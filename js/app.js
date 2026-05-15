/**
 * app.js — Expense & Budget Visualizer
 *
 * Arsitektur: MVC sederhana (Model - Validator - View - Controller)
 * Semua logika aplikasi ada di file ini.
 *
 * Alur data:
 * 1. Pengguna isi form → Controller tangkap event submit
 * 2. Controller panggil Validator untuk cek input
 * 3. Jika valid → Model simpan ke LocalStorage
 * 4. Controller panggil View untuk perbarui tampilan
 */

'use strict';

// ============================================================
// KONSTANTA
// ============================================================

/** Key yang digunakan untuk menyimpan data di LocalStorage */
const STORAGE_KEY_TRANSACTIONS = 'ebv_transactions';
const STORAGE_KEY_CATEGORIES   = 'ebv_categories';
const STORAGE_KEY_LIMIT        = 'ebv_limit';

/** Kategori default yang selalu tersedia */
const DEFAULT_CATEGORIES = ['Food', 'Transport', 'Fun'];

// ============================================================
// MODEL — Manajemen Data (LocalStorage)
// ============================================================
// Bertanggung jawab untuk semua operasi baca/tulis ke LocalStorage.
// Tidak ada logika tampilan di sini.

/**
 * Mengambil semua transaksi dari LocalStorage.
 * @returns {Array} Array objek transaksi, atau array kosong jika tidak ada data.
 */
function getTransactions() {
  try {
    // Baca data mentah dari LocalStorage menggunakan key yang sudah didefinisikan
    const raw = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);

    // Jika tidak ada data sama sekali, kembalikan array kosong
    if (raw === null) return [];

    // Parse JSON dan kembalikan hasilnya
    return JSON.parse(raw);
  } catch (error) {
    // Jika data rusak/tidak valid, hapus data yang bermasalah agar tidak mengganggu
    console.error('Data LocalStorage rusak, menghapus data lama:', error);
    localStorage.removeItem(STORAGE_KEY_TRANSACTIONS);
    return [];
  }
}

/**
 * Menyimpan array transaksi ke LocalStorage.
 * @param {Array} transactions - Array transaksi yang akan disimpan.
 */
function saveTransactions(transactions) {
  // Ubah array menjadi string JSON lalu simpan ke LocalStorage
  localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
}

/**
 * Menambahkan satu transaksi baru ke daftar dan menyimpannya.
 * @param {Object} transaction - Objek transaksi baru.
 */
function addTransaction(transaction) {
  // Ambil daftar transaksi yang sudah ada dari LocalStorage
  const transactions = getTransactions();

  // Tambahkan transaksi baru ke akhir array
  transactions.push(transaction);

  // Simpan kembali array yang sudah diperbarui ke LocalStorage
  saveTransactions(transactions);
}

/**
 * Menghapus transaksi berdasarkan ID dan menyimpan ulang daftar.
 * @param {string} id - ID transaksi yang akan dihapus.
 */
function removeTransaction(id) {
  // Ambil daftar saat ini, lalu filter keluar transaksi dengan ID yang cocok
  const transactions = getTransactions().filter(t => t.id !== id);

  // Simpan kembali array yang sudah difilter ke LocalStorage
  saveTransactions(transactions);
}

/**
 * Menghasilkan ID unik untuk setiap transaksi baru.
 * @returns {string} ID unik berupa kombinasi timestamp dan string acak.
 */
function generateId() {
  // Gabungkan timestamp saat ini dengan string acak berbasis base-36 untuk keunikan
  return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Mengambil semua kategori (default + kustom) dari LocalStorage.
 * @returns {Array} Array string nama kategori.
 */
function getCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (raw === null) return [...DEFAULT_CATEGORIES];
    const saved = JSON.parse(raw);
    // Gabungkan kategori default dengan kategori kustom, hindari duplikat
    return [...new Set([...DEFAULT_CATEGORIES, ...saved])];
  } catch (error) {
    console.error('Data kategori rusak, menggunakan kategori default:', error);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    return [...DEFAULT_CATEGORIES];
  }
}

