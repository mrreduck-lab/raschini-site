#!/usr/bin/env bash
# RASCHINI / MG Bot VPS diagnostics. READ-ONLY.
# Does not print process command-line arguments, environments, SSH keys or tokens.
set -u
export LC_ALL=C

section() { printf '\n========== %s ==========\n' "$1"; }
safe() { "$@" 2>&1 || true; }

section "DATE / SERVER / UPTIME"
date -u '+UTC: %Y-%m-%d %H:%M:%S'
printf 'Host: '; hostname
printf 'OS: '; awk -F= '$1=="PRETTY_NAME" { gsub(/"/,"",$2);print $2;exit }' /etc/os-release 2>/dev/null
printf 'Architecture: '; uname -m
printf 'Logical CPUs: '; getconf _NPROCESSORS_ONLN 2>/dev/null
uptime

section "CPU LOAD / IDLE (3 seconds)"
if command -v vmstat >/dev/null 2>&1; then
  vmstat -w 1 3 | tail -n 4
else
  echo 'vmstat not installed'
fi
if test -r /proc/pressure/cpu; then
  printf 'CPU pressure: '; grep '^some ' /proc/pressure/cpu
fi

section "MEMORY / SWAP"
free -h
awk '/^MemAvailable:/{printf "MemAvailable: %.0f MiB\n",$2/1024} /^SwapTotal:/{printf "SwapTotal: %.0f MiB\n",$2/1024} /^SwapFree:/{printf "SwapFree: %.0f MiB\n",$2/1024}' /proc/meminfo
if test -r /proc/pressure/memory; then
  printf 'Memory pressure: '; grep '^some ' /proc/pressure/memory
fi

section "DISK SPACE / INODES"
df -h / /opt 2>/dev/null || df -h /
df -i / 2>/dev/null | tail -n 2

section "TOP CPU PROCESSES (no arguments)"
ps -eo pid,ppid,user,comm,pcpu,pmem,rss,etime --sort=-pcpu | head -n 21

section "TOP RAM PROCESSES (no arguments)"
ps -eo pid,ppid,user,comm,pcpu,pmem,rss,etime --sort=-rss | head -n 21

section "RUNNING SERVICES (first 35)"
if command -v systemctl >/dev/null 2>&1; then
  systemctl list-units --type=service --state=running --no-pager --no-legend 2>/dev/null | head -n 35
else
  echo "systemctl not present"
fi

section "PM2 PROCESSES"
if command -v pm2 >/dev/null 2>&1; then
  safe pm2 ls
else
  echo "PM2 unavailable in this user's PATH (bot may run under another OS user)"
fi
if command -v pgrep >/dev/null 2>&1; then
  printf 'PM2/Node process names visible across users:\n'
  ps -eo user,pid,comm | awk '$3 ~ /^(node|PM2|pm2)$/ {print}' | head -n 30
fi

section "DOCKER CONTAINERS"
if command -v docker >/dev/null 2>&1; then
  safe docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}'
else
  echo 'Docker unavailable'
fi

section "RASCHINI RUNNER STATUS"
if id raschini-runner >/dev/null 2>&1; then
  echo 'Runner OS user: exists'
else
  echo 'Runner OS user: absent'
fi
if test -f /opt/raschini-actions-runner/.runner; then
  echo 'Runner configuration: exists'
else
  echo 'Runner configuration: not installed'
fi
if command -v systemctl >/dev/null 2>&1; then
  systemctl list-units --all 'actions.runner.*' --no-pager --no-legend 2>/dev/null | head -n 5
fi

echo
echo "READ_ONLY_DIAGNOSTICS=complete"
