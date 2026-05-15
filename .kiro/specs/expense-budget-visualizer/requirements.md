# Dokumen Kebutuhan (Requirements)

## Introduction

Expense & Budget Visualizer adalah aplikasi web mobile-friendly yang membantu pengguna melacak pengeluaran harian mereka. Aplikasi ini menampilkan total saldo, riwayat transaksi, dan grafik visual pengeluaran per kategori. Dibangun menggunakan HTML, CSS, dan Vanilla JavaScript murni tanpa framework, dengan data tersimpan di LocalStorage browser.

## Glosarium

- **Aplikasi**: Expense & Budget Visualizer — aplikasi web pelacak pengeluaran
- **Transaksi**: Satu catatan pengeluaran yang terdiri dari nama item, jumlah uang, dan kategori
- **Kategori**: Pengelompokan pengeluaran (Food, Transport, Fun, atau kategori kustom)
- **Saldo_Total**: Jumlah total semua pengeluaran yang tercatat
- **Form_Input**: Formulir untuk memasukkan data transaksi baru
- **Daftar_Transaksi**: Tampilan daftar semua transaksi yang telah dimasukkan
- **Grafik_Pie**: Diagram lingkaran yang menampilkan proporsi pengeluaran per kategori
- **LocalStorage**: Mekanisme penyimpanan data di browser pengguna
- **Validator**: Komponen yang memeriksa keabsahan data masukan
- **Renderer**: Komponen yang menampilkan data ke layar

---

## Requirements

### Requirement 1: Form Input Transaksi

**User Story:** Sebagai pengguna, saya ingin mengisi formulir pengeluaran dengan nama item, jumlah, dan kategori, agar saya dapat mencatat transaksi baru dengan mudah.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL menampilkan Form_Input dengan tiga field: nama item (teks), jumlah (angka), dan kategori (pilihan: Food, Transport, Fun)
2. WHEN pengguna mengisi semua field dan menekan tombol submit, THE Aplikasi SHALL menambahkan transaksi baru ke Daftar_Transaksi
3. WHEN pengguna menekan tombol submit dengan satu atau lebih field kosong, THE Validator SHALL mencegah penambahan transaksi dan menampilkan pesan kesalahan yang menjelaskan field mana yang belum diisi
4. WHEN transaksi berhasil ditambahkan, THE Form_Input SHALL mengosongkan semua field dan siap menerima input berikutnya
5. IF field jumlah diisi dengan nilai bukan angka atau angka negatif, THEN THE Validator SHALL menolak input dan menampilkan pesan kesalahan khusus untuk field jumlah tersebut

---

### Requirement 2: Daftar Transaksi

**User Story:** Sebagai pengguna, saya ingin melihat semua transaksi saya dalam daftar yang dapat di-scroll, agar saya dapat memantau riwayat pengeluaran saya.

#### Kriteria Penerimaan

1. THE Daftar_Transaksi SHALL menampilkan semua transaksi yang tersimpan, masing-masing menampilkan nama item, jumlah uang, dan kategori
2. WHILE terdapat lebih dari satu transaksi, THE Daftar_Transaksi SHALL dapat di-scroll secara vertikal untuk melihat semua item
3. WHEN pengguna menekan tombol hapus pada sebuah transaksi, THE Aplikasi SHALL menghapus transaksi tersebut dari Daftar_Transaksi dan dari LocalStorage
4. WHEN tidak ada transaksi yang sedang ditampilkan, THE Daftar_Transaksi SHALL menampilkan pesan kosong yang informatif kepada pengguna
5. THE Renderer SHALL menampilkan jumlah uang dalam format mata uang yang konsisten (contoh: Rp 50.000)

---

### Requirement 3: Saldo Total

**User Story:** Sebagai pengguna, saya ingin melihat total pengeluaran saya di bagian atas halaman, agar saya dapat langsung mengetahui berapa total yang sudah saya keluarkan.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL menampilkan Saldo_Total di bagian atas halaman yang terlihat jelas
2. WHEN transaksi baru ditambahkan, THE Aplikasi SHALL memperbarui Saldo_Total secara otomatis tanpa perlu me-refresh halaman
3. WHEN sebuah transaksi dihapus, THE Aplikasi SHALL memperbarui Saldo_Total secara otomatis untuk mencerminkan pengurangan jumlah tersebut
4. THE Saldo_Total SHALL dihitung sebagai jumlah dari semua nilai transaksi yang tersimpan di LocalStorage

---

### Requirement 4: Grafik Visual Pengeluaran

**User Story:** Sebagai pengguna, saya ingin melihat grafik pie yang menampilkan proporsi pengeluaran per kategori, agar saya dapat memahami pola pengeluaran saya secara visual.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL menampilkan Grafik_Pie menggunakan library Chart.js yang memvisualisasikan total pengeluaran per kategori
2. WHEN transaksi baru ditambahkan, THE Grafik_Pie SHALL diperbarui secara otomatis untuk mencerminkan data terbaru
3. WHEN sebuah transaksi dihapus, THE Grafik_Pie SHALL diperbarui secara otomatis untuk mencerminkan perubahan data
4. THE Grafik_Pie SHALL menampilkan label kategori dan persentase atau nilai untuk setiap segmen
5. WHEN semua transaksi dihapus sehingga tidak ada data, THE Aplikasi SHALL segera menyembunyikan Grafik_Pie dan menampilkan pesan kosong yang sesuai

