# Test Case - Login Pasien

## Informasi Umum

| | |
|---|---|
| **Feature** | Login Pasien |
| **Kode Fitur** | LGN |
| **Author** | SH-1 Vio |
| **Date** | 2026-05-06 |

---

## Form Login

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.LGN.001 | TC.LGN.001.001 | Validasi field wajib | Negative | Input semua field kosong dan klik Masuk | User di halaman Login | 1. Biarkan semua field kosong 2. Klik tombol "Masuk" | Muncul pesan error di field Email dan Kata Sandi |
| TS.LGN.001 | TC.LGN.001.002 | Validasi format Email | Negative | Input email format salah, password valid | User di halaman Login | 1. Isi Email "usertest" 2. Isi Kata Sandi "password123" 3. Klik tombol "Masuk" | Muncul pesan error format email tidak valid |
| TS.LGN.001 | TC.LGN.001.003 | Validasi Email kosong | Negative | Input hanya password, email dikosongkan | User di halaman Login | 1. Biarkan field Email kosong 2. Isi Kata Sandi "password123" 3. Klik tombol "Masuk" | Muncul pesan error pada field Email |
| TS.LGN.001 | TC.LGN.001.004 | Validasi Password kosong | Negative | Input hanya email, password dikosongkan | User di halaman Login | 1. Isi Email "test@example.com" 2. Biarkan field Kata Sandi kosong 3. Klik tombol "Masuk" | Muncul pesan error pada field Kata Sandi |
| TS.LGN.001 | TC.LGN.001.005 | Kredensial salah | Negative | Input email terdaftar dengan password yang salah | User di halaman Login | 1. Isi Email akun terdaftar 2. Isi Kata Sandi yang salah 3. Klik tombol "Masuk" | Muncul pesan error kredensial tidak cocok |
| TS.LGN.001 | TC.LGN.001.006 | Email tidak terdaftar | Negative | Input email yang tidak ada di database | User di halaman Login | 1. Isi Email "tidakada@example.com" 2. Isi Kata Sandi "password123" 3. Klik tombol "Masuk" | Muncul pesan error kredensial tidak cocok |
| TS.LGN.001 | TC.LGN.001.007 | Fungsi toggle password | Positive | Klik icon mata pada field Kata Sandi | User di halaman Login | 1. Isi Kata Sandi 2. Klik icon mata 3. Klik icon mata kembali | Password tampil saat klik pertama, dan password tersembunyi saat klik kedua |
| TS.LGN.001 | TC.LGN.001.008 | Fungsi checkbox Ingat Saya | Positive | Klik checkbox "Ingat saya di perangkat ini" | User di halaman Login | 1. Klik checkbox "Ingat saya di perangkat ini" 2. Klik kembali | Checkbox tercentang saat klik pertama, dan tidak tercentang saat klik kedua |
| TS.LGN.001 | TC.LGN.001.009 | Navigasi ke halaman Registrasi | Positive | Klik link "Daftar" di halaman Login | User di halaman Login | 1. Klik link "Daftar" | User diarahkan ke halaman Registrasi |

---

## Login Berhasil & Redirect

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.LGN.002 | TC.LGN.002.001 | Login berhasil sebagai Pasien | Positive | Login dengan akun role pasien yang valid | User di halaman Login, akun pasien tersedia di database | 1. Isi Email akun pasien 2. Isi Kata Sandi yang benar 3. Klik tombol "Masuk" | User berhasil login dan diarahkan ke halaman kunjungan pasien (/patient/kunjungan) |
| TS.LGN.002 | TC.LGN.002.002 | Login berhasil sebagai Dokter | Positive | Login dengan akun role dokter yang valid | User di halaman Login, akun dokter tersedia di database | 1. Isi Email akun dokter 2. Isi Kata Sandi yang benar 3. Klik tombol "Masuk" | User berhasil login dan diarahkan ke halaman jadwal dokter (/doctor/schedule) |
| TS.LGN.002 | TC.LGN.002.003 | Login berhasil sebagai Admin | Positive | Login dengan akun role admin yang valid | User di halaman Login, akun admin tersedia di database | 1. Isi Email akun admin 2. Isi Kata Sandi yang benar 3. Klik tombol "Masuk" | User berhasil login dan diarahkan ke halaman dashboard admin (/admin/dashboard) |

---

## End-to-End

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.LGN.003 | TC.LGN.003.001 | Flow login lengkap sebagai pasien | Positive | Isi email dan password pasien yang valid dan submit | User di halaman Login, akun pasien tersedia | 1. Isi Email dan Kata Sandi pasien valid 2. Klik "Masuk" | User berhasil login dan halaman diarahkan ke /patient/kunjungan |
| TS.LGN.003 | TC.LGN.003.002 | Akses halaman login saat sudah login | Positive | User yang sudah login mencoba mengakses /login | User sudah login sebagai pasien | 1. Login terlebih dahulu 2. Navigasi manual ke /login | User diarahkan kembali ke dashboard sesuai role, tidak dapat mengakses halaman login |
