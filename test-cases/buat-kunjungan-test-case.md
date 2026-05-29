# Test Case - Buat Kunjungan

## Informasi Umum

| | |
|---|---|
| **Feature** | Buat Kunjungan (Appointment Booking) |
| **Kode Fitur** | APT |
| **Author** | SH-7 Vio |
| **Date** | 2025-05-03 |

---

## Step 1: Pilih Poliklinik

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.APT.001 | TC.APT.001.001 | Tampilan dan seleksi poliklinik | Positive | Buka halaman dan pilih salah satu poliklinik | User login sebagai pasien | 1. Buka halaman Buat Kunjungan 2. Klik card poliklinik | Berada di halaman step 1, menampilkan grid card poliklinik dengan ikon, nama, dan deskripsi |
| TS.APT.001 | TC.APT.001.002 | Navigasi ke Step 2 | Positive | Pilih poliklinik lalu klik Selanjutnya | Berada di halaman step 1 | 1. Pilih poliklinik 2. Klik tombol "Selanjutnya" | Pindah ke halaman step 2 |
| TS.APT.001 | TC.APT.001.003 | Tombol Selanjutnya disabled tanpa pilihan | Negative | Klik Selanjutnya tanpa memilih poliklinik | Berada di halaman step 1 | 1. Jangan pilih poliklinik 2. Klik tombol "Selanjutnya" | Tidak pindah ke step 2 dan tombol "Selanjutnya" disabled |

---

## Step 2: Pilih Dokter & Jadwal

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.APT.002 | TC.APT.002.001 | Tampilan dan seleksi tanggal | Positive | Pilih tanggal yang tersedia di calendar | Berada di halaman step 2 | 1. Periksa calendar picker 2. Klik tanggal yang available | Calendar menampilkan 14 hari ke depan, tanggal terpilih dengan background primary, doctor selection muncul |
| TS.APT.002 | TC.APT.002.002 | Tanggal tidak tersedia | Negative | Periksa tanggal yang tidak ada jadwal dokter | Berada di halaman step 2 | 1. Periksa tanggal unavailable di calendar | Tanggal disabled dan tidak bisa dipilih |
| TS.APT.002 | TC.APT.002.003 | Seleksi dokter dan slot waktu | Positive | Expand accordion dokter lalu pilih slot waktu | Berada di halaman step 2, tanggal sudah dipilih | 1. Klik header accordion dokter 2. Klik slot waktu yang available | Accordion terbuka, slot terpilih dengan background primary |
| TS.APT.002 | TC.APT.002.004 | Slot waktu sudah dibooking | Negative | Periksa slot yang sudah dibooking | Berada di halaman step 2 | 1. Periksa slot waktu yang unavailable | Slot disabled dan tidak bisa dipilih |
| TS.APT.002 | TC.APT.002.005 | Navigasi antar step | Positive | Klik Selanjutnya lalu Kembali dari step 2 | Berada di halaman step 2, dokter dan waktu sudah dipilih | 1. Klik tombol "Selanjutnya" 2. Klik tombol "Kembali" | Pindah ke step 3, kembali ke step 2 dengan data masih terpilih |
| TS.APT.002 | TC.APT.002.006 | Tombol Selanjutnya disabled tanpa pilihan lengkap | Negative | Klik Selanjutnya tanpa lengkapi dokter dan waktu | Berada di halaman step 2 | 1. Jangan pilih dokter atau waktu 2. Klik tombol "Selanjutnya" | Tidak pindah ke step 3 dan tombol "Selanjutnya" disabled |

---

## Step 3: Konfirmasi Kunjungan

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.APT.003 | TC.APT.003.001 | Tampilan summary booking | Positive | Periksa detail ringkasan booking di step 3 | Berada di halaman step 3 | 1. Periksa halaman step 3 | Menampilkan nama pasien, poliklinik, dokter dengan avatar, dan jadwal format "Senin, 1 Januari 2025" |
| TS.APT.003 | TC.APT.003.002 | Konfirmasi booking berhasil | Positive | Klik konfirmasi lalu selesaikan booking | Berada di halaman step 3 | 1. Klik "Konfirmasi Booking" 2. Klik "Ya, Buat" | Tombol berubah "Membuat...", booking tersimpan, pindah ke halaman Kunjungan |
| TS.APT.003 | TC.APT.003.003 | Batal konfirmasi booking | Positive | Buka dialog konfirmasi lalu batalkan | Berada di halaman step 3 | 1. Klik "Konfirmasi Booking" 2. Klik "Batal" | Dialog tertutup, tetap di halaman step 3 |
| TS.APT.003 | TC.APT.003.004 | Navigasi kembali ke step 2 | Positive | Klik Kembali dari step 3 | Berada di halaman step 3 | 1. Klik tombol "Kembali" | Pindah ke halaman step 2 dengan data masih terpilih |

---

## End-to-End

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.APT.004 | TC.APT.004.001 | Flow booking lengkap | Positive | Selesaikan seluruh proses booking dari step 1 hingga konfirmasi | User login sebagai pasien | 1. Buka halaman Buat Kunjungan 2. Pilih poliklinik, klik Selanjutnya 3. Pilih tanggal, dokter, dan waktu, klik Selanjutnya 4. Klik Konfirmasi Booking | Booking berhasil, pindah ke halaman daftar kunjungan |
| TS.APT.004 | TC.APT.004.002 | Data persists dan reset antar step | Positive | Navigasi bolak-balik antar step lalu ganti tanggal | Data sudah dipilih di setiap step | 1. Pilih data di step 1 dan 2 2. Kembali ke step sebelumnya 3. Ganti tanggal di step 2 | Data tetap saat navigasi, dokter dan waktu reset saat tanggal diganti |