---

### Requirement 5: Penyimpanan Data Persisten

**User Story:** Sebagai pengguna, saya ingin data pengeluaran saya tetap tersimpan meskipun browser ditutup dan dibuka kembali, agar saya tidak kehilangan riwayat transaksi saya.

#### Kriteria Penerimaan

1. WHEN transaksi baru ditambahkan, THE Aplikasi SHALL menyimpan data transaksi ke LocalStorage secara langsung
2. WHEN sebuah transaksi dihapus, THE Aplikasi SHALL menghapus data transaksi tersebut dari LocalStorage secara langsung
3. WHEN halaman dimuat ulang atau browser dibuka kembali, THE Aplikasi SHALL memuat semua transaksi yang tersimpan dari LocalStorage dan menampilkannya di Daftar_Transaksi
4. THE Aplikasi SHALL menyimpan data transaksi dalam format JSON yang valid di LocalStorage
5. IF data di LocalStorage rusak atau tidak dapat diakses, THEN THE Aplikasi SHALL menampilkan pesan kesalahan kepada pengguna dan melanjutkan dengan daftar transaksi kosong

---

### Requirement 6: Kompatibilitas dan Performa

**User Story:** Sebagai pengguna, saya ingin aplikasi berjalan dengan lancar di berbagai browser modern, agar saya dapat menggunakannya di perangkat apa pun.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL berjalan dengan benar di browser Chrome, Firefox, Edge, dan Safari versi terbaru
2. THE Aplikasi SHALL menggunakan hanya HTML, CSS, dan Vanilla JavaScript tanpa framework atau library tambahan selain Chart.js, dan penggunaan framework lain secara tegas dilarang
3. THE Aplikasi SHALL memiliki struktur file: satu file `index.html` di root, satu file CSS di folder `css/`, dan satu file JavaScript di folder `js/`
4. WHEN pengguna mengakses aplikasi dari perangkat mobile, THE Aplikasi SHALL menampilkan antarmuka yang responsif dan mudah digunakan

---

### Requirement 7: Antarmuka Pengguna yang Bersih

**User Story:** Sebagai pengguna, saya ingin antarmuka yang bersih dan mudah dipahami, agar saya dapat menggunakan aplikasi tanpa kebingungan.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL menampilkan hierarki visual yang jelas dengan Saldo_Total di bagian paling atas, diikuti Form_Input, Daftar_Transaksi, dan Grafik_Pie
2. THE Aplikasi SHALL menggunakan tipografi yang mudah dibaca dengan ukuran font yang sesuai untuk perangkat mobile dan desktop
3. THE Aplikasi SHALL memberikan umpan balik visual yang jelas ketika pengguna berinteraksi dengan elemen (tombol, form, dll.)

---

### Requirement 8 (Opsional): Kategori Kustom

**User Story:** Sebagai pengguna, saya ingin menambahkan kategori pengeluaran sendiri, agar saya dapat menyesuaikan pelacakan pengeluaran dengan kebutuhan saya.

#### Kriteria Penerimaan

1. WHERE fitur kategori kustom diaktifkan, THE Aplikasi SHALL menyediakan opsi bagi pengguna untuk menambahkan nama kategori baru
2. WHERE fitur kategori kustom diaktifkan, WHEN pengguna menambahkan kategori baru, THE Aplikasi SHALL menyimpan kategori tersebut ke LocalStorage dan menampilkannya sebagai pilihan di Form_Input
3. WHERE fitur kategori kustom diaktifkan, IF penyimpanan ke LocalStorage gagal karena batas kapasitas atau pembatasan browser, THEN THE Aplikasi SHALL mencegah penambahan kategori dan menampilkan pesan kesalahan kepada pengguna
4. WHERE fitur kategori kustom diaktifkan, THE Grafik_Pie SHALL menampilkan kategori kustom bersama kategori default

---

### Requirement 9 (Opsional): Urutkan Transaksi

**User Story:** Sebagai pengguna, saya ingin mengurutkan daftar transaksi berdasarkan jumlah atau kategori, agar saya dapat menganalisis pengeluaran dengan lebih mudah.

#### Kriteria Penerimaan

1. WHERE fitur pengurutan diaktifkan, THE Aplikasi SHALL selalu menampilkan kontrol pengurutan yang terlihat untuk mengurutkan Daftar_Transaksi berdasarkan jumlah (naik/turun) atau berdasarkan kategori (A-Z)
2. WHERE fitur pengurutan diaktifkan, WHEN pengguna memilih opsi urutan, THE Daftar_Transaksi SHALL diperbarui secara langsung sesuai urutan yang dipilih

---

### Requirement 10 (Opsional): Sorot Pengeluaran Berlebih

**User Story:** Sebagai pengguna, saya ingin mendapatkan peringatan visual ketika pengeluaran saya melebihi batas yang saya tetapkan, agar saya dapat mengontrol anggaran saya.

#### Kriteria Penerimaan

1. WHERE fitur batas pengeluaran diaktifkan, THE Aplikasi SHALL menyediakan field untuk pengguna menetapkan batas pengeluaran total
2. WHERE fitur batas pengeluaran diaktifkan, WHEN Saldo_Total melebihi batas yang ditetapkan, THE Aplikasi SHALL menampilkan indikator visual yang mencolok (misalnya warna merah atau peringatan teks)
