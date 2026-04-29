<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateResidentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_lengkap' => 'sometimes|required|string|max:255',
            'foto_ktp' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status_penghuni' => 'sometimes|required|in:tetap,kontrak',
            'nomor_telepon' => 'sometimes|required|string|max:20',
            'status_nikah' => 'sometimes|required|in:menikah,belum',
        ];
    }
}
