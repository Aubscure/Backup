<?php

namespace App\Support\Enums;

class Platforms
{
    /**
     * Platforms supported by MUI Icons (@mui/icons-material)
     */
    public static function getList(): array
    {
        return [

            [
                'name'     => 'LinkedIn',
                'icon_key' => 'LinkedIn',
                'base_url' => 'https://www.linkedin.com/in/',
            ],

            [
                'name'     => 'GitHub',
                'icon_key' => 'GitHub',
                'base_url' => 'https://github.com/',
            ],

            [
                'name'     => 'Facebook',
                'icon_key' => 'Facebook',
                'base_url' => 'https://facebook.com/',
            ],

            [
                'name'     => 'Twitter',
                'icon_key' => 'Twitter',
                'base_url' => 'https://twitter.com/',
            ],

            [
                'name'     => 'Instagram',
                'icon_key' => 'Instagram',
                'base_url' => 'https://instagram.com/',
            ],

            [
                'name'     => 'YouTube',
                'icon_key' => 'YouTube',
                'base_url' => 'https://youtube.com/@',
            ],

            [
                'name'     => 'Reddit',
                'icon_key' => 'Reddit',
                'base_url' => 'https://reddit.com/user/',
            ],

            [
                'name'     => 'Pinterest',
                'icon_key' => 'Pinterest',
                'base_url' => 'https://pinterest.com/',
            ],

            [
                'name'     => 'WhatsApp',
                'icon_key' => 'WhatsApp',
                'base_url' => 'https://wa.me/',
            ],

            [
                'name'     => 'Telegram',
                'icon_key' => 'Telegram',
                'base_url' => 'https://t.me/',
            ],

            [
                'name'     => 'Discord',
                'icon_key' => 'Discord',
                'base_url' => 'https://discord.gg/',
            ],

            [
                'name'     => 'Google',
                'icon_key' => 'Google',
                'base_url' => 'https://profiles.google.com/',
            ],

            [
                'name'     => 'Apple',
                'icon_key' => 'Apple',
                'base_url' => '',
            ],

            [
                'name'     => 'Microsoft',
                'icon_key' => 'Microsoft',
                'base_url' => '',
            ],

            [
                'name'     => 'Portfolio / Website',
                'icon_key' => 'Language', // Globe icon in MUI
                'base_url' => '',
            ],
        ];
    }
}
