<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnforceVerificationStepProgress
{
    /**
     * Maps route name segments to their step numbers.
     * Add new steps here without touching handle().
     */
    private const STEP_ROUTE_MAP = [
        'step1' => 1,
        'step2' => 2,
        'step3' => 3,
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->is_verified) {
            return $next($request);
        }

        $requestedStep = $this->resolveStepFromRoute($request->route()->getName());

        if ($requestedStep === null) {
            return $next($request);
        }

        $userStep = $user->getCurrentVerificationStep();

        if ($userStep && $userStep !== $requestedStep) {
            return redirect()
                ->route("verification.step{$userStep}")
                ->with('warning', 'Please complete the current step before proceeding.');
        }

        return $next($request);
    }

    private function resolveStepFromRoute(string $routeName): ?int
    {
        foreach (self::STEP_ROUTE_MAP as $segment => $step) {
            if (str_contains($routeName, $segment)) {
                return $step;
            }
        }

        return null;
    }
}
