# Rencana Implementasi: Expense & Budget Visualizer

## Overview

Implementasi dilakukan secara bertahap menggunakan HTML, CSS, dan Vanilla JavaScript murni. Setiap langkah membangun di atas langkah sebelumnya, dimulai dari struktur dasar hingga fitur lengkap yang terhubung satu sama lain.

Bahasa: **Vanilla JavaScript (ES6+)**
Struktur file: `index.html` (root), `css/style.css`, `js/app.js`

---

## Tasks

- [x] 1. Buat struktur file dan kerangka HTML dasar
  - Buat file `index.html` di root dengan struktur HTML5 yang lengkap
  - Buat folder `css/` dan file `css/style.css`
  - Buat folder `js/` dan file `js/app.js`
  - Di `index.html`, tambahkan elemen-elemen utama: section saldo total (`#total-balance`), form input (`#transaction-form`), daftar transaksi (`#transaction-list`), dan container grafik (`#chart-container`)
  - Tambahkan tag `<script src="https://cdn.jsdelivr.net/npm/chart.js">` untuk Chart.js
  - Tambahkan tag `<link>` untuk menghubungkan `css/style.css`
  - Tambahkan tag `<script src="js/app.js" defer>` di bagian bawah `<body>`
  - _Requirements: 6.2, 6.3_

- [x] 2. Implementasi Model (penyimpanan data LocalStorage)
  - [x] 2.1 Buat fungsi-fungsi Model di `js/app.js`
    - Tulis fungsi `getTransactions()` yang membaca dan mem-parse data dari `localStorage.getItem("ebv_transactions")`
    - Tulis fungsi `saveTransactions(transactions)` yang menyimpan array transaksi ke LocalStorage sebagai JSON
    - Tulis fungsi `addTransaction(transaction)` yang menambahkan satu transaksi ke array dan menyimpannya
    - Tulis fungsi `removeTransaction(id)` yang menghapus transaksi berdasarkan ID dan menyimpan ulang
    - Tulis fungsi `generateId()` yang menghasilkan ID unik menggunakan `Date.now()` + string acak
    - Tambahkan try-catch di `getTransactions()` untuk menangani data LocalStorage yang rusak
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 2.2 Tulis property test untuk round-trip LocalStorage
    - **Property 7: Round-Trip Penyimpanan LocalStorage**
    - Untuk semua array transaksi acak, simpan ke LocalStorage lalu baca kembali, hasilnya harus identik
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
    - Gunakan `fast-check` dengan `fc.array(fc.record({...}))` sebagai generator
    - Tag: `// Feature: expense-budget-visualizer, Property 7`

- [x] 3. Implementasi Validator (validasi input form)
  - [x] 3.1 Buat fungsi Validator di `js/app.js`
    - Tulis fungsi `validateTransaction(name, amount, category)` yang mengembalikan `{ valid: boolean, errors: object }`
    - Validasi `name`: tidak boleh kosong atau hanya spasi
    - Validasi `amount`: harus bisa dikonversi ke angka, harus lebih dari 0
    - Validasi `category`: tidak boleh string kosong
    - Kembalikan objek errors dengan key per field: `{ name: "...", amount: "...", category: "..." }`
    - _Requirements: 1.3, 1.5_

  - [ ]* 3.2 Tulis property test untuk validasi input
    - **Property 2: Validasi Menolak Input Tidak Valid**
    - Untuk semua kombinasi input tidak valid (nama kosong, jumlah negatif/nol/NaN, kategori kosong), Validator harus mengembalikan `valid: false`
    - **Validates: Requirements 1.3, 1.5**
    - Tag: `// Feature: expense-budget-visualizer, Property 2`

- [ ] 4. Checkpoint — Pastikan semua fungsi Model dan Validator bekerja
  - Pastikan semua tests pass, tanyakan kepada user jika ada pertanyaan.

