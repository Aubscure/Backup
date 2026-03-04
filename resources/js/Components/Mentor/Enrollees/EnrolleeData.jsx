// ─── Static / seed data ─────────────────────────────────────────────────────
// Shape mirrors what the backend will return once the DB is wired.
// To connect real data: replace STATIC_ENROLLEES with Inertia props from the controller.
// Child components consume `enrollee.certificates`, `enrollee.top_courses`, and
// `enrollee.course_performance` — no component changes needed when going live.

export const STATIC_ENROLLEES = [
    {
        id: 1,
        firstname: 'Alex',
        lastname: 'Rivera',
        email: 'alex.rivera@example.com',
        avatar_initials: 'AR',
        avatar_color: '#1a7309',
        enrolled_course: 'Computer Science III',
        course_plan: 'Individual',
        enrollment_status: 'pending',
        learning_progress: 88,
        avg_course_score: 91,
        source: 'manpro',
        organization_name: null,
        enrolled_at: '2024-11-03',
        // ── Profile panel data ───────────────────────────────────────────────
        certificates: [
            { id: 1, title: 'Effective Team Communication', issued_at: 'March 18, 2024' },
            { id: 2, title: 'Advanced Marketing Strategy',  issued_at: 'March 10, 2021' },
            { id: 3, title: 'The Art of Public Speaking',   issued_at: 'June 21, 2020'  },
        ],
        top_courses: [
            { id: 1, title: 'Team Communication',              progress: 20 },
            { id: 2, title: 'Fundamentals of Public Speaking', progress: 75 },
        ],
        course_performance: [
            {
                id: 1,
                title: 'Introduction to Data Science',
                assessment_score: '6/10',
                score: 85,
                progress: 62,
                status: 'ONGOING',
                syllabus: [
                    { id: 1, name: 'Python Basics', progress: 88 },
                    { id: 2, name: 'SQL Basics',    progress: 79 },
                ],
            },
            {
                id: 2,
                title: 'Effective Team Communication',
                assessment_score: '9/10',
                score: 92,
                progress: 0,
                status: 'ONGOING',
                syllabus: [],
            },
            {
                id: 3,
                title: 'Advanced Marketing Strategy',
                assessment_score: '0/10',
                score: 0,
                progress: 0,
                status: 'CANCELLED',
                syllabus: [],
            },
        ],
    },
    {
        id: 2,
        firstname: 'Jordan',
        lastname: 'Smith',
        email: 'jordan.smith@example.com',
        avatar_initials: 'JS',
        avatar_color: '#2563eb',
        enrolled_course: 'Web Development 101',
        course_plan: 'Individual',
        enrollment_status: 'graduate',
        learning_progress: 100,
        avg_course_score: 97,
        source: 'manpro',
        organization_name: null,
        enrolled_at: '2024-09-15',
        certificates: [
            { id: 4, title: 'Web Development 101',   issued_at: 'January 5, 2025'   },
            { id: 5, title: 'JavaScript Essentials', issued_at: 'November 20, 2024' },
        ],
        top_courses: [
            { id: 3, title: 'Web Development 101',    progress: 100 },
            { id: 4, title: 'JavaScript Essentials',  progress: 95  },
        ],
        course_performance: [
            {
                id: 4,
                title: 'Web Development 101',
                assessment_score: '10/10',
                score: 97,
                progress: 100,
                status: 'COMPLETED',
                syllabus: [
                    { id: 3, name: 'HTML & CSS',   progress: 100 },
                    { id: 4, name: 'JavaScript',   progress: 100 },
                    { id: 5, name: 'React Basics', progress: 94  },
                ],
            },
        ],
    },
    {
        id: 3,
        firstname: 'Casey',
        lastname: 'Chen',
        email: 'casey.chen@example.com',
        avatar_initials: 'CC',
        avatar_color: '#d97706',
        enrolled_course: 'Data Structures & Algos',
        course_plan: 'Organization',
        enrollment_status: 'ongoing',
        learning_progress: 65,
        avg_course_score: 78,
        source: 'organization',
        organization_name: 'TechCorp Inc.',
        enrolled_at: '2024-12-01',
        certificates: [
            { id: 6, title: 'Python Fundamentals', issued_at: 'October 12, 2024' },
        ],
        top_courses: [
            { id: 5, title: 'Data Structures & Algos', progress: 65 },
            { id: 6, title: 'Python Fundamentals',     progress: 100 },
        ],
        course_performance: [
            {
                id: 5,
                title: 'Data Structures & Algos',
                assessment_score: '7/10',
                score: 78,
                progress: 65,
                status: 'ONGOING',
                syllabus: [
                    { id: 6, name: 'Arrays & Linked Lists', progress: 90 },
                    { id: 7, name: 'Trees & Graphs',        progress: 60 },
                    { id: 8, name: 'Dynamic Programming',   progress: 30 },
                ],
            },
        ],
    },
    {
        id: 4,
        firstname: 'Riley',
        lastname: 'Taylor',
        email: 'riley.t@example.com',
        avatar_initials: 'RT',
        avatar_color: '#6b7280',
        enrolled_course: 'UI/UX Design Masterclass',
        course_plan: 'Individual',
        enrollment_status: 'pending',
        learning_progress: 0,
        avg_course_score: null,
        source: 'manpro',
        organization_name: null,
        enrolled_at: '2025-01-10',
        certificates: [],
        top_courses: [
            { id: 7, title: 'UI/UX Design Masterclass', progress: 0 },
        ],
        course_performance: [
            {
                id: 6,
                title: 'UI/UX Design Masterclass',
                assessment_score: '0/10',
                score: 0,
                progress: 0,
                status: 'PENDING',
                syllabus: [],
            },
        ],
    },
    {
        id: 5,
        firstname: 'Morgan',
        lastname: 'Lee',
        email: 'morgan.lee@globalcorp.com',
        avatar_initials: 'ML',
        avatar_color: '#7c3aed',
        enrolled_course: 'Computer Science III',
        course_plan: 'Organization',
        enrollment_status: 'ongoing',
        learning_progress: 42,
        avg_course_score: 74,
        source: 'organization',
        organization_name: 'GlobalCorp Ltd.',
        enrolled_at: '2025-01-18',
        certificates: [
            { id: 7, title: 'CS Fundamentals', issued_at: 'September 3, 2024' },
        ],
        top_courses: [
            { id: 8, title: 'Computer Science III', progress: 42 },
            { id: 9, title: 'CS Fundamentals',      progress: 100 },
        ],
        course_performance: [
            {
                id: 7,
                title: 'Computer Science III',
                assessment_score: '5/10',
                score: 74,
                progress: 42,
                status: 'ONGOING',
                syllabus: [
                    { id: 9,  name: 'Operating Systems', progress: 70 },
                    { id: 10, name: 'Networking',        progress: 45 },
                    { id: 11, name: 'Compilers',         progress: 15 },
                ],
            },
        ],
    },
    {
        id: 6,
        firstname: 'Sam',
        lastname: 'Nguyen',
        email: 'sam.nguyen@example.com',
        avatar_initials: 'SN',
        avatar_color: '#db2777',
        enrolled_course: 'Web Development 101',
        course_plan: 'Individual',
        enrollment_status: 'graduate',
        learning_progress: 100,
        avg_course_score: 85,
        source: 'manpro',
        organization_name: null,
        enrolled_at: '2024-08-22',
        certificates: [
            { id: 8, title: 'Web Development 101',  issued_at: 'December 15, 2024' },
            { id: 9, title: 'Responsive Design',    issued_at: 'November 1, 2024'  },
        ],
        top_courses: [
            { id: 10, title: 'Web Development 101', progress: 100 },
            { id: 11, title: 'Responsive Design',   progress: 100 },
        ],
        course_performance: [
            {
                id: 8,
                title: 'Web Development 101',
                assessment_score: '9/10',
                score: 85,
                progress: 100,
                status: 'COMPLETED',
                syllabus: [
                    { id: 12, name: 'HTML & CSS',   progress: 100 },
                    { id: 13, name: 'JavaScript',   progress: 100 },
                ],
            },
        ],
    },
];

export const STATIC_STATS = {
    total_enrollees: 1248,
    active_enrollments: 856,
    completion_rate: 92,
    issued_certificates: 1148,
};

export const STATUS_META = {
    pending:   { label: 'Pending',   color: '#3b82f6', bg: '#eff6ff' },
    ongoing:   { label: 'Ongoing',   color: '#d97706', bg: '#fffbeb' },
    graduate:  { label: 'Graduate',  color: '#16a34a', bg: '#f0fdf4' },
    completed: { label: 'Completed', color: '#16a34a', bg: '#f0fdf4' },
    cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2' },
};

export const SOURCE_META = {
    manpro:       { label: 'ManPro',       color: '#1a7309', bg: '#f0fdf4' },
    organization: { label: 'Organization', color: '#7c3aed', bg: '#f5f3ff' },
};