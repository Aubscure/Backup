import { Grid } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import AnalyticsStatCard from './AnalyticsStatCard';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount || 0);

const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num || 0);

/**
 * AnalyticsStatCards
 *
 * Renders the 2×4 grid of KPI summary cards.
 *
 * @param {object} metrics - Flat metrics object from the Laravel controller
 */
export default function AnalyticsStatCards({ metrics = {} }) {
    const m = metrics;

    const cards = [
        {
            title: 'Total Courses',
            value: m.total_courses ?? 0,
            subtitle: `${m.paid_individual_courses ?? 0} Paid Indv • ${m.paid_organization_courses ?? 0} Paid Orgn • ${m.free_courses ?? 0} Free`,
            icon: <SchoolIcon sx={{ color: '#16a34a', fontSize: 22 }} />,
            iconBg: '#f0fdf4',
            trend: 'up',
            trendValue: `+${m.courses_this_month ?? 0} this month`,
        },
        {
            title: 'Total Enrollees',
            value: formatNumber(m.total_enrollees ?? 0),
            subtitle: `${m.ongoing_enrollees ?? 0} Ongoing • ${m.pending_enrollees ?? 0} Pending • ${m.graduated_enrollees ?? 0} Graduated`,
            icon: <PeopleIcon sx={{ color: '#d97706', fontSize: 22 }} />,
            iconBg: '#fffbeb',
            trend: (m.enrollees_change_percent ?? 0) >= 0 ? 'up' : 'down',
            trendValue: `${(m.enrollees_change_percent ?? 0) >= 0 ? '+' : ''}${m.enrollees_change_percent ?? 0}% vs last month`,
        },
        {
            title: 'Total Revenue',
            value: formatCurrency(m.total_revenue ?? 0),
            subtitle: `${formatCurrency(m.individual_revenue ?? 0)} Indv • ${formatCurrency(m.organization_revenue ?? 0)} Orgn`,
            icon: <AttachMoneyIcon sx={{ color: '#16a34a', fontSize: 22 }} />,
            iconBg: '#f0fdf4',
            trend: (m.revenue_change_percent ?? 0) >= 0 ? 'up' : 'down',
            trendValue: `${(m.revenue_change_percent ?? 0) >= 0 ? '+' : ''}${m.revenue_change_percent ?? 0}% this month`,
        },
        {
            title: 'Mentor Rating',
            value: `${(m.mentor_rating ?? 0).toFixed(1)}`,
            subtitle: `Based on ${formatNumber(m.total_reviews ?? 0)} reviews`,
            icon: <StarIcon sx={{ color: '#d97706', fontSize: 22 }} />,
            iconBg: '#fffbeb',
            trend: (m.rating_change ?? 0) >= 0 ? 'up' : 'down',
            trendValue: `${(m.rating_change ?? 0) >= 0 ? '+' : ''}${(m.rating_change ?? 0).toFixed(1)} pts`,
        },
        {
            title: 'Completion Rate',
            value: `${m.completion_rate ?? 0}%`,
            icon: <CheckCircleIcon sx={{ color: '#16a34a', fontSize: 22 }} />,
            iconBg: '#f0fdf4',
            trend: (m.completion_rate_change ?? 0) >= 0 ? 'up' : 'down',
            trendValue: `${(m.completion_rate_change ?? 0) >= 0 ? '+' : ''}${m.completion_rate_change ?? 0}% improvement`,
        },
        {
            title: 'Revenue / Learner',
            value: formatCurrency(m.revenue_per_learner ?? 0),
            subtitle: `Avg order ${formatCurrency(m.average_order_value ?? 0)}`,
            icon: <AttachMoneyIcon sx={{ color: '#d97706', fontSize: 22 }} />,
            iconBg: '#fffbeb',
            trend: 'up',
            trendValue: `+${formatCurrency(m.revenue_per_learner_change ?? 0)}`,
        },
        {
            title: 'Repeat Orgs',
            value: `${m.repeat_organizations ?? 0}%`,
            subtitle: `${m.repeat_organizations_count ?? 0} of ${m.total_organizations ?? 0} organizations`,
            icon: <BusinessIcon sx={{ color: '#16a34a', fontSize: 22 }} />,
            iconBg: '#f0fdf4',
            trend: 'up',
            trendValue: `${m.repeat_organizations_count ?? 0} renewals`,
        },
        {
            title: 'Certificates',
            value: formatNumber(m.certificates_issued ?? 0),
            subtitle: `${m.certificate_download_rate ?? 0}% download rate`,
            icon: <SchoolIcon sx={{ color: '#d97706', fontSize: 22 }} />,
            iconBg: '#fffbeb',
            trend: 'up',
            trendValue: `+${m.certificates_this_week ?? 0} this week`,
        },
    ];

return (
    <Grid container spacing={2}>
        {cards.map((card, i) => (
            <Grid key={i} item xs={6} sm={6} md={4} lg={3} sx={{ display: 'flex' }}>
                <AnalyticsStatCard {...card} />
            </Grid>
        ))}
    </Grid>
);
}