- [x] 5. Implementasi View/Renderer (tampilan UI)
  - [x] 5.1 Buat fungsi `formatCurrency(amount)` di `js/app.js`
    - Gunakan `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })` untuk format Rupiah
    - Fungsi harus mengembalikan string seperti "Rp 35.000"
    - _Requirements: 2.5_

  - [ ]* 5.2 Tulis property test untuk format mata uang
    - **Property 8: Format Mata Uang Konsisten**
    - Untuk semua angka positif acak, hasil `formatCurrency` harus mengandung "Rp" dan menggunakan pemisah ribuan
    - **Validates: Requirements 2.5**
    - Tag: `// Feature: expense-budget-visualizer, Property 8`

  - [x] 5.3 Buat fungsi `renderTransactionList(transactions)` di `js/app.js`
    - Fungsi mengambil elemen `#transaction-list` dari DOM
    - Jika array kosong, tampilkan pesan "Belum ada transaksi. Tambahkan pengeluaran pertamamu!"
    - Jika ada data, render setiap transaksi sebagai `<li>` dengan nama, jumlah (format Rupiah), kategori, dan tombol hapus
    - Setiap tombol hapus harus memiliki `data-id` yang berisi ID transaksi
    - _Requirements: 2.1, 2.4_

  - [x] 5.4 Buat fungsi `renderTotalBalance(transactions)` di `js/app.js`
    - Hitung total dengan `transactions.reduce((sum, t) => sum + t.amount, 0)`
    - Tampilkan hasil di elemen `#total-balance` menggunakan `formatCurrency`
    - _Requirements: 3.1, 3.4_

  - [ ]* 5.5 Tulis property test untuk kalkulasi saldo total
    - **Property 4: Saldo Total Selalu Sama dengan Jumlah Semua Transaksi**
    - Untuk semua array transaksi acak, `calculateTotal(transactions)` harus sama dengan `transactions.reduce((sum, t) => sum + t.amount, 0)`
    - **Validates: Requirements 3.2, 3.3, 3.4**
    - Tag: `// Feature: expense-budget-visualizer, Property 4`

  - [x] 5.6 Buat fungsi `renderChart(transactions)` di `js/app.js`
    - Jika tidak ada transaksi, sembunyikan `#chart-container` dan tampilkan pesan kosong
    - Jika ada transaksi, kelompokkan berdasarkan kategori dan hitung total per kategori
    - Buat atau perbarui instance Chart.js dengan tipe `'doughnut'` atau `'pie'`
    - Tampilkan label kategori dan nilai/persentase di tooltip
    - Simpan referensi chart di variabel global agar bisa diperbarui (bukan dibuat ulang setiap kali)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 5.7 Tulis property test untuk data grafik
    - **Property 6: Data Grafik Mencerminkan Data Transaksi**
    - Untuk semua array transaksi acak, fungsi `groupByCategory(transactions)` harus menghasilkan objek di mana setiap nilai sama dengan jumlah semua transaksi dalam kategori tersebut
    - **Validates: Requirements 4.2, 4.3, 4.4**
    - Tag: `// Feature: expense-budget-visualizer, Property 6`

  - [x] 5.8 Buat fungsi `showFieldError(fieldId, message)` dan `clearErrors()` di `js/app.js`
    - `showFieldError` menambahkan elemen `<span class="error-message">` di bawah field yang ditentukan
    - `clearErrors` menghapus semua elemen `.error-message` dari DOM
    - _Requirements: 1.3, 1.5_

- [x] 6. Implementasi Controller (penanganan event)
  - [x] 6.1 Buat fungsi `handleFormSubmit(event)` di `js/app.js`
    - Panggil `event.preventDefault()` untuk mencegah reload halaman
    - Ambil nilai dari semua field form
    - Panggil `clearErrors()` untuk menghapus error sebelumnya
    - Panggil `validateTransaction(name, amount, category)`
    - Jika tidak valid, panggil `showFieldError` untuk setiap field yang error, lalu return
    - Jika valid, buat objek transaksi baru dengan `generateId()` dan `new Date().toISOString()`
    - Panggil `addTransaction(transaction)` untuk menyimpan
    - Panggil `renderAll()` untuk memperbarui semua tampilan
    - Kosongkan form dengan mereset nilai semua field
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

  - [ ]* 6.2 Tulis property test untuk penambahan transaksi
    - **Property 1: Penambahan Transaksi Menambah Daftar**
    - Untuk semua input transaksi valid acak, setelah `addTransaction`, panjang daftar harus bertambah 1 dan transaksi tersebut harus ada di daftar
    - **Validates: Requirements 1.2, 2.1**
    - Tag: `// Feature: expense-budget-visualizer, Property 1`

  - [ ]* 6.3 Tulis property test untuk form dikosongkan setelah submit
    - **Property 3: Form Dikosongkan Setelah Submit Berhasil**
    - Untuk semua input valid, setelah submit berhasil, semua field form harus kosong/default
    - **Validates: Requirements 1.4**
    - Tag: `// Feature: expense-budget-visualizer, Property 3`

  - [x] 6.4 Buat fungsi `handleDeleteTransaction(id)` di `js/app.js`
    - Panggil `removeTransaction(id)` untuk menghapus dari LocalStorage
    - Panggil `renderAll()` untuk memperbarui semua tampilan
    - _Requirements: 2.3_

  - [ ]* 6.5 Tulis property test untuk penghapusan transaksi
    - **Property 5: Penghapusan Transaksi Menghapus dari Daftar**
    - Untuk semua daftar transaksi yang berisi setidaknya satu item, setelah `removeTransaction(id)`, transaksi dengan ID tersebut tidak boleh ada di daftar dan panjang daftar berkurang 1
    - **Validates: Requirements 2.3**
    - Tag: `// Feature: expense-budget-visualizer, Property 5`

  - [x] 6.6 Buat fungsi `renderAll()` dan `init()` di `js/app.js`
    - `renderAll()` memanggil `getTransactions()` lalu memanggil `renderTransactionList`, `renderTotalBalance`, dan `renderChart` secara berurutan
    - `init()` dipanggil saat `DOMContentLoaded`, menambahkan event listener ke form submit dan daftar transaksi (event delegation untuk tombol hapus), lalu memanggil `renderAll()`
    - _Requirements: 3.2, 3.3, 4.2, 4.3_

