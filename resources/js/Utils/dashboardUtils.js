import { GraduationCap, Users, PhilippinePeso } from 'lucide-react';

// -----------------------------------------------------------------------------
// STAT CARD DEFINITIONS
// Each entry maps an iconKey (sent from PHP) to its Lucide icon + color tokens.
// When a new stat is added on the backend, just register it here.
// -----------------------------------------------------------------------------

const ICON_MAP = {
    GraduationCap:  { Icon: GraduationCap,  iconColor: '#1a7508', iconBg: '#f0fdf4' },
    Users:          { Icon: Users,          iconColor: '#f59e0b', iconBg: '#fffbeb' },
    PhilippinePeso: { Icon: PhilippinePeso, iconColor: '#15803d', iconBg: '#f0fdf4' }, // Fixed key mismatch
};

/**
 * Merges backend stat props with their front-end icon/color config.
 *
 * @param {Array|null} stats  - The `stats` prop passed from the controller.
 * Each item: { title, value, change, footer, iconKey }
 * @returns {Array}           - Ready-to-render stat card objects.
 *
 * Usage:
 * const cards = buildStatCards(stats);
 */
export function buildStatCards(stats) {
    if (!stats?.length) return getDefaultStatCards();

    return stats.map((stat) => ({
        ...stat,
        ...(ICON_MAP[stat.iconKey] ?? ICON_MAP.GraduationCap),
    }));
}

// -----------------------------------------------------------------------------
// DEFAULTS  (shown when backend sends no stats / before courses exist)
// -----------------------------------------------------------------------------

function getDefaultStatCards() {
    return [
        {
            title:    'TOTAL COURSES',
            value:    '0',
            change:   '+0 this month',
            footer:   '0 Published | 0 Drafts',
            iconKey:  'GraduationCap',
            ...ICON_MAP.GraduationCap,
        },
        {
            title:    'ACTIVE ENROLLEES',
            value:    '0',
            change:   'No enrollees yet',
            footer:   'Enrollments coming soon',
            iconKey:  'Users',
            ...ICON_MAP.Users,
        },
        {
            title:    'TOTAL EARNINGS',
            value:    '₱0.00',
            change:   'No earnings yet',
            footer:   'Payments coming soon',
            iconKey:  'PhilippinePeso',
            ...ICON_MAP.PhilippinePeso, // Now correctly maps to the object above
        },
    ];
}

// -----------------------------------------------------------------------------
// ACTION CARD DEFINITIONS
// Add new quick-action cards here. No need to touch the component.
// -----------------------------------------------------------------------------

export const ACTION_CARDS = [
    {
        label:      'Create New Course',
        iconKey:    'Plus',
        iconBg:     '#15803d',
        iconColor:  '#ffffff',
        route:      'mentor.courses.create',
    },
    {
        label:      'Create Assessment',
        iconKey:    'ClipboardCheck',
        iconBg:     '#f0fdf4',
        iconColor:  '#15803d',
        route:      'mentor.assessment.create',          // wire up when assessment route exists
    },
    {
        label:      'Design Certificate',
        iconKey:    'Award',
        iconBg:     '#f0fdf4',
        iconColor:  '#15803d',
        route:      'mentor.certificates.index',
    },
];

// -----------------------------------------------------------------------------
// REVENUE TRENDS (fallback shape)
// Replace data values once the real endpoint is wired.
// -----------------------------------------------------------------------------

export const DEFAULT_REVENUE_TRENDS = [
    { name: 'Feb 1',  revenue: 20,  enrollments: 50 },
    { name: 'Feb 5',  revenue: 60,  enrollments: 100 },
    { name: 'Feb 10', revenue: 45,  enrollments: 50 },
    { name: 'Feb 15', revenue: 50, enrollments: 50 },
    { name: 'Feb 20', revenue: 130, enrollments: 150 },
    { name: 'Feb 28', revenue: 80, enrollments: 40 },
    { name: 'Jan 5', revenue: 80, enrollments: 50 },
    { name: 'Jan 10',  revenue: 20,  enrollments: 50 },
    { name: 'Jan 15',  revenue: 60,  enrollments: 100 },
    { name: 'Jan 20', revenue: 45,  enrollments: 50 },
    { name: 'Jan 25', revenue: 350, enrollments: 500 },
    { name: 'Jan 30', revenue: 200, enrollments: 250 },
    { name: 'Jan 35', revenue: 280, enrollments: 400 },
    { name: 'Jan 40', revenue: 480, enrollments: 500 },
];

// -----------------------------------------------------------------------------
// RECENT ACTIVITY (type to color mapping)
// Add new activity types here when needed.
// -----------------------------------------------------------------------------

export const ACTIVITY_COLORS = {
    success: { dot: '#22c55e', ring: '#f0fdf4', text: '#15803d' },
    warning: { dot: '#f59e0b', ring: '#fffbeb', text: '#d97706' },
    info:    { dot: '#3b82f6', ring: '#eff6ff', text: '#2563eb' },
    primary: { dot: '#15803d', ring: '#f0fdf4', text: '#15803d' },
};

export const DEFAULT_ACTIVITY = [];   // empty until activity log is implemented

// -----------------------------------------------------------------------------
// TOP COURSES (fallback shape)
// -----------------------------------------------------------------------------

export const DEFAULT_TOP_COURSES = []; // empty until enrollments exist