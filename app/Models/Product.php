<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
  use HasFactory;

  public $incrementing = false;

  protected $fillable = [
    "id",
    "user_id",
    "name",
    "description",
    "category",
    "price",
    "url",
    "summary",
    "attributes",
    "thumbnail_path",
    "status",
  ];

  protected $appends = ['stars'];

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class, 'user_id', 'id');
  }

  public function files(): HasMany
  {
    return $this->hasMany(ProductFile::class, 'product_id', 'id');
  }

  public function getStarsAttribute()
  {
    $reviews = Review::where("product_id", $this->id)
      ->orderBy("updated_at")
      ->get()
      ->map(function ($e) {
        $e->user = $e->user;
        return $e;
      });

    $stars = [
      'total' => 0,
      'values' => [
        '1' => 0,
        '2' => 0,
        '3' => 0,
        '4' => 0,
        '5' => 0,
      ],
      'average' => 0,
    ];

    $starSum = 0;

    foreach ($reviews as $review) {
      $starSum += $review->rating;

      $stars['values']["$review->rating"] += 1;
    }

    $stars['total'] = count($reviews);
    $stars['average'] = count($reviews) != 0
      ? $starSum / count($reviews)
      : 0;

    return $stars;
  }
}
