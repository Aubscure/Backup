<?php

namespace App\Support\Enums;

class Categories
{
    public static function all(): array
    {
        return [
            'project_management'     => 'Project Management',
            'human_resources'        => 'Human Resources',
            'leadership_management'  => 'Leadership & Management',
            'communication_skills'   => 'Communication Skills',
            'technical_skills'       => 'Technical Skills',
            'compliance_safety'      => 'Compliance & Safety',
            'sales_marketing'        => 'Sales & Marketing',
            'finance_accounting'     => 'Finance & Accounting',
            'it_software'            => 'IT & Software',
            'personal_development'   => 'Personal Development',
        ];
    }

    public static function values(): array
    {
        return array_values(self::all());
    }
}
