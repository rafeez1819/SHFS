# SHFS Service

This directory contains the cross-platform Node.js service boundary. It intentionally contains no platform-specific boot logic.

## Run

```bash
npm start
```

Default endpoint:

```text
http://127.0.0.1:6868/health
```

## Production rule

This service is only the runtime boundary. Cryptographic trust, TPM integration, durable preservation, and privileged storage operations must be implemented behind dedicated modules and must not be simulated by the HTTP layer.

## Pre-login service registration

Use the native OS manager:

- Windows: SYSTEM service/task configured for machine startup
- Linux: systemd system unit
- macOS: launchd LaunchDaemon

The same Node entry point is used on all platforms.
