# Test Case - Edit Profile Admin

## Informasi Umum

| | |
|---|---|
| **Feature** | Edit Profile Admin |
| **Kode Fitur** | ADM |
| **Author** | SH-17 Clara|
| **Date** | 2026-06-01 |

---

## Akses Halaman Profil

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.ADM.001 | TC.ADM.001.001 | Akses halaman profil admin | Positive | Berhasil membuka halaman profil admin | User sudah login sebagai admin | 1. Login sebagai admin 2. Buka halaman /admin/settings/profile | Halaman profil admin terbuka, judul Data Profil tampil, dan Email tampil read-only |

---

## Update Informasi Dasar

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.ADM.002 | TC.ADM.002.001 | Update nama dan nomor telepon | Positive | Berhasil mengupdate nama dan nomor telepon | User berada di halaman profil admin | 1. Ubah Nama Lengkap 2. Ubah Nomor Telepon 3. Klik Simpan Perubahan | Nama dan nomor telepon tersimpan dan tampil terupdate |

---

## Foto Profil

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.ADM.003 | TC.ADM.003.001 | Upload foto profil | Positive | Berhasil upload foto profil | User berada di halaman profil admin | 1. Klik Ganti Foto Profil 2. Pilih gambar 3. Klik Simpan Perubahan | Foto profil berhasil diupload dan src img mengandung '/storage/' |
| TS.ADM.003 | TC.ADM.003.002 | Hapus foto profil | Positive | Berhasil hapus foto profil | User memiliki foto profil | 1. Klik Hapus Foto Profil 2. Klik Simpan Perubahan jika perlu | Foto profil terhapus dan img avatar tidak tampil lagi |

---

## Ganti Kata Sandi

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.ADM.004 | TC.ADM.004.001 | Ganti password admin | Positive | Berhasil ganti password | User berada di halaman profil admin | 1. Isi Kata Sandi Baru 2. Isi Konfirmasi Sandi Baru 3. Klik Simpan Perubahan | Password berhasil diubah dan admin dapat login dengan password baru |

---

## Validasi Field dan Email Read-Only

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.ADM.005 | TC.ADM.005.001 | Validasi field yang required | Negative | Validasi Nama dan Nomor Telepon wajib | User berada di halaman profil admin | 1. Hapus Nama Lengkap 2. Hapus Nomor Telepon 3. Klik Simpan Perubahan | Muncul pesan error "Nama lengkap harus diisi." dan "Nomor ponsel harus diisi." |
| TS.ADM.005 | TC.ADM.005.002 | Email read-only | Positive | Email tidak bisa diubah (read-only) | User berada di halaman profil admin | 1. Periksa field Email | Field Email disabled dan tidak bisa diinput |
