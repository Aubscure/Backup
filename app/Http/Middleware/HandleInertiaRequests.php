<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Http\Resources\AuthResource;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => fn () => ($user = $request->user())
                    ? (new AuthResource($user->fresh()))->resolve()
                    : null,
            ],
            'flash' => fn () => $request->session()->only(['success', 'info', 'error', 'warning']),
        ]);
}
}
