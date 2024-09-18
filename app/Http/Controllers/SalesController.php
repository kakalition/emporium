<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Carbon\Carbon;
use DateInterval;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SalesController extends Controller
{
  public function index()
  {
    $transactions = Transaction::join('transaction_details', 'transactions.id', '=', 'transaction_details.transaction_id')
      ->join('products', 'transaction_details.product_id', '=', 'products.id')
      ->where('transactions.status', 'FINISHED')
      ->where('products.user_id', Auth::user()->id)
      ->where('transactions.updated_at', '>=', Carbon::now()->subDays(28))
      ->select('transaction_details.*')
      ->get();

    $transactionsSum = Transaction::join('transaction_details', 'transactions.id', '=', 'transaction_details.transaction_id')
      ->join('products', 'transaction_details.product_id', '=', 'products.id')
      ->where('transactions.status', 'FINISHED')
      ->where('products.user_id', Auth::user()->id)
      ->where('transactions.updated_at', '>=', Carbon::now()->subDays(28))
      ->sum('transaction_details.price');

    return Inertia::render('Sales', [
      'transactions' => $transactions,
      'transactionsSum' => $transactionsSum,
    ]);
  }
}