/**
 * Menambahkan kategori kustom baru ke LocalStorage.
 * @param {string} name - Nama kategori baru.
 */
function addCategory(name) {
  try {
    // Ambil kategori kustom yang sudah ada (hanya yang kustom, bukan default)
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    const customCategories = raw ? JSON.parse(raw) : [];
    
    // Cek apakah kategori sudah ada (case-insensitive)
    const allCategories = getCategories();
    const alreadyExists = allCategories.some(
      cat => cat.toLowerCase() === name.trim().toLowerCase()
    );
    
    if (alreadyExists) {
      return { success: false, message: 'Kategori ini sudah ada' };
    }
    
    // Tambahkan kategori baru ke array kustom
    customCategories.push(name.trim());
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(customCategories));
    return { success: true };
  } catch (error) {
    console.error('Gagal menyimpan kategori:', error);
    return { success: false, message: 'Tidak dapat menyimpan kategori. Penyimpanan browser penuh.' };
  }
}

// ============================================================
// VALIDATOR — Validasi Input Form
// ============================================================
// Memeriksa keabsahan data sebelum disimpan ke Model.
// Mengembalikan objek { valid, errors } agar View bisa menampilkan pesan.

/**
 * Memvalidasi input form transaksi.
 * @param {string} name     - Nama item pengeluaran.
 * @param {string} amount   - Jumlah pengeluaran (masih string dari input).
 * @param {string} category - Kategori yang dipilih.
 * @returns {{ valid: boolean, errors: { name?: string, amount?: string, category?: string } }}
 */
function validateTransaction(name, amount, category) {
  // Inisialisasi objek errors dengan string kosong untuk setiap field
  // String kosong berarti tidak ada error pada field tersebut
  const errors = {
    name: '',
    amount: '',
    category: ''
  };

  // --- Validasi field 'name' ---
  // Gunakan .trim() untuk menghapus spasi di awal dan akhir,
  // lalu cek apakah hasilnya string kosong
  if (!name || name.trim() === '') {
    errors.name = 'Nama item harus diisi';
  }

  // --- Validasi field 'amount' ---
  // Input dari HTML selalu berupa string, jadi perlu dicek dulu sebelum dikonversi
  if (amount === '' || amount === null || amount === undefined) {
    // Kasus: field jumlah tidak diisi sama sekali
    errors.amount = 'Jumlah harus diisi';
  } else {
    // Konversi string ke angka menggunakan parseFloat
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount)) {
      // Kasus: nilai yang dimasukkan bukan angka yang valid (misal: "abc")
      errors.amount = 'Jumlah harus berupa angka';
    } else if (numericAmount <= 0) {
      // Kasus: angka valid tapi nol atau negatif
      errors.amount = 'Jumlah harus lebih dari 0';
    }
  }

  // --- Validasi field 'category' ---
  // Cek apakah kategori sudah dipilih (tidak boleh string kosong)
  if (!category || category === '') {
    errors.category = 'Pilih kategori pengeluaran';
  }

  // Tentukan apakah semua field valid:
  // valid = true hanya jika SEMUA pesan error masih berupa string kosong
  const valid = errors.name === '' && errors.amount === '' && errors.category === '';

  // Kembalikan objek dengan status valid dan detail errors per field
  return { valid, errors };
}

// ============================================================
// VIEW / RENDERER — Tampilan UI
// ============================================================
// Bertanggung jawab merender ulang elemen-elemen di halaman.
// Tidak ada logika bisnis di sini — hanya membaca data dan menampilkannya.

/** Menyimpan instance Chart.js yang sedang aktif agar bisa dihancurkan sebelum dibuat ulang */
let expenseChart = null;

/** Menyimpan pilihan urutan transaksi yang sedang aktif */
let currentSortBy = 'newest';

/**
 * Memformat angka menjadi string mata uang Rupiah.
 * Contoh: 35000 → "Rp 35.000"
 * @param {number} amount - Jumlah dalam angka.
 * @returns {string} String mata uang yang sudah diformat.
 */
