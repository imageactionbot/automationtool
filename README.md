# ImageActionBot Website

SEO-friendly landing website with dynamic release metadata.

## Quick update workflow (no HTML edit needed)

Update only `download.json`:

- `version`: release version text
- `file_name`: installer name
- `download_url`: direct setup link
- `last_updated`: release date in `YYYY-MM-DD`

Example:

```json
{
  "version": "1.0.0",
  "file_name": "ImageActionBot_Setup.exe",
  "download_url": "https://pub-7df420d78ae8472e9817557d4ae9fd10.r2.dev/ImageActionBot_Setup.exe",
  "last_updated": "2026-04-09"
}
```

All download buttons and release labels update automatically via `main.js`.

> Note: File naming helps consistency, but "Unknown Publisher" warnings are controlled by code signing (Authenticode), not by filename alone.

## Optional ad metadata

`ad.json` includes a `last_updated` field and placeholder ad metadata for future banner integration.

## Files

- `index.html` - primary landing page
- `how-to-use.html` - advanced usage guide
- `main.css` - responsive styling
- `main.js` - JSON metadata loader
- `download.json` - single source release metadata
- `ad.json` - optional ad metadata
