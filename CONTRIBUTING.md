# Contributing

SHFS is security-sensitive software. Contributions should preserve the separation between the active preservation layer, independent verification, and cold archival.

## Rules

- Never add custom cryptography when a vetted implementation is available.
- Never weaken sealed-evidence semantics for convenience.
- Never add functionality intended to disable legitimate endpoint security controls or bypass authorization.
- Add regression tests for every security invariant.
- Document assumptions and residual risk.
- Keep protocol formats versioned and backward-readable.

## Development

The service requires Node.js 20 or newer.

```bash
npm install
npm start
```

The local service listens on `127.0.0.1:6868` by default.
