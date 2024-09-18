<?php

use App\Jobs\ProcessTransactionStatus;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Foundation\Inspiring;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
  $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('processt', function () {
  (new ProcessTransactionStatus)->handle();
  $this->comment("OK");
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('send-mail', function () {
  Mail::raw('Your OTP code is: 12312', function (Message $message) {
    $message->from(env('MAIL_FROM_ADDRESS'))
      ->subject("Emporium - OTP")
      ->to('kharismasriwibowo@gmail.com');
  });
  $this->comment("OK");
})->purpose('Display an inspiring quote');
