# Awaking Legal Pages

This repository hosts the public legal pages for **Awaking**, an on-device photo editing app for iOS. The pages are served via **GitHub Pages** at the URL below.

## Live URLs ✅

GitHub Pages is enabled for the `master` branch at the repository root. The canonical URLs are:

| Page | URL |
|---|---|
| Index / Home | `https://yangkj.github.io/awaking-legal/` |
| Privacy Policy | `https://yangkj.github.io/awaking-legal/privacy-policy.html` |
| Terms of Service | `https://yangkj.github.io/awaking-legal/terms-of-service.html` |

These are the URLs to paste into App Store Connect (App Information → Privacy Policy URL) and `MainProject/Awakening/iOS/Info.plist` (`AwakingPrivacyPolicyURL` and `AwakingTermsOfServiceURL`).

## Enabling GitHub Pages

1. Push this repository to GitHub under the name `awaking-legal`.
2. Repository **Settings → Pages**.
3. Source: **Deploy from a branch**.
4. Branch: **master** (not `main`, because this repo uses `master`), folder: **/(root)**.
5. Save. After ~1 minute, the URLs above will return 200.

GitHub Pages serves this site over HTTPS automatically. No additional configuration is required.

## Updating the pages

1. Edit `privacy-policy.html` or `terms-of-service.html` in this repository.
2. Commit and push to `master`.
3. GitHub Pages redeploys within ~30 seconds.

If the contact email (`yangkj310@gmail.com`) needs to change in the future, do a global find-and-replace across both HTML files.

## Why this repository exists

The HTML files use `yangkj310@gmail.com` as the official support email. The App Store review checklist for Awaking required a public HTTPS Privacy Policy URL and Terms of Service URL. This repository satisfies that requirement without requiring a custom domain.

See the main Awaking release-readiness documentation for the full Phase 1 (no IAP) submission plan.
