<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kategori' => 'required|in:perbaikan_jalan,perbaikan_selokan,gaji_satpam,token_listrik,lainnya',
            'judul' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:1',
            'tgl_pengeluaran' => 'required|date',
            'keterangan' => 'nullable|string',
        ];
    }
}
