<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment_bill_id' => 'required|exists:payment_bills,id',
            'jumlah_bayar' => 'required|integer|min:1',
            'tgl_bayar' => 'required|date',
            'keterangan' => 'nullable|string',
        ];
    }
}
