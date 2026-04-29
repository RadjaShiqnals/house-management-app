<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\PaymentBill;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    public function processPayment(array $data)
    {
        try {
            DB::beginTransaction();

            $bill = PaymentBill::lockForUpdate()->findOrFail($data['payment_bill_id']);
            
            $payment = Payment::create([
                'payment_bill_id' => $bill->id,
                'jumlah_bayar' => $data['jumlah_bayar'],
                'tgl_bayar' => $data['tgl_bayar'],
                'keterangan' => $data['keterangan'] ?? null,
            ]);

            $totalPaid = $bill->payments()->sum('jumlah_bayar');

            if ($totalPaid >= $bill->total_tagihan) {
                $bill->update(['status' => 'lunas']);
            }

            DB::commit();
            return $payment;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment processing failed: ' . $e->getMessage());
            throw $e;
        }
    }
}
