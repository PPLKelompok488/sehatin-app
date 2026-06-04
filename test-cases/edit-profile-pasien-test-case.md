# Test Case - Edit Profile Pasien

## Informasi Umum

| | |
|---|---|
| **Feature** | Edit Profile Pasien |
| **Kode Fitur** | PRF |
| **Author** | SH-17 Clara |
| **Date** | 2026-05-31 |

---

## Akses Halaman Profil

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.PRF.001 | TC.PRF.001.001 | Membuka halaman profil pasien | Positive | Berhasil membuka halaman profil pasien | User sudah login sebagai pasien | 1. Login pasien 2. Buka halaman /patient/settings/profile | Halaman profil pasien terbuka dengan judul Data Profil Pasien dan email tampil read-only |

---

## Update Informasi Dasar

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.PRF.002 | TC.PRF.002.001 | Update nama dan nomor telepon | Positive | Berhasil mengupdate nama dan nomor telepon | User berada di halaman profil pasien | 1. Ubah field Nama Lengkap 2. Ubah field Nomor Ponsel 3. Klik Simpan Perubahan | Data berhasil disimpan dan field Nama dan Nomor Ponsel terupdate |
| TS.PRF.002 | TC.PRF.002.002 | Update data pasien lengkap | Positive | Berhasil mengupdate data pasien (tanggal lahir, jenis kelamin, golongan darah, alamat) | User berada di halaman profil pasien | 1. Ubah field Tanggal Lahir 2. Pilih Jenis Kelamin 3. Pilih Golongan Darah 4. Ubah Alamat Lengkap 5. Klik Simpan Perubahan | Data berhasil disimpan dan semua field profil terupdate |

---

## Foto Profil

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.PRF.003 | TC.PRF.003.001 | Upload foto profil | Positive | Berhasil upload foto profil | User berada di halaman profil pasien | 1. Klik Ganti Foto Profil 2. Pilih file gambar 3. Klik Simpan Perubahan | Foto profil berhasil diupload dan tampil di halaman profil |
| TS.PRF.003 | TC.PRF.003.002 | Hapus foto profil | Positive | Berhasil hapus foto profil | User memiliki foto profil | 1. Klik Hapus Foto Profil 2. Konfirmasi jika ada 3. Tunggu pesan sukses | Foto profil terhapus dan avatar kembali ke placeholder |

---

## Ganti Kata Sandi

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.PRF.004 | TC.PRF.004.001 | Ganti password pasien | Positive | Berhasil ganti password | User berada di halaman profil pasien | 1. Isi Kata Sandi Baru 2. Isi Konfirmasi Sandi Baru 3. Klik Simpan Perubahan | Password berhasil diubah dan user dapat login dengan password baru |

---

## Validasi Field dan Email Read-Only

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.PRF.005 | TC.PRF.005.001 | Validasi field yang required | Negative | Validasi field yang required saat disimpan kosong | User berada di halaman profil pasien | 1. Kosongkan semua field wajib 2. Klik Simpan Perubahan | Muncul pesan error validasi untuk Nama, Tanggal Lahir, Jenis Kelamin, Golongan Darah, dan Alamat |
| TS.PRF.005 | TC.PRF.005.002 | Email read-only | Positive | Email tidak bisa diubah (read-only) | User berada di halaman profil pasien | 1. Cek field Email | Field Email tampil disabled dan tidak dapat diubah |
