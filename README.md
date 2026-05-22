# washly-laundry-digital
Washly is a simple digital laundry POS prototype designed for small laundry businesses. It features visual-first service selection, automatic price calculation, digital receipts, QR-based pickup codes, laundry status tracking, WhatsApp receipt sharing, and responsive mobile-desktop layout.
# Washly - Warung Digital Laundry

Washly adalah prototype aplikasi POS laundry sederhana berbasis web yang dirancang untuk membantu UMKM laundry dalam mengelola transaksi secara lebih cepat, mudah, dan praktis.

Aplikasi ini dibuat dengan konsep **mobile-first** dan **visual-first interface**, sehingga pengguna dapat memilih layanan laundry melalui ikon tanpa perlu banyak mengetik. Washly cocok digunakan sebagai prototype aplikasi kasir laundry untuk tugas, portofolio, atau pengembangan awal sistem POS UMKM.

## Fitur Utama

- Login kasir menggunakan PIN sederhana
- Pilihan layanan laundry berbasis ikon
- Input data pelanggan
- Perhitungan total harga otomatis
- Perhitungan kembalian otomatis
- Estimasi tanggal selesai otomatis
- Pembuatan invoice otomatis
- Kode pengambilan otomatis
- QR Code untuk pengambilan laundry
- Nota digital
- Simulasi cetak nota
- Simulasi kirim nota melalui WhatsApp
- Manajemen status laundry:
  - Diproses
  - Dicuci
  - Selesai
  - Sudah Diambil
- Indikator warna untuk setiap status
- Fitur pencarian order
- Pengambilan laundry menggunakan invoice atau kode pengambilan
- Data tersimpan di browser menggunakan LocalStorage
- Tampilan responsive untuk mobile dan desktop

## Konsep HCI

Prototype ini menerapkan beberapa prinsip Human Computer Interaction, yaitu:

### 1. Visual-First Interface

Pengguna dapat memilih layanan laundry melalui ikon dan kartu visual, sehingga aplikasi lebih mudah digunakan oleh pengguna non-teknis.

### 2. Direct Manipulation

Kasir dapat langsung memilih layanan, mengubah status, dan melihat hasil perubahan secara langsung melalui tombol dan indikator visual.

### 3. Error Reduction

Sistem menghitung total harga, kembalian, estimasi selesai, invoice, dan kode pengambilan secara otomatis untuk mengurangi kesalahan input manual.

### 4. Visibility and Feedback

Setiap status laundry ditampilkan dengan warna berbeda agar mudah dipahami:

- Kuning: Diproses
- Biru: Dicuci
- Hijau: Selesai
- Merah: Sudah Diambil

### 5. Low Cognitive Load

Pelanggan tidak perlu membuat akun. Kasir hanya perlu memasukkan nama, nomor HP, dan berat laundry.

## Teknologi yang Digunakan

- HTML
- CSS
- JavaScript
- LocalStorage
- QRCode.js

## Cara Menjalankan Project

1. Clone repository ini:

```bash
git clone https://github.com/username/nama-repository.git
