# Test Case - Pembatalan Janji Temu

## Informasi Umum

| | |
|---|---|
| **Feature** | Pembatalan Janji Temu |
| **Kode Fitur** | APT |
| **Author** | Antigravity |
| **Date** | 2026-05-05 |

---

## TS.APT.001: Filter & View Kunjungan

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.APT.001 | TC.APT.001.001 | Filter Kunjungan Aktif | Positive | Menampilkan kunjungan dengan status booked | User di halaman Kunjungan Anda | 1. Klik tab "Aktif" | Hanya kunjungan dengan status "AKTIF" yang muncul |
| TS.APT.001 | TC.APT.001.002 | Filter Kunjungan Selesai | Positive | Menampilkan kunjungan dengan status completed | User di halaman Kunjungan Anda | 1. Klik tab "Selesai" | Hanya kunjungan dengan status "SELESAI" yang muncul |
| TS.APT.001 | TC.APT.001.003 | Filter Kunjungan Batal | Positive | Menampilkan kunjungan dengan status cancelled | User di halaman Kunjungan Anda | 1. Klik tab "Batal" | Hanya kunjungan dengan status "DIBATALKAN" yang muncul |

---

## TS.APT.002: Pembatalan Janji Temu

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.APT.002 | TC.APT.002.001 | Buka Modal Pembatalan | Positive | Klik tombol batalkan kunjungan | User di halaman Kunjungan (Tab Aktif) | 1. Klik tombol "Batalkan kunjungan" pada salah satu jadwal | Modal "Batalkan Kunjungan" terbuka |
| TS.APT.002 | TC.APT.002.002 | Validasi Alasan Kosong | Negative | Mencoba konfirmasi tanpa isi alasan | Modal "Batalkan Kunjungan" terbuka | 1. Kosongkan field "Alasan Pembatalan" | Tombol "Konfirmasi Pembatalan" dalam keadaan disabled |
| TS.APT.002 | TC.APT.002.003 | Batalkan Pembatalan (Kembali) | Positive | Klik tombol kembali pada modal | Modal "Batalkan Kunjungan" terbuka | 1. Klik tombol "Kembali" | Modal tertutup, status kunjungan tidak berubah |
| TS.APT.002 | TC.APT.002.004 | Konfirmasi Pembatalan Valid | Positive | Isi alasan dan konfirmasi pembatalan | Modal "Batalkan Kunjungan" terbuka | 1. Isi "Alasan Pembatalan" 2. Klik "Konfirmasi Pembatalan" | Modal tertutup, kunjungan pindah ke tab "Batal" dengan status "DIBATALKAN" |
