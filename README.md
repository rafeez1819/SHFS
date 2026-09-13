# SHFS — Sherin Hashed File System

> **Immediate Preservation • Independent Air-Gap Verification • Long-Term DNA Archive • Cryptographic Identity**

SHFS is the storage and preservation layer of the Sherin security architecture. It is designed around **1 MiB cubes**, cryptographic content identity, tamper-evident journals, policy-triggered preservation, independent air-gap witnessing, and optional long-term archival through the Sherin DNA Vault.

**Default local service port: `6868`.**

## Architecture

```text
                         SHERIN ENGINE
                              │
                       POLICY / TRUST
                              │
                       TAMPER DETECTOR
                              │
                    PRESERVATION CONTROLLER
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
        SHFS                STREAM              RUNTIME
      1 MiB cubes          evidence              state
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
                         MERKLE / CID
                              │
                       SIGNED MANIFEST
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
            AIR-GAP NODE               DNA VAULT
          independent witness         long-term archive
                 │                         │
                 └────────────┬────────────┘
                              ▼
                       CUSTODY LEDGER
                              │
                       CONTROLLED RECOVERY
```

## Design rules

1. **Preserve first.** A confirmed security/policy event creates a durable preservation record before expensive secondary processing.
2. **DNA is archival, not real-time.** DNA Vault is never required for normal execution or immediate preservation.
3. **Air-gap is independent.** Verification must not depend on the primary application's database or UI.
4. **Hashes identify; signatures authenticate.** Content identity and authority are separate primitives.
5. **Sealed evidence is append-only.** Ordinary APIs cannot modify or delete a sealed preservation package.
6. **The browser is not the security boundary.** The production preservation service owns privileged operations.
7. **OS boot integration is platform-specific; the SHFS protocol is not.** Node.js services and manifests remain portable; only Windows/Linux/macOS service registration differs.

## Service

The production runtime is intended to expose the local control API on:

```text
http://127.0.0.1:6868
```

Health endpoint:

```text
GET /health
```

The service can be registered to start **before interactive login** using the native service manager for the host OS.

## Preservation lifecycle

```text
DETECTED
   ↓
VALIDATING
   ↓
PRESERVING
   ↓
FROZEN
   ↓
CAPTURED
   ↓
SEALED
   ├────────→ AIRGAP_PENDING → VERIFIED
   └────────→ DNA_PENDING    → ARCHIVED
```

## Repository status

This repository is the **production architecture foundation**. The existing prototype demonstrated the domain model and UI concepts; production cryptography, TPM integration, durable journal storage, and OS-specific hardening must be implemented and independently reviewed before security-critical deployment.

See:

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/PROTOCOL.md`](docs/PROTOCOL.md)
- [`docs/THREAT-MODEL.md`](docs/THREAT-MODEL.md)
- [`docs/OPERATIONS.md`](docs/OPERATIONS.md)
- [`schemas/preservation-manifest.v1.json`](schemas/preservation-manifest.v1.json)
- [`services/shfs-service/README.md`](services/shfs-service/README.md)

## Security posture

SHFS is intended to **protect and preserve** evidence. It must not disable antivirus/EDR, bypass authorization, exploit unrelated systems, or provide unauthorized access. SHFS should coexist with legitimate endpoint security controls and become harder to tamper with itself.

## License

See [`LICENSE`](LICENSE).
