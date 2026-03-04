<?php

namespace App\Services;

use Vimeo\Vimeo;
use Exception;

class VimeoService
{
    protected Vimeo $client;

    public function __construct()
    {
        $this->client = new Vimeo(
            config('services.vimeo.client_id'),
            config('services.vimeo.client_secret'),
            config('services.vimeo.access_token')
        );
    }


    /**
     * Generate a direct upload ticket using the Tus approach.
     */
    public function createUploadTicket(int $fileSizeBytes, string $title = 'Lesson Video'): array
    {
        try {
            $response = $this->client->request('/me/videos', [
                'upload' => [
                    'approach' => 'tus',
                    'size' => $fileSizeBytes,
                ],
                'name' => $title,
                'privacy' => [
                    'view' => 'anybody',
                    'embed' => 'public'
                ]
            ], 'POST');

            if ($response['status'] !== 200) {
                throw new Exception('Failed to generate Vimeo upload ticket.');
            }

            return [
                'upload_link' => $response['body']['upload']['upload_link'],
                'vimeo_id' => str_replace('/videos/', '', $response['body']['uri']),
            ];
        } catch (Exception $e) {
            throw new Exception('Vimeo API Error: ' . $e->getMessage());
        }
    }

    public function getVideoThumbnail(string $vimeoId): ?string
    {
        try {
            $response = $this->client->request('/videos/' . $vimeoId, [], 'GET');

            if ($response['status'] === 200) {
                // Vimeo returns an array of pictures in different sizes.
                // Using end() grabs the last one, which is typically the highest resolution.
                $pictures = $response['body']['pictures']['sizes'] ?? [];
                $bestPicture = end($pictures);

                return $bestPicture['link'] ?? null;
            }

            return null;
        } catch (Exception $e) {
            // Fails gracefully if the video is still processing or missing
            return null;
        }
    }

    
}
