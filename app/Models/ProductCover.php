<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCover extends Model
{
  use HasFactory;

  public $incrementing = false;

  protected $fillable = [
    "id",
    "product_id",
    "path",
  ];
}
