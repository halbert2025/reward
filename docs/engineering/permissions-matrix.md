# Reward MVP Permissions Matrix

> Prompt 12 output. Server-side authorization must follow this matrix.

## Roles

| Role | Meaning |
| --- | --- |
| parent | Parent or guardian inside a family. |
| co_signer | Additional parent/guardian who can co-sign supported contract actions. |
| child | Child participant. |
| witness | Memorial witness with limited access. |
| system | Deterministic system process. |
| admin | Internal development/admin role, not a family participant. |

## Permission Answers Required By Prompt 12

| Question | Parent | Co-signer | Child | Witness | System |
| --- | --- | --- | --- | --- | --- |
| Who can view contract? | Yes, family contracts | Yes, assigned contracts | Yes, own contracts | Limited completion summary only | Yes, for transitions |
| Who can edit contract draft? | Yes, before child confirmation | Yes, if assigned | No | No | No |
| Who can confirm contract? | No, parent proposes | No | Yes, assigned child only | No | No |
| Who can view evidence? | Yes, contract evidence | Yes, if assigned | Yes, own submitted evidence | No | Limited processing only |
| Who can view tree-hole/ChildNote? | No by default | No by default | Yes, own notes | No | Storage only, no auto-alert |
| Who can start repair? | Yes, after completion response point | Yes, if assigned | Can respond/acknowledge, not unilateral verdict | No | Can route prompts |
| Who can archive records? | Yes, where allowed | Yes, if assigned | Own ChildNote archive only | No | Retention/archive jobs |
| Who can export data? | Family-safe export | Family-safe export if authorized | Own child-visible data | No | Generate export without restricted data |

**Hard rule:** parent cannot view ChildNote default content. ChildNote is child-private unless a later explicit consent model is designed and reviewed.

## Object Permissions

| Object | Parent | Child | Witness | System/Admin Notes |
| --- | --- | --- | --- | --- |
| User | Read family members | Read self and family display names | Read limited inviter/display context | Admin only for support |
| Family | Create/manage | Read own family context | No direct browse | System reads for transitions |
| FamilyMember | Invite/manage family members | Read own membership | No | Admin support only |
| Membership | Manage contract-level roles | Read own contract role | No | Used by auth layer |
| RewardPool | Create/edit/archive | Read active wishes | No | Validate forbidden categories |
| Wish | Create/edit/archive safe wishes | Choose active safe wish | No | Block unsafe wish types |
| Contract | Draft/view/respond/archive | View/confirm own contract | Limited summary after diary | Enforce state machine |
| ContractVersion | Create new version | Confirm latest assigned version | No | Immutable after creation |
| Task | Read summary, no destructive delete | Start/pause/resume/exit/complete own task | No | Enforce Task transitions |
| FocusSession | Read summary | Control own session | No | No video/location/hard lock |
| Evidence | View contract evidence | Create/view own evidence | No | Do not send to analytics raw |
| Fulfillment | Create parent response | View family-facing response | Limited safe memory only | AI cannot fulfill |
| RepairCase | Open/message/resolve without verdict | Respond/acknowledge | No | Repair is not judgment |
| Witness | Invite/revoke | No | Accept invite, send blessing | Token is secret |
| DiaryEntry | View family diary | View family diary | Limited safe summary | Generated from valid state |
| ChildNote | No default read | Create/read/archive own notes | No | No auto-alert in MVP |
| Notification | Read own | Read own | Read own limited invite | Must not leak private text |
| AuditLog | No raw browse in MVP | No | No | Admin/system only |

## Sensitive Field Rules

| Field/Data | Parent | Child | Witness | Analytics | Export |
| --- | --- | --- | --- | --- | --- |
| ChildNote.body | Deny by default | Own only | Deny | Never raw | Excluded by default |
| Evidence.reflectionText | Contract parent can read | Own/family contract | Deny | Never raw | Family export with filtering |
| Evidence.photoUrl | Contract parent can read | Own/family contract | Deny | Never image/face | Family export with filtering |
| RepairCase.parentMessage | Parent/co-signer | Assigned child if part of repair | Deny | Never raw | Exclude or summarize |
| RepairCase.childResponse | Parent/co-signer if part of repair | Author child | Deny | Never raw | Exclude or summarize |
| AuditLog.metadataJson | Admin/system only | Deny | Deny | Aggregated only | Usually excluded |
| Witness.inviteTokenHash | Deny | Deny | Token use only | Never | Excluded |

## Deny-By-Default Rules

- Parent cannot view ChildNote default content.
- Witness cannot view Evidence, ChildNote, reward amount-like details, repair details, or AuditLog.
- Child cannot edit confirmed ContractVersion.
- Parent cannot hard-delete child Task, FocusSession, Evidence, DiaryEntry, or AuditLog.
- System and AI cannot judge, fulfill, repair verdicts, auto-send, or auto-alert from ChildNote.
- No role can create school/class/institution, payment escrow, merchant, video supervision, hard lock, realtime location, open social ranking, or gacha entities in MVP.

## API Enforcement Notes

- Permission checks must run server-side.
- UI hiding is only a convenience, not an authorization boundary.
- Every read endpoint must choose a role-specific DTO.
- Every write endpoint must go through a state transition or explicit repository method.
- Export endpoints must use a dedicated export DTO, never raw database rows.

## Tests Needed

- Parent ChildNote read returns denied.
- Witness Evidence read returns denied.
- Witness repair detail read returns denied.
- Child confirmed contract edit returns denied.
- Parent child-effort hard delete returns denied.
- Export excludes ChildNote by default.

## Done When

- The matrix answers all eight Prompt 12 permission questions.
- It explicitly says parent cannot view ChildNote default content.
- It gives object-level and sensitive-field-level rules.
- It can be translated into server authorization tests.
