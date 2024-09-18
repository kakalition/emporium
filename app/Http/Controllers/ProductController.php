<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCover;
use App\Models\ProductFile;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;

class ProductController extends Controller
{
  public function index() {}

  public function show(string $email, string $url)
  {
    $product = Product::select('products.*')
      ->where("url", $url)
      ->join('users', DB::raw('users.id::varchar'), '=', 'products.user_id')
      ->where('users.email', $email)
      ->first();

    $product->covers = ProductCover::where('product_id', $product->id)->orderBy("created_at")->get();
    $product->email = $product->user->email;
    $product->attributes = json_decode($product->attributes);
    $product->purchased = DB::table("products")
      ->join('transaction_details', 'transaction_details.product_id', '=', 'products.id')
      ->join('transactions', 'transaction_details.transaction_id', '=', 'transactions.id')
      ->where('products.id', $product->id)
      ->where('transactions.user_id', Auth::user()->id)
      ->where('transactions.status', "FINISHED")
      ->exists();

    $product->reviews = Review::where("product_id", $product->id)
      ->orderBy("updated_at")
      ->get()
      ->map(function ($e) {
        $e->user = $e->user;
        return $e;
      });

    // $stars = [
    //   'values' => [
    //     '1' => 0,
    //     '2' => 0,
    //     '3' => 0,
    //     '4' => 0,
    //     '5' => 0,
    //   ],
    //   'average' => 0,
    // ];

    // $starSum = 0;

    // foreach ($product->reviews as $review) {
    //   $starSum += $review->rating;

    //   $stars['values']["$review->rating"] += 1;
    // }

    // $stars['average'] = count($product->reviews) != 0
    //   ? $starSum / count($product->reviews)
    //   : 0;

    return Inertia::render("Product", [
      'product' => $product,
      // 'stars' => $stars,
    ]);
  }

  public function publish(string $uuid)
  {
    $product = Product::find($uuid);
    $product->status = "PUBLISHED";
    $product->save();

    return redirect()->back();
  }

  public function unpublish(string $uuid)
  {
    $product = Product::find($uuid);
    $product->status = "UNPUBLISHED";
    $product->save();

    return redirect()->back();
  }

  public function store(Request $request)
  {
    $data = $request->input();
    unset($data['phase']);

    $uuid = Uuid::uuid4();

    $data['id'] = $uuid;
    $data['user_id'] = Auth::user()->id;
    $data['status'] = "UNPUBLISHED";

    Product::create($data);

    return redirect("/app/products/$uuid/edit");
  }

  public function update(Request $request, string $uuid)
  {
    $data = $request->input();
    $data['user_id'] = Auth::user()->id;
    unset($data['phase']);

    Product::find($uuid)->update($data);

    return redirect("/app/products/$uuid/edit");
  }

  public function destroy(string $uuid)
  {
    $product = Product::find($uuid);

    if (File::exists(public_path('storage/' . $product->thumbnail_path))) {
      File::delete(public_path('storage/' . $product->thumbnail_path));
    }

    ProductFile::where('product_id', $uuid)->get()->each(function ($file) {
      if (File::exists(public_path('storage/' . $file->path))) {
        File::delete(public_path('storage/' . $file->path));
      }

      $file->delete();
    });

    ProductCover::where('product_id', $uuid)->get()->each(function ($file) {
      if (File::exists(public_path('storage/' . $file->path))) {
        File::delete(public_path('storage/' . $file->path));
      }

      $file->delete();
    });

    $product->delete();

    return redirect()->back();
  }
}
