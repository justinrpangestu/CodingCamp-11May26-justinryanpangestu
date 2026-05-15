# Dokumen Desain: Expense & Budget Visualizer

## Overview

Expense & Budget Visualizer adalah aplikasi web satu halaman (Single Page Application) yang dibangun dengan HTML, CSS, dan Vanilla JavaScript murni. Aplikasi ini memungkinkan pengguna mencatat pengeluaran harian, melihat total saldo, dan memvisualisasikan pengeluaran per kategori melalui grafik pie interaktif.

Semua data disimpan di LocalStorage browser sehingga tidak memerlukan server atau database eksternal. Aplikasi dirancang mobile-first agar nyaman digunakan di smartphone maupun desktop.

---

## Architecture

Aplikasi menggunakan arsitektur **MVC sederhana** (Model-View-Controller) yang diimplementasikan dalam satu file JavaScript:

```
┌─────────────────────────────────────────────────────┐
│                    index.html                        │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  Form Input │  │ Trans. List  │  │  Pie Chart │  │
│  └─────────────┘  └──────────────┘  └────────────┘  │
│                   ┌──────────────┐                   │
│                   │ Total Saldo  │                   │
│                   └──────────────┘                   │
└─────────────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────────────────────────────────────────┐
│                   js/app.js                          │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │  Model   │  │   View   │  │     Controller     │ │
│  │(Storage) │  │(Renderer)│  │  (Event Handlers)  │ │
│  └──────────┘  └──────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│   LocalStorage  │
│  (Browser API)  │
└─────────────────┘
```

**Alur Data:**
1. Pengguna mengisi form → Controller menangkap event submit
2. Controller memanggil Validator untuk validasi input
3. Jika valid, Controller memanggil Model untuk menyimpan ke LocalStorage
4. Controller memanggil View untuk memperbarui tampilan (daftar, saldo, grafik)

---

## Components and Interfaces

### 1. Model (Manajemen Data)

Bertanggung jawab untuk semua operasi baca/tulis ke LocalStorage.

```javascript
// Struktur data satu transaksi
{
  id: string,          // ID unik (timestamp + random)
  name: string,        // Nama item pengeluaran
  amount: number,      // Jumlah dalam angka (misal: 50000)
  category: string,    // Kategori (Food / Transport / Fun / kustom)
  createdAt: string    // Tanggal ISO string
}

// Interface Model
Model = {
  getAll()           → Transaction[]   // Ambil semua transaksi
  add(transaction)   → void            // Tambah transaksi baru
  remove(id)         → void            // Hapus transaksi berdasarkan ID
  getCategories()    → string[]        // Ambil semua kategori (default + kustom)
  addCategory(name)  → void            // Tambah kategori kustom
}
```

### 2. Validator (Validasi Input)

Memeriksa keabsahan data sebelum disimpan.

```javascript
Validator = {
  validateTransaction(name, amount, category) → { valid: boolean, errors: string[] }
  // Aturan:
  // - name: tidak boleh kosong, minimal 1 karakter non-spasi
  // - amount: harus angka positif > 0
  // - category: harus dipilih (tidak boleh kosong)
}
```

### 3. View / Renderer (Tampilan)

Bertanggung jawab merender ulang semua elemen UI.

```javascript
View = {
  renderTransactionList(transactions)  → void  // Render ulang daftar transaksi
  renderTotalBalance(transactions)     → void  // Hitung dan tampilkan saldo total
  renderChart(transactions)            → void  // Perbarui grafik pie Chart.js
  renderCategoryOptions(categories)    → void  // Render opsi kategori di form
  showError(fieldId, message)          → void  // Tampilkan pesan error pada field
  clearErrors()                        → void  // Hapus semua pesan error
  clearForm()                          → void  // Kosongkan semua field form
  formatCurrency(amount)               → string // Format angka ke "Rp X.XXX"
}
```

### 4. Controller (Penanganan Event)

Menghubungkan Model dan View, menangani semua interaksi pengguna.

```javascript
Controller = {
  init()                    → void  // Inisialisasi aplikasi saat halaman dimuat
  handleFormSubmit(event)   → void  // Tangani submit form
  handleDeleteTransaction(id) → void // Tangani hapus transaksi
  handleAddCategory(name)   → void  // Tangani tambah kategori kustom (opsional)
  handleSortChange(sortBy)  → void  // Tangani perubahan urutan (opsional)
}
```

---

## Data Models

### Transaksi (Transaction)

