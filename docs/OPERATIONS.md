# Operations Guide

## Runtime port

The SHFS local control service uses port `6868`.

```text
127.0.0.1:6868
```

Bind to loopback by default. Exposing the control API to a LAN should be an explicit deployment decision with authentication and transport protection.

## Pre-login startup

The service is designed to start before interactive login:

```text
Windows → SYSTEM scheduled task / service
Linux   → systemd system service
macOS   → launchd LaunchDaemon
```

The OS wrapper is platform-specific. The Node.js runtime and protocol remain common.

## Operational invariants

- sealed preservation objects are not ordinary user files;
- downstream DNA failure never invalidates local sealing;
- air-gap verification is independent of the primary UI/database;
- recovery verifies before restoring trusted runtime state;
- service startup must fail closed rather than silently running in an unprotected mode.

## Health

The service should expose a minimal local health endpoint:

```http
GET /health
```

Recommended response fields:

```json
{
  "service": "shfs",
  "version": "1.0.0",
  "port": 6868,
  "state": "READY",
  "integrity": "VALID"
}
```

## Production deployment checklist

- [ ] Real cryptographic provider selected and reviewed
- [ ] TPM integration implemented for supported platforms
- [ ] Durable append-only journal implemented
- [ ] Browser removed from privileged trust boundary
- [ ] Air-gap verifier built as independent software
- [ ] DNA adapter isolated from real-time path
- [ ] Power-loss tests pass
- [ ] Corruption/tamper tests pass
- [ ] Key rotation/recovery procedure documented
- [ ] Security review completed
- [ ] Claims backed by reproducible benchmarks
