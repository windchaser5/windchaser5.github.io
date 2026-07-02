# Notion CMS Setup

The public website no longer includes a built-in editor. Notion is the content source, and GitHub Pages remains the static presentation layer.

## Recommended Notion Database Properties

Create one Notion database with these properties:

- `Title` or `Name`: title
- `Type`: select, use `Perspective` or `Case`
- `Summary`: rich text
- `Tag`: select
- `Date`: date
- `Published`: checkbox
- `URL`: url, optional
- `Label`: rich text, optional for cases, for example `Case 01`
- `Points`: rich text, optional for cases, one bullet per line

## GitHub Secrets

Add these repository secrets in GitHub:

- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`

The token must come from a Notion integration that has access to the database.

## Update Flow

1. Write or update content in Notion.
2. Check `Published`.
3. Run the GitHub Action `Sync Notion Content`, or wait for the scheduled sync.
4. The action updates `data/content.json`.
5. GitHub Pages rebuilds the static site.

This keeps the Notion token server-side in GitHub Actions, instead of exposing it in browser JavaScript.
