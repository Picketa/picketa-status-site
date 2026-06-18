---
title: "Fieldbook API outage — elevated 5xx errors"
severity: SEV1
status: resolved
affected: ["Fieldbook API", "Fieldbook"]
date: "2026-06-02T09:05:00-03:00"
resolved: "2026-06-02T11:40:00-03:00"
postmortem: 2026-06-02-fieldbook-api-outage
---

### Resolved — 11:40 ADT

The database connection pool has been restored and error rates have been at
zero for 30 minutes. The incident is resolved. A full post-mortem is available.

### Monitoring — 11:10 ADT

A fix has been deployed to increase the connection pool limits and recycle
stale connections. Error rates are dropping. We continue to monitor.

### Identified — 10:20 ADT

We identified exhaustion of the database connection pool following a traffic
spike. Fieldbook and the Fieldbook API were returning elevated 5xx errors for
most write operations.

### Investigating — 09:05 ADT

We are investigating a significant increase in errors on the Fieldbook API.
Users may be unable to save records in Fieldbook.
