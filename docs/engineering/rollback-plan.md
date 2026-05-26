# Reward Rollback Plan

Date: 2026-05-26  
Stage: P6 Deployment & Observability

## Immediate Pause

If pilot behavior looks unsafe or unstable, first pause new child invites:

```env
REWARD_INVITES_PAUSED=true
```

Then redeploy or restart the app with the updated env. Existing families can still access their data, but new child invites are blocked with a calm message.

## Code Rollback

1. Identify the last known-good Git commit.
2. Deploy that commit.
3. Run:

```bash
npm run env:check
npm run predeploy:check
```

4. Verify:

```text
/api/health
```

5. Run the smoke path:
   - parent login
   - family page
   - child invite generation if invites are not intentionally paused

## Database Rollback

Prisma migrations are forward-first. Prefer:

- provider snapshot restore for severe corruption
- forward repair migration for normal schema/data issues

Before database rollback:

- Pause new invites.
- Export or snapshot current database.
- Record the incident in operations notes.
- Avoid deleting `AuditLog`, `OperationalEvent`, `DataRequest`, or `RiskSignal` rows unless legally required.

## Roll Forward

When the fix is ready:

1. Deploy new code.
2. Run health check.
3. Run smoke checks.
4. Set `REWARD_INVITES_PAUSED=false`.
5. Create an operations note with the incident, fix, and verification result.

## Do Not

- Do not run demo seed in pilot/production.
- Do not copy production data to local development.
- Do not delete child-private notes as a quick fix.
- Do not expose safety or ChildNote raw content in incident updates.
