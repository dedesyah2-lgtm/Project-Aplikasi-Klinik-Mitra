<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Kartu Pasien</title>
    <style>
        :root {
            --card-width: 85.6mm;
            --card-height: 53.98mm;
            --primary: #0f172a;
            --secondary: #1e293b;
            --accent1: #22c55e;
            --accent2: #14b8a6;
            --accent3: #3b82f6;
        }

        /* =========================
           RESET
        ========================== */
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        html, body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: #e2e8f0;
        }

        body {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
            padding: 20px;
        }

        /* =========================
           KARTU
        ========================== */
        .print-area {
            width: var(--card-width);
            height: var(--card-height);
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .card {
            width: var(--card-width);
            height: var(--card-height);
            position: relative;
            overflow: hidden;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            border-radius: 14px;
            padding: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,.18);
        }

        .top-accent {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 3.5mm;
            background: linear-gradient(90deg, var(--accent1), var(--accent2), var(--accent3));
        }

        .circle-1,
        .circle-2 {
            position: absolute;
            border-radius: 999px;
            background: rgba(255,255,255,0.04);
        }

        .circle-1 {
            width: 32mm;
            height: 32mm;
            top: -8mm;
            right: -8mm;
        }

        .circle-2 {
            width: 24mm;
            height: 24mm;
            bottom: -7mm;
            left: -7mm;
            background: rgba(255,255,255,0.03);
        }

        /* =========================
           HEADER
        ========================== */
        .header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 4mm;
            position: relative;
            z-index: 2;
        }

        .logo {
            width: 10mm;
            height: 10mm;
            border-radius: 8px;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            flex-shrink: 0;
            padding: 1px;
        }

        .logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .hospital-info {
            line-height: 1.1;
        }

        .hospital-name {
            font-size: 10.5px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .4px;
        }

        .hospital-sub {
            font-size: 7.5px;
            opacity: 0.8;
            margin-top: 2px;
        }

        /* =========================
           CONTENT
        ========================== */
        .content {
            display: flex;
            justify-content: space-between;
            margin-top: 4mm;
            position: relative;
            z-index: 2;
        }

        .left {
            width: 62%;
        }

        .right {
            width: 32%;
            display: flex;
            justify-content: center;
            align-items: flex-start;
        }

        .card-title {
            font-size: 7px;
            text-transform: uppercase;
            opacity: 0.75;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }

        .patient-name {
            font-size: 11px;
            font-weight: 700;
            line-height: 1.25;
            margin-bottom: 6px;
            text-transform: uppercase;
            max-height: 26px;
            overflow: hidden;
        }

        .info-row {
            display: flex;
            gap: 4px;
            font-size: 8px;
            margin-bottom: 2.5px;
        }

        .label {
            width: 14mm;
            opacity: 0.75;
            flex-shrink: 0;
        }

        .value {
            font-weight: 600;
            word-break: break-word;
        }

        /* =========================
           QR
        ========================== */
        .qrcode-box {
            width: 18mm;
            height: 18mm;
            background: white;
            padding: 1.5mm;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .qrcode-box svg,
        .qrcode-box img {
            width: 100% !important;
            height: 100% !important;
        }

        /* =========================
           BARCODE
        ========================== */
        .barcode-wrap {
            position: absolute;
            left: 12px;
            right: 12px;
            bottom: 8px;
            z-index: 2;
        }

        .barcode-box {
            background: white;
            border-radius: 8px;
            padding: 3px 6px 2px;
            width: 100%;
            overflow: hidden;
        }

        .barcode-box img,
        .barcode-box svg {
            max-width: 100% !important;
            height: auto !important;
        }

        .barcode-box div {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .barcode-text {
            text-align: center;
            color: #0f172a;
            font-size: 7px;
            font-weight: bold;
            margin-top: 2px;
            letter-spacing: .5px;
        }

        .footer-note {
            position: absolute;
            right: 12px;
            bottom: 1.5px;
            font-size: 5.5px;
            opacity: 0.55;
            z-index: 2;
        }

        /* =========================
           SCREEN ONLY
        ========================== */
        .screen-toolbar {
            position: fixed;
            top: 16px;
            right: 16px;
            display: flex;
            gap: 8px;
            z-index: 9999;
        }

        .screen-toolbar button {
            border: none;
            background: #0f172a;
            color: white;
            padding: 10px 14px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 8px 20px rgba(0,0,0,.12);
        }

        .screen-toolbar button:hover {
            background: #1e293b;
        }

        /* =========================
           PRINT MODE
        ========================== */
        @page {
            size: 85.6mm 53.98mm;
            margin: 0;
        }

        @media print {
            html, body {
                width: var(--card-width);
                height: var(--card-height);
                background: white !important;
                overflow: hidden;
            }

            body {
                display: block;
                padding: 0;
                margin: 0;
            }

            .screen-toolbar {
                display: none !important;
            }

            .print-area {
                margin: 0;
                padding: 0;
                width: var(--card-width);
                height: var(--card-height);
            }

            .card {
                width: var(--card-width);
                height: var(--card-height);
                border-radius: 0;
                box-shadow: none;
                page-break-after: avoid;
            }

            .barcode-box,
            .qrcode-box {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>

    <div class="screen-toolbar">
        <button onclick="window.print()">🖨️ Cetak</button>
    </div>

    <div class="print-area">
        <div class="card">
            <div class="top-accent"></div>
            <div class="circle-1"></div>
            <div class="circle-2"></div>

            <div class="header">
<div class="logo">
    <img src="{{ asset('logo-rs.png') }}" alt="Logo RS" style="width: 60px; height: auto;">
</div>

                <div class="hospital-info">
                    <div class="hospital-name">KLINIK MITRA KELUARGA</div>
                    <div class="hospital-sub">Kartu Identitas Pasien</div>
                </div>
            </div>

            <div class="content">
                <div class="left">
                    <div class="card-title">Patient Card</div>
                    <div class="patient-name">{{ $pasien->nama_lengkap }}</div>

                    <div class="info-row">
                        <div class="label">No. RM</div>
                        <div class="value">: {{ $pasien->nomor_pasien }}</div>
                    </div>

                    <div class="info-row">
                        <div class="label">L/P</div>
                        <div class="value">: {{ $pasien->jenis_kelamin }}</div>
                    </div>

                    <div class="info-row">
                        <div class="label">Lahir</div>
                        <div class="value">: {{ \Carbon\Carbon::parse($pasien->tanggal_lahir)->format('d-m-Y') }}</div>
                    </div>
                </div>

                {{-- <div class="right">
                    <div class="qrcode-box">
                        {!! QrCode::size(90)->margin(0)->generate(route('pasien.scan', $pasien->nomor_pasien)) !!}
                    </div>
                </div> --}}
            </div>

            <div class="barcode-wrap">
                <div class="barcode-box">
                    {!! DNS1D::getBarcodeHTML($pasien->nomor_pasien, 'C128', 1.2, 20) !!}
                    <div class="barcode-text">{{ $pasien->nomor_pasien }}</div>
                </div>
            </div>

            <div class="footer-note">Valid untuk identifikasi pasien</div>
        </div>
    </div>

</body>
</html>