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
  "file_name": "ImageActionBot_Setup_1.0.1.exe",
  "download_url": "https://your-link/ImageActionBot_Setup.exe",
  "last_updated": "2026-04-10"
}
```

All download buttons and release labels update automatically via `main.js`.

## Optional ad metadata

`ad.json` includes a `last_updated` field and placeholder ad metadata for future banner integration.

## Files

- `index.html` - primary landing page
- `how-to-use.html` - advanced usage guide
- `main.css` - responsive styling
- `main.js` - JSON metadata loader
- `download.json` - editable release details
- `ad.json` - optional ad metadata
