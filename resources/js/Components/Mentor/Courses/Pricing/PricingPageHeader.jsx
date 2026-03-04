import { memo } from 'react';
import CoursePageHeader from '@/Components/Mentor/Courses/CoursePageHeader';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const PricingPageHeader = memo(function PricingPageHeader({ mounted }) {
    return (
        <CoursePageHeader
            mounted={mounted}
            icon={AttachMoneyIcon}
            title="Pricing & Monetization"
            subtitle="Configure how individuals and organizations purchase access to your course."
        />
    );
});

export default PricingPageHeader;
