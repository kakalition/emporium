<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('products', function (Blueprint $table) {
      $table->string("id")->primary();
      $table->string("user_id");
      $table->string("name")->nullable();
      $table->text("description")->nullable();
      $table->string("category")->nullable();
      $table->float("price")->nullable();
      $table->string("url")->nullable();
      $table->string("summary")->nullable();
      $table->json("attributes")->nullable();
      $table->string("thumbnail_path")->nullable();
      $table->string("status")->nullable();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('products');
  }
};
