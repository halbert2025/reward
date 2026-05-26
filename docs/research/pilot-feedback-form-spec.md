# Reward Pilot Feedback Form Spec

Date: 2026-05-26  
Stage: P9C / P10 Pilot Feedback

## Purpose

The feedback form turns family observations into triageable pilot work without collecting unnecessary child data.

## Fields

| Field | Required | Notes |
| --- | --- | --- |
| Role | Yes | parent / child / witness / other |
| Feedback type | Yes | bug / usability / safety / privacy / idea / general |
| Page or step | No | Short label, no URL with tokens |
| What happened | Yes | Plain description |
| What you expected | No | Helpful for bugs |
| How serious it felt | Yes | low / medium / high |
| Contact permission | Yes | yes / no |
| Contact method | No | Parent contact only; do not ask child direct contact |

## Prohibited Inputs

The form copy must ask users not to submit:

- Child full name.
- Address.
- School.
- Phone number.
- ID number.
- Face photo.
- Screenshots containing private chat.
- ChildNote raw private content unless the child and guardian intentionally decide to report it as a safety concern.

## Routing

| Type | Route |
| --- | --- |
| bug | Product triage |
| usability | Product triage |
| safety | Risk review queue |
| privacy | Privacy/data handler |
| idea | V1 candidate review |
| general | Daily observation |

## Acceptance

- Safety feedback creates a `RiskSignal`.
- Feedback records are visible to admin.
- Feedback does not expose ChildNote by default.
- Feedback can be exported or deleted/sealed through the data request process.
