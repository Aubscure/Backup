<?php

namespace App\Support\Enums;

class EducationFields
{
    // A simplified list based on CIP/ISCED for your dropdown
    public static function getFields()
    {
        return [

            // ========================
            // COMPUTER & TECHNOLOGY
            // ========================
            'Computer Science',
            'Information Technology',
            'Software Engineering',
            'Data Science',
            'Cybersecurity',
            'Artificial Intelligence',
            'Machine Learning',
            'Information Systems',
            'Cloud Computing',
            'Computer Engineering',
            'Game Development',
            'Web Development',
            'Mobile Application Development',
            'Blockchain Technology',
            'Robotics',
            'Human-Computer Interaction',
            'Network Engineering',
            'Systems Engineering',
            'Bioinformatics',

            // ========================
            // ENGINEERING
            // ========================
            'Civil Engineering',
            'Mechanical Engineering',
            'Electrical Engineering',
            'Electronics Engineering',
            'Chemical Engineering',
            'Industrial Engineering',
            'Petroleum Engineering',
            'Aerospace Engineering',
            'Automotive Engineering',
            'Biomedical Engineering',
            'Environmental Engineering',
            'Structural Engineering',
            'Mechatronics Engineering',
            'Mining Engineering',
            'Marine Engineering',
            'Agricultural Engineering',
            'Materials Engineering',
            'Geotechnical Engineering',

            // ========================
            // BUSINESS & MANAGEMENT
            // ========================
            'Business Administration',
            'Business Management',
            'Entrepreneurship',
            'Marketing',
            'Digital Marketing',
            'Finance',
            'Accounting',
            'Banking and Finance',
            'Human Resource Management',
            'International Business',
            'Project Management',
            'Supply Chain Management',
            'Operations Management',
            'E-commerce',
            'Economics',
            'Investment Management',
            'Risk Management',

            // ========================
            // HEALTH & MEDICAL
            // ========================
            'Medicine',
            'Nursing',
            'Pharmacy',
            'Public Health',
            'Dentistry',
            'Veterinary Medicine',
            'Physiotherapy',
            'Radiology',
            'Medical Laboratory Science',
            'Nutrition and Dietetics',
            'Psychiatry',
            'Clinical Psychology',
            'Occupational Therapy',
            'Epidemiology',
            'Health Administration',

            // ========================
            // SCIENCES
            // ========================
            'Mathematics',
            'Statistics',
            'Physics',
            'Chemistry',
            'Biology',
            'Microbiology',
            'Biotechnology',
            'Environmental Science',
            'Geology',
            'Astronomy',
            'Marine Biology',
            'Genetics',
            'Applied Mathematics',
            'Actuarial Science',

            // ========================
            // SOCIAL SCIENCES
            // ========================
            'Psychology',
            'Sociology',
            'Political Science',
            'International Relations',
            'Anthropology',
            'Criminology',
            'Geography',
            'Urban Planning',
            'Public Administration',
            'Social Work',
            'Development Studies',
            'Gender Studies',

            // ========================
            // LAW
            // ========================
            'Law',
            'International Law',
            'Corporate Law',
            'Criminal Law',
            'Human Rights Law',
            'Environmental Law',

            // ========================
            // EDUCATION
            // ========================
            'Education',
            'Early Childhood Education',
            'Primary Education',
            'Secondary Education',
            'Special Education',
            'Educational Leadership',
            'Curriculum and Instruction',
            'Educational Technology',

            // ========================
            // ARTS & HUMANITIES
            // ========================
            'English',
            'Literature',
            'History',
            'Philosophy',
            'Linguistics',
            'Religious Studies',
            'Creative Writing',
            'Fine Arts',
            'Visual Arts',
            'Performing Arts',
            'Music',
            'Theatre Arts',
            'Film and Media Studies',
            'Graphic Design',
            'Animation',
            'Interior Design',
            'Fashion Design',

            // ========================
            // AGRICULTURE & ENVIRONMENT
            // ========================
            'Agriculture',
            'Agronomy',
            'Horticulture',
            'Forestry',
            'Fisheries',
            'Animal Science',
            'Food Science',
            'Environmental Management',

            // ========================
            // COMMUNICATION & MEDIA
            // ========================
            'Mass Communication',
            'Journalism',
            'Public Relations',
            'Advertising',
            'Media Studies',
            'Communication Studies',

            // ========================
            // HOSPITALITY & SERVICE
            // ========================
            'Hospitality Management',
            'Tourism Management',
            'Culinary Arts',
            'Event Management',

            // ========================
            // TRANSPORT & AVIATION
            // ========================
            'Aviation Management',
            'Air Traffic Control',
            'Logistics',
            'Maritime Studies',

            // ========================
            // INTERDISCIPLINARY
            // ========================
            'Data Analytics',
            'Sustainability Studies',
            'Innovation Management',
            'Technology Management',
            'Artificial Intelligence and Robotics',
            'Digital Transformation',
        ];
    }


    public static function getLevels()
    {
        return [

            // ========================
            // BASIC EDUCATION (DepEd - Philippines)
            // ========================
            'Elementary Level',
            'Elementary Graduate',
            'Junior High School Level',
            'Junior High School Graduate',
            'Senior High School Level',
            'Senior High School Graduate',
            'High School Diploma (Pre-K12)',

            // ========================
            // TECHNICAL / VOCATIONAL (TESDA)
            // ========================
            'TESDA NC I',
            'TESDA NC II',
            'TESDA NC III',
            'TESDA NC IV',
            'Technical-Vocational Certificate',
            'Diploma (Technical/Vocational)',

            // ========================
            // UNDERGRADUATE (CHED)
            // ========================
            'Associate Degree',
            'Bachelor\'s Degree',
            'Bachelor\'s Degree with Honors',

            // ========================
            // POSTGRADUATE
            // ========================
            'Postgraduate Diploma',
            'Master\'s Degree',
            'Master\'s Degree with Thesis',
            'Doctorate (PhD)',
            'Doctor of Education (EdD)',
            'Doctor of Business Administration (DBA)',
            'Doctor of Medicine (MD)',
            'Juris Doctor (JD)',

            // ========================
            // PROFESSIONAL & LICENSURE
            // ========================
            'Professional License (PRC)',
            'Board Passer',
            'Civil Service Eligibility',
            'Bar Passer',

            // ========================
            // ACADEMIC & SPECIAL
            // ========================
            'Postdoctoral',
            'Certificate Course',
            'Short Course Certificate',
            'Continuing Professional Development (CPD)',
            'Undergraduate Level (No Degree)',
            'Graduate Level (No Degree)',
        ];
    }

}
