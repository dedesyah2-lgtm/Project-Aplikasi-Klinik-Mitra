<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Pasien;
use App\Http\Requests\PasienStoreRequest;
use App\Http\Resources\PasienResource;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class PasienController extends Controller
{
    public function index(Request $request)
{
    $perPage = $request->query('perPage', 25);
    $search = $request->query('search', '');

    $query = Pasien::query();

    // 🔍 Search
    if ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('nama_lengkap', 'LIKE', "%{$search}%")
              ->orWhere('nomor_pasien', 'LIKE', "%{$search}%")
              ->orWhere('nomor_ktp', 'LIKE', "%{$search}%");
        });
    }

    // 📅 Filter hari ini
    if ($request->boolean('today')) {
        $query->whereDate('created_at', Carbon::today());
    }

    // Sorting
    $query->orderBy('nama_lengkap', 'ASC');

    // Pagination
    $pasiens = PasienResource::collection(
        $query->paginate($perPage)->withQueryString()
    );

    return Inertia::render('pasien/Index', [
        'pasiens' => $pasiens,
        'filters' => [
            'search' => $search,
            'today' => $request->boolean('today'),
        ]
    ]);
}

public function store(PasienStoreRequest $request)
{
    Pasien::create($request->all());
    return redirect()->to('/data-pasien')->with('success', 'Data pasien berhasil disimpan');
}

public function update(PasienStoreRequest $request, $pasien_id)
{
    $pasien = Pasien::findOrFail($pasien_id);
    $pasien->update($request->all());
    return redirect()->to('/data-pasien')->with('success', 'Data Pasien berhasil diupdate');
}

public function destroy($pasien_id){
 $pasien = Pasien::findOrFail($pasien_id);
 $pasien->delete();
 return redirect()->to('/data-pasien')->with('success', 'Data pasien berhasil dihapus.');
}

public function scan($no_rm)
{
    $pasien = Pasien::where('no_rm', $no_rm)->firstOrFail();

    return redirect()->route('pasien.show', $pasien->id);
}

public function cetakKartu(Pasien $pasien)
{
    return view('pasien.cetak-kartu', compact('pasien'));
}

public function cekNik($nik)
{
    $pasien = \App\Models\Pasien::where('nomor_ktp', $nik)->first();

    if (!$pasien) {
        return response()->json([
            'exists' => false,
            'message' => 'NIK belum terdaftar',
        ]);
    }

    return response()->json([
        'exists' => true,
        'message' => 'Pasien lama ditemukan',
        'data' => $pasien,
    ]);
}

public function cetakPdf(Request $request)
{
    $search = $request->search;
    $today = $request->boolean('today');

    $query = Pasien::query();

    // SEARCH
    if ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('nama_lengkap', 'like', "%{$search}%")
              ->orWhere('nomor_pasien', 'like', "%{$search}%")
              ->orWhere('nomor_ktp', 'like', "%{$search}%");
        });
    }

    // FILTER HARI INI
    if ($today) {
        $query->whereDate('created_at', now()->toDateString());
    }

    $pasiens = $query->orderBy('created_at', 'desc')->get();

    $pdf = Pdf::loadView('pdf.data-pasien', [
        'pasiens' => $pasiens,
        'search' => $search,
        'today' => $today,
        'tanggalCetak' => now(),
    ])->setPaper('a4', 'landscape');

    return $pdf->stream('data-pasien.pdf');
    // kalau mau auto download, ganti stream jadi:
    // return $pdf->download('data-pasien.pdf');
}

}
