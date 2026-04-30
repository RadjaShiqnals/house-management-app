<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\HouseResidentController;
use App\Http\Controllers\PaymentBillController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DeveloperExportController;

Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        
        Route::apiResource('residents', ResidentController::class);
        
        Route::apiResource('houses', HouseController::class);
        Route::post('houses/{house}/assign', [HouseResidentController::class, 'assign']);
        Route::post('houses/{house}/unassign', [HouseResidentController::class, 'unassign']);

        Route::apiResource('bills', PaymentBillController::class);
        Route::post('bills/generate', [PaymentBillController::class, 'generate']);
        Route::post('bills/{bill}/pay', [PaymentController::class, 'store']);

        Route::apiResource('expenses', ExpenseController::class);

        Route::get('reports/monthly-summary', [ReportController::class, 'monthlySummary']);
        Route::get('reports/monthly-detail', [ReportController::class, 'monthlyDetail']);

        Route::get('dev/export-residents', [DeveloperExportController::class, 'exportResidents']);
        Route::get('dev/export-houses', [DeveloperExportController::class, 'exportHouses']);
        Route::get('dev/export-expenses', [DeveloperExportController::class, 'exportExpenses']);
    });
});