- [ ] 7. Checkpoint — Pastikan semua fitur inti berfungsi
  - Pastikan semua tests pass, tanyakan kepada user jika ada pertanyaan.

- [x] 8. Implementasi CSS (tampilan dan responsivitas)
  - Tulis CSS di `css/style.css` dengan pendekatan mobile-first
  - Atur layout utama menggunakan Flexbox atau CSS Grid agar responsif
  - Beri style pada card saldo total agar menonjol di bagian atas
  - Beri style pada form input dengan spacing yang nyaman untuk layar sentuh
  - Beri style pada daftar transaksi dengan `max-height` dan `overflow-y: auto` agar bisa di-scroll
  - Beri style pada tombol hapus dengan warna merah/oranye yang jelas
  - Beri style pada pesan error dengan warna merah dan ukuran font kecil
  - Tambahkan media query untuk tampilan desktop (min-width: 768px)
  - _Requirements: 2.2, 6.4, 7.1, 7.2, 7.3_

- [x] 9. Implementasi fitur opsional: Kategori Kustom
  - [x] 9.1 Tambahkan fungsi `getCategories()` dan `addCategory(name)` ke Model
    - `getCategories()` membaca dari `localStorage.getItem("ebv_categories")` dengan fallback ke `["Food", "Transport", "Fun"]`
    - `addCategory(name)` menambahkan kategori baru ke array dan menyimpan ke LocalStorage dengan try-catch untuk menangani storage penuh
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 9.2 Tambahkan UI untuk input kategori kustom di `index.html` dan `js/app.js`
    - Tambahkan input teks dan tombol "Tambah Kategori" di bawah form utama
    - Buat fungsi `handleAddCategory(name)` di Controller
    - Perbarui `renderCategoryOptions()` agar membaca dari `getCategories()`
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 10. Implementasi fitur opsional: Urutkan Transaksi
  - Tambahkan elemen `<select>` di atas daftar transaksi dengan opsi: "Terbaru", "Jumlah (Terbesar)", "Jumlah (Terkecil)", "Kategori (A-Z)"
  - Buat fungsi `sortTransactions(transactions, sortBy)` yang mengembalikan array terurut baru (tidak mengubah array asli)
  - Perbarui `renderTransactionList` agar menerima parameter `sortBy` dan menerapkan pengurutan sebelum render
  - Tambahkan event listener pada elemen select untuk memanggil `renderTransactionList` ulang
  - _Requirements: 9.1, 9.2_

- [x] 11. Implementasi fitur opsional: Sorot Pengeluaran Berlebih
  - Tambahkan input angka "Batas Pengeluaran" di bagian saldo total
  - Simpan nilai batas di variabel atau LocalStorage
  - Perbarui `renderTotalBalance` agar membandingkan total dengan batas
  - Jika total melebihi batas, tambahkan class CSS `over-limit` pada elemen saldo total yang mengubah warna menjadi merah
  - _Requirements: 10.1, 10.2_

- [ ] 12. Checkpoint akhir — Verifikasi semua fitur dan tests
  - Pastikan semua tests pass, tanyakan kepada user jika ada pertanyaan.

---

## Catatan

- Task yang ditandai `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk keterlacakan
- Checkpoint memastikan validasi bertahap sebelum melanjutkan
- Property tests memvalidasi kebenaran universal, unit tests memvalidasi contoh spesifik
- Untuk menjalankan tests: `npx vitest --run` (satu kali) atau `npx vitest` (watch mode)
