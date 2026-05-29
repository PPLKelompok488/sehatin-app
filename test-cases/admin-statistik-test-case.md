# Test Case - Admin Statistik Dashboard

## Informasi Umum

| | |
|---|---|
| **Feature** | Admin Statistik |
| **Kode Fitur** | STAT |
| **Author** | QA Team |
| **Date** | 2026-05-05 |

---

## Modul: Dashboard Statistik

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.STAT.001 | TC.STAT.001.001 | Memuat Halaman Dashboard | Positive | Validasi header dan judul halaman | User memiliki akses Admin dan sudah login | 1. Akses halaman `/admin/dashboard` | Halaman berhasil dimuat dengan judul "Laporan & Analitik" serta subjudul yang sesuai |
| TS.STAT.001 | TC.STAT.001.002 | Validasi Kartu Ringkasan (Summary Cards) | Positive | Pastikan 4 metrik utama ditampilkan | User berada di halaman Dashboard Admin | 1. Cek komponen kartu statistik di bagian atas halaman | Muncul 4 kartu: "Total Janji Temu", "Pasien Baru", "Kunjungan Selesai", dan "Batal & Absen" beserta ikon dan persentase indikator pertumbuhan |
| TS.STAT.001 | TC.STAT.001.003 | Validasi Grafik Statistik Kunjungan | Positive | Memeriksa render grafik AreaChart (Recharts) | User berada di halaman Dashboard Admin | 1. Gulir dan lihat bagian "Statistik Kunjungan" | Grafik area dirender dengan benar yang menampilkan tooltip dan legenda "Pasien Baru" & "Pasien Lama" |
| TS.STAT.001 | TC.STAT.001.004 | Validasi Daftar Trafik Poli Favorit | Positive | Memeriksa daftar poli yang paling sering dikunjungi | User berada di halaman Dashboard Admin | 1. Gulir dan lihat bagian "Trafik Poli Favorit" | Menampilkan card "Trafik Poli Favorit" dengan badge "Bulan Ini" beserta daftar poli dengan urutan peringkat, jumlah kunjungan, dan visual bar progress warna-warni |
| TS.STAT.001 | TC.STAT.001.005 | Validasi Daftar Performa Dokter | Positive | Memeriksa daftar dokter dengan performa tertinggi | User berada di halaman Dashboard Admin | 1. Gulir dan lihat bagian "Performa Dokter" | Menampilkan card "Performa Dokter" dengan badge "Tertinggi" beserta daftar dokter lengkap dengan nama, spesialisasi, foto profil (avatar), dan jumlah kunjungan |
