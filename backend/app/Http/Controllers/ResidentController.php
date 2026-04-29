<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreResidentRequest;
use App\Http\Requests\UpdateResidentRequest;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Spatie\QueryBuilder\QueryBuilder;

class ResidentController extends Controller
{
    public function index()
    {
        $residents = QueryBuilder::for(Resident::class)
            ->allowedFilters('nama_lengkap', 'status_penghuni')
            ->allowedSorts('nama_lengkap', 'created_at')
            ->paginate(10);

        return response()->json($residents);
    }

    public function store(StoreResidentRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('foto_ktp')) {
            $path = $request->file('foto_ktp')->store('ktp', 'public');
            $data['foto_ktp'] = $path;
        }

        $resident = Resident::create($data);

        return response()->json(['message' => 'Penghuni berhasil ditambahkan', 'data' => $resident], 201);
    }

    public function show(Resident $resident)
    {
        $resident->load('houseResidentHistories', 'house');
        return response()->json($resident);
    }

    public function update(UpdateResidentRequest $request, Resident $resident)
    {
        $data = $request->validated();

        if ($request->hasFile('foto_ktp')) {
            // Delete old photo if exists
            if ($resident->foto_ktp) {
                Storage::disk('public')->delete($resident->foto_ktp);
            }
            $path = $request->file('foto_ktp')->store('ktp', 'public');
            $data['foto_ktp'] = $path;
        }

        $resident->update($data);

        return response()->json(['message' => 'Penghuni berhasil diupdate', 'data' => $resident]);
    }

    public function destroy(Resident $resident)
    {
        $resident->delete();

        return response()->json(['message' => 'Penghuni berhasil dihapus']);
    }
}
