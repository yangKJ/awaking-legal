# Awaking Legal Pages

This repository hosts the public legal pages for **Awaking**, an on-device photo editing app for iOS. The pages are served via **GitHub Pages** at the URL below.

## Live URLs (after enabling GitHub Pages)

When GitHub Pages is enabled for the `main` branch at the repository root, the canonical URLs will be:

| Page | URL |
|---|---|
| Index / Home | `https://<github-username>.github.io/awaking-legal/` |
| Privacy Policy | `https://<github-username>.github.io/awaking-legal/privacy-policy.html` |
| Terms of Service | `https://<github-username>.github.io/awaking-legal/terms-of-service.html` |

Replace `<github-username>` with your actual GitHub username before pasting into App Store Connect and `iOS/Info.plist`.

## Enabling GitHub Pages

1. Push this repository to GitHub under the name `awaking-legal`.
2. Repository **Settings → Pages**.
3. Source: **Deploy from a branch**.
4. Branch: **main**, folder: **/(root)**.
5. Save. After ~1 minute, the URLs above will return 200.

GitHub Pages serves this site over HTTPS automatically. No additional configuration is required.

## Updating the pages

1. Edit `privacy-policy.html` or `terms-of-service.html` in this repository.
2. Commit and push to `main`.
3. GitHub Pages redeploys within ~30 seconds.

If the contact email (`support@awaking.app`) needs to change in the future, do a global find-and-replace across both HTML files.

## Why these placeholders exist

The HTML files currently use `support@awaking.app` as the contact placeholder. Before sending the app for App Store review:

1. **Replace the placeholder** with a real email you control (or a Support URL pointing to a contact form).
2. **Confirm the URL is live** by visiting `https://<github-username>.github.io/awaking-legal/privacy-policy.html` from a browser outside your network.
3. **Paste the URL** into App Store Connect: App → App Information → Privacy Policy URL.
4. **Paste the URL** into `MainProject/Awakening/iOS/Info.plist`:
   - `AwakingPrivacyPolicyURL`
   - `AwakingTermsOfServiceURL`

See `/Users/condy/Desktop/Awakening/Docs/ReleaseReadiness/phase1_no_iap_launch_plan.md` for the full Phase 1 (no IAP) submission plan.
