<?php

use App\Http\Controllers\PasienController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function() {
        return Inertia::render('dashboard');
    })-> name('dashboard');

    Route::prefix('data-pasien')->controller(PasienController::class)->group(function () { 
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::put('/{pasien_id}', 'update');
        Route::delete('/{pasien_id}', 'destroy');
    });
    Route::get('/scan-pasien/{no_rm}', [PasienController::class, 'scan'])
    ->name('pasien.scan');
    Route::get('/pasien/{pasien}', [PasienController::class, 'show'])
    ->name('pasien.show');
    
    Route::get('/pasien/{pasien}/cetak-kartu', [PasienController::class, 'cetakKartu'])
    ->name('pasien.cetak-kartu');

    Route::get('/data-pasien/cek-nik/{nik}', [PasienController::class, 'cekNik']);

    Route::get('/data-pasien/cetak/pdf', [PasienController::class, 'cetakPdf'])
    ->name('data-pasien.cetak.pdf');
    
});

    Route::get('/debug', function () {
    return 'OK';
});


require __DIR__.'/settings.php';

