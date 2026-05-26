# Reward Environment Variables

Date: 2026-05-26  
Stage: P2 Production Data Layer

## Required Variables

| Variable | Local | Pilot/Production | Notes |
| --- | --- | --- | --- |
| `APP_ENV` | `local` | `pilot` or `production` | Controls safety gates. |
| `APP_BASE_URL` | `http://localhost:3000` | Public HTTPS app URL | Must be an absolute URL. |
| `DATABASE_URL` | `file:./dev.db` | PostgreSQL URL | Pilot/production must not use SQLite. |
| `AUTH_SECRET` | optional but recommended | required, 32+ chars | Used for session and invite token hashing. |
| `STORAGE_PROVIDER` | `mock` | `mock` for first pilot | Real storage requires evidence policy review. |
| `AI_PROVIDER_MODE` | `mock` or `template` | `mock` or `template` | `kimi` requires separate consent and redaction. |
| `REWARD_ENABLE_MOCK_ROLE_SWITCHER` | `true` allowed | must not be `true` | Keeps demo tools out of test-user environments. |
| `REWARD_ADMIN_EMAILS` | optional | required for admin access | Comma-separated allowlist for `/admin/pilot`. |
| `REWARD_INVITES_PAUSED` | `false` | `false` unless incident response | Blocks creation of new child invites when `true`. |
| `ALLOW_DEMO_SEED` | `false` | must be `false` | Demo seed is forbidden in pilot/production. |
| `NOTIFICATION_MODE` | `in_app` | `in_app` | Real push is not in first-pilot scope. |
| `REWARD_ENABLE_PAYMENTS` | `false` | must not be `true` | Payment is outside MVP/Pilot scope. |

## Compatibility Variables

The code still accepts these older names while the app is moving from MVP demo to pilot:

| Legacy Variable | Preferred Variable |
| --- | --- |
| `MOCK_AUTH_ENABLED` | `REWARD_ENABLE_MOCK_ROLE_SWITCHER` |
| `EVIDENCE_STORAGE_MODE` | `STORAGE_PROVIDER` |
| `AI_PROVIDER`, `AI_MODE` | `AI_PROVIDER_MODE` |

## Optional Variables

| Variable | Default | Notes |
| --- | --- | --- |
| `EVIDENCE_MAX_MB` | `5` | Applies when real evidence storage is introduced. |
| `KIMI_API_KEY` | empty | Must stay empty unless AI consent and redaction are implemented. |
| `KIMI_BASE_URL` | provider default | Future-only. |
| `KIMI_MODEL` | provider default | Future-only. |
| `TIME_ACCELERATION_FACTOR` | `1` | Local testing aid. |
| `AUDIT_LOG_ENABLED` | `true` | Should remain true for pilot/production. |
| `ALLOW_DEMO_SEED` | `false` | Must remain false for real pilot/production. |

## Local Example

```env
APP_ENV=local
APP_BASE_URL=http://localhost:3000
DATABASE_URL=file:./dev.db
AUTH_SECRET=replace-with-at-least-32-random-characters
REWARD_ENABLE_MOCK_ROLE_SWITCHER=true
STORAGE_PROVIDER=mock
AI_PROVIDER_MODE=mock
ALLOW_DEMO_SEED=false
NOTIFICATION_MODE=in_app
REWARD_ENABLE_PAYMENTS=false
```

## Pilot Example

```env
APP_ENV=pilot
APP_BASE_URL=https://pilot.example.com
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/reward_pilot
AUTH_SECRET=replace-with-a-real-64-character-random-secret
REWARD_ENABLE_MOCK_ROLE_SWITCHER=false
STORAGE_PROVIDER=mock
AI_PROVIDER_MODE=mock
ALLOW_DEMO_SEED=false
NOTIFICATION_MODE=in_app
REWARD_ENABLE_PAYMENTS=false
```

## Validation

Run:

```bash
npm run env:check
```

For a deployment check that also verifies database connectivity:

```bash
npm run predeploy:check
```
