export const SIDEBAR_WIDTH = 240;
export const EASE         = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
export const EASE_SPRING  = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

export function formatDuration(seconds) {
    if (!seconds || seconds <= 0) return null;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (!h) return `${m}m`;
    if (!m) return `${h}h`;
    return `${h}h ${m}m`;
}

export function formatModuleDuration(lessons = []) {
    const total = lessons.reduce(
        (acc, l) =>
            acc +
            (l.materials || []).reduce((a, m) => a + (m.duration_seconds || 0), 0) +
            (l.videos    || []).reduce((a, v) => a + (v.duration         || 0), 0),
        0,
    );
    return formatDuration(total);
}

export const formatCurrency = (n) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(n ?? 0);

export function stripHTML(html) {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}