function formatCurrency(amount) {
  // Buat formatter mata uang Rupiah Indonesia menggunakan Intl.NumberFormat
  // locale 'id-ID' → pemisah ribuan menggunakan titik (.), tanpa desimal
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Merender ulang daftar transaksi di elemen #transaction-list.
 * @param {Array} transactions - Array transaksi yang akan ditampilkan.
 */
function renderTransactionList(transactions) {
  // Ambil elemen daftar transaksi dari DOM
  const list = document.getElementById('transaction-list');

  // Terapkan pengurutan sebelum merender — gunakan currentSortBy yang aktif
  const sorted = sortTransactions(transactions, currentSortBy);

  // Jika tidak ada transaksi, tampilkan pesan kosong yang informatif
  if (transactions.length === 0) {
    list.innerHTML = '<li class="empty-message">Belum ada transaksi. Tambahkan pengeluaran pertamamu!</li>';
    return;
  }

  // Bangun string HTML untuk setiap transaksi dalam array (gunakan sorted, bukan transactions)
  const html = sorted.map(t => `
    <li class="transaction-item">
      <div class="transaction-info">
        <span class="transaction-name">${t.name}</span>
        <span class="transaction-meta">${t.category}</span>
      </div>
      <span class="transaction-amount">${formatCurrency(t.amount)}</span>
      <button class="btn-delete" data-id="${t.id}">Hapus</button>
    </li>
  `).join('');

  // Masukkan HTML yang sudah dibangun ke dalam elemen daftar
  list.innerHTML = html;
}

/**
 * Menghitung dan menampilkan saldo total di elemen #total-balance.
 * @param {Array} transactions - Array transaksi untuk dihitung totalnya.
 */
function renderTotalBalance(transactions) {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const balanceEl = document.querySelector('#total-balance .balance-amount');
  balanceEl.textContent = formatCurrency(total);

  // Cek batas pengeluaran — ubah warna saldo jika melebihi batas
  const limitInput = document.getElementById('budget-limit');
  const limit = limitInput ? parseFloat(limitInput.value) : NaN;
  const section = document.getElementById('total-balance');
  if (!isNaN(limit) && limit > 0 && total > limit) {
    section.classList.add('over-limit');
  } else {
    section.classList.remove('over-limit');
  }
}

/**
 * Memperbarui grafik pie Chart.js berdasarkan data transaksi.
 * @param {Array} transactions - Array transaksi untuk divisualisasikan.
 */
function renderChart(transactions) {
  // Ambil elemen-elemen yang diperlukan dari DOM
  const chartContainer = document.getElementById('chart-container');
  const canvas = document.getElementById('expense-chart');
  const emptyMessage = document.getElementById('empty-chart-message');

  // Jika tidak ada transaksi, sembunyikan canvas dan tampilkan pesan kosong
  if (transactions.length === 0) {
    canvas.style.display = 'none';
    emptyMessage.style.display = 'block';
    return;
  }

  // Ada transaksi — tampilkan canvas dan sembunyikan pesan kosong
  canvas.style.display = 'block';
  emptyMessage.style.display = 'none';

  // Kelompokkan transaksi berdasarkan kategori untuk mendapatkan data grafik
  const grouped = groupByCategory(transactions);
  const labels = Object.keys(grouped);
  const data = Object.values(grouped);

  // Peta warna untuk setiap kategori
  const colorMap = {
    Food: '#22c55e',       // hijau
    Transport: '#3b82f6',  // biru
    Fun: '#f97316',        // oranye
  };

  // Tentukan warna latar belakang untuk setiap label kategori
  const backgroundColors = labels.map(label => colorMap[label] || '#8b5cf6');

  // Hancurkan instance Chart.js lama jika sudah ada, agar canvas bisa dipakai ulang
  if (expenseChart !== null) {
    expenseChart.destroy();
  }

  // Buat instance Chart.js baru dengan tipe pie
  expenseChart = new Chart(canvas, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColors,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        }
      }
    }
  });
}

