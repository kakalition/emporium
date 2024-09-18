<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessTransactionStatus;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{
  public function __construct()
  {
    (new ProcessTransactionStatus)->handle();
  }

  public function index()
  {
    $transactions = Transaction::where('user_id', Auth::user()->id)
      ->orderBy('updated_at', 'DESC')
      ->get()
      ->map(function ($e) {
        $e->details = $e->details;
        $e->details = $e->details->map(function ($e) {
          $e->product = $e->product;
          $e->product->user = $e->product->user;
          return $e;
        });

        $e->payment_result = $e->payment_result;

        return $e;
      });

    return Inertia::render('Transactions', [
      'transactions' => $transactions,
    ]);
  }
}
