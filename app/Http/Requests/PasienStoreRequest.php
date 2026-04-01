<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PasienStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_lengkap' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date|before:today',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'nomor_ktp' => 'required|numeric|min:1',
            'nomor_telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
    return [
        'nama_lengkap.required' => 'Nama lengkap wajib diisi.',
        'nama_lengkap.string' => 'Nama lengkap harus berupa teks.',
        'nama_lengkap.max' => 'Nama lengkap maksimal 255 karakter.',

        'tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
        'tanggal_lahir.date' => 'Tanggal lahir harus berupa tanggal yang valid.',
        'tanggal_lahir.before' => 'Tanggal lahir harus sebelum hari ini.',

        'jenis_kelamin.required' => 'Jenis kelamin wajib diisi.',
        'jenis_kelamin.in' => 'Pilihan jenis kelamin "Laki-laki" atau "Perempuan".',

        'nomor_telepon.string' => 'Nomor telepon harus berupa teks',
        'nomor_telepon.max' => 'Nomor telepon maksimal 20 karakter.',

        'nomor_ktp.required' => 'Nomor ktp wajib diisi.',
        'nomor_ktp.numeric' => 'Nomor ktp harus berupa angka',
        'nomor_ktp.max' => 'Nomor telepon maksimal 50 karakter.',

        'alamat.string' => 'Alamat harus berupa teks.',
        'alamat.max' => 'Alamat maksimal 500 karakter.',
    ];
    }
}
