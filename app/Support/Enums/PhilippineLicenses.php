<?php

namespace App\Support\Enums;

class PhilippineLicenses
{
    public static function get()
    {
        return [
            // ==========================
            // GOVERNMENT / CIVIL SERVICE
            // ==========================
            'Civil Service Professional',
            'Civil Service Sub-Professional',
            'Napolcom Entrance (PNP)',
            'Penology Officer (BJMP)',
            'Fire Officer (BFP)',

            // ==========================
            // ENGINEERING & TECHNOLOGY
            // ==========================
            'Civil Engineer',
            'Professional Electronics Engineer (PECE)',
            'Electronics Engineer (ECE)',
            'Electronics Technician (ECT)',
            'Professional Electrical Engineer (PEE)',
            'Registered Electrical Engineer (REE)',
            'Registered Master Electrician (RME)',
            'Mechanical Engineer',
            'Geodetic Engineer',
            'Chemical Engineer',
            'Sanitary Engineer',
            'Master Plumber',

            // ==========================
            // HEALTH & MEDICAL
            // ==========================
            'Physician (Medical Doctor)',
            'Registered Nurse',
            'Medical Technologist',
            'Pharmacist',
            'Physical Therapist',
            'Occupational Therapist',
            'Radiologic Technologist',
            'Midwife',
            'Dentist',
            'Nutritionist-Dietitian',
            'Veterinarian',

            // ==========================
            // BUSINESS & EDUCATION
            // ==========================
            'Certified Public Accountant (CPA)',
            'Professional Teacher (LPT) - Elementary',
            'Professional Teacher (LPT) - Secondary',
            'Real Estate Broker',
            'Real Estate Appraiser',
            'Customs Broker',
            'Guidance Counselor',
            'Librarian',
            'Social Worker',

            // ==========================
            // ARCHITECTURE & DESIGN
            // ==========================
            'Architect',
            'Interior Designer',
            'Environmental Planner',
            'Landscape Architect',
        ];
    }
}
