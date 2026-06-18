---
title: "Delayed background sync on Internal Tools API"
severity: SEV2
status: monitoring
affected: ["Internal Tools API"]
date: "2026-06-18T08:15:00-03:00"
---

### Monitoring — 09:40 ADT

We have applied a fix to the background job workers and sync latency has
returned to normal levels. We are monitoring to confirm the issue is fully
resolved.

### Identified — 08:50 ADT

The delay is caused by a backlog in the background job queue after a deployment
earlier this morning. We are scaling up workers to drain the backlog.

### Investigating — 08:15 ADT

We are investigating reports of delayed background syncs affecting the Internal
Tools API. Interactive requests are unaffected.
