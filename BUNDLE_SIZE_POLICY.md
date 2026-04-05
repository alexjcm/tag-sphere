# Bundle Size Policy (Brotli)

Primary size KPI is Brotli-compressed output.

- Core target: `dist/index.js <= 1024 B` (brotli).
- Styles target: `styles/styles.css <= 400 B` (brotli).

Run size report:

```bash
npm run size
```

Run CI check:

```bash
npm run size:check
```
