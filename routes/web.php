<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\OtpController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\TransactionController;
use App\Models\Product;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//   return Inertia::render('Welcome', [
//     'canLogin' => Route::has('login'),
//     'canRegister' => Route::has('register'),
//     'laravelVersion' => Application::VERSION,
//     'phpVersion' => PHP_VERSION,
//   ]);
// });

Route::post('/otp', [OtpController::class, 'index'])
  ->withoutMiddleware([VerifyCsrfToken::class]);

Route::post('/app/carts/payment/notification', [CartController::class, 'notification'])
  ->withoutMiddleware([VerifyCsrfToken::class]);

Route::middleware('guest')->group(function () {
  Route::get('/otp/{uuid}', [OtpController::class, 'show']);
  Route::post('/otp/{uuid}/resend', [OtpController::class, 'resend']);
  Route::post('/otp/{uuid}', [OtpController::class, 'login']);
});

Route::middleware('auth')->group(function () {
  Route::get('/', fn() => redirect("/products/all"));
  Route::get('/products', fn() => redirect("/products/all"));

  Route::get('/u/{email}/p/{url}', [ProductController::class, 'show']);

  Route::get('/products/{category}', [MainController::class, 'productsOnCategory']);
  Route::delete('/products/{uuid}', [ProductController::class, 'destroy']);

  Route::post('/reviews', [ReviewController::class, 'store']);
  Route::get('/app/profile', [ProfileController::class, 'index']);

  Route::post('/profile/picture', [ProfileController::class, 'picture']);

  Route::get('/app', fn() => redirect("/app/library"));
  Route::get('/app/library', [MainController::class, 'library']);
  Route::get('/app/products', [MainController::class, 'products']);
  Route::get('/app/products/new', [MainController::class, 'productNew']);
  Route::get('/app/products/{uuid}/edit', [MainController::class, 'productEdit']);
  Route::get('/app/products/{uuid}/edit/content', [MainController::class, 'productEditContent']);
  Route::get('/app/transactions', [TransactionController::class, 'index']);
  Route::get('/app/sales', [SalesController::class, 'index']);

  Route::get('/app/carts', [CartController::class, 'index']);
  Route::post('/app/carts', [CartController::class, 'store']);
  Route::get('/app/carts/payment', [CartController::class, 'payment']);
  // Route::get('/app/carts/payment/finish', [CartController::class, 'finish']);

  Route::get('/app/library', [LibraryController::class, 'index']);
  Route::get('/app/library/{uuid}', [LibraryController::class, 'show']);
});

Route::middleware('auth')->group(function () {
  Route::prefix("api")->group(function () {
    Route::get('/products/{uuid}/covers', [FileController::class, 'covers']);
    Route::post('/products/{productUuid}/covers', [FileController::class, 'storeCover']);
    Route::delete('/products/{productUuid}/covers/{uuid}', [FileController::class, 'destroyCover']);

    Route::post('/products/{productUuid}/thumbnail', [FileController::class, 'storeThumbnail']);
    Route::delete('/products/{productUuid}/thumbnail', [FileController::class, 'destroyThumbnail']);

    Route::get('/products/{productUuid}/files/{uuid}', [FileController::class, 'getFile']);
    Route::post('/products/{productUuid}/files', [FileController::class, 'storeFile']);
    Route::delete('/products/{productUuid}/files/{uuid}', [FileController::class, 'destroyFile']);

    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{uuid}', [ProductController::class, 'update']);
    Route::post('/products/{uuid}/publish', [ProductController::class, 'publish']);
    Route::post('/products/{uuid}/unpublish', [ProductController::class, 'unpublish']);
  });
});


Route::get('/dashboard', function () {
  return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
