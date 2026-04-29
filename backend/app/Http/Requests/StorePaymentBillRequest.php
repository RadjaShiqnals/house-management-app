<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentBillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'house_id' => 'required|exists:houses,id',
            'fee_type_id' => 'required|exists:fee_types,id',
            'bulan' => 'required|date_format:Y-m-d',
            'jumlah_bulan' => 'required|integer|min:1',
        ];
    }
}
