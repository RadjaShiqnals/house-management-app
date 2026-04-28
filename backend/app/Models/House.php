<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class House extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nomor_rumah',
        'alamat',
        'status',
        'resident_id',
    ];

    public function activeResident()
    {
        return $this->belongsTo(Resident::class, 'resident_id');
    }

    public function histories()
    {
        return $this->hasMany(HouseResidentHistory::class);
    }
}
