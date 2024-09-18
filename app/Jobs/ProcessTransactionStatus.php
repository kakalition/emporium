<?php

namespace App\Jobs;

use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;

class ProcessTransactionStatus implements ShouldQueue, ShouldBeUnique
{
  use Queueable;

  public function __construct() {}

  public function handle(): void
  {
    Transaction::where("status", "PENDING")
      ->where("expired_at", '<', Carbon::now())
      ->get()
      ->each(function ($val) {
        $val->status = "FAILED";
        $val->save();
      });
  }
}
