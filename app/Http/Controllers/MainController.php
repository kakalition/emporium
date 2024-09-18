<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCover;
use App\Models\ProductFile;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MainController extends Controller
{
  public function index()
  {
    return Inertia::render("Main");
  }

  public function productsOnCategory(Request $request, string $category)
  {
    $query = $request->input("query") ?? "";
    $category = str_replace("-", " ", $category);

    // $product->reviews = Review::where("product_id", $product->id)
    //   ->orderBy("updated_at")
    //   ->get()
    //   ->map(function ($e) {
    //     $e->user = $e->user;
    //     return $e;
    //   });

    $products = Product::where("name", "ILIKE", "%$query%")
      ->where("status", "PUBLISHED")
      ->where("category", "ILIKE", $category == "all" ? "%%" : $category)
      ->orderBy("name")
      ->get()
      ->map(function ($e) {
        $e->email = $e->user->email;

        $reviews = Review::where("product_id", $e->id)
          ->orderBy("updated_at")
          ->select('rating')
          ->get()
          ->map(function ($e) {
            return $e->rating;
          });

        $e->total_review = count($reviews);
        $e->sum_review = $reviews->sum();
        $e->rating_value = $e->sum_review / ($e->total_review != 0 ? $e->total_review : 1);

        return $e;
      });

    return Inertia::render("Main", [
      'products' => $products,
    ]);
  }

  public function library()
  {
    return Inertia::render("App/Products");
  }

  public function products()
  {
    $products = Product::where("user_id", Auth::user()->id)
      ->orderBy("name")
      ->get();

    return Inertia::render("App/Products", [
      'products' => $products,
    ]);
  }


  public function productNew()
  {
    return Inertia::render("App/NewProduct");
  }

  public function productEdit($uuid)
  {
    $product = Product::find($uuid);
    $product->attributes = json_decode($product->attributes);
    $covers = ProductCover::where('product_id', $uuid)->orderBy("created_at")->get();

    return Inertia::render("App/EditProduct", [
      'product' => $product,
      'covers' => $covers,
    ]);
  }

  public function productEditContent($uuid)
  {
    $product = Product::find($uuid);
    $product->attributes = json_decode($product->attributes);
    $files = ProductFile::where('product_id', $uuid)->orderBy("created_at")->get();

    return Inertia::render("App/EditProductContent", [
      'product' => $product,
      'files' => $files,
    ]);
  }
}
