<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Ramsey\Uuid\Uuid;

class ReviewController extends Controller
{
  public function store(Request $request)
  {
    $payload = $request->input();

    $existing = Review::where('product_id', $payload['productId'])
      ->where('user_id', Auth::user()->id)
      ->first();

    if ($existing) {
      $existing->update($payload);
    } else {
      Review::create([
        'id' => Uuid::uuid4(),
        'product_id' => $payload['productId'],
        'user_id' => Auth::user()->id,
        'comment' => $payload['comment'],
        'rating' => $payload['rating'],
      ]);
    }

    return redirect()->back();
  }

  public function update(Request $request, string $id)
  {
    //
  }

  public function destroy(string $id)
  {
    //
  }
}
