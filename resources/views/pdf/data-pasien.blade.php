<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Data Pasien</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #111827;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h2 {
            margin: 0;
            font-size: 20px;
        }

        .header p {
            margin: 4px 0;
            color: #4b5563;
        }

        .info {
            margin-bottom: 15px;
            font-size: 12px;
        }

        .info p {
            margin: 3px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }

        table th, table td {
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: left;
            vertical-align: top;
        }

        table th {
            background-color: #e5e7eb;
            text-align: center;
        }

        .text-center {
            text-align: center;
        }

        .footer {
            margin-top: 24px;
            font-size: 11px;
            color: #6b7280;
            text-align: right;
        }
    </style>
</head>
<body>

    <div class="header">
        <h2>DATA PASIEN</h2>
        <p>Klinik Mitra Keluarga Tegaldlimo - Banyuwangi</p>
    </div>

    <div class="info">
        <p><strong>Tanggal Cetak:</strong> {{ $tanggalCetak->translatedFormat('l, d F Y H:i') }}</p>
        <p><strong>Pencarian:</strong> {{ $search ?: '-' }}</p>
        <p><strong>Filter:</strong> {{ $today ? 'Data Hari Ini' : 'Semua Data' }}</p>
        <p><strong>Total Data:</strong> {{ $pasiens->count() }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th width="40">No</th>
                <th width="100">No Pasien</th>
                <th width="140">NIK</th>
                <th>Nama Lengkap</th>
                <th width="90">Jenis Kelamin</th>
                <th width="70">Usia</th>
                <th width="120">Tanggal Daftar</th>
            </tr>
        </thead>
        <tbody>
    @forelse ($pasiens as $index => $pasien)
        <tr>
            <td class="text-center">{{ $index + 1 }}</td>
            <td>{{ $pasien->nomor_pasien }}</td>
            <td>{{ $pasien->nomor_ktp }}</td>
            <td>{{ $pasien->nama_lengkap }}</td>
            <td class="text-center">{{ $pasien->jenis_kelamin }}</td>
            <td class="text-center">
                {{ $pasien->tanggal_lahir ? \Carbon\Carbon::parse($pasien->tanggal_lahir)->age . ' th' : '-' }}
            </td>
            <td class="text-center">
                {{ optional($pasien->created_at)->format('d-m-Y') }}
            </td>
        </tr>
    @empty
        <tr>
            <td colspan="7" class="text-center">Tidak ada data pasien.</td>
        </tr>
    @endforelse
        </tbody>
    </table>

    <div class="footer">
        Dicetak oleh sistem pada {{ $tanggalCetak->format('d-m-Y H:i:s') }}
    </div>

</body>
</html>