<?php

namespace App\Services;

use App\Models\FeeType;
use App\Models\House;
use App\Models\PaymentBill;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BillGeneratorService
{
    public function generateForMonth($dateString)
    {
        try {
            DB::beginTransaction();

            $houses = House::with('activeResident')->where('status', 'dihuni')->get();
            $feeTypes = FeeType::all();
            
            $generatedCount = 0;

            foreach ($houses as $house) {
                if (!$house->activeResident) continue;

                foreach ($feeTypes as $fee) {
                    $exists = PaymentBill::where('house_id', $house->id)
                        ->where('fee_type_id', $fee->id)
                        ->where('bulan', $dateString)
                        ->exists();

                    if (!$exists) {
                        PaymentBill::create([
                            'house_id' => $house->id,
                            'resident_id' => $house->activeResident->id,
                            'fee_type_id' => $fee->id,
                            'bulan' => $dateString,
                            'jumlah_bulan' => 1,
                            'total_tagihan' => $fee->nominal,
                            'status' => 'belum',
                        ]);
                        $generatedCount++;
                    }
                }
            }

            DB::commit();
            return ['status' => 'success', 'count' => $generatedCount];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bill generation failed: ' . $e->getMessage());
            throw $e;
        }
    }
}
