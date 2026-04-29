<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use App\Models\House;
use App\Models\Expense;

class DeveloperExportController extends Controller
{
    public function exportResidents()
    {
        $residents = Resident::withTrashed()->get();
        return response()->json($residents);
    }

    public function exportHouses()
    {
        $houses = House::withTrashed()->with('histories')->get();
        return response()->json($houses);
    }

    public function exportExpenses()
    {
        $expenses = Expense::withTrashed()->get();
        return response()->json($expenses);
    }
}
