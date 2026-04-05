# Bundle Size Policy (Brotli)

Primary size KPI is Brotli-compressed output.

- Core target: `dist/index.js <= 1024 B` (brotli).
- Styles target: `styles/styles.css <= 400 B` (brotli).

## Limit updates

If future changes require increasing these limits, the user must update this file manually.
Limit changes are never automatic and must be intentional.

Run size report:

```bash
npm run size
```

Run CI check:

```bash
npm run size:check
```
