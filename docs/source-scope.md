# Audit cakupan bahan dosen

Arsip: ALIN NJ JTK-20261117T053750Z-1-001.zip.
Delapan PDF ALIN-1 sampai ALIN-8 dan satu PPTX ALIN-3 diperiksa melalui
teks halaman dan struktur materi. Halaman pokok ALIN-6 juga diperiksa sebagai gambar.
PDF ALIN-6 di arsip identik secara SHA-256 dengan sumber di docs/.

| Berkas | Cakupan | Keputusan |
| --- | --- | --- |
| ALIN-1, 31 halaman | Matriks dan operasi | Tidak ditambahkan |
| ALIN-2, 28 halaman | Determinan | Tidak ditambahkan |
| ALIN-3, PDF dan PPTX, masing-masing 40 halaman | Sistem persamaan linear | Tidak ditambahkan |
| ALIN-4, 33 halaman | Operasi vektor, dot/cross product, proyeksi garis | Tidak diulang sebagai pengantar terpisah |
| ALIN-5, 48 halaman | Ruang vektor, subruang, basis, dimensi | Pengantar ruang vektor dihapus |
| ALIN-6, 42 halaman | RHD, norm, ortonormal, Gram–Schmidt, contoh proyeksi bidang, latihan | Sumber presentasi |
| ALIN-7, 36 halaman | Transformasi linear, kernel, jangkauan | Tidak ditambahkan |
| ALIN-8, 28 halaman | Eigen, diagonalisasi | Tidak ditambahkan |

## Pengantar geometri

- Lingkaran norm satu dan dua merupakan ilustrasi definisi norm (hlm. 5).
- Elips 2x²+y²=1 adalah irisan z=0 dari ellipsoid Contoh 2, dengan hasil kali dalam 2u₁v₁+u₂v₂+3u₃v₃. Koordinat tidak diubah; aturan pengukuran yang berubah.
- Ilustrasi jarak terpendek ke garis memperlihatkan prinsip galat minimum yang disebut pada hlm. 3. Bukan penambahan pelajaran least squares atau integral.
- Ortogonal/ortonormal mengikuti hlm. 10–13; perhitungan terpisah pada contoh.
- Penjelasan proyeksi bidang dipertahankan untuk Contoh 8–9.

Versi terbaru: 25 slide. A/kiri kembali, D/kanan lanjut; tombol juga bekerja
setelah tombol animasi mendapat fokus. Input kamera tetap memakai panah untuk
mengubah nilainya. Identitas: D4 2B; nama kompilator di sampul dihapus atas
permintaan pengguna, tanpa mengubah dokumen sumber.

Verifikasi: 25 slide tanpa galat JavaScript atau luapan vertikal; seluruh 9
keadaan pengantar diperiksa; A/D, huruf besar, panah, dan fokus tombol lulus.
Enam tes numerik, deno lint, dan deno check server.ts lulus.

## Revisi narasi dan aljabar-geometri

Pengantar kini dimulai dari a=(3,2) dan b=(2,0), proyeksi bertanda 3, lalu hasil kali dalam 6. Arsiran bukan luas yang dihitung. Rumusan RHD tetap mensyaratkan empat aksioma, tidak disimpulkan dari satu contoh saja.

Setiap contoh interaktif memiliki diketahui, pertanyaan, tahapan pengerjaan, dan makna hasil. Diagram memakai warna identitas vektor yang tetap; warna simbol dan komponen di bawah diagram mengikuti panah. Komponen panah yang dipindahkan dihitung dari ujung dikurangi pangkal. Desimal ≈ hanya pendekatan untuk membantu membaca gambar; rumus utama tetap eksak.

Gram–Schmidt dan proyeksi Contoh 7–9 kini memuat perhitungan koefisien, pengurangan komponen, serta norm sebelum normalisasi secara terpisah. Seluruh 99 keadaan interaktif diperiksa dengan browser; tidak ditemukan galat JavaScript atau luapan vertikal teks.

Ilustrasi aplikasi merupakan konteks tambahan yang diminta pengguna, bukan materi ujian atau kutipan dosen. Grafika menggunakan contoh pencahayaan Lambert; basis ortonormal ditunjukkan pada kamera dan kerangka pesawat. Ikon bergerak bersifat ilustratif, bukan simulator penerbangan atau renderer pencahayaan numerik.

Referensi aplikasi:
- https://www.khronos.org/files/collada_1_5_1_release_notes.pdf (Lambert)
- https://numpy.org/doc/stable/reference/generated/numpy.linalg.qr.html (kolom Q ortonormal)
- https://arxiv.org/abs/math/0606258 (Gram–Schmidt dan QR)

Tidak diklaim bahwa implementasi QR NumPy menggunakan Gram–Schmidt.

## Revisi sesi, aksioma, dan aplikasi

Versi terbaru memuat 30 slide. Lima slide aplikasi terpisah, masing-masing tiga
gambar. Keterangan sumber dan implementasi disembunyikan dari layar audiens.
Pengantar memakai a=(4,3), b=(2,0): proyeksi 4, panjang b 2, hasil kali dalam 8.
Koordinat ditulis dekat ujung panah; panjang norm ditulis di tengah ruas
(setelah nilai tersebut dihitung; sebelumnya tanda tanya).

Empat aksioma memiliki tahap geometri sendiri. Operasi berbobot diuji dengan
u=(1,1,0), v=(2,0,1), w=(0,1,1), bobot (2,1,3); ilustrasi numerik hanya
mendampingi pembuktian umum, bukan menggantikannya. Contoh penyangkal
positivitas −11 dan hasil nol pada (0,2,0) mempertahankan vektor yang terlihat.

113 keadaan interaktif diperiksa tanpa galat JavaScript atau teks meluap vertikal.
Sepuluh tes matematis/protokol lulus. Pengujian browser lokal dan tunnel publik
mencakup host, dua presenter, navigasi, keadaan tahap, whiteboard, undo/redo,
reload host, serta reset animasi saat masuk slide. Pemulihan token sesi setelah
restart server juga diperiksa. Kapasitas banyak presenter belum diuji beban.

Gambar aplikasi dibuat dengan tool imagegen bawaan (bukan CLI), disimpan pada
public/assets/applications/render.png, flight.png, robot.png. Ketiga aset
digunakan ulang dengan konteks khusus di setiap kelompok materi; gerak berupa
animasinya di browser (pencahayaan, pergerakan gambar, dan penunjuk jalur), bukan
video hasil simulasi fisika.

Pemeriksaan akhir tambahan: kamera 3D dan pembuatan sesi langsung dari panel S di alamat HTTPS publik lulus. Penanganan Origin memperbolehkan terminasi TLS proxy pada host yang sama; origin host lain ditolak. Snapshot animasi disiarkan agar keadaan jeda juga sama. Keanggotaan tanpa perubahan revisi tidak menimpa kontrol presenter. Koneksi putus menghentikan animasi lokal; heartbeat memantau sambungan.
