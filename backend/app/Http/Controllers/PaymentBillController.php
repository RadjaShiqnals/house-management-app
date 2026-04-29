<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentBillRequest;
use App\Models\FeeType;
use App\Models\House;
use App\Models\PaymentBill;
use App\Services\BillGeneratorService;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class PaymentBillController extends Controller
{
    public function index()
    {
        $bills = QueryBuilder::for(PaymentBill::class)
            ->allowedFilters('bulan', 'status', 'house_id')
            ->allowedSorts('bulan', 'status')
            ->with(['house', 'resident', 'feeType'])
            ->paginate(15);

        return response()->json($bills);
    }

    public function generate(Request $request, BillGeneratorService $service)
    {
        $request->validate(['bulan' => 'required|date_format:Y-m-d']);
        
        try {
            $result = $service->generateForMonth($request->bulan);
            return response()->json([
                'message' => "Berhasil generate {$result['count']} tagihan baru."
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal generate tagihan', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(StorePaymentBillRequest $request)
    {
        $data = $request->validated();
        $house = House::findOrFail($data['house_id']);
        
        if (!$house->activeResident) {
            return response()->json(['message' => 'Rumah tidak memiliki penghuni aktif.'], 400);
        }

        $fee = FeeType::findOrFail($data['fee_type_id']);
        $total = $fee->nominal * $data['jumlah_bulan'];

        $bill = PaymentBill::create([
            'house_id' => $house->id,
            'resident_id' => $house->activeResident->id,
            'fee_type_id' => $fee->id,
            'bulan' => $data['bulan'],
            'jumlah_bulan' => $data['jumlah_bulan'],
            'total_tagihan' => $total,
            'status' => 'belum',
        ]);

        return response()->json(['message' => 'Tagihan berhasil dibuat', 'data' => $bill], 201);
    }

    public function show(PaymentBill $bill)
    {
        $bill->load(['house', 'resident', 'feeType', 'payments']);
        return response()->json($bill);
    }
}
