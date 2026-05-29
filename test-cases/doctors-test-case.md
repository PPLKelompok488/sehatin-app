# Test Case - Manajemen Dokter

## Informasi Umum

| | |
|---|---|
| **Feature** | Manajemen Dokter |
| **Kode Fitur** | DOC |
| **Author** | Antigravity |
| **Date** | 2026-05-05 |

---

## TS.DOC.001: View, Search & Filter

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.DOC.001 | TC.DOC.001.001 | Pencarian Dokter | Positive | Mencari dokter berdasarkan nama yang ada | Admin di halaman Kelola Dokter | 1. Ketik nama dokter yang ada di search bar | List dokter terfilter hanya menampilkan dokter yang sesuai |
| TS.DOC.001 | TC.DOC.001.002 | Filter Status Aktif | Positive | Filter hanya menampilkan dokter dengan status aktif | Admin di halaman Kelola Dokter | 1. Klik tombol Filter<br>2. Pilih "Aktif" | Hanya dokter dengan status aktif yang muncul di tabel |
| TS.DOC.001 | TC.DOC.001.003 | Filter Status Nonaktif | Positive | Filter hanya menampilkan dokter dengan status nonaktif | Admin di halaman Kelola Dokter | 1. Klik tombol Filter<br>2. Pilih "Nonaktif" | Hanya dokter dengan status nonaktif yang muncul di tabel |
| TS.DOC.001 | TC.DOC.001.004 | Navigasi Halaman (Pagination) | Positive | Klik tombol halaman berikutnya | Admin di halaman Kelola Dokter (data > 8) | 1. Klik angka halaman atau icon panah kanan | Tabel menampilkan data baris berikutnya |

---

## TS.DOC.002: Tambah Dokter

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.DOC.002 | TC.DOC.002.001 | Validasi field wajib | Negative | Submit form dengan field kosong | Modal "Input Data Dokter" terbuka | 1. Biarkan field "Nama Lengkap & Gelar" kosong<br>2. Klik "Simpan Data" | Muncul pesan error "Nama dokter wajib diisi." |
| TS.DOC.002 | TC.DOC.002.002 | Ketergantungan Poli dan Spesialisasi | Positive | Pilihan spesialisasi berubah sesuai Poli | Modal "Input Data Dokter" terbuka | 1. Pilih Poli pada dropdown Poli | Dropdown Spesialisasi aktif dan menampilkan list spesialisasi yang relevan dengan Poli tersebut |
| TS.DOC.002 | TC.DOC.002.003 | Toggle Status Dokter | Positive | Mengubah status dokter saat pembuatan | Modal "Input Data Dokter" terbuka | 1. Klik "Nonaktif" pada pilihan Status | Tombol "Nonaktif" terpilih dengan outline abu-abu |
| TS.DOC.002 | TC.DOC.002.004 | Submit Dokter Valid | Positive | Input data valid dan simpan | Modal "Input Data Dokter" terbuka | 1. Isi semua field (Nama, Poli, Spesialisasi, STR, Telp, Email, Password)<br>2. Klik "Simpan Data" | Modal tertutup, dokter baru muncul di tabel |

---

## TS.DOC.003: Edit Dokter

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.DOC.003 | TC.DOC.003.001 | Buka Modal Edit | Positive | Klik tombol Kelola pada salah satu baris | Admin di halaman Kelola Dokter | 1. Klik tombol "Kelola" pada salah satu dokter | Modal terbuka dengan data dokter tersebut sudah terisi di form |
| TS.DOC.003 | TC.DOC.003.002 | Simpan Perubahan | Positive | Mengubah data dan simpan | Modal "Input Data Dokter" (mode Edit) terbuka | 1. Ubah nomor telepon atau nama dokter<br>2. Klik "Simpan Data" | Modal tertutup, data dokter di tabel terupdate |
