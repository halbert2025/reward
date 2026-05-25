# Reward Evidence Photo Policy

Date: 2026-05-26  
Stage: P4 Evidence & Storage

## Pilot Decision

The first pilot does not upload or store real family photos.

Reward currently supports:

- Required child reflection text.
- Optional short mock photo description.
- Server-side rejection for sensitive or real-upload-like evidence input.

Reward currently does not support:

- Real photo upload.
- Video evidence.
- Camera capture.
- Face, address, school logo, certificate, chat screenshot, GPS, or location evidence.
- Public evidence URLs or base64 image payloads.

## Product Copy Rule

P08 completion submission must clearly say:

- Photos are optional.
- The pilot does not upload real photos.
- A child can write a short local/mock description instead.
- The description must avoid face, address, school, certificate, chat screenshot, and location details.

## Server Rule

`validateEvidencePlaceholder` blocks:

- Face/selfie/portrait/group photo wording.
- Address, doorplate, school, class, teacher, certificate, chat screenshot, video, location, and GPS wording.
- URL, `data:image`, `base64`, `file:`, and common image file extensions.
- Mock descriptions longer than 80 characters.

If a child fills a mock photo description, `submitWishReflection` also requires `evidenceNoticeAccepted=on`.

## Stored Data

The MVP stores:

- `Evidence.reflectionText`
- Optional `Evidence.photoUrl = mock://<short-description>`
- Audit metadata:
  - `storageProvider = mock`
  - `hasPhotoPlaceholder`
  - `evidenceNoticeAccepted`

No image bytes are stored.

## Future Real Storage Gate

Before real upload is enabled, the project must add:

- Private object storage adapter.
- File size/type checks.
- EXIF stripping.
- Virus/malware scanning where provider supports it.
- Deletion and sealing workflow.
- Face/address/school warning before upload.
- Separate pilot consent update.
- E2E tests for upload rejection and delete request.
