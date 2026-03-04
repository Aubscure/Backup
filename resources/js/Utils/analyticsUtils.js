/**
 * @file analyticsUtils.js
 * @description Default data and shared config for Analytics charts.
 *
 * These arrays serve as both the empty-state fallback AND the documented
 * schema for what the Laravel controller should eventually return.
 * Replace the placeholder values with real data from Inertia props.
 */

// ─── Enrollment Trends ────────────────────────────────────────────────────────
/**
 * Monthly enrollment breakdown by learner status.
 *
 * Schema per row:
 *   name       {string}  - Month label shown on X-axis  (e.g. "Jan")
 *   graduated  {number}  - Learners who completed the course
 *   ongoing    {number}  - Learners currently active
 *   pending    {number}  - Learners enrolled but not yet started
 *
 * @type {Array<{ name: string, graduated: number, ongoing: number, pending: number }>}
 */
export const DEFAULT_ENROLLMENT_TRENDS = [
    // Uncomment and populate when wiring real data:
    { name: 'Jan', graduated: 45,  ongoing: 120, pending: 30 },
    { name: 'Feb', graduated: 52,  ongoing: 145, pending: 45 },
    { name: 'Mar', graduated: 85,  ongoing: 160, pending: 20 },
    { name: 'Apr', graduated: 110, ongoing: 190, pending: 60 },
    { name: 'May', graduated: 140, ongoing: 210, pending: 40 },
    { name: 'Jun', graduated: 165, ongoing: 250, pending: 55 },
];

// ─── Revenue Trends ───────────────────────────────────────────────────────────
/**
 * Monthly revenue split by enrolment type.
 *
 * Schema per row:
 *   name          {string}  - Month label shown on X-axis  (e.g. "Jan")
 *   individual    {number}  - Revenue from individual enrolments (PHP)
 *   organization  {number}  - Revenue from organisation enrolments (PHP)
 *
 * @type {Array<{ name: string, individual: number, organization: number }>}
 */
export const DEFAULT_ANALYTICS_REVENUE_TRENDS = [
    // Uncomment and populate when wiring real data:
    { name: 'Jan', individual: 15000, organization: 45000 },
    { name: 'Feb', individual: 18500, organization: 52000 },
    { name: 'Mar', individual: 22000, organization: 48000 },
    { name: 'Apr', individual: 31000, organization: 75000 },
    { name: 'May', individual: 28000, organization: 82000 },
    { name: 'Jun', individual: 42000, organization: 95000 },
];

// ─── Shared chart theme ───────────────────────────────────────────────────────
/**
 * Colour tokens reused across all Analytics charts.
 * Change here to update every chart at once.
 */
export const ANALYTICS_CHART_COLORS = {
    graduated:    '#16a34a',   // deep green
    ongoing:      '#4ade80',   // light green
    pending:      '#fbbf24',   // amber
    individual:   '#15803d',   // dark green  (matches dashboard)
    organization: '#f59e0b',   // amber       (matches dashboard)
    grid:         '#f1f5f9',
    axis:         '#94a3b8',
    tooltip: {
        bg:     'background.paper',
        border: 'divider',
    },
};
export const DEFAULT_STATUS_BREAKDOWN = [
    { label: 'Ongoing',   value: 456, color: ANALYTICS_CHART_COLORS.ongoing   },
    { label: 'Pending',   value: 124, color: ANALYTICS_CHART_COLORS.pending   },
    { label: 'Graduated', value: 342, color: ANALYTICS_CHART_COLORS.graduated },
    { label: 'Inactive',  value:  58, color: ANALYTICS_CHART_COLORS.inactive  },
];
