# SHFS Production Architecture

## 1. Purpose

SHFS is the active digital preservation layer in the Sherin Preservation Fabric. Its job is to preserve a trustworthy snapshot when policy, integrity, or tamper controls require it.

It is not an antivirus replacement and it is not an offensive access mechanism.

## 2. Four-layer preservation fabric

### Layer A — SHFS

Fast, local, active preservation using 1 MiB logical cubes, manifests, authenticated encryption, content identity, and append-only journal records.

### Layer B — Air-Gap

A separately administered verifier receives sealed packages and independently verifies signatures, hashes, Merkle roots, manifests, and event-chain continuity.

### Layer C — DNA Vault

A cold archival adapter transforms a sealed encrypted package into the DNA Vault archival representation. DNA processing is asynchronous and never blocks immediate preservation.

### Layer D — Merkle/CID

A common identity and integrity layer binds cubes, event streams, manifests, preservation packages, air-gap witnesses, and archive records.

## 3. Trust zones

```text
Z0 Hardware Root of Trust
   TPM / secure boot / device identity

Z1 Sherin Runtime
   execution / memory / policy evaluation

Z2 Preservation Core
   detection / capture / sealing

Z3 SHFS Storage
   encrypted cubes / journal / manifests

Z4 Air-Gap
   independent verification / witness

Z5 Archive
   DNA Vault / other cold media
```

A compromised workload must not be able to mutate Z3/Z4/Z5 evidence through ordinary application APIs.

## 4. Event transaction

```text
DETECT → DECIDE → JOURNAL → FREEZE → SNAPSHOT → COMMIT → SEAL → WITNESS → ARCHIVE
```

The minimum durable boundary is the journal/commit. Expensive hashing, packaging, air-gap transfer, and DNA encoding can continue asynchronously after the sealed local state is durable.

## 5. Cube model

The logical unit is 1 MiB (1,048,576 bytes). A cube has a stable identity and a versioned manifest. Physical placement is an implementation detail and must never be treated as the security identity.

Recommended metadata:

```json
{
  "cube_id": "shfs-cube-...",
  "version": 1,
  "logical_size": 1048576,
  "ciphertext_hash": "sha256:...",
  "content_cid": "cid:...",
  "previous_version": null,
  "created_at": "...",
  "sealed_at": "...",
  "status": "SEALED"
}
```

## 6. Event chain

Each event commits to the previous event:

```text
H0 → H1 → H2 → H3 → ...
```

Conceptually:

```text
event_hash = H(sequence || timestamp || type || payload_hash || previous_event_hash)
```

A production implementation must canonicalize all serialized fields before hashing.

## 7. Merkle checkpoints

Events should be grouped into signed epochs:

```text
events 1..N  → Merkle Root A

events N+1..M → Merkle Root B

Root A → Root B → Root C → ...
```

Each checkpoint contains its sequence range, root, previous checkpoint root, timestamp, and signature.

## 8. Evidence package

A sealed package should contain:

```text
manifest.json
identity/
  package.cid
  merkle.root
  signature
policy/
  decision.json
  policy-version.json
event/
  timeline.log
filesystem/
  cube-manifest.json
  cubes/
runtime/
  runtime-manifest.json
stream/
  stream-manifest.json
archive/
  dna-manifest.json
```

## 9. Air-gap witness

The air-gap verifier independently calculates the package identity. It must not trust a root supplied only by the primary service.

A witness records:

- package CID
- received byte count
- received Merkle root
- verification implementation version
- verification result
- timestamp
- witness signature

A verification mismatch is itself an auditable event.

## 10. DNA boundary

The DNA adapter consumes only a sealed package:

```text
sealed package
 → canonical serialization
 → compression (optional)
 → authenticated encryption
 → integrity manifest
 → DNA encoding
 → archival representation
```

DNA encoding is a storage representation, not an encryption primitive.

## 11. Recovery

Recovery always verifies before trust:

```text
source
 → signature verification
 → Merkle verification
 → object verification
 → custody verification
 → decryption
 → reconstruction
 → second verification
 → controlled restore
```

DNA recovery is a cold path.

## 12. Availability rule

Failure of any downstream archive must not invalidate a successfully sealed local preservation:

```text
DNA failure      → retry; SHFS remains sealed
network failure  → queue; SHFS remains sealed
power failure    → recover from journal
storage failure  → use verified replica/archive
```

## 13. Platform portability

The SHFS protocol, Node.js service, schemas, manifests, and preservation state machine are portable. Only the operating-system service registration changes:

```text
Windows → Task Scheduler / Windows Service
Linux   → systemd
macOS   → launchd
```

All use the same service API and default port `6868`.
