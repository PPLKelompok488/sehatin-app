# Test Case - Jadwal Kunjungan Dokter

## Informasi Umum

| | |
|---|---|
| **Feature** | Jadwal Kunjungan Dokter |
| **Kode Fitur** | SCH |
| **Author** | SH-10 Clara |
| **Date** | 2026-05-05 |

---

## View Jadwal

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.SCH.001 | TC.SCH.001.001 | Validasi halaman jadwal | Positive | Buka halaman Jadwal Kunjungan | User sudah login sebagai doktor | 1. Akses halaman /doctor/schedule | Halaman memuat judul "Jadwal Kunjungan" |
| TS.SCH.001 | TC.SCH.001.002 | Validasi kartu statistik | Positive | Verifikasi kartu statistik di halaman jadwal | User sudah login sebagai doktor | 1. Akses halaman /doctor/schedule | Menampilkan kartu "Total Pasien", "Pasien Selanjutnya", dan "Pasien Hari Ini" |
| TS.SCH.001 | TC.SCH.001.003 | Validasi header kalender mingguan | Positive | Periksa header kalender 7 hari | User sudah login sebagai doktor | 1. Akses halaman /doctor/schedule | Menampilkan 7 kolom hari dengan singkatan hari kerja |

---

## Navigasi Minggu

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.SCH.002 | TC.SCH.002.001 | Navigasi minggu berikutnya | Positive | Klik tombol next week | User di halaman Jadwal Kunjungan | 1. Klik tombol panah kanan | URL berubah dan jadwal menampilkan minggu berikutnya |
| TS.SCH.002 | TC.SCH.002.002 | Navigasi minggu sebelumnya | Positive | Klik tombol previous week | User di halaman Jadwal Kunjungan | 1. Klik tombol panah kiri | URL berubah dan jadwal kembali ke minggu sebelumnya |

---

## Kartu Pasien dan Slot

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.SCH.003 | TC.SCH.003.001 | Navigasi kartu pasien selanjutnya | Positive | Verifikasi link pasien selanjutnya saat ada data | User di halaman Jadwal Kunjungan | 1. Akses halaman /doctor/schedule | Jika ada pasien selanjutnya, kartu berisi link menuju medical record |
| TS.SCH.003 | TC.SCH.003.002 | Empty state pasien selanjutnya | Positive | Verifikasi tampilan jika tidak ada pasien selanjutnya | User di halaman Jadwal Kunjungan | 1. Akses halaman /doctor/schedule | Jika tidak ada pasien selanjutnya, menampilkan teks "Tidak ada" |
| TS.SCH.003 | TC.SCH.003.003 | Verifikasi slot appointment | Positive | Periksa tampilan appointment slot di grid | User di halaman Jadwal Kunjungan | 1. Akses halaman /doctor/schedule | Jika ada appointment, kartu appointment muncul di slot waktu yang sesuai |
