# Test Case - Input Rekam Medis (Medical History Create)

## Informasi Umum

| | |
|---|---|
| **Feature** | Input Rekam Medis Pasien |
| **Kode Fitur** | MHC |
| **Author** | SH-12 Diva |
| **Date** | 2026-05-05 |

---

## TS.MHC.001: Verifikasi Validasi Form

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.MHC.001 | TC.MHC.001.001 | Submit form dengan field kosong | Negative | Verifikasi pesan error muncul pada field wajib (SOAP) | User di halaman Input Rekam Medis | 1. Kosongkan semua field <br> 2. Klik tombol "Simpan Rekam Medis" | Muncul pesan error di bawah field Subjektif, Objektif, Assessment, dan Plan |

---

## TS.MHC.002: Input Data Rekam Medis

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.MHC.002 | TC.MHC.002.001 | Input data tanda vital | Positive | Verifikasi input Tanda Vital (TD, Detak Jantung, Suhu, BB, Gula Darah) | User di halaman Input Rekam Medis | 1. Masukkan data ke semua field Tanda Vital | Nilai terinput dengan benar di setiap field |
| TS.MHC.002 | TC.MHC.002.002 | Input data SOAP dan Resep | Positive | Verifikasi input field SOAP dan Resep Obat | User di halaman Input Rekam Medis | 1. Masukkan teks ke field S, O, A, P <br> 2. Masukkan daftar obat ke field Resep | Teks tampil di area input sesuai yang diketikkan |
| TS.MHC.002 | TC.MHC.002.003 | Simpan rekam medis valid | Positive | Verifikasi berhasil menyimpan data dan diarahkan kembali | User di halaman Input Rekam Medis | 1. Isi semua field dengan data valid <br> 2. Klik tombol "Simpan Rekam Medis" | Data tersimpan, user diarahkan kembali ke halaman jadwal/detail |

---

## TS.MHC.003: Navigasi dan Pembatalan

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.MHC.003 | TC.MHC.003.001 | Batal input rekam medis | Positive | Verifikasi tombol Batal mengarahkan kembali ke jadwal | User di halaman Input Rekam Medis | 1. Klik tombol "Batal" | User diarahkan kembali ke halaman Jadwal Kunjungan |
| TS.MHC.003 | TC.MHC.003.002 | Akses histori dari form | Positive | Verifikasi link Histori Kunjungan berfungsi | User di halaman Input Rekam Medis | 1. Klik tombol "Histori Kunjungan" di sidebar pasien | User diarahkan ke halaman Riwayat Medis pasien tersebut |
