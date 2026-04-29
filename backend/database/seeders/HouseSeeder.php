<?php

namespace Database\Seeders;

use App\Models\House;
use Illuminate\Database\Seeder;

class HouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 20; $i++) {
            House::create([
                'nomor_rumah' => 'A' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'alamat' => 'Blok A No. ' . $i,
                'status' => 'tidak_dihuni',
            ]);
        }
    }
}
