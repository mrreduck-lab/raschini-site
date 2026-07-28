<?php
/**
 * Plugin Name: Raschini PWA Auth Handoff
 * Description: Securely transfers an authenticated WordPress customer into the Raschini PWA using a short-lived one-time token.
 * Version: 0.1.0
 * Author: Raschini
 */

if (!defined('ABSPATH')) exit;

final class Raschini_PWA_Handoff {
    const OPTION_PWA_BASE = 'raschini_pwa_base_url';
    const OPTION_SHARED_SECRET = 'raschini_pwa_shared_secret';
    const CONNECT_ACTION = 'raschini_pwa_connect';

    public static function boot() {
        add_action('admin_init', [__CLASS__, 'register_settings']);
        add_action('admin_menu', [__CLASS__, 'add_settings_page']);
        add_action('template_redirect', [__CLASS__, 'maybe_connect']);
        add_shortcode('raschini_pwa_install_link', [__CLASS__, 'shortcode']);
    }

    public static function register_settings() {
        register_setting('raschini_pwa', self::OPTION_PWA_BASE, [
            'type' => 'string',
            'sanitize_callback' => 'esc_url_raw',
            'default' => 'https://raschini-site.vercel.app',
        ]);
        register_setting('raschini_pwa', self::OPTION_SHARED_SECRET, [
            'type' => 'string',
            'sanitize_callback' => [__CLASS__, 'sanitize_secret'],
            'default' => '',
        ]);
    }

    public static function sanitize_secret($value) {
        return trim((string) $value);
    }

    public static function add_settings_page() {
        add_options_page('Raschini PWA', 'Raschini PWA', 'manage_options', 'raschini-pwa', [__CLASS__, 'render_settings']);
    }

    public static function render_settings() {
        if (!current_user_can('manage_options')) return;
        ?>
        <div class="wrap">
            <h1>Raschini PWA</h1>
            <form method="post" action="options.php">
                <?php settings_fields('raschini_pwa'); ?>
                <table class="form-table" role="presentation">
                    <tr><th scope="row"><label for="raschini_pwa_base_url">PWA base URL</label></th><td><input class="regular-text" id="raschini_pwa_base_url" name="<?php echo esc_attr(self::OPTION_PWA_BASE); ?>" value="<?php echo esc_attr(get_option(self::OPTION_PWA_BASE, 'https://raschini-site.vercel.app')); ?>" /></td></tr>
                    <tr><th scope="row"><label for="raschini_pwa_shared_secret">Shared secret</label></th><td><input class="regular-text" type="password" autocomplete="new-password" id="raschini_pwa_shared_secret" name="<?php echo esc_attr(self::OPTION_SHARED_SECRET); ?>" value="<?php echo esc_attr(get_option(self::OPTION_SHARED_SECRET, '')); ?>" /><p class="description">Must exactly match PWA_WORDPRESS_SHARED_SECRET in Vercel.</p></td></tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }

    public static function shortcode($atts) {
        $atts = shortcode_atts(['label' => 'Добавить Raschini', 'class' => 'raschini-pwa-install-link'], $atts, 'raschini_pwa_install_link');
        $url = add_query_arg(self::CONNECT_ACTION, '1', home_url('/'));
        return sprintf('<a class="%s" href="%s">%s</a>', esc_attr($atts['class']), esc_url($url), esc_html($atts['label']));
    }

    private static function user_assertion() {
        $user = wp_get_current_user();
        if (!$user || !$user->exists()) return new WP_Error('not_logged_in', 'User is not logged in');

        $now = time();
        $payload = [
            'sub' => (string) $user->ID,
            'name' => $user->display_name ?: $user->user_login,
            'phone' => (string) get_user_meta($user->ID, 'billing_phone', true),
            'discount' => (float) get_user_meta($user->ID, 'raschini_discount', true),
            'manager' => [
                'name' => (string) get_user_meta($user->ID, 'raschini_manager_name', true),
                'phone' => (string) get_user_meta($user->ID, 'raschini_manager_phone', true),
                'whatsapp' => (string) get_user_meta($user->ID, 'raschini_manager_whatsapp', true),
            ],
            'iat' => $now,
            'exp' => $now + 120,
        ];

        $secret = (string) get_option(self::OPTION_SHARED_SECRET, '');
        if ($secret === '') return new WP_Error('missing_secret', 'PWA shared secret is not configured');

        $json = wp_json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $encoded = rtrim(strtr(base64_encode($json), '+/', '-_'), '=');
        $signature = rtrim(strtr(base64_encode(hash_hmac('sha256', $encoded, $secret, true)), '+/', '-_'), '=');
        return $encoded . '.' . $signature;
    }

    public static function maybe_connect() {
        if (!isset($_GET[self::CONNECT_ACTION])) return;

        if (!is_user_logged_in()) {
            $return_url = add_query_arg(self::CONNECT_ACTION, '1', home_url('/'));
            wp_safe_redirect(wp_login_url($return_url));
            exit;
        }

        $assertion = self::user_assertion();
        if (is_wp_error($assertion)) wp_die(esc_html($assertion->get_error_message()), 'Raschini PWA', ['response' => 500]);

        $pwa_base = untrailingslashit((string) get_option(self::OPTION_PWA_BASE, 'https://raschini-site.vercel.app'));
        $response = wp_remote_post($pwa_base . '/api/pwa/handoff/issue', [
            'timeout' => 10,
            'headers' => ['Content-Type' => 'application/json'],
            'body' => wp_json_encode(['assertion' => $assertion]),
        ]);

        if (is_wp_error($response)) wp_die('Не удалось связаться с PWA. Попробуйте позже.', 'Raschini PWA', ['response' => 502]);

        $status = wp_remote_retrieve_response_code($response);
        $body = json_decode(wp_remote_retrieve_body($response), true);
        if ($status !== 200 || empty($body['handoff'])) wp_die('Не удалось подготовить безопасный вход в приложение.', 'Raschini PWA', ['response' => 502]);

        $target = add_query_arg('handoff', $body['handoff'], $pwa_base . '/pwa-start');
        wp_redirect($target, 302, 'Raschini PWA');
        exit;
    }
}

Raschini_PWA_Handoff::boot();
