<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LibraryController extends Controller
{
  public function index()
  {
    $purchased = DB::table('transactions')
      ->join('transaction_details', 'transactions.id', '=', 'transaction_details.transaction_id')
      ->join('products', 'transaction_details.product_id', '=', 'products.id')
      ->where('transactions.user_id', Auth::user()->id)
      ->where('transactions.status', "FINISHED")
      ->select('products.*')
      ->get()
      ->map(function ($e) {
        return new Product((array)$e);
      });

    return Inertia::render("Library", [
      'purchased' => $purchased
    ]);
  }

  public function show(string $uuid)
  {
    $product = Product::find($uuid);
    $product->files = $product->files;
    $product->review = Review::where('user_id', Auth::user()->id)
      ->where('product_id', $product->id)
      ->first();

    return Inertia::render("LibraryDetail", [
      'product' => $product,
    ]);
  }
}
