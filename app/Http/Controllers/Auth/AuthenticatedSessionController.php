<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Otp;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Ramsey\Uuid\Uuid;

class AuthenticatedSessionController extends Controller
{
  /**
   * Display the login view.
   */
  public function create(): Response
  {
    return Inertia::render('Login', [
      'canResetPassword' => Route::has('password.request'),
      'status' => session('status'),
    ]);
  }

  /**
   * Handle an incoming authentication request.
   */
  public function store(LoginRequest $request): RedirectResponse
  {
    $request->authenticate();

    $request->session()->regenerate();

    return redirect("/products/all");
  }

  public function storeViaOtp(LoginRequest $request): RedirectResponse
  {
    $id = Uuid::uuid4();
    $otpValue = rand(100000, 999999);

    Mail::raw("Your OTP code is: $otpValue", function (Message $message) use ($request) {
      $message->from(env('MAIL_FROM_ADDRESS'))
        ->subject("Emporium - OTP")
        ->to($request->input('email'));
    });

    Otp::create([
      'id' => $id,
      'otp' => $otpValue,
      'user' => json_encode($request->input()),
      'expired_at' => Carbon::now()->addMinutes(15),
    ]);

    return redirect("/otp/$id");
  }

  /**
   * Destroy an authenticated session.
   */
  public function destroy(Request $request): RedirectResponse
  {
    Auth::guard('web')->logout();

    $request->session()->invalidate();

    $request->session()->regenerateToken();

    return redirect('/');
  }
}
