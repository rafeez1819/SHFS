# Threat Model

## Security objectives

SHFS aims to provide:

- confidentiality for protected content;
- integrity detection for protected objects;
- authenticated evidence manifests;
- durable, tamper-evident event history;
- independent air-gap verification;
- long-term archival through an external cold-storage adapter;
- controlled recovery.

## Threats

| Threat | Primary control |
|---|---|
| Unauthorized file modification | authenticated encryption + integrity verification |
| Evidence alteration | signed manifest + Merkle structure + custody chain |
| Journal deletion | append-only durable journal + independent witness |
| Ransomware | preservation trigger + sealed evidence |
| Privileged misuse | least privilege + custody/governance controls |
| Compromised application | separate preservation service boundary |
| Storage corruption | hashes + verified replicas/archive |
| Power loss | crash-consistent journal and recovery |
| Network loss | local durable queue |
| Archive failure | SHFS and air-gap remain authoritative preservation layers |

## Out of scope

SHFS must not disable antivirus/EDR, bypass authorization, exploit unrelated devices, or provide unauthorized access.

## Residual risks

No software architecture can guarantee protection against every physical, hardware, implementation, supply-chain, or credential compromise. Production claims must be supported by measured tests, threat modeling, and independent security review.

## Security language

Avoid absolute claims such as “impossible to hack”, “100% protected”, or “mathematically impossible” in production documentation. State the threat, control, assumptions, test evidence, and residual risk instead.
