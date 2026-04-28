<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_bill_id',
        'jumlah_bayar',
        'tgl_bayar',
        'keterangan',
    ];

    public function paymentBill()
    {
        return $this->belongsTo(PaymentBill::class);
    }
}
