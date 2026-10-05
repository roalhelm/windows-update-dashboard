# Microsoft Update Dashboard v2

A GitHub Pages dashboard that fetches its Windows Update data on every build directly from official Microsoft support pages. The generated JSON file exists only in the Pages artifact, not in the repository. Updates are grouped by product and feature update version.

## Architecture

`config/sources.json` contains only Microsoft source URLs and their feature versions. GitHub Actions runs `npm run build` daily as well as on push/manual triggers. The synchronizer loads the pages, extracts the date, KB, and OS build, and generates `_site/data/updates.json`. After that, `_site` is published.

A direct browser query to `support.microsoft.com` is deliberately not used because a static Pages site should not depend on third-party CORS policies. "Live" therefore means: freshly fetched from Microsoft on the server side during each GitHub Actions build. If a source fails, the error is logged visibly; if every source fails, deployment stops.

## Setup

1. Upload the files to a GitHub repository using the `main` branch.
2. Under **Settings > Pages > Source**, choose **GitHub Actions**.
3. Start the **Live Microsoft sync and Pages** workflow manually or wait for the next run.
4. Add more feature versions in `config/sources.json`. Only `https://support.microsoft.com/...` is allowed.

## Local testing

```bash
npm test
npm run build
python3 -m http.server 8000 --directory _site
```

## Data and permissions

Microsoft Graph is not used. No tenant permissions, secrets, or app registrations are required. GitHub Actions only uses `contents: read`, `pages: write`, and `id-token: write`.

## Limitations

- Microsoft support pages are HTML, not a stable public JSON API. If Microsoft changes the markup, the parser may fail. Tests cover the expected format.
- A single detail page only returns the relevant update. For a complete feature version, its official update history page should be listed in `config/sources.json`.
- Office and Teams use different publication formats and require separate adapters; no KB numbers are invented.
- The Microsoft Graph Windows Updates API provides structured Windows data, but it requires authentication and uses beta endpoints. Therefore, it is not the secure default for a public GitHub Pages site.

## Security

**Passed:** Host allowlist, HTTPS-only, 30-second timeout, 8 MiB limit, no secrets, no raw DOM data, CSP, secure external links, minimal workflow permissions.

**Deviation:** HTML scraping instead of a stable API. Risk: parser outage. Mitigation: make source errors visible, stop deployment if all sources fail, and maintain parser tests.

**Not verifiable:** Independent multi-agent verification of the complete Cloudflare audit flow.
