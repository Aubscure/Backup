<?php

namespace App\Http\Controllers;

use App\Mail\OtpMail;
use App\Models\Otp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class OtpController extends Controller
{
    public function create()
    {
        if (!session('email')) {
            return to_route('register');
        }

        session()->reflash();

        return Inertia::render('Auth/Otp', [
            'email' => session('email'),
            'type' => session('type'),
        ]);
    }

    public function generate(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255',
            'type' => 'required|in:registration,login',
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return back()->withErrors([
                'email' => 'User not found',
            ]);
        }

        $otpCode = rand(100000, 999999);

        $otp = Otp::create([
            'user_id' => $user->id,
            'otp_code' => $otpCode,
            'type' => $request->type,
            'expired_at' => now()->addMinute(5),
            'is_used' => false
        ]);

        Mail::to($user->email)->send(new OtpMail(
            $user,
            $otp->otp_code,
        ));

        return back()->with('status', 'OTP sent successfully. Please check your email.');
    }

    public function verify(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255',
            'otp_code' => 'required|digits:6',
            'type' => 'required|in:registration,login',
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return back()->with('status', 'Please register your account first.');
        }

        $otp = Otp::where('user_id', $user->id)->where('otp_code', $request->otp_code)
            ->where('type', $request->type)
            ->where('is_used', false)
            ->where('expired_at', '>=', now())
            ->first();

        if (!$otp) {
            return back()->with('status', 'Invalid or Expired OTP');
        }

        $otp->is_used = true;
        $otp->save();

        if ($request->type === 'registration') {
            $user->email_verified_at = now();
            $user->save();
            return to_route('login');
        }

        if ($request->type === 'login') {
            Auth::login($user);
            $request->session()->regenerate();
            return to_route('dashboard');
        }

        return back()->with('status', 'Invalid OTP type');
    }
}
