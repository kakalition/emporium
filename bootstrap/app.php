<?php

use App\Jobs\ProcessTransactionStatus;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
  ->withRouting(
    web: __DIR__ . '/../routes/web.php',
    api: __DIR__ . '/../routes/api.php',
    commands: __DIR__ . '/../routes/console.php',
    health: '/up',
  )
  ->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
      \App\Http\Middleware\HandleInertiaRequests::class,
      \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
    ]);

    //
  })
  // ->withMiddleware(function (Middleware $middleware) {
  //   $middleware->validateCsrfTokens(except: [
  //     'app/carts/payment/notification',
  //   ]);
  // })
  ->withSchedule(function (Schedule $schedule) {
    $schedule->call(function () {
      Transaction::where("status", "PENDING")
        ->where("expired_at", '<', Carbon::now())
        ->get()
        ->each(function ($val) {
          $val->status = "FAILED";
          $val->save();
        });
    })->everyMinute();
  })
  ->withExceptions(function (Exceptions $exceptions) {
    //
  })->create();
