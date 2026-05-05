# Test Case - Detail Rekam Medis (Medical History Show)

## Informasi Umum

| | |
|---|---|
| **Feature** | Detail Rekam Medis Pasien |
| **Kode Fitur** | MHS |
| **Author** | SH-12 Diva |
| **Date** | 2026-05-05 |

---

## TS.MHS.001: Verifikasi Informasi Pasien dan Kunjungan

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.MHS.001 | TC.MHS.001.001 | Menampilkan identitas pasien | Positive | Verifikasi Nama, Jenis Kelamin, dan Usia pasien tampil | User di halaman Detail Rekam Medis | 1. Perhatikan bagian kartu ringkasan pasien | Nama, jenis kelamin, dan usia pasien tampil sesuai data |
| TS.MHS.001 | TC.MHS.001.002 | Menampilkan detail kunjungan | Positive | Verifikasi Queue ID, Waktu, dan Nama Dokter tampil | User di halaman Detail Rekam Medis | 1. Perhatikan bagian detail di bawah nama pasien | Queue ID, jam kunjungan, dan nama dokter tampil dengan benar |
| TS.MHS.001 | TC.MHS.001.003 | Menampilkan status kunjungan | Positive | Verifikasi timeline status kunjungan (Booked, Visit, Completed) | User di halaman Detail Rekam Medis | 1. Perhatikan bagian timeline status | Timeline menunjukkan status "Completed" jika rekam medis sudah diisi |

---

## TS.MHS.002: Verifikasi Temuan Klinis dan Tanda Vital

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.MHS.002 | TC.MHS.002.001 | Menampilkan catatan SOAP | Positive | Verifikasi data Subjektif, Objektif, Diagnosis, dan Rekomendasi | User di halaman Detail Rekam Medis (Filled State) | 1. Scroll ke bagian "Temuan Klinis" | Empat kartu SOAP (S, O, D, R) menampilkan data hasil pemeriksaan |
| TS.MHS.002 | TC.MHS.002.002 | Menampilkan tanda-tanda vital | Positive | Verifikasi Tekanan Darah, Detak Jantung, Suhu, BB, dan Gula Darah | User di halaman Detail Rekam Medis (Filled State) | 1. Perhatikan sidebar "Tanda Vital" | Semua parameter vital sign tampil dengan ikon dan nilai yang sesuai |
| TS.MHS.002 | TC.MHS.002.003 | Menampilkan resep obat | Positive | Verifikasi daftar obat dan dosis | User di halaman Detail Rekam Medis (Filled State) | 1. Scroll ke bagian "Resep Obat & Dosis" | Teks resep obat tampil dengan format yang rapi dan mudah dibaca |

---

## TS.MHS.003: Verifikasi Kondisi Kosong dan Navigasi

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.MHS.003 | TC.MHS.003.001 | Verifikasi Empty State | Positive | Tampilkan pesan kosong jika belum ada rekam medis | User di halaman Detail Rekam Medis (Empty State) | 1. Buka kunjungan yang belum diperiksa | Muncul ilustrasi dan pesan "Catatan medis belum tersedia" |
| TS.MHS.003 | TC.MHS.003.002 | Navigasi ke Form Pemeriksaan | Positive | Klik tombol "Mulai Periksa Sekarang" atau "Rekam Medis Pasien" | User di halaman Detail Rekam Medis | 1. Klik tombol "Mulai Periksa Sekarang" (jika kosong) atau "Rekam Medis Pasien" | User diarahkan ke halaman Input Rekam Medis (Create) |
| TS.MHS.003 | TC.MHS.003.003 | Navigasi ke Histori Kunjungan | Positive | Klik tombol "Histori Kunjungan" | User di halaman Detail Rekam Medis | 1. Klik tombol "Histori Kunjungan" | User diarahkan ke halaman riwayat medis pasien tersebut |
