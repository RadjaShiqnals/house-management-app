<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentBill extends Model
{
    use HasFactory;

    protected $fillable = [
        'house_id',
        'resident_id',
        'fee_type_id',
        'bulan',
        'jumlah_bulan',
        'total_tagihan',
        'status',
    ];

    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    public function feeType()
    {
        return $this->belongsTo(FeeType::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
