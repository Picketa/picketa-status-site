export const SITE_TITLE = 'Picketa Status';
export const SITE_DESCRIPTION = 'Current status and incident history for Picketa systems';
export const SITE_URL = 'https://status.picketa.com';
export const DEFAULT_OG_TITLE = SITE_TITLE;
export const DEFAULT_OG_DESCRIPTION = SITE_DESCRIPTION;
export const DEFAULT_OG_IMAGE_TITLE = SITE_DESCRIPTION;

// The subsystems we track on the status page. Order here is the display order.
export const SYSTEMS = [
  "Fieldbook",
  "Fieldbook API",
  "Internal Tools API",
  "LENS Desktop",
] as const;

// Number of days of daily history rendered in the per-system uptime bars.
export const HISTORY_DAYS = 90;
