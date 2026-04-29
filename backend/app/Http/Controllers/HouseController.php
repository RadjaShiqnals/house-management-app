<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHouseRequest;
use App\Http\Requests\UpdateHouseRequest;
use App\Models\House;
use Spatie\QueryBuilder\QueryBuilder;

class HouseController extends Controller
{
    public function index()
    {
        $houses = QueryBuilder::for(House::class)
            ->allowedFilters('nomor_rumah', 'status')
            ->allowedSorts('nomor_rumah', 'created_at')
            ->with('activeResident')
            ->paginate(10);

        return response()->json($houses);
    }

    public function store(StoreHouseRequest $request)
    {
        $house = House::create($request->validated());
        return response()->json(['message' => 'Rumah berhasil ditambahkan', 'data' => $house], 201);
    }

    public function show(House $house)
    {
        $house->load('activeResident', 'histories.resident');
        return response()->json($house);
    }

    public function update(UpdateHouseRequest $request, House $house)
    {
        $house->update($request->validated());
        return response()->json(['message' => 'Rumah berhasil diupdate', 'data' => $house]);
    }
}
