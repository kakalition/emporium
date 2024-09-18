<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCover;
use App\Models\ProductFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Ramsey\Uuid\Uuid;
use Symfony\Component\VarDumper\Caster\RedisCaster;

class FileController extends Controller
{
  public function storeThumbnail(Request $request, string $productId)
  {
    $path = str_replace("public/", "", Storage::putFile("public/files", $request->file("file")));

    $product = Product::find($productId);
    $product->thumbnail_path = $path;
    $product->save();

    return $path;
  }

  public function destroyThumbnail(string $uuid)
  {
    $product = Product::find($uuid);

    if (File::exists(public_path('storage/' . $product->thumbnail_path))) {
      File::delete(public_path('storage/' . $product->thumbnail_path));
    }

    $product->thumbnail_path = null;
    $product->save();
  }

  public function covers($uuid)
  {
    $covers = ProductCover::where("product_id", $uuid)->get();

    return $covers;
  }

  public function storeCover(Request $request, string $productUuid)
  {
    $path = str_replace("public/", "", Storage::putFile("public/files", $request->file("file")));

    $uuid = Uuid::uuid4();

    ProductCover::create([
      'id' => $uuid,
      'product_id' => $productUuid,
      'path' => $path,
    ]);

    return ProductCover::where('product_id', $productUuid)->orderBy("created_at")->get();
  }

  public function destroyCover(string $productUuid, string $uuid)
  {
    $cover = ProductCover::find($uuid);

    if (File::exists(public_path('storage/' . $cover->path))) {
      File::delete(public_path('storage/' . $cover->path));
    }

    $cover->delete();

    return ProductCover::where('product_id', $productUuid)->orderBy("created_at")->get();
  }

  public function getFile(string $productUuid, string $uuid)
  {
    $file = ProductFile::find($uuid);

    return response()->download("storage/" . $file->path, $file->filename);
  }

  public function storeFile(Request $request, string $productUuid)
  {
    $path = str_replace("public/", "", Storage::putFile("public/files", $request->file("file")));
    $size = filesize("storage/" . $path);

    $uuid = Uuid::uuid4();

    ProductFile::create([
      'id' => $uuid,
      'product_id' => $productUuid,
      'filename' => $request->file("file")->getClientOriginalName(),
      'size' => $size,
      'path' => $path,
    ]);

    return ProductFile::where('product_id', $productUuid)->orderBy("created_at")->get();
  }

  public function destroyFile(string $productUuid, string $uuid)
  {
    $file = ProductFile::find($uuid);

    if (File::exists(public_path('storage/' . $file->path))) {
      File::delete(public_path('storage/' . $file->path));
    }

    $file->delete();

    return ProductFile::where('product_id', $productUuid)->orderBy("created_at")->get();
  }
}
