import { memo } from 'react';
import CoursePageHeader from '@/Components/Mentor/Courses/CoursePageHeader';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

const CreatePageHeader = memo(function CreatePageHeader({ mounted }) {
    return (
        <CoursePageHeader
            mounted={mounted}
            icon={AutoAwesomeOutlinedIcon}
            title="Course Details"
            subtitle="Set up the foundation of your course — title, category, and thumbnail."
        />
    );
});

export default CreatePageHeader;