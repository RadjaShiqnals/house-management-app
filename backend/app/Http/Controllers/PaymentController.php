<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Services\PaymentService;

class PaymentController extends Controller
{
    public function store(StorePaymentRequest $request, PaymentService $service)
    {
        try {
            $payment = $service->processPayment($request->validated());
            return response()->json(['message' => 'Pembayaran berhasil dicatat', 'data' => $payment], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal memproses pembayaran', 'error' => $e->getMessage()], 500);
        }
    }
}
