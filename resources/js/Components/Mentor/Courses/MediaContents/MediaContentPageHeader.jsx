import { memo } from 'react';
import CoursePageHeader from '@/Components/Mentor/Courses/CoursePageHeader';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import MentorStorageUsage from '@/Components/Mentor/Courses/MediaContents/MentorStorageUsage';

const MediaContentPageHeader = memo(function MediaContentPageHeader({
    mounted,
    totalBytes,
    formatBytes,
}) {
    return (
        <CoursePageHeader
            mounted={mounted}
            icon={CloudUploadOutlinedIcon}
            title="Upload Media Content"
            subtitle="Add videos and files to your lessons."
            rightSlot={
                <MentorStorageUsage totalBytes={totalBytes} formatBytes={formatBytes} />
            }
        />
    );
});

export default MediaContentPageHeader;