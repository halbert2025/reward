# Reward Storage Adapter

Date: 2026-05-26  
Stage: P4 Evidence & Storage

## Current Adapter

Current provider: `mock`

The mock adapter stores no files. Evidence uses only a short textual placeholder:

```text
mock://desk-corner
```

This is intentional for the first pilot because minor photo handling requires a separate privacy and deletion review.

## Environment

```env
STORAGE_PROVIDER=mock
EVIDENCE_STORAGE_MODE=mock
EVIDENCE_MAX_MB=5
```

For pilot, `STORAGE_PROVIDER` should remain `mock`.

## Contract

A future real storage adapter must expose:

- `putEvidenceObject(input)`
- `getEvidenceSignedUrl(input)`
- `deleteEvidenceObject(input)`
- `sealEvidenceObject(input)`

The adapter must not be called from P08 while `STORAGE_PROVIDER=mock`.

## Required Real Storage Guards

Before implementing `s3` or `r2`:

- Object keys must not contain child name, family name, school, or original filename.
- Buckets must be private.
- URLs must be short-lived signed URLs.
- Upload must strip EXIF before persistence.
- File type and size must be checked server-side.
- Deletion must remove the object and keep only an audit-safe summary.
- Witness views must never request evidence object URLs.

## Pilot Acceptance

P4 is complete when:

- UI says real photos are not uploaded.
- Server rejects upload-like placeholder input.
- Unit tests cover sensitive evidence and real-upload indicators.
- `docs/safety/evidence-photo-policy.md` is linked from privacy docs.
