<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pasien extends Model
{
    /** @use HasFactory<\Database\Factories\PasienFactory> */
    use HasFactory;
    protected $fillable = [ 
        'nomor_pasien',
        'nama_lengkap',
        'alamat',
        'nomor_telepon',
        'jenis_kelamin',
        'tanggal_lahir',
        'golongan_darah',
        'pekerjaan',
        'nomor_ktp'
    ];
    public static function nomorPasien (){
        $maxId = self::max('id');
        $kode = sprintf("%04d", $maxId ? $maxId + 1 : 1);
        return 'PSN-' . date('Y') . $kode;
    }

    public static function getUsia($tanggalLahir){
    try {
        $tanggalLahir = new DateTime($tanggalLahir);
        $today = new DateTime();
        $usia = $today->diff($tanggalLahir);
        return $usia->y . ' Tahun, ' . $usia->m . ' Bulan';
    } catch (\Throwable $th) {
        return null;
    }
    }

    protected static function booted()
    {
    static::created(function($pasien){
        $pasien->nomor_pasien = self::nomorPasien();
        $pasien->save();
    });
    }
}
