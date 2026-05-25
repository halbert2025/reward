# Reward Pilot Consent Text

Date: 2026-05-26  
Version: 2026-05-26

## Guardian Notice

Reward is a small family promise pilot, not a control or monitoring tool.

The pilot records account, family, promise, reflection, diary, invite, audit, and in-app request data.

The first pilot does not collect real evidence photos, location, school identifiers, payment data, or child social graph data.

ChildNote is child-private by default and is not shown to parents, witnesses, or normal operations views.

Witnesses only see a safe memory summary, not evidence, amount, ChildNote, repair details, or family disputes.

AI/Kimi is off by default and must not be connected without separate consent, redaction, a kill switch, and fallback.

Families can request export, deletion review, data sealing, or pilot exit from the data request page.

## Child-Friendly Notice

Reward helps your family remember one small promise at a time.

Your private note is for you by default.

The app does not use camera monitoring, location tracking, rankings, or punishment locks.

If something feels unfair, ask a trusted adult to review it together.

## Product Implementation

The live pilot consent page is `/pilot/consent`.

Acceptance creates a `PilotConsent` row with:

- `scope = guardian_pilot`
- `version = 2026-05-26`
- `status = accepted`
- `noticeSnapshot` copied from this versioned notice

Family creation is blocked until the current parent/co-signer has accepted the current notice version.
