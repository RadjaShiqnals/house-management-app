<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHouseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nomor_rumah' => [
                'sometimes',
                'required',
                'string',
                Rule::unique('houses')->ignore($this->route('house')),
            ],
            'alamat' => 'nullable|string',
            'status' => 'sometimes|required|in:dihuni,tidak_dihuni',
        ];
    }
}
