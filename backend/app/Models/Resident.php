<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resident extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nama_lengkap',
        'foto_ktp',
        'status_penghuni',
        'nomor_telepon',
        'status_nikah',
    ];

    public function house()
    {
        return $this->hasOne(House::class, 'resident_id');
    }

    public function houseResidentHistories()
    {
        return $this->hasMany(HouseResidentHistory::class);
    }
}
