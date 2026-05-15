# Test Case - Hasil Pemeriksaan Dokter (Pasien)

## Informasi Umum

| | |
|---|---|
| **Feature** | Melihat Hasil Pemeriksaan Dokter (Pasien) |
| **Kode Fitur** | EXM |
| **Author** | SH-9 Qalam |
| **Date** | 2026-05-06 |
| **Objective** | Sebagai pasien, saya ingin melihat hasil pemeriksaan dokter agar saya bisa memahami kondisi kesehatan saya. |

---

## Lihat Detail Kunjungan (Status Selesai)

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.EXM.001 | TC.EXM.001.001 | Navigasi ke Detail Selesai | Positive | Klik tombol "Detail >" pada kunjungan berstatus Selesai | Terdapat minimal 1 data kunjungan di tab Selesai | 1. Buka tab "Selesai" 2. Klik tombol "Detail >" pada card | User diarahkan ke halaman detail, menampilkan status badge "SELESAI". |
| TS.EXM.001 | TC.EXM.001.002 | Verifikasi Temuan Klinis (SOAP) | Positive | Cek visibilitas data Temuan Klinis (SOAP) | User di halaman detail kunjungan yang memiliki Rekam Medis lengkap | 1. Scroll ke area "Temuan Klinis (SOAP)" | Terdapat blok informasi untuk: Subjektif, Objektif, Assessment, dan Plan. |
| TS.EXM.001 | TC.EXM.001.003 | Verifikasi Tanda Vital | Positive | Cek visibilitas data Tanda Vital | User di halaman detail kunjungan yang memiliki Rekam Medis lengkap | 1. Scroll ke area "Tanda Vital" | Terdapat informasi untuk Tekanan Darah, Detak Jantung, Suhu Tubuh, Berat Badan, dan Gula Darah. |
| TS.EXM.001 | TC.EXM.001.004 | Verifikasi Resep Obat | Positive | Cek visibilitas data Resep Obat | User di halaman detail kunjungan yang memiliki Rekam Medis lengkap | 1. Scroll ke area "Resep Obat & Dosis" | Terdapat blok resep obat dan dosis instruksinya. |
