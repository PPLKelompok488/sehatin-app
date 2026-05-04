# Test Case - Registrasi Pasien

## Informasi Umum

| | |
|---|---|
| **Feature** | Registrasi Pasien |
| **Kode Fitur** | REG |
| **Author** | SH-1 Vio |
| **Date** | 2025-05-02 |

---

## Step 1: Buat Akun

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.REG.001 | TC.REG.001.001 | Validasi field wajib Step 1 | Negative | Input semua field kosong dan lanjut ke Step 2 | User di halaman Step 1 | 1. Biarkan semua field kosong 2. Klik tombol "Selanjutnya" | Muncul pesan error di semua field wajib |
| TS.REG.001 | TC.REG.001.002 | Validasi format Email | Negative | Input email format salah, field lain valid | User di halaman Step 1 | 1. Isi Email "Usertest" 2. Klik tombol "Selanjutnya" | Muncul pesan error "Format email tidak valid" |
| TS.REG.001 | TC.REG.001.003 | Validasi Kata Sandi | Negative | Input password kurang dari 8 karakter | User di halaman Step 1 | 1. Isi password "12345" 2. Klik tombol "Selanjutnya" | Muncul pesan error "Kata sandi minimal 8 karakter" |
| TS.REG.001 | TC.REG.001.004 | Validasi Konfirmasi Sandi | Negative | Input konfirmasi sandi tidak cocok dengan password | User di halaman Step 1 | 1. Isi password "password123" 2. Isi konfirmasi "password456" 3. Klik tombol "Selanjutnya" | Muncul pesan error "Konfirmasi sandi tidak cocok" |
| TS.REG.001 | TC.REG.001.005 | Fungsi toggle password | Positive | Klik icon mata pada field password | User di halaman Step 1 | 1. Isi password 2. Klik icon mata 3. Klik icon mata kembali | Password tampil saat klik pertama, dan password tersembunyi saat klik kedua |
| TS.REG.001 | TC.REG.001.006 | Navigasi ke halaman Login | Positive | Klik link "Masuk" di halaman registrasi | User di halaman Step 1 | 1. Klik link "Masuk" | User diarahkan ke halaman Login |
| TS.REG.001 | TC.REG.001.007 | Submit Step 1 dengan data valid | Positive | Input semua field valid, klik Selanjutnya | User di halaman Step 1 | 1. Isi semua field dengan data valid 2. Klik tombol "Selanjutnya" | User pindah ke Step 2 |

---

## Step 2: Lengkapi Data Diri

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.REG.002 | TC.REG.002.001 | Validasi field wajib Step 2 | Negative | Input semua field kosong, klik Daftar Sekarang | User di halaman Step 2 | 1. Biarkan semua field kosong 2. Klik "Daftar Sekarang" | Muncul pesan error di semua field wajib |
| TS.REG.002 | TC.REG.002.002 | Validasi NIK | Negative | Input NIK kurang dari 16 digit | User di halaman Step 2 | 1. Isi NIK "1234567890123" 2. Klik "Daftar Sekarang" | Muncul pesan error "NIK harus 16 digit" |
| TS.REG.002 | TC.REG.002.003 | Pilih satu jenis kelamin | Positive | Pilih salah satu opsi jenis kelamin | User di halaman Step 2 | 1. Klik "Laki-laki" atau "Perempuan" | Salah satu jenis kelamin berbasis radio button terpilih dengan border primary |
| TS.REG.002 | TC.REG.002.004 | Fungsi tombol Kembali | Positive | Klik tombol Kembali dari Step 2 ke Step 1 | User di halaman Step 2 | 1. Klik "Kembali" | User kembali ke Step 1 dengan data input sebelumnya yang masih tersimpan |

---

## End-to-End

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.REG.003 | TC.REG.003.001 | Flow registrasi lengkap | Positive | Isi Step 1 dan Step 2 dengan data valid hingga selesai | User di halaman Registrasi | 1. Isi Step 1 2. Klik "Selanjutnya" 3. Isi Step 2 valid 4. Klik "Daftar Sekarang" | User berhasil mendaftar sebagai pasien dan halaman diarahkan ke login |
| TS.REG.003 | TC.REG.003.002 | Penanganan duplikasi email | Negative | Submit registrasi dengan email yang sudah terdaftar | User di halaman Step 2 | 1. Gunakan email yang sudah terdaftar di database | User kembali ke Step 1 dengan error di field email "This Email has already been taken" |