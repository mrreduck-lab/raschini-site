#!/usr/bin/env bash
# Run ONCE as root on MG Bot VPS from Termius, not through GitHub Actions.
# Public installation helper. It contains no SSH keys or GitHub registration tokens.
# Registers only Raschini-Team/raschini-site, and does not touch MG Bot or PM2.
set -Eeuo pipefail
umask 077
repo="https://github.com/Raschini-Team/raschini-site"
user="raschini-runner"
name="raschini-stage-01"
label="raschini-stage-ci"
dir="/opt/raschini-actions-runner"
archive="actions-runner-linux-x64-2.336.0.tar.gz"
url="https://github.com/actions/runner/releases/download/v2.336.0/$archive"
expected_sha="04cf0be1aff4c3ec3554466c39124ca250e3effd8873bb7e8d68535aa9505d5d"
die(){ echo "BOOTSTRAP_REFUSED: $*" >&2; exit 1; }
test "$(id -u)" -eq 0 || die "Run as root, on the MG VPS only"
test "$(uname -s)" = Linux || die "Linux required"
test "$(uname -m)" = x86_64 || die "Requires x86_64"
test -d /run/systemd/system || die "systemd required"
for cmd in curl tar sha256sum useradd runuser systemctl awk df getconf; do
  command -v "$cmd" >/dev/null || die "Missing: $cmd"
done
mem_kib="$(awk '/^MemAvailable:/ {print $2}' /proc/meminfo)"
disk_kib="$(df -Pk /opt | awk 'END{print $4}')"
cpus="$(getconf _NPROCESSORS_ONLN)"
test "$mem_kib" -ge 786432 || die "MG Bot safety: available RAM < 768 MiB"
test "$disk_kib" -ge 3145728 || die "MG Bot safety: /opt free disk < 3 GiB"
# One CPU is supported only for LIGHT staging CI, subject to strict quotas.
# Do not run compilation, stress, or large test matrices on this shared host.
if test "$cpus" -eq 1; then
  test "$mem_kib" -ge 1048576 || die "One vCPU needs at least 1 GiB free RAM to protect MG Bot"
  load_1m="$(awk '{print $1}' /proc/loadavg)"
  awk -v load="$load_1m" 'BEGIN {exit (load < 0.85 ? 0 : 1)}' \
    || die "MG Bot CPU load too high for shared runner (1-minute load: $load_1m)"
  echo "ONE_CORE_MODE=enabled CPUQuota=25% MemoryMax=512M"
elif test "$cpus" -lt 1; then
  die "No CPU capacity detected"
fi
echo "HOST_PREFLIGHT=pass available_memory_mib=$((mem_kib/1024)) free_disk_gib=$((disk_kib/1048576)) cpus=$cpus"
test ! -f "$dir/.runner" || die "Runner already registered; will not overwrite"
test ! -f "$dir/.credentials" || die "Runner credentials exist; will not overwrite"
if ! id "$user" >/dev/null 2>&1; then
  useradd --system --create-home --shell /bin/bash "$user"
fi
test "$(id -u "$user")" != 0 || die "Runner user unexpectedly root"
# Do not let the runner access MG Bot credentials if a known private env exists.
if test -f /opt/raschini-retailcrm-chat-bot/.env; then
  if runuser -u "$user" -- test -r /opt/raschini-retailcrm-chat-bot/.env; then
    die "Runner OS user can read MG Bot environment secrets; fix file permissions first"
  fi
fi
install -d -o "$user" -g "$user" -m 0700 "$dir"
if test ! -f "$dir/config.sh"; then
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' EXIT
  curl --fail --location --silent --show-error --retry 2 --max-time 180 "$url" -o "$tmp/$archive"
  printf '%s  %s\n' "$expected_sha" "$tmp/$archive" | sha256sum --check --status \
    || die "Runner archive checksum mismatch"
  echo "OFFICIAL_ARCHIVE_SHA256=pass"
  tar -xzf "$tmp/$archive" -C "$dir"
  chown -R "$user:$user" "$dir"
fi
test -x "$dir/config.sh" || die "Runner files missing"
echo
echo "Open https://github.com/Raschini-Team/raschini-site/settings/actions/runners"
echo "Choose New self-hosted runner > Linux > x64, get the short-lived registration token."
echo "Paste token ONLY in this terminal, never into ChatGPT or GitHub source."
token=""
IFS= read -r -s -p "GitHub registration token: " token </dev/tty
echo
test -n "$token" || die "Token is empty"
(
  cd "$dir"
  runuser -u "$user" -- ./config.sh \
    --url "$repo" --token "$token" \
    --name "$name" --labels "$label" --work _work --unattended
) || die "GitHub registration failed: check repo token and connection"
unset token
cd "$dir"
./svc.sh install "$user"
if test "$cpus" -eq 1; then
  # systemctl set-property writes persistent systemd resource controls.
  service_name="$(cat "$dir/.service")"
  case "$service_name" in
    actions.runner.*.service) ;;
    *) die "Unexpected runner service name; refusing to set limits" ;;
  esac
  systemctl set-property "$service_name" CPUQuota=25% CPUWeight=10 MemoryMax=512M TasksMax=128 \
    || die "Could not enforce hard CPU/memory limits; runner NOT started"
  echo "ONE_CORE_CGROUP_LIMITS=enabled"
fi
./svc.sh start
./svc.sh status
echo "RUNNER_INSTALL=completed"
echo "RUNNER_NAME=$name"
echo "RUNNER_LABEL=$label"
echo "MG_BOT_PM2=untouched"
echo "DEPLOY_SCOPE=staging_only_manual"
echo "NEXT=Verify Online in Raschini-Team/raschini-site Settings > Actions > Runners."
