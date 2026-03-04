import { STATIC_ENROLLEES } from '@/Components/Mentor/Enrollees/enrolleeData';

export function resolveEnrollee(userdata, id) {
    if (userdata) return userdata;
    if (id) return STATIC_ENROLLEES.find((e) => String(e.id) === String(id)) ?? null;
    return null;
}

export function getFullName(enrollee) {
    if (!enrollee) return 'Unknown';
    return `${enrollee.firstname ?? ''} ${enrollee.lastname ?? ''}`.trim();
}

export function getInitials(enrollee) {
    if (!enrollee) return '?';
    const first = enrollee.firstname?.[0] ?? '';
    const last  = enrollee.lastname?.[0]  ?? '';
    return `${first}${last}`.toUpperCase() || '?';
}

export function formatEnrolledDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });
}

export function getStatusMeta(status) {
    const map = {
        pending:  { label: 'Pending',  color: '#d97706' },
        ongoing:  { label: 'Ongoing',  color: '#2563eb' },
        graduate: { label: 'Graduate', color: '#16a34a' },
    };
    return map[status] ?? { label: status ?? 'Unknown', color: '#6b7280' };
}