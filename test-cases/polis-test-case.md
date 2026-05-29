# Test Case - Manajemen Poli

## Informasi Umum

| | |
|---|---|
| **Feature** | Manajemen Poli |
| **Kode Fitur** | POL |
| **Author** | Antigravity |
| **Date** | 2026-05-05 |

---

## TS.POL.001: View, Search & Filter

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.POL.001 | TC.POL.001.001 | Pencarian Poli | Positive | Mencari poli berdasarkan nama yang ada | Admin di halaman Kelola Poli | 1. Ketik nama poli yang ada di search bar | List poli terfilter hanya menampilkan poli yang sesuai |
| TS.POL.001 | TC.POL.001.002 | Filter Status Aktif | Positive | Filter hanya menampilkan poli dengan status aktif | Admin di halaman Kelola Poli | 1. Klik tab "Aktif" | Hanya poli dengan status aktif yang muncul di tabel |
| TS.POL.001 | TC.POL.001.003 | Filter Status Nonaktif | Positive | Filter hanya menampilkan poli dengan status nonaktif | Admin di halaman Kelola Poli | 1. Klik tab "Nonaktif" | Hanya poli dengan status nonaktif yang muncul di tabel |
| TS.POL.001 | TC.POL.001.004 | Navigasi Halaman (Pagination) | Positive | Klik tombol halaman berikutnya | Admin di halaman Kelola Poli (data > 8) | 1. Klik angka "2" atau icon panah kanan | Tabel menampilkan data baris 9-16 |

---

## TS.POL.002: Tambah Poli

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.POL.002 | TC.POL.002.001 | Validasi field wajib | Negative | Submit form dengan nama poli kosong | Modal "Tambah Poli" terbuka | 1. Biarkan field "Nama Poli" kosong 2. Klik "Tambah Poli" | Muncul pesan error "Nama poli wajib diisi" |
| TS.POL.002 | TC.POL.002.002 | Pilih Icon Poli | Positive | Memilih icon ilustrasi yang berbeda | Modal "Tambah Poli" terbuka | 1. Klik salah satu icon di grid | Icon yang dipilih memiliki border primary dan checkmark |
| TS.POL.002 | TC.POL.002.003 | Toggle Status Poli | Positive | Mengubah status poli saat pembuatan | Modal "Tambah Poli" terbuka | 1. Klik "Nonaktif" pada pilihan status | Tombol "Nonaktif" terpilih dengan warna abu-abu |
| TS.POL.002 | TC.POL.002.004 | Submit Poli Valid | Positive | Input data valid dan simpan | Modal "Tambah Poli" terbuka | 1. Isi nama poli 2. Pilih icon 3. Klik "Tambah Poli" | Modal tertutup, poli baru muncul di tabel |

---

## TS.POL.003: Edit Poli

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.POL.003 | TC.POL.003.001 | Buka Modal Edit | Positive | Klik tombol edit pada salah satu baris | Admin di halaman Kelola Poli | 1. Klik icon pensil pada salah satu poli | Modal terbuka dengan data poli tersebut sudah terisi |
| TS.POL.003 | TC.POL.003.002 | Simpan Perubahan | Positive | Mengubah deskripsi dan simpan | Modal "Edit Poli" terbuka | 1. Ubah deskripsi 2. Klik "Simpan Perubahan" | Modal tertutup, deskripsi di tabel (atau data database) terupdate |

---

## TS.POL.004: Hapus Poli

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.POL.004 | TC.POL.004.001 | Batalkan Penghapusan | Positive | Klik batal pada dialog konfirmasi | Admin di halaman Kelola Poli | 1. Klik icon sampah 2. Klik "Batal" | Dialog tertutup, data poli tetap ada di tabel |
| TS.POL.004 | TC.POL.004.002 | Konfirmasi Penghapusan | Positive | Klik hapus pada dialog konfirmasi | Admin di halaman Kelola Poli | 1. Klik icon sampah 2. Klik "Ya, Hapus" | Dialog tertutup, poli terhapus dari tabel |
