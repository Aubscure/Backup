<?php

namespace App\Support\Enums;

class Professions
{
    public static function get(): array
    {
        return [

            'Information Technology' => [
                'Software Engineer',
                'Backend Developer',
                'Frontend Developer',
                'Full Stack Developer',
                'Mobile App Developer (iOS/Android)',
                'Web Developer',
                'DevOps Engineer',
                'Cloud Engineer',
                'Data Engineer',
                'Data Analyst',
                'Data Scientist',
                'AI / Machine Learning Engineer',
                'Cybersecurity Specialist',
                'QA Engineer',
                'System Administrator',
                'Network Engineer',
                'IT Support Specialist',
                'Database Administrator',
                'UI/UX Designer',
                'Game Developer',
                'Blockchain Developer',
            ],

            'Healthcare & Medical' => [
                'Doctor / Physician',
                'Surgeon',
                'Nurse',
                'Nursing Aide',
                'Midwife',
                'Medical Technologist',
                'Pharmacist',
                'Physical Therapist',
                'Radiologic Technologist',
                'Dentist',
                'Psychologist',
                'Psychiatrist',
                'Caregiver',
                'Occupational Therapist',
            ],

            'Engineering' => [
                'Civil Engineer',
                'Mechanical Engineer',
                'Electrical Engineer',
                'Electronics Engineer',
                'Chemical Engineer',
                'Industrial Engineer',
                'Geodetic Engineer',
                'Mining Engineer',
                'Sanitary Engineer',
                'Agricultural Engineer',
            ],

            'Education' => [
                'Teacher',
                'Professor',
                'Instructor',
                'Guidance Counselor',
                'School Administrator',
                'Special Education Teacher',
                'TESOL Teacher',
            ],

            'Business & Finance' => [
                'Accountant',
                'Certified Public Accountant (CPA)',
                'Auditor',
                'Financial Analyst',
                'Banker',
                'Investment Analyst',
                'Insurance Agent',
                'Entrepreneur',
                'Business Analyst',
                'Operations Manager',
                'Project Manager',
                'Human Resources Manager',
                'Recruiter',
            ],

            'Legal & Government' => [
                'Lawyer / Attorney',
                'Paralegal',
                'Judge',
                'Prosecutor',
                'Police Officer',
                'Soldier',
                'Firefighter',
                'Barangay Official',
                'Government Employee',
                'Customs Officer',
                'Immigration Officer',
            ],

            'Creative & Media' => [
                'Graphic Designer',
                'Multimedia Artist',
                'Video Editor',
                'Photographer',
                'Content Creator',
                'Social Media Manager',
                'Digital Marketer',
                'Copywriter',
                'Journalist',
                'Animator',
                'Film Director',
                'Musician',
                'Actor / Actress',
            ],

            'Hospitality & Tourism' => [
                'Hotel Manager',
                'Chef',
                'Cook',
                'Baker',
                'Barista',
                'Waiter / Waitress',
                'Bartender',
                'Tour Guide',
                'Travel Agent',
                'Flight Attendant',
                'Cruise Ship Worker',
            ],

            'Skilled Trades & Technical' => [
                'Electrician',
                'Plumber',
                'Carpenter',
                'Welder',
                'Automotive Mechanic',
                'Aircon Technician',
                'Construction Worker',
                'Heavy Equipment Operator',
                'Machinist',
                'Technician',
            ],

            'Agriculture & Fisheries' => [
                'Farmer',
                'Fisherman',
                'Farm Technician',
                'Livestock Farmer',
                'Agribusiness Owner',
            ],

            'Maritime' => [
                'Seafarer',
                'Ship Captain',
                'Marine Engineer',
                'Deck Officer',
                'Marine Technician',
            ],

            'BPO & Freelancing' => [
                'Call Center Agent',
                'Customer Service Representative',
                'Virtual Assistant',
                'Online English Teacher',
                'Freelance Writer',
                'Freelance Developer',
                'Remote Support Specialist',
                'Data Entry Specialist',
            ],

            'Transportation & Logistics' => [
                'Truck Driver',
                'Delivery Rider',
                'Taxi Driver',
                'Pilot',
                'Logistics Coordinator',
                'Warehouse Staff',
                'Supply Chain Manager',
            ],

            'Others' => [
                'Homemaker',
                'Student',
                'Retired',
                'Unemployed',
                'Self-Employed',
            ],

        ];
    }
}
