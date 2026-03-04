import { memo } from 'react';
import CoursePageHeader from '@/Components/Mentor/Courses/CoursePageHeader';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';

const SyllabusPageHeader = memo(function SyllabusPageHeader({ mounted }) {
    return (
        <CoursePageHeader
            mounted={mounted}
            icon={ListAltOutlinedIcon}
            title="Syllabus"
            subtitle="Structure your course effectively with our modular roadmap."
        />
    );
});

export default SyllabusPageHeader;