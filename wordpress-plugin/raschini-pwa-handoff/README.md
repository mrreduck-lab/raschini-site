# Raschini PWA Auth Handoff

## Purpose

Transfers an authenticated WordPress/WooCommerce customer into the Raschini PWA without exposing the WordPress login cookie.

Flow:

1. Customer opens `https://raschini.com/?raschini_pwa_connect=1`.
2. WordPress checks the current logged-in user.
3. WordPress signs a two-minute user assertion.
4. Next.js issues a five-minute one-time handoff token.
5. Customer adds `/pwa-start?handoff=...` to the Home Screen.
6. On first standalone launch, the token is redeemed once and a protected PWA session cookie is created.

## Installation

1. Copy the folder `raschini-pwa-handoff` into `wp-content/plugins/`.
2. Activate **Raschini PWA Auth Handoff** in WordPress.
3. Open **Settings → Raschini PWA**.
4. Set the PWA URL, initially `https://raschini-site.vercel.app`.
5. Generate a long random shared secret and save it in WordPress.
6. Add the same value in Vercel as `PWA_WORDPRESS_SHARED_SECRET`.
7. Also add independent random values for:
   - `PWA_HANDOFF_SECRET`
   - `PWA_SESSION_SECRET`
8. Redeploy Vercel.

## Link placement

Use this direct URL in a button or menu item:

`https://raschini.com/?raschini_pwa_connect=1`

Or insert the shortcode:

`[raschini_pwa_install_link]`

Custom label example:

`[raschini_pwa_install_link label="Добавить Raschini на экран Домой"]`

## User fields

The plugin currently reads:

- WordPress display name
- WooCommerce `billing_phone`
- `raschini_discount`
- `raschini_manager_name`
- `raschini_manager_phone`
- `raschini_manager_whatsapp`

These meta keys can later be replaced by a RetailCRM lookup once the final customer identity mapping is agreed.

## Security

- WordPress cookies are never sent to the PWA.
- Assertions expire after two minutes.
- Handoff tokens expire after five minutes.
- Each handoff token can be redeemed only once.
- The resulting PWA session is stored in a Secure, HttpOnly, SameSite=Lax cookie.
