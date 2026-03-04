<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                          => $this->id,
            'firstname'                   => $this->firstname,
            'lastname'                    => $this->lastname,
            'email'                       => $this->email,
            'is_verified'                 => (bool) $this->is_verified,
            'profile_photo_url'           => $this->profile_photo_url ?? null,
            'verification_documents_count' => $this->verificationDocuments()->count(),
        ];
    }
}