```javascript
{
  "id": "1716800000000_abc123",
  "name": "Makan Siang",
  "amount": 35000,
  "category": "Food",
  "createdAt": "2025-05-27T10:00:00.000Z"
}
```

### Penyimpanan LocalStorage

```javascript
// Key: "ebv_transactions"
// Value: JSON array dari Transaction[]
localStorage.setItem("ebv_transactions", JSON.stringify([...transactions]));

// Key: "ebv_categories" (untuk fitur opsional kategori kustom)
// Value: JSON array dari string[]
localStorage.setItem("ebv_categories", JSON.stringify(["Food", "Transport", "Fun", "Belanja"]));
```

### Format Tampilan Mata Uang

Semua jumlah ditampilkan dalam format Rupiah Indonesia:
- `35000` → `Rp 35.000`
- `1500000` → `Rp 1.500.000`

Menggunakan `Intl.NumberFormat` bawaan browser:
```javascript
function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}
```

---

## Correctness Properties

*A property adalah karakteristik atau perilaku yang harus berlaku benar di semua eksekusi sistem yang valid — pada dasarnya, pernyataan formal tentang apa yang seharusnya dilakukan sistem. Properties berfungsi sebagai jembatan antara spesifikasi yang dapat dibaca manusia dan jaminan kebenaran yang dapat diverifikasi mesin.*

### Property 1: Penambahan Transaksi Menambah Daftar

*Untuk semua* daftar transaksi yang ada dan input transaksi valid (nama non-kosong, jumlah positif, kategori dipilih), menambahkan transaksi baru harus menghasilkan daftar yang panjangnya bertambah satu dan mengandung transaksi tersebut.

**Validates: Requirements 1.2, 2.1**

---

### Property 2: Validasi Menolak Input Tidak Valid

*Untuk semua* kombinasi input di mana setidaknya satu field kosong atau jumlah tidak valid (bukan angka positif), Validator harus menolak input dan tidak mengubah daftar transaksi.

**Validates: Requirements 1.3, 1.5**

---

### Property 3: Form Dikosongkan Setelah Submit Berhasil

*Untuk semua* input transaksi valid, setelah submit berhasil, semua field form (nama, jumlah, kategori) harus kembali ke nilai default/kosong.

**Validates: Requirements 1.4**

---

### Property 4: Saldo Total Selalu Sama dengan Jumlah Semua Transaksi

*Untuk semua* daftar transaksi (termasuk daftar kosong), nilai Saldo_Total yang ditampilkan harus selalu sama dengan hasil penjumlahan semua nilai `amount` dari setiap transaksi dalam daftar.

**Validates: Requirements 3.2, 3.3, 3.4**

---

### Property 5: Penghapusan Transaksi Menghapus dari Daftar

*Untuk semua* daftar transaksi yang berisi setidaknya satu item, menghapus transaksi berdasarkan ID-nya harus menghasilkan daftar yang tidak lagi mengandung transaksi tersebut dan panjangnya berkurang satu.

**Validates: Requirements 2.3**

---

### Property 6: Data Grafik Mencerminkan Data Transaksi

*Untuk semua* daftar transaksi, data yang digunakan Grafik_Pie (total per kategori) harus selalu sama dengan hasil pengelompokan dan penjumlahan transaksi berdasarkan kategori dari daftar yang aktif.

**Validates: Requirements 4.2, 4.3, 4.4**

---

### Property 7: Round-Trip Penyimpanan LocalStorage

*Untuk semua* daftar transaksi, menyimpan daftar ke LocalStorage lalu membacanya kembali harus menghasilkan daftar yang identik (sama jumlah, sama data setiap item).

**Validates: Requirements 5.1, 5.2, 5.3, 5.4**

---

### Property 8: Format Mata Uang Konsisten

*Untuk semua* nilai angka positif, fungsi `formatCurrency` harus menghasilkan string yang mengandung prefix "Rp" dan menggunakan pemisah ribuan yang konsisten.

**Validates: Requirements 2.5**

---

## Error Handling

### Validasi Form

| Kondisi Error | Pesan yang Ditampilkan |
|---|---|
| Nama item kosong | "Nama item harus diisi" |
| Jumlah kosong | "Jumlah harus diisi" |
| Jumlah bukan angka | "Jumlah harus berupa angka" |
| Jumlah negatif atau nol | "Jumlah harus lebih dari 0" |
| Kategori tidak dipilih | "Pilih kategori pengeluaran" |

