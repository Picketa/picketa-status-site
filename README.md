# Picketa Status

The public status and incident-report page for Picketa Systems. Built with
Next.js and deployed on AWS Amplify. Like the developer site it was forked from,
it is **stateless** — there is no database. Incidents and post-mortems are plain
markdown files with frontmatter, read at build time via `gray-matter`.

## What it shows

- A **banner** reflecting overall health: green "All systems operational",
  orange when a SEV2 is active, red when a SEV1 is active (red always wins).
- A **per-system 90-day history** of little daily bars (green / orange / red)
  for each tracked subsystem.
- A reverse-chronological **incident history** grouped by date, each with a
  severity (SEV1 / SEV2) and status, linking to a detail page and, when
  available, a post-mortem.

The tracked subsystems and the history window are configured in
[`src/lib/constants.ts`](src/lib/constants.ts) (`SYSTEMS`, `HISTORY_DAYS`).

## Getting Started

```bash
git clone https://github.com/<your-username>/picketa-status-site.git
cd picketa-status-site
pnpm install
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the site.

## Reporting an incident

1. Create a markdown file in `_incidents/` named `YYYY-MM-DD-<kebab-slug>.md`
   (date first, so files sort chronologically in GitHub). The whole filename is
   the slug and becomes the URL: `/incidents/2026-06-15-fieldbook-api-errors`.
2. Include the frontmatter:
   ```markdown
   ---
   title: "Elevated error rates on Fieldbook API"
   severity: SEV1            # SEV1 (red) | SEV2 (orange)
   status: investigating     # investigating | identified | monitoring | resolved
   affected: ["Fieldbook API", "Fieldbook"]   # subset of SYSTEMS
   date: "2026-06-15T14:30:00-03:00"          # incident start
   resolved: "2026-06-15T16:10:00-03:00"      # omit while ongoing
   postmortem: 2026-06-15-fieldbook-api-errors  # optional; slug in _postmortems/
   ---
   ```
3. Write the timeline in the body as chronological updates (newest first), e.g.
   `### Monitoring — 09:40 ADT`, `### Identified — 08:50 ADT`, …
4. **While `resolved` is absent**, the incident counts as active: it drives the
   banner color and the current status of every system in `affected`. Add the
   `resolved` timestamp to close it.
5. Open a Pull Request.

The history bars are derived automatically: each day a system is within an
incident's `[date, resolved]` window is colored by that incident's severity
(worst severity wins when incidents overlap).

## JSON API

`GET /api/get-past-90-days` returns a machine-readable snapshot for other apps
(e.g. a "systems degraded" banner inside Fieldbook). It contains the overall
status, every tracked system with its current status and full 90-day history,
and all incidents reported with **only their latest status** — no post-mortems
and no per-update timeline. Shape:

```jsonc
{
  "status": "degraded",          // operational | degraded | major_outage
  "indicator": "orange",         // green | orange | red
  "description": "Some systems degraded",
  "degraded": true,              // convenience flag for a banner
  "windowDays": 90,
  "systems": [
    {
      "name": "Fieldbook",
      "status": "operational",
      "indicator": "green",
      "uptime": 97.78,           // % operational over the window
      "history": [ { "date": "2026-06-02", "status": "major_outage",
                     "incident": "2026-06-02-fieldbook-api-outage" } ]
    }
  ],
  "incidents": [
    { "slug": "...", "title": "...", "severity": "SEV1",
      "status": "resolved", "affected": ["Fieldbook API", "Fieldbook"],
      "startedAt": "...", "resolvedAt": "...", "latestUpdate": "..." }
  ]
}
```

It is served as static JSON (`force-static`) with `Access-Control-Allow-Origin: *`
and is regenerated on each deploy. A client banner can simply check `degraded`.

## Adding a post-mortem

1. Create a markdown file in `_postmortems/`, also named
   `YYYY-MM-DD-<kebab-slug>.md` (use the incident date so it sorts next to its
   incident). The filename is the slug and the URL: `/postmortems/<slug>`.
2. Frontmatter:
   ```markdown
   ---
   title: "2026-06-02 — Fieldbook API outage"
   date: "2026-06-04T09:00:00-03:00"
   incident: fieldbook-api-outage-2026-06-02   # optional back-reference
   ---
   ```
3. Write the body following the public-facing subset of the
   [Postmortem Template](https://picketa.atlassian.net/wiki/spaces/ENG/pages/1033076747/Postmortem+Template):
   Summary, Impact, Detection, Timeline, Root Cause, Resolution, Contributing
   Factors, Lessons Learned. Keep the internal-only sections (What Went Well ·
   Poorly · Lucky, and Action Items with owners/tickets) in the Confluence
   post-mortem, not here. GitHub-flavored markdown tables are supported.
4. Reference the post-mortem from its incident with the `postmortem:` field so
   the "Read post-mortem" link appears.

## Development

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Content managed with Markdown (`gray-matter` + `remark` / `remark-gfm`)
- Deployed on [AWS Amplify](https://aws.amazon.com/amplify/)

## License

Copyright 2026 Picketa Systems. All rights reserved.
