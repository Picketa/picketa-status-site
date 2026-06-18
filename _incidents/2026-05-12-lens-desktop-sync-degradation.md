---
title: "LENS Desktop sync degradation"
severity: SEV2
status: resolved
affected: ["LENS Desktop"]
date: "2026-05-12T13:00:00-03:00"
resolved: "2026-05-12T15:30:00-03:00"
---

### Resolved — 15:30 ADT

Sync throughput has fully recovered and no further errors have been observed.
The incident is resolved.

### Identified — 13:45 ADT

A third-party storage provider was returning intermittent timeouts, slowing
uploads from LENS Desktop. We have rerouted traffic to a healthy region.

### Investigating — 13:00 ADT

We are investigating slow and occasionally failing scan uploads from LENS
Desktop. Locally cached data is safe and will sync once service is restored.