Pesan error ditampilkan di bawah field yang bermasalah menggunakan elemen `<span class="error-message">`.

### LocalStorage Error

```javascript
// Saat memuat data
try {
  const data = JSON.parse(localStorage.getItem("ebv_transactions") || "[]");
  return data;
} catch (e) {
  // Data rusak - tampilkan pesan dan mulai dengan daftar kosong
  showGlobalError("Data tersimpan tidak dapat dibaca. Memulai dengan daftar baru.");
  localStorage.removeItem("ebv_transactions");
  return [];
}

// Saat menyimpan data (kategori kustom)
try {
  localStorage.setItem("ebv_categories", JSON.stringify(categories));
} catch (e) {
  // Storage penuh
  showError("Tidak dapat menyimpan kategori. Penyimpanan browser penuh.");
}
```

### Kondisi Kosong

- **Daftar transaksi kosong**: Tampilkan pesan "Belum ada transaksi. Tambahkan pengeluaran pertamamu!"
- **Grafik tanpa data**: Sembunyikan elemen canvas grafik dan tampilkan pesan "Tambahkan transaksi untuk melihat grafik"

---

## Testing Strategy

### Pendekatan Pengujian Ganda

Aplikasi ini menggunakan dua pendekatan pengujian yang saling melengkapi:

1. **Unit Tests** — Menguji contoh spesifik, edge case, dan kondisi error
2. **Property-Based Tests** — Menguji properti universal yang berlaku untuk semua input

### Library yang Digunakan

- **Property-Based Testing**: [fast-check](https://fast-check.io/) — library PBT untuk JavaScript
- **Test Runner**: [Vitest](https://vitest.dev/) — test runner modern yang kompatibel dengan Vanilla JS

### Konfigurasi Property Tests

- Minimum **100 iterasi** per property test
- Setiap property test harus mereferensikan property dari dokumen desain ini
- Format tag: `// Feature: expense-budget-visualizer, Property N: <deskripsi>`

### Rencana Pengujian

#### Unit Tests (Contoh Spesifik)

| Test | Deskripsi | Requirements |
|---|---|---|
| Form menampilkan 3 field | Verifikasi form memiliki field nama, jumlah, kategori | 1.1 |
| Pesan kosong saat tidak ada transaksi | Verifikasi pesan muncul saat daftar kosong | 2.4 |
| Saldo total tampil di atas | Verifikasi elemen saldo ada di DOM | 3.1 |
| Grafik tersembunyi saat data kosong | Verifikasi grafik disembunyikan saat tidak ada transaksi | 4.5 |
| Error handling LocalStorage rusak | Verifikasi pesan error dan daftar kosong saat data rusak | 5.5 |

#### Property-Based Tests

| Property | Deskripsi | Iterasi |
|---|---|---|
| Property 1 | Penambahan transaksi menambah daftar | 100+ |
| Property 2 | Validasi menolak input tidak valid | 100+ |
| Property 3 | Form dikosongkan setelah submit | 100+ |
| Property 4 | Saldo total = sum semua transaksi | 100+ |
| Property 5 | Penghapusan menghapus dari daftar | 100+ |
| Property 6 | Data grafik mencerminkan data transaksi | 100+ |
| Property 7 | Round-trip LocalStorage | 100+ |
| Property 8 | Format mata uang konsisten | 100+ |

### Contoh Property Test

```javascript
import fc from 'fast-check';
import { describe, it, expect } from 'vitest';

// Feature: expense-budget-visualizer, Property 4: Saldo total = sum semua transaksi
describe('Property 4: Saldo Total', () => {
  it('selalu sama dengan jumlah semua transaksi', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string(),
            name: fc.string({ minLength: 1 }),
            amount: fc.float({ min: 1, max: 10_000_000 }),
            category: fc.constantFrom('Food', 'Transport', 'Fun'),
          })
        ),
        (transactions) => {
          const expectedTotal = transactions.reduce((sum, t) => sum + t.amount, 0);
          const actualTotal = calculateTotal(transactions);
          expect(actualTotal).toBeCloseTo(expectedTotal, 2);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Struktur File Test

```
tests/
  unit/
    validator.test.js      // Unit tests untuk Validator
    renderer.test.js       // Unit tests untuk View/Renderer
    storage.test.js        // Unit tests untuk Model/LocalStorage
  property/
    transactions.test.js   // Property tests untuk operasi transaksi
    storage.test.js        // Property tests untuk round-trip LocalStorage
    formatting.test.js     // Property tests untuk format mata uang
```
