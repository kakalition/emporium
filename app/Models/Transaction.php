<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
  use HasFactory;

  public $incrementing = false;

  protected $fillable = [
    "id",
    "user_id",
    "order_id",
    "payment_url",
    "payment_result",
    "status",
    "expired_at",
  ];

  public function details(): HasMany
  {
    return $this->hasMany(TransactionDetail::class, 'transaction_id', 'id');
  }
}
