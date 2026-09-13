# Preservation Protocol v1

## Canonical preservation states

```text
NORMAL
  → DETECTED
  → VALIDATING
  → PRESERVING
  → FROZEN
  → CAPTURED
  → SEALED
  → AIRGAP_PENDING
  → VERIFIED
  → DNA_PENDING
  → ARCHIVED
```

`FALSE_POSITIVE` may be reached from `VALIDATING` when policy permits. `FAILED` states must retain the failure record and never erase the already-durable evidence.

## Trigger record

A trigger binds the event to a specific policy and policy version.

Required concepts:

- event ID
- device ID
- policy ID
- policy version
- trigger type
- severity
- confidence
- timestamp
- subject/resource identity
- decision

## Sealing

A package becomes `SEALED` only after:

1. required evidence is committed;
2. canonical manifest is generated;
3. content hashes are calculated;
4. Merkle root is calculated;
5. manifest is authenticated by the configured signing authority;
6. durable state records the sealed package identity.

## Verification

The verifier recalculates values. It must not merely compare values produced by the same process that created the package.

## Custody

Custody events form a separate append-only chain:

```text
CREATED → SEALED → TRANSFERRED → RECEIVED → VERIFIED → ARCHIVED
```

A release/disposition operation requires an explicit governance policy and creates a signed custody event. No ordinary destructive API is defined for sealed evidence.

## Versioning

Protocol changes must increment the protocol version and retain readers for previously sealed packages for the supported archival lifetime.
