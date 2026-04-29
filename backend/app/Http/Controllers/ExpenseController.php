<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExpenseRequest;
use App\Models\Expense;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = QueryBuilder::for(Expense::class)
            ->allowedFilters('kategori', 'tgl_pengeluaran')
            ->allowedSorts('tgl_pengeluaran', 'jumlah')
            ->paginate(15);

        return response()->json($expenses);
    }

    public function store(StoreExpenseRequest $request)
    {
        $expense = Expense::create($request->validated());
        return response()->json(['message' => 'Pengeluaran berhasil dicatat', 'data' => $expense], 201);
    }

    public function show(Expense $expense)
    {
        return response()->json($expense);
    }

    public function update(StoreExpenseRequest $request, Expense $expense)
    {
        $expense->update($request->validated());
        return response()->json(['message' => 'Pengeluaran berhasil diupdate', 'data' => $expense]);
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();
        return response()->json(['message' => 'Pengeluaran berhasil dihapus']);
    }
}
