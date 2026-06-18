---
title: "2026-06-02 — Fieldbook API outage (connection pool exhaustion)"
date: "2026-06-04T09:00:00-03:00"
incident: 2026-06-02-fieldbook-api-outage
---

| | |
| --- | --- |
| **Status** | FINAL |
| **Severity** | SEV1 |
| **Incident date** | 2026-06-02 |
| **Duration** | 2h 35m (first impact → full recovery) |
| **Detected by** | Monitoring (5xx rate alert) |
| **Affected services** | Fieldbook API, Fieldbook |

## Summary

On 2026-06-02, the Fieldbook API began returning elevated 5xx errors for write
operations after a morning traffic spike exhausted the database connection
pool. Users were unable to save records in Fieldbook for roughly 2.5 hours. The
root cause was a connection pool limit that had not been scaled alongside recent
traffic growth, combined with connections that were not being recycled. It was
mitigated by raising the pool limit and recycling stale connections, and fully
resolved once error rates held at zero for 30 minutes.

## Impact

- **Customer-facing:** Saving records in Fieldbook failed with an error; reads
  were intermittently slow but mostly succeeded.
- **Scope:** All customers performing writes during the window; peak error rate
  ~68% of write requests.
- **Product/pipeline:** The collect → upload → Fieldbook path was blocked at the
  write stage; no new records persisted during the incident.
- **Data integrity:** No data lost or corrupted. Failed writes were not
  acknowledged, so clients retried successfully after recovery.

## Detection

Detected via the Fieldbook API 5xx-rate alert at 09:12 ADT, approximately 7
minutes after first impact. The alert fired as designed.

## Timeline

| Time (ADT) | Event |
| --- | --- |
| 09:05 | First impact — write error rate begins climbing |
| 09:12 | 5xx-rate alert fires; on-call acknowledges |
| 10:20 | Root cause identified — DB connection pool exhausted |
| 11:10 | Mitigation deployed — pool limit raised, stale connections recycled |
| 11:40 | Full recovery confirmed; incident resolved |

## Root Cause

A morning traffic spike drove concurrent write volume above the configured
database connection pool size. Because long-lived connections were not being
recycled, the pool saturated and new queries queued until they timed out,
surfacing as 5xx errors. The pool limit had not been revisited as traffic grew
over the preceding quarter.

## Resolution & Recovery

Mitigation and resolution were the same change: the connection pool limit was
increased and a shorter max-connection-lifetime was set so stale connections are
recycled. Recovery was confirmed by watching the write error rate hold at zero
for 30 minutes after deploy.

## Contributing Factors

- Connection pool size was a static value not tied to observed traffic.
- No alert on connection pool utilization — only on the downstream 5xx rate.

## Lessons Learned

- Capacity limits that are static while traffic grows are latent incidents
  waiting for a spike.
- Alert on the resource (pool utilization), not just the symptom (5xx rate), to
  cut diagnosis time.
