# Studi Kasus SIRAP

SIRAP adalah Sistem Informasi Realisasi Anggaran dan Penyerapan untuk membantu pelaporan kegiatan serta pemantauan penggunaan anggaran di tingkat kecamatan. Dokumen ini tidak memuat data pengguna, data anggaran, atau konfigurasi operasional.

## Masalah

Pelaporan realisasi anggaran sering tersebar di spreadsheet, pesan, dan bukti kegiatan yang dikumpulkan terpisah. Hal ini menyulitkan pengecekan pagu, pelacakan status laporan, dan penyusunan rekap secara konsisten.

SIRAP menyatukan alokasi, laporan kegiatan, rincian pengeluaran, dan bukti pendukung dalam alur yang dapat ditinjau sesuai peran pengguna.

## Alur Kerja

1. Staf unit kerja menyusun laporan realisasi dan rincian pengeluaran.
2. Kepala seksi meninjau laporan pada tahap verifikasi pertama.
3. Pimpinan melakukan verifikasi lanjutan sesuai kewenangannya.
4. Admin keuangan mengelola alokasi dan memantau rekap penggunaan.

Setiap tahap dibatasi oleh kontrol peran dan status laporan. Sistem membantu mencegah pelaporan melebihi pagu dan menjaga bukti kegiatan terkait dengan laporan yang tepat.

## Nilai Operasional

- Alur pelaporan lebih mudah ditelusuri daripada pengumpulan dokumen manual.
- Pengecekan pagu membantu menjaga realisasi dalam alokasi yang tersedia.
- Verifikasi bertahap memberi kejelasan tanggung jawab setiap peran.
- Rekap dan ekspor membantu penyusunan bahan pelaporan rutin.
- Akses berbasis peran menjaga data unit kerja tetap relevan bagi pengguna berwenang.

## Ruang Lingkup Demo

Studi kasus ini menggunakan screenshot yang telah disanitasi agar pengunjung dapat memahami alur aplikasi tanpa membuka data maupun fungsi administrasi khusus. Walkthrough langsung tersedia secara privat berdasarkan permintaan dan menggunakan data fiktif serta peran terbatas. Ini bukan sumber data operasional dan tidak menggantikan proses instansi sebenarnya.

Untuk menjadwalkan walkthrough, hubungi [m.noor.aditya.rahman@gmail.com](mailto:m.noor.aditya.rahman@gmail.com).

## Teknologi dan Praktik Pengembangan

SIRAP menggunakan Laravel, Inertia, React, TypeScript, PostgreSQL, serta lingkungan berbasis container. Pengembangan menekankan validasi di server, otorisasi berbasis peran, pengujian otomatis, dan perubahan yang dapat ditinjau melalui riwayat Git.

Lihat [arsitektur konseptual](architecture.md) untuk gambaran batas teknis yang disanitasi.