/**
 * Mengurutkan array transaksi berdasarkan kriteria yang dipilih.
 * Fungsi ini TIDAK mengubah array asli — mengembalikan salinan yang sudah diurutkan.
 * @param {Array} transactions - Array transaksi yang akan diurutkan.
 * @param {string} sortBy - Kriteria pengurutan: 'newest'|'amount-desc'|'amount-asc'|'category-az'
 * @returns {Array} Salinan array yang sudah diurutkan.
 */
function sortTransactions(transactions, sortBy) {
  // Buat salinan array agar data asli di LocalStorage tidak berubah
  const sorted = [...transactions];

  switch (sortBy) {
    case 'amount-desc':
      // Urutkan dari jumlah terbesar ke terkecil
      sorted.sort((a, b) => b.amount - a.amount);
      break;

    case 'amount-asc':
      // Urutkan dari jumlah terkecil ke terbesar
      sorted.sort((a, b) => a.amount - b.amount);
      break;

    case 'category-az':
      // Urutkan berdasarkan nama kategori A-Z (case-insensitive)
      sorted.sort((a, b) => a.category.localeCompare(b.category, 'id'));
      break;

    case 'newest':
    default:
      // Urutkan dari yang terbaru (berdasarkan createdAt, terbaru di atas)
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }

  return sorted;
}

/**
 * Mengelompokkan transaksi berdasarkan kategori dan menjumlahkan amount-nya.
 * Contoh: [{ category: 'Food', amount: 10000 }, { category: 'Food', amount: 5000 }]
 *         → { Food: 15000 }
 * @param {Array} transactions - Array transaksi.
 * @returns {Object} Objek dengan key kategori dan value total amount.
 */
function groupByCategory(transactions) {
  // Gunakan reduce untuk mengelompokkan transaksi berdasarkan kategori
  // dan menjumlahkan amount-nya menjadi satu objek { kategori: totalAmount }
  return transactions.reduce((acc, t) => {
    // Jika kategori belum ada di accumulator, inisialisasi dengan 0
    if (!acc[t.category]) {
      acc[t.category] = 0;
    }
    // Tambahkan amount transaksi ke total kategori yang sesuai
    acc[t.category] += t.amount;
    return acc;
  }, {});
}

/**
 * Menampilkan pesan error di bawah field tertentu.
 * @param {string} fieldId  - ID field yang error (misal: 'name', 'amount').
 * @param {string} message  - Pesan error yang akan ditampilkan.
 */
function showFieldError(fieldId, message) {
  // Temukan elemen error yang sesuai dengan field menggunakan id "error-{fieldId}"
  // lalu isi teksnya dengan pesan error yang diberikan
  document.getElementById('error-' + fieldId).textContent = message;
}

/**
 * Menghapus semua pesan error dari form.
 */
function clearErrors() {
  // Pilih semua elemen dengan class .error-message menggunakan querySelectorAll
  // lalu kosongkan teks setiap elemen agar pesan error sebelumnya hilang
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
  });
}

/**
 * Mengosongkan semua field form setelah submit berhasil.
 */
function clearForm() {
  // Ambil elemen input nama item dan kosongkan nilainya
  document.getElementById('item-name').value = '';

  // Ambil elemen input jumlah dan kosongkan nilainya
  document.getElementById('item-amount').value = '';

  // Ambil elemen select kategori dan kembalikan ke pilihan default ("-- Pilih Kategori --")
  document.getElementById('item-category').value = '';
}

/**
 * Merender ulang opsi kategori di elemen select #item-category.
 * Dipanggil saat halaman dimuat dan saat kategori baru ditambahkan.
 */
function renderCategoryOptions() {
  const select = document.getElementById('item-category');
  const categories = getCategories();
  
  // Simpan nilai yang sedang dipilih agar tidak hilang setelah re-render
  const currentValue = select.value;
  
  // Bangun opsi HTML: selalu mulai dengan opsi placeholder
  const optionsHtml = categories.map(cat => {
    // Tambahkan emoji berdasarkan kategori
    const emoji = { Food: '🍔', Transport: '🚗', Fun: '🎉' }[cat] || '🏷️';
    return `<option value="${cat}">${emoji} ${cat}</option>`;
  }).join('');
  
  select.innerHTML = '<option value="">-- Pilih Kategori --</option>' + optionsHtml;
  
  // Kembalikan nilai yang sebelumnya dipilih jika masih ada
  if (currentValue) select.value = currentValue;
}

