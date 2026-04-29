<?php

namespace Database\Seeders;

use App\Models\FeeType;
use Illuminate\Database\Seeder;

class FeeTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FeeType::create([
            'nama' => 'satpam',
            'nominal' => 100000,
        ]);

        FeeType::create([
            'nama' => 'kebersihan',
            'nominal' => 15000,
        ]);
    }
}
