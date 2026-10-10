# SIRAP — Budget Realisation Reporting Workflow

SIRAP is a web application for recording, reviewing, and monitoring budget
realisation at the district-government level. It gives each role a focused
workflow—from activity reporting to staged review—while keeping allocations,
evidence, and reporting controls connected in one system.

## Overview

Public-sector budget reporting is often spread across spreadsheets, messages,
and manually collected evidence. SIRAP brings that process into a traceable
workflow: staff record activity realisation, reviewers check submissions in
sequence, and authorised users can monitor allocation use and export reports.

The interface is intentionally in Indonesian for its operational users. This
repository is an English-first case study of the product and the engineering
decisions behind it; the application source remains private.

## Demo Access

Selected, sanitised screenshots are shared during a private walkthrough of the
workflow. Please contact
[m.noor.aditya.rahman@gmail.com](mailto:m.noor.aditya.rahman@gmail.com) to
arrange access.

## Key Capabilities

- Budget allocation management with ceiling-aware reporting controls.
- Activity realisation reports with structured expense details and supporting
  evidence.
- Staged review flow for staff, section leadership, and management roles.
- Role-based access control that limits data and actions to the appropriate
  work unit and responsibility.
- Budget recaps and CSV, XLSX, and PDF exports for reporting workflows.

## Technology

- Laravel and PHP for the application backend.
- Inertia.js, React, TypeScript, and Tailwind CSS for the interface.
- PostgreSQL for relational data.
- Spatie Laravel Permission for role-based access control.
- Docker for reproducible development and deployment environments.

## Engineering Quality

SIRAP is built around server-side validation and authorisation rather than
UI-only restrictions. Budget calculations use decimal-safe comparisons,
uploads are constrained by type and size, and evidence is kept behind
application access controls.

The project also maintains automated backend and frontend checks. Recent
hardening work covers session invalidation after sensitive account changes,
cross-role access controls, disabled public registration, safer exports, and
production-safe error handling.

## Remote Collaboration

The project is maintained with reviewable commits, documented environment
conventions, automated checks, and container-based workflows. Those practices
make the work easier to understand, review, and continue across asynchronous
teams.

## Case Study

- [Indonesian client case study](docs/portfolio-case-study.id.md)
- [Sanitized conceptual architecture](docs/architecture.md)
- [Private demo access policy](docs/demo-publication-checklist.md)
- [Responsible disclosure policy](SECURITY.md)

## Contact

For technical discussion or a private source review, please contact the
repository owner through GitHub.
