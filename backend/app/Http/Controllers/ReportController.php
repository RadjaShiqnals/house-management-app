<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function monthlySummary(Request $request)
    {
        $request->validate(['year' => 'required|integer']);
        $year = $request->year;

        $income = Payment::select(
                DB::raw('MONTH(tgl_bayar) as month'),
                DB::raw('SUM(jumlah_bayar) as total')
            )
            ->whereYear('tgl_bayar', $year)
            ->groupBy('month')
            ->get()
            ->keyBy('month');

        $expense = Expense::select(
                DB::raw('MONTH(tgl_pengeluaran) as month'),
                DB::raw('SUM(jumlah) as total')
            )
            ->whereYear('tgl_pengeluaran', $year)
            ->groupBy('month')
            ->get()
            ->keyBy('month');

        $result = [];
        for ($m = 1; $m <= 12; $m++) {
            $result[] = [
                'month' => $m,
                'income' => $income->get($m)->total ?? 0,
                'expense' => $expense->get($m)->total ?? 0,
            ];
        }

        return response()->json($result);
    }

    public function monthlyDetail(Request $request)
    {
        $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer|min:1|max:12'
        ]);

        $payments = Payment::with('paymentBill.house', 'paymentBill.feeType')
            ->whereYear('tgl_bayar', $request->year)
            ->whereMonth('tgl_bayar', $request->month)
            ->get();

        $expenses = Expense::whereYear('tgl_pengeluaran', $request->year)
            ->whereMonth('tgl_pengeluaran', $request->month)
            ->get();

        return response()->json([
            'income_details' => $payments,
            'expense_details' => $expenses,
        ]);
    }
}
