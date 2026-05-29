# Test Case - Manajemen Jadwal Dokter

## Informasi Umum

| | |
|---|---|
| **Feature** | Manajemen Jadwal Dokter |
| **Kode Fitur** | MSC |
| **Author** | SH-6 Vio |
| **Date** | 2025-05-02 |

---

## View Jadwal

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.MSC.001 | TC.MSC.001.001 | Tampilan list jadwal | Positive | Buka halaman saat belum ada jadwal tersimpan | Belum ada jadwal dokter | 1. Buka halaman Manajemen Jadwal | Menampilkan empty state dengan ikon dan pesan "Belum Ada Jadwal" |
| TS.MSC.001 | TC.MSC.001.002 | Tampilan list jadwal | Positive | Buka halaman saat sudah ada jadwal tersimpan | Terdapat jadwal dokter | 1. Buka halaman Manajemen Jadwal | Jadwal dikelompokkan per hari dalam Accordion, menampilkan badge sesi aktif, card berisi waktu, durasi, dan avatar dokter |

---

## Tambah Jadwal

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.MSC.002 | TC.MSC.002.001 | Validasi field wajib kosong | Negative | Submit form dengan semua field kosong | User di halaman Jadwal | 1. Klik tombol "Tambah Jadwal" 2. Biarkan semua field kosong 3. Klik tombol "Simpan" | Muncul error untuk Hari, Waktu Mulai, Waktu Selesai, Durasi, dan Dokter |
| TS.MSC.002 | TC.MSC.002.002 | Validasi minimal dokter | Negative | Submit form tanpa memilih dokter, field lain valid | User di halaman Jadwal | 1. Klik tombol "Tambah Jadwal" 2. Isi Hari, Waktu, Durasi 3. Jangan pilih dokter 4. Klik Simpan | Muncul error "Minimal satu dokter harus dipilih" |
| TS.MSC.002 | TC.MSC.002.003 | Manajemen dokter dalam sesi | Positive | Tambah lalu hapus dokter dari list | User di halaman Jadwal | 1. Klik tombol "Tambah Jadwal" 2. Klik "Tambah Dokter Ke Sesi" 3. Pilih dokter 4. Klik "X" di card dokter | Dokter muncul di list saat dipilih, terhapus saat klik X |
| TS.MSC.002 | TC.MSC.002.004 | Tambah jadwal berhasil | Positive | Isi semua field valid lalu simpan | User di halaman Jadwal | 1. Klik tombol "Tambah Jadwal" 2. Isi semua field valid 3. Klik tombol "Simpan" | Form tertutup, jadwal baru muncul di list |
| TS.MSC.002 | TC.MSC.002.005 | Batal tambah jadwal | Positive | Klik tombol Batal sebelum menyimpan | User di halaman Jadwal | 1. Klik tombol "Tambah Jadwal" 2. Klik tombol "Batal" | Form tertutup tanpa menyimpan data |

---

## Edit Jadwal

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.MSC.003 | TC.MCH.003.001 | Tombol simpan disabled jika tidak ada perubahan | Positive | Buka form edit tanpa mengubah apapun | User di halaman Jadwal | 1. Klik tombol "edit" pada session card jadwal 2. Hapus dan tambahkan kembali salah satu dokter | Tombol "Simpan Perubahan" dalam kondisi disabled |
| TS.MSC.003 | TC.MSC.003.002 | Edit jadwal berhasil | Positive | Ubah data jadwal lalu simpan | User di halaman Jadwal | 1. Klik tombol "edit" pada session card jadwal 2. Ubah Hari, Waktu, atau Dokter 3. Klik tombol "Simpan Perubahan" | Form tertutup, data terupdate di list |
| TS.MSC.003 | TC.MSC.003.003 | Batal edit jadwal | Positive | Klik Batal setelah mengubah data | User di halaman Jadwal | 1. Klik tombol "edit" pada session card jadwal 2. Ubah salah satu field 3. Klik tombol "Batal" | Form tertutup, data tidak berubah |

---

## Hapus Jadwal

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.MSC.004 | TC.MCH.004.001 | Batal hapus jadwal | Positive | Buka dialog hapus lalu batalkan | Form edit session terbuka | 1. Klik "Hapus Sesi" 2. Klik tombol "Batal" | Dialog tertutup, sesi tidak terhapus |
| TS.MSC.004 | TC.MCH.004.002 | Konfirmasi hapus jadwal | Positive | Buka dialog hapus lalu konfirmasi | Form edit session terbuka | 1. Klik "Hapus Sesi" 2. Klik tombol "Hapus" sebagai konfirmasi | Dialog tertutup, sesi terhapus dari list, tombol sempat berubah "Menghapus..." |