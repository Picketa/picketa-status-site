---
title: "2026-06-17 — Sample upload failures (HTTP 500, samples cached but not uploading)"
date: "2026-06-19T09:00:00-03:00"
incident: 2026-06-17-sample-upload-failures
---

| | |
| --- | --- |
| **Status** | FINAL |
| **Severity** | SEV2 |
| **Incident date** | 2026-06-17 |
| **Duration** | 1h 59m (first impact → full recovery) |
| **Detected by** | Customer reports (LENS Desktop app) |
| **Affected services** | LENS Desktop, Fieldbook |

## Summary

On 2026-06-17, multiple customers reported that plant-tissue samples collected
in the LENS Desktop app were caching locally but failing to upload, returning an
HTTP 500 error. Because the product pipeline is collect → upload → ML analysis →
render in Fieldbook, samples that failed to upload never reached the ML models
and no analysis appeared in Fieldbook. In total, 6 customers and 17 sample
uploads were affected over roughly two hours. The root cause was a recently
shipped change to the sample-upload API that did not handle a value sent by
currently deployed desktop clients. It was mitigated by deploying a fix, after
which most affected samples could be re-uploaded.

## Impact

- **Customer-facing:** Samples collected in the field cached on the device but
  did not upload, surfacing as a "failed to upload samples" error with HTTP 500.
- **Scope:** 17 sample uploads failed, affecting 6 customers, between first
  impact and recovery.
- **Product/pipeline:** The failure was at the upload stage. With uploads
  rejected, samples did not enter the ML pipeline and no analysis rendered in
  Fieldbook for the affected samples.
- **Data integrity:** No data was lost. Samples were cached on-device rather
  than discarded, so they remained re-uploadable once the API accepted them.

## Detection

Detected via customer reports submitted through our support channel, the first
roughly 35 minutes after first impact. No automated alert fired ahead of the
customer reports, because there is no error-rate alerting configured on the
sample-upload API.

## Timeline

| Time (ADT) | Event |
| --- | --- |
| 15:33 | First upload failure begins |
| 16:08 | First customer report received |
| 16:10 | Incident acknowledged; diagnosis started |
| 16:34 | Fix PR opened |
| 17:01 | Fix deployed |
| 17:32 | Full recovery confirmed; incident resolved |

## Root Cause

A recently shipped change to the sample-upload API introduced a new code path
intended to route certain spectrometer samples to a new model. That path
expected a serial-number value to always be present, but currently deployed
versions of the LENS Desktop app do not send one. When the value was absent, the
API errored and uploads failed with HTTP 500. The new path was exercised by
existing tests, but never with the absent-value input that current desktop
clients actually produce, so the regression was not caught before release.

## Resolution & Recovery

The fix handled the absent serial-number value safely and was deployed, after
which uploads succeeded again. Samples that had failed to upload were left in a
partial state in the database; these were repaired so that affected users would
not hit a follow-on error when re-uploading. After the fix and cleanup, most
affected users were able to successfully re-upload their samples. Full recovery
was confirmed once error rates held at zero.

## Contributing Factors

- No automated alert on the sample-upload error rate — detection relied entirely
  on customer reports.
- A new code path shipped without a test for an input that currently deployed
  clients actually send (an absent serial-number value).

## Lessons Learned

- New API behavior must be tested against the inputs that currently deployed
  clients actually send, including absent or null fields. Backward compatibility
  with shipped desktop-app versions is part of the API contract, not an edge
  case.
- We were blind to upload failures until customers told us. Error-rate alerting
  on the sample-upload path is table stakes and is being added.
- Local on-device caching is a meaningful safety net — it turned a potential
  data-loss incident into a recoverable one.