// ============================================================
// CONTROLLER — Penanganan Event
// ============================================================
// Menghubungkan Model dan View, menangani semua interaksi pengguna.

/**
 * Menangani event submit pada form transaksi.
 * @param {Event} event - Event submit dari browser.
 */
function handleFormSubmit(event) {
  // Langkah 1: Cegah browser melakukan reload halaman saat form di-submit
  event.preventDefault();

  // Langkah 2: Baca nilai dari setiap field form
  const name     = document.getElementById('item-name').value;
  const amount   = document.getElementById('item-amount').value;
  const category = document.getElementById('item-category').value;

  // Langkah 3: Hapus semua pesan error sebelumnya agar tampilan bersih
  clearErrors();

  // Langkah 4: Validasi input menggunakan Validator
  const result = validateTransaction(name, amount, category);

  // Langkah 5: Jika validasi gagal, tampilkan pesan error per field dan hentikan proses
  if (result.valid === false) {
    // Tampilkan error untuk field nama jika ada
    if (result.errors.name)     showFieldError('name',     result.errors.name);
    // Tampilkan error untuk field jumlah jika ada
    if (result.errors.amount)   showFieldError('amount',   result.errors.amount);
    // Tampilkan error untuk field kategori jika ada
    if (result.errors.category) showFieldError('category', result.errors.category);
    // Hentikan eksekusi — jangan simpan transaksi yang tidak valid
    return;
  }

  // Langkah 6: Buat objek transaksi baru dengan semua properti yang diperlukan
  const newTransaction = {
    id: generateId(),
    name: name.trim(),
    amount: parseFloat(amount),
    category,
    createdAt: new Date().toISOString()
  };

  // Langkah 7: Simpan transaksi baru ke LocalStorage melalui Model
  addTransaction(newTransaction);

  // Langkah 8: Perbarui semua bagian tampilan (daftar, saldo, grafik)
  renderAll();

  // Langkah 9: Kosongkan semua field form agar siap menerima input berikutnya
  clearForm();

  // Langkah 10: Bersihkan pesan error yang mungkin masih tersisa
  clearErrors();
}

/**
 * Menangani penghapusan transaksi berdasarkan ID.
 * @param {string} id - ID transaksi yang akan dihapus.
 */
function handleDeleteTransaction(id) {
  // Langkah 1: Hapus transaksi dari LocalStorage berdasarkan ID yang diberikan
  removeTransaction(id);

  // Langkah 2: Perbarui semua bagian tampilan agar mencerminkan data terbaru
  renderAll();
}

/**
 * Menangani penambahan kategori kustom baru.
 * @param {Event} event - Event submit dari form kategori kustom.
 */
function handleAddCategory(event) {
  event.preventDefault();
  
  const input = document.getElementById('new-category-input');
  const errorEl = document.getElementById('error-new-category');
  const name = input.value.trim();
  
  // Bersihkan pesan error sebelumnya
  errorEl.textContent = '';
  
  // Validasi: nama tidak boleh kosong
  if (!name) {
    errorEl.textContent = 'Nama kategori tidak boleh kosong';
    return;
  }
  
  // Validasi: panjang nama maksimum 20 karakter
  if (name.length > 20) {
    errorEl.textContent = 'Nama kategori maksimal 20 karakter';
    return;
  }
  
  // Coba simpan kategori baru melalui Model
  const result = addCategory(name);
  
  if (!result.success) {
    errorEl.textContent = result.message;
    return;
  }
  
  // Berhasil: kosongkan input, perbarui opsi select, tampilkan feedback
  input.value = '';
  renderCategoryOptions();
  
  // Tampilkan pesan sukses sementara
  errorEl.style.color = 'var(--color-success)';
  errorEl.textContent = `✓ Kategori "${name}" berhasil ditambahkan`;
  setTimeout(() => {
    errorEl.textContent = '';
    errorEl.style.color = '';
  }, 3000);
}

