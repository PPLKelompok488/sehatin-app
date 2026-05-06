# Test Case - History Booking Appointment (Pasien)

## Informasi Umum

| | |
|---|---|
| **Feature** | Riwayat & Daftar Kunjungan Pasien |
| **Kode Fitur** | HIS |
| **Author** | SH-8 Qalam |
| **Date** | 2026-05-06 |

---

## Filter & Navigasi Tab

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.HIS.001 | TC.HIS.001.001 | Default View | Positive | Memuat halaman awal | User sudah login sebagai pasien | 1. Buka halaman `/patient/kunjungan` | Halaman dimuat, tab "Aktif" terpilih sebagai default, dan menampilkan daftar kunjungan yang sedang aktif. |
| TS.HIS.001 | TC.HIS.001.002 | Pindah Tab Selesai | Positive | Klik tab "Selesai" | User di halaman kunjungan | 1. Klik tab "Selesai" | Daftar memfilter dan menampilkan riwayat kunjungan dengan status SELESAI. |
| TS.HIS.001 | TC.HIS.001.003 | Pindah Tab Batal | Positive | Klik tab "Batal" | User di halaman kunjungan | 1. Klik tab "Batal" | Daftar memfilter dan menampilkan riwayat kunjungan dengan status DIBATALKAN. |

---

## Filter Tanggal

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.HIS.002 | TC.HIS.002.001 | Filter berdasarkan tanggal | Positive | Pilih tanggal spesifik dari date picker | User di halaman kunjungan | 1. Klik input kalender (date picker) 2. Pilih tanggal yang diinginkan | Daftar memfilter dan hanya menampilkan appointment pada tanggal tersebut sesuai status tab. |
| TS.HIS.002 | TC.HIS.002.002 | Reset filter tanggal | Positive | Klik tombol reset filter | Date picker sudah diisi dengan suatu tanggal | 1. Klik icon reset (filter_alt_off) di sebelah date picker | Input tanggal dikosongkan dan daftar kembali menampilkan semua jadwal tanpa difilter tanggal. |

---

## Interaksi Appointment Card

| Scenario ID | Case ID | Test Scenario | Type | Test Case | Pre Condition | Steps Description | Expected Result |
|---|---|---|---|---|---|---|---|
| TS.HIS.003 | TC.HIS.003.001 | Tombol Detail (Status Aktif/Batal) | Positive | Klik tombol "Detail >" pada kunjungan berstatus Aktif atau Batal | Terdapat minimal 1 data appointment berstatus Aktif/Batal | 1. Klik tombol "Detail" pada card 2. Hitung jumlah tombol "Kembali" di halaman detail | User diarahkan ke halaman detail kunjungan, dan **hanya terdapat persis 1 tombol/link "Kembali"** di halaman tersebut. (Jika ada 2 tombol, test harus fail). |
| TS.HIS.003 | TC.HIS.003.002 | Buka Modal Batal | Positive | Klik tombol "Batalkan kunjungan" | User berada di tab "Aktif" | 1. Klik "Batalkan kunjungan" | Muncul popup/modal untuk konfirmasi pembatalan kunjungan dan input alasan. |
| TS.HIS.003 | TC.HIS.003.003 | Tutup Modal Batal | Positive | Klik tombol "Kembali" atau ikon "X" di modal | Modal pembatalan terbuka | 1. Klik "Kembali" atau ikon silang | Modal tertutup, tidak ada perubahan pada data kunjungan. |
| TS.HIS.003 | TC.HIS.003.004 | Validasi Alasan Batal | Negative | Kosongkan field alasan lalu klik submit | Modal pembatalan terbuka | 1. Biarkan textarea alasan kosong 2. Cek tombol "Konfirmasi Pembatalan" | Tombol "Konfirmasi Pembatalan" dalam keadaan disable (tidak dapat diklik). |
