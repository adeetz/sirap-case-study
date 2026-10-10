# SIRAP Conceptual Architecture

This conceptual view deliberately omits infrastructure topology, deployment paths, addresses, and configuration values.

```text
Browser → HTTPS → Laravel/Inertia application
                         ├── PostgreSQL
                         └── Private Evidence Storage
```

## Request and access boundary

The Browser reaches the Laravel/Inertia application over HTTPS. It handles workflow, authentication, authorisation, validation, and response rendering. Role-based controls limit actions and records to the appropriate responsibility.

## Data boundary

PostgreSQL stores structured application data such as users, allocations, reports, verification state, and expense details. Budget comparisons use decimal-safe server-side logic.

## Evidence boundary

Private Evidence Storage holds accepted supporting files behind application access controls. File type, size, and attachment-count constraints are checked before files are accepted.

## Delivery boundary

The application is built in container-based environments so dependencies and frontend assets can be reproduced consistently. Operational hosts, network routes, and deployment access are intentionally outside this public case study.
