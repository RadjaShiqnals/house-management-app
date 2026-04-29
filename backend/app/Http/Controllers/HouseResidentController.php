<?php

namespace App\Http\Controllers;

use App\Models\House;
use App\Models\HouseResidentHistory;
use Illuminate\Http\Request;

class HouseResidentController extends Controller
{
    public function assign(Request $request, House $house)
    {
        $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'tgl_masuk' => 'required|date',
        ]);

        if ($house->status === 'dihuni' && $house->resident_id) {
            return response()->json(['message' => 'Rumah sedang dihuni.'], 400);
        }

        $house->update([
            'resident_id' => $request->resident_id,
            'status' => 'dihuni'
        ]);

        $history = HouseResidentHistory::create([
            'house_id' => $house->id,
            'resident_id' => $request->resident_id,
            'tgl_masuk' => $request->tgl_masuk,
        ]);

        return response()->json(['message' => 'Penghuni berhasil diassign', 'data' => $history]);
    }

    public function unassign(Request $request, House $house)
    {
        $request->validate([
            'tgl_keluar' => 'required|date',
        ]);

        if (!$house->resident_id) {
            return response()->json(['message' => 'Rumah tidak sedang dihuni.'], 400);
        }

        // Update current history
        $history = HouseResidentHistory::where('house_id', $house->id)
            ->where('resident_id', $house->resident_id)
            ->whereNull('tgl_keluar')
            ->latest()
            ->first();

        if ($history) {
            $history->update(['tgl_keluar' => $request->tgl_keluar]);
        }

        $house->update([
            'resident_id' => null,
            'status' => 'tidak_dihuni'
        ]);

        return response()->json(['message' => 'Penghuni berhasil di-unassign']);
    }
}
