<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Carbon\Carbon;
use GuzzleHttp\Exception\BadResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;
use stdClass;

class CartController extends Controller
{
  public function index()
  {
    $carts = Cart::select('carts.*')
      ->join('users', DB::raw("users.id::varchar"), '=', 'carts.user_id')
      ->where('user_id', Auth::user()->id)
      ->orderBy("name")
      ->get()
      ->map(function ($e) {
        $e->product = $e->product;
        return $e;
      });

    return Inertia::render("Carts", [
      'carts' => $carts,
    ]);
  }

  public function payment()
  {
    $carts = Cart::select('carts.*')
      ->join('users', DB::raw("users.id::varchar"), '=', 'carts.user_id')
      ->where('user_id', Auth::user()->id)
      ->orderBy("name")
      ->get()
      ->map(function ($e) {
        $e->product = $e->product;

        return $e;
      });

    $orderId = Uuid::uuid4();
    $paymentData = $this->getPaymentData($orderId, $carts);

    if ($paymentData == null) {
      return redirect()->back();
    }

    $transaction = Transaction::create([
      'id' => Uuid::uuid4(),
      'user_id' => Auth::user()->id,
      'order_id' => $orderId,
      'payment_url' => $paymentData['redirect_url'],
      'status' => 'PENDING',
      'expired_at' => Carbon::now()->addMinutes(30),
    ]);

    $carts->each(function ($val) use ($transaction) {
      TransactionDetail::create([
        'id' => Uuid::uuid4(),
        'transaction_id' => $transaction->id,
        'product_id' => $val->product_id,
        'price' => $val->product->price * 1.11,
      ]);

      $val->delete();
    });

    return response('', 409)
      ->header('X-Inertia-Location', $paymentData['redirect_url']);
  }

  private function getPaymentData($orderId, $carts)
  {
    $modifiedCarts = (clone $carts)
      ->map(function ($e) {
        $product = $e->product;

        $temp = new stdClass();
        $temp->id = $product->id;
        $temp->price = intval($product->price * 1.11);
        $temp->quantity = 1;
        $temp->name = $product->name;
        $temp->brand = "-";
        $temp->category = $product->category;
        $temp->merchant_name = "Emporium";

        return $temp;
      });

    $grossAmounts = intval((clone $modifiedCarts)
      ->map(function ($e) {
        return $e->price;
      })->sum());

    $client = new \GuzzleHttp\Client();

    $authToken = base64_encode(env("MIDTRANS_SERVER_KEY") . ":");
    $requestParams = [
      'body' => json_encode([
        'transaction_details' => [
          'order_id' => $orderId,
          'gross_amount' => $grossAmounts,
        ],
        'credit_card' => [
          'secure' => true,
        ],
        "item_details" => $modifiedCarts->toArray(),
      ]),
      'headers' => [
        'accept' => 'application/json',
        'authorization' => "Basic $authToken",
        'content-type' => 'application/json',
      ],
    ];

    $response = null;
    try {
      $response = $client->request('POST', 'https://app.sandbox.midtrans.com/snap/v1/transactions', $requestParams);
    } catch (BadResponseException $ex) {
      $response = $ex->getResponse();
    }

    if ($response->getStatusCode() != 201) {
      return null;
    }

    return json_decode($response->getBody(), true);
  }

  public function notification(Request $request)
  {
    $data = $request->input();

    $transaction = Transaction::where('order_id', $data['order_id'])->first();
    $transaction->update(['payment_result' => json_encode($data)]);
    if (in_array($data['transaction_status'], ["capture", "settlement"])) {
      $transaction->status = "FINISHED";
    }

    $transaction->save();
  }

  public function store(Request $request)
  {
    $payload = $request->input();
    $userId = Auth::user()->id;

    $isNotExists = !Cart::where("user_id", $userId)
      ->where('product_id', $payload['productId'])
      ->exists();

    if ($isNotExists) {
      Cart::create([
        'id' => Uuid::uuid4(),
        'user_id' => $userId,
        'product_id' => $payload['productId']
      ]);
    }

    return redirect("/app/carts");
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
