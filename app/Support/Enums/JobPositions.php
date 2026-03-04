<?php

namespace App\Support\Enums;

class JobPositions
{
    public static function get()
    {
        return [
            // ==========================
            // SOFTWARE & IT
            // ==========================
            'Software Engineer',
            'Backend Developer',
            'Frontend Developer',
            'Full Stack Developer',
            'Mobile App Developer (iOS/Android)',
            'Web Developer',
            'DevOps Engineer',
            'QA Engineer / Tester',
            'System Administrator',
            'Network Engineer',
            'Database Administrator',
            'Data Scientist',
            'Data Analyst',
            'UI/UX Designer',
            'Technical Support Specialist',
            'IT Project Manager',
            'Cybersecurity Analyst',

            // ==========================
            // BPO & VIRTUAL ASSISTANCE
            // ==========================
            'Customer Service Representative (CSR)',
            'Technical Support Representative (TSR)',
            'Virtual Assistant',
            'Data Entry Specialist',
            'Content Moderator',
            'Transcriptionist',
            'Lead Generation Specialist',

            // ==========================
            // CREATIVE & MARKETING
            // ==========================
            'Graphic Designer',
            'Video Editor',
            'Content Writer',
            'Social Media Manager',
            'Digital Marketing Specialist',
            'SEO Specialist',
            'Copywriter',

            // ==========================
            // GENERAL CORPORATE
            // ==========================
            'Administrative Assistant',
            'Human Resource Specialist',
            'Recruitment Officer',
            'Accountant',
            'Bookkeeper',
            'Sales Associate',
            'Marketing Officer',
            'Operations Manager',
            'Executive Assistant',

            // ==========================
            // ENTRY LEVEL
            // ==========================
            'Intern / OJT',
            'Trainee',
            'Junior Associate',
            'Freelancer',
        ];
    }
}