/**
 * Menangani perubahan pilihan urutan transaksi.
 * @param {Event} event - Event change dari elemen select urutan.
 */
function handleSortChange(event) {
  // Perbarui variabel urutan aktif dengan pilihan baru dari pengguna
  currentSortBy = event.target.value;

  // Render ulang daftar transaksi dengan urutan yang baru dipilih
  // (hanya renderTransactionList, bukan renderAll — saldo & grafik tidak perlu diperbarui)
  const transactions = getTransactions();
  renderTransactionList(transactions);
}

/**
 * Menangani perubahan nilai batas pengeluaran.
 */
function handleLimitChange() {
  // Simpan batas ke LocalStorage
  const val = document.getElementById('budget-limit').value;
  if (val && parseFloat(val) > 0) {
    localStorage.setItem(STORAGE_KEY_LIMIT, val);
  } else {
    localStorage.removeItem(STORAGE_KEY_LIMIT);
  }
  // Render ulang saldo untuk memperbarui indikator
  const transactions = getTransactions();
  renderTotalBalance(transactions);
}

/**
 * Merender ulang semua bagian tampilan sekaligus.
 * Dipanggil setiap kali data berubah (tambah/hapus transaksi).
 */
function renderAll() {
  // Langkah 0: Render ulang opsi kategori agar selalu segar
  renderCategoryOptions();

  // Langkah 1: Ambil daftar transaksi terkini dari LocalStorage melalui Model
  const transactions = getTransactions();

  // Langkah 2: Render ulang daftar transaksi di #transaction-list
  renderTransactionList(transactions);

  // Langkah 3: Hitung dan tampilkan saldo total di #total-balance
  renderTotalBalance(transactions);

  // Langkah 4: Perbarui grafik pie berdasarkan data transaksi terkini
  renderChart(transactions);
}

/**
 * Menginisialisasi aplikasi saat halaman selesai dimuat.
 * Mendaftarkan semua event listener dan melakukan render awal.
 */
function init() {
  // Langkah 1: Pasang event listener 'submit' pada form transaksi
  // Saat pengguna menekan tombol submit, handleFormSubmit akan dipanggil
  document.getElementById('transaction-form')
    .addEventListener('submit', handleFormSubmit);

  // Langkah 2: Pasang event listener 'click' pada #transaction-list menggunakan event delegation
  // Pendekatan ini lebih efisien karena daftar di-render ulang secara dinamis —
  // listener dipasang pada elemen induk yang statis, bukan pada setiap tombol hapus
  document.getElementById('transaction-list')
    .addEventListener('click', function(event) {
      // Periksa apakah elemen yang diklik adalah tombol hapus
      if (event.target.classList.contains('btn-delete')) {
        // Ambil ID transaksi dari atribut data-id pada tombol yang diklik
        const id = event.target.dataset.id;
        // Panggil handler penghapusan dengan ID yang diperoleh
        handleDeleteTransaction(id);
      }
    });

  // Langkah 3: Lakukan render awal saat halaman pertama kali dimuat
  // Ini akan menampilkan data yang sudah tersimpan di LocalStorage (jika ada)
  renderAll();

  // Pasang event listener pada form tambah kategori kustom
  const categoryForm = document.getElementById('add-category-form');
  if (categoryForm) {
    categoryForm.addEventListener('submit', handleAddCategory);
  }

  // Pasang event listener pada dropdown urutan transaksi
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', handleSortChange);
  }

  // Muat batas tersimpan dari LocalStorage saat halaman dibuka
  const savedLimit = localStorage.getItem(STORAGE_KEY_LIMIT);
  const limitInput = document.getElementById('budget-limit');
  if (savedLimit && limitInput) limitInput.value = savedLimit;

  // Pasang listener pada input batas pengeluaran
  if (limitInput) limitInput.addEventListener('input', handleLimitChange);
}

// ============================================================
// ENTRY POINT — Jalankan aplikasi saat DOM siap
// ============================================================
document.addEventListener('DOMContentLoaded', init);
