---
title: "Sample upload failures from LENS Desktop"
severity: SEV2
status: resolved
affected: ["LENS Desktop", "Fieldbook"]
date: "2026-06-17T15:33:00-03:00"
resolved: "2026-06-17T17:32:00-03:00"
postmortem: 2026-06-17-sample-upload-failures
---

### Resolved — 17:32 ADT

Sample uploads have fully recovered and error rates have held at zero. Samples
collected during the incident were cached safely on-device and can be
re-uploaded. The incident is resolved. A full post-mortem is available.

### Monitoring — 17:01 ADT

A fix has been deployed to the sample-upload API and uploads are succeeding
again. We are monitoring to confirm full recovery.

### Identified — 16:10 ADT

We identified a recently shipped change to the sample-upload API that caused
uploads to fail with an HTTP 500 error. Affected samples remained cached on the
device. We are preparing a fix.

### Investigating — 15:33 ADT

We are investigating reports that samples collected in the LENS Desktop app are
caching locally but failing to upload. Locally cached data is safe and will sync
once service is restored.
