<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Pengingat Janji Temu — RS Sehatin</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f7ff;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">

    <!-- Wrapper -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f7ff;padding:32px 16px;">
        <tr>
            <td align="center">

                <!-- Email Container -->
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(14,99,167,0.10);">

                    <!-- ======================== HEADER ======================== -->
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #0e63a7 0%, #0891b2 100%);padding:36px 32px 28px 32px;">
                            <!-- Logo-like mark -->
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="padding-bottom:12px;">
                                        <!-- Pulse icon (SVG inline) -->
                                        <div style="width:56px;height:56px;background-color:rgba(255,255,255,0.18);border-radius:50%;display:inline-block;line-height:56px;text-align:center;">
                                            <span style="font-size:28px;line-height:56px;">🏥</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <span style="display:block;font-size:26px;font-weight:800;letter-spacing:0.5px;color:#ffffff;">RS Sehatin</span>
                                        <span style="display:block;font-size:13px;font-weight:400;color:rgba(255,255,255,0.78);margin-top:4px;letter-spacing:1px;text-transform:uppercase;">Layanan Janji Temu Digital</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- ======================== BODY ======================== -->
                    <tr>
                        <td style="padding:36px 40px 0 40px;">

                            <!-- Reminder badge -->
                            <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                                <tr>
                                    <td style="background-color:#e0f2fe;border-radius:20px;padding:6px 14px;">
                                        <span style="font-size:12px;font-weight:700;color:#0e63a7;letter-spacing:0.5px;text-transform:uppercase;">🔔 Pengingat H-1</span>
                                    </td>
                                </tr>
                            </table>

                            <!-- Greeting -->
                            <p style="margin:0 0 6px 0;font-size:22px;font-weight:700;color:#0f172a;">
                                Halo, {{ $patientName }}! 👋
                            </p>
                            <p style="margin:0 0 28px 0;font-size:15px;color:#475569;line-height:1.7;">
                                Kami ingin mengingatkan bahwa Anda memiliki <strong style="color:#0e63a7;">janji temu medis besok</strong>. Harap hadir tepat waktu dan siapkan dokumen identitas Anda.
                            </p>

                            <!-- ============ Detail Card ============ -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f7fa 100%);border-radius:12px;border-left:5px solid #0891b2;margin-bottom:28px;">
                                <tr>
                                    <td style="padding:24px 28px;">

                                        <p style="margin:0 0 18px 0;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#0891b2;">Detail Janji Temu</p>

                                        <!-- Queue Number -->
                                        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                                            <tr>
                                                <td style="background-color:#0e63a7;border-radius:8px;padding:8px 18px;">
                                                    <span style="font-size:18px;font-weight:800;color:#ffffff;letter-spacing:2px;">No. Antrian: {{ $queueNumber }}</span>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Detail rows -->
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">

                                            <!-- Tanggal -->
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid #cfe8f7;width:40%;">
                                                    <span style="font-size:13px;color:#64748b;font-weight:500;">📅 Tanggal</span>
                                                </td>
                                                <td style="padding:8px 0;border-bottom:1px solid #cfe8f7;">
                                                    <span style="font-size:14px;font-weight:700;color:#0f172a;">{{ $appointmentDate }}</span>
                                                </td>
                                            </tr>

                                            <!-- Jam -->
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid #cfe8f7;">
                                                    <span style="font-size:13px;color:#64748b;font-weight:500;">🕐 Jam</span>
                                                </td>
                                                <td style="padding:8px 0;border-bottom:1px solid #cfe8f7;">
                                                    <span style="font-size:14px;font-weight:700;color:#0f172a;">{{ $appointmentTime }}</span>
                                                </td>
                                            </tr>

                                            <!-- Dokter -->
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid #cfe8f7;">
                                                    <span style="font-size:13px;color:#64748b;font-weight:500;">👨‍⚕️ Dokter</span>
                                                </td>
                                                <td style="padding:8px 0;border-bottom:1px solid #cfe8f7;">
                                                    <span style="font-size:14px;font-weight:700;color:#0f172a;">dr. {{ $doctorName }}</span>
                                                </td>
                                            </tr>

                                            <!-- Spesialisasi -->
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid #cfe8f7;">
                                                    <span style="font-size:13px;color:#64748b;font-weight:500;">🩺 Spesialisasi</span>
                                                </td>
                                                <td style="padding:8px 0;border-bottom:1px solid #cfe8f7;">
                                                    <span style="font-size:14px;font-weight:700;color:#0f172a;">{{ $specialization }}</span>
                                                </td>
                                            </tr>

                                            <!-- Poli -->
                                            <tr>
                                                <td style="padding:8px 0;">
                                                    <span style="font-size:13px;color:#64748b;font-weight:500;">🏨 Poli</span>
                                                </td>
                                                <td style="padding:8px 0;">
                                                    <span style="font-size:14px;font-weight:700;color:#0f172a;">{{ $poliName }}</span>
                                                </td>
                                            </tr>

                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- ============ CTA Button ============ -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $appointmentUrl }}"
                                           style="display:inline-block;background: linear-gradient(135deg, #0e63a7 0%, #0891b2 100%);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:50px;letter-spacing:0.5px;box-shadow:0 4px 14px rgba(14,99,167,0.35);">
                                            Lihat Detail Janji Temu &rarr;
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Reminder tips -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;border-radius:10px;margin-bottom:36px;">
                                <tr>
                                    <td style="padding:18px 22px;">
                                        <p style="margin:0 0 8px 0;font-size:13px;font-weight:700;color:#374151;">💡 Tips Persiapan</p>
                                        <ul style="margin:0;padding:0 0 0 18px;font-size:13px;color:#4b5563;line-height:1.9;">
                                            <li>Bawa kartu identitas (KTP) dan kartu pasien Anda.</li>
                                            <li>Hadir 10–15 menit sebelum jam yang tertera.</li>
                                            <li>Informasikan riwayat alergi dan obat yang sedang dikonsumsi.</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- ======================== FOOTER ======================== -->
                    <tr>
                        <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:28px 40px;border-radius:0 0 16px 16px;">

                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="padding-bottom:12px;">
                                        <span style="font-size:15px;font-weight:800;color:#0e63a7;">RS Sehatin</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-bottom:6px;">
                                        <span style="font-size:12px;color:#64748b;">📍 Jl. Kesehatan No. 1, Kota Sehatin, Indonesia</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-bottom:18px;">
                                        <span style="font-size:12px;color:#64748b;">📞 Bantuan: (021) 1234-5678 &nbsp;|&nbsp; ✉️ info@rssehatin.id</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <span style="font-size:11px;color:#94a3b8;line-height:1.6;">
                                            Ini adalah email otomatis dari sistem RS Sehatin, mohon tidak membalas email ini.<br/>
                                            &copy; {{ date('Y') }} RS Sehatin. Semua hak dilindungi.
                                        </span>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                </table>
                <!-- /Email Container -->

            </td>
        </tr>
    </table>
    <!-- /Wrapper -->

</body>
</html>
