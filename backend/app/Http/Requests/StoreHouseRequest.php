<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHouseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nomor_rumah' => 'required|string|unique:houses,nomor_rumah',
            'alamat' => 'nullable|string',
            'status' => 'required|in:dihuni,tidak_dihuni',
        ];
    }
}
