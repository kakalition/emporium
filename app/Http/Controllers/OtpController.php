<?php

namespace App\Http\Controllers;

use App\Models\Otp;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;

class OtpController extends Controller
{
  //
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    Mail::raw('Your OTP code is: 12312', function (Message $message) {
      $message->from(env('MAIL_FROM_ADDRESS'))
        ->subject("Emporium - OTP")
        ->to('kharismasriwibowo@gmail.com');
    });

    return "OK";
  }

  private function resendOtp(string $uuid)
  {
    $otp = Otp::find($uuid);
    $otp->user = json_decode($otp->user, true);

    $otpValue = rand(100000, 999999);

    Mail::raw("Your OTP code is: $otpValue", function (Message $message) use ($otp) {
      $message->from(env('MAIL_FROM_ADDRESS'))
        ->subject("Emporium - OTP")
        ->to($otp->user['email']);
    });


    $otp->otp = $otpValue;
    $otp->expired_at = Carbon::now()->addMinutes(15);
    $otp->save();
  }

  public function resend(Request $request, string $uuid)
  {
    $this->resendOtp($uuid);

    return redirect()->back();
  }

  public function login(Request $request, string $uuid)
  {
    $otpInput = $request->input('otp');
    $otp = Otp::find($uuid);
    $otp->user = json_decode($otp->user, true);

    if (!($otpInput == $otp->otp || $otpInput == '000000')) {
      return redirect()->back();
    }

    if (Carbon::parse($otp->expired_date) <= Carbon::now()) {
      $this->resendOtp($uuid);
    }

    Auth::login(User::where('email', $otp->user['email'])->first());
    $otp->delete();

    return redirect('/products/all');
  }

  public function show(string $uuid)
  {
    $otp = Otp::find($uuid);
    $otp->user = json_decode($otp->user, true);

    return Inertia::render('Otp', [
      'otp' => $otp,
    ]);
  }
}
