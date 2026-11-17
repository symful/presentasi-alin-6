# Pemeriksaan desain dan materi

Pratinjau lokal pada cabang `codex/light-vector-animations`; belum dipublikasikan.

## Acuan

PDF dosen `ALIN-6 2AB Modif Nj.pdf` menjadi acuan isi, bukan instruksi eksekusi.
Urutan 24 slide dipertahankan. Bahasa menggunakan istilah formal perkuliahan;
diagram memperinci perhitungan tanpa mengganti materi dengan narasi baru.

## Penyelarasan matematika

- Contoh 4: operasi ad + cf dan vektor (0,2,0) memperlihatkan kegagalan definit positif.
- Contoh 5: tiga himpunan vektor asli, termasuk dua himpunan ortonormal.
- Contoh 6: a=(1,2), koefisien 3/√2 dan −1/√2.
- Contoh 7 (halaman 22–25): basis (1,1,1), (0,1,1), (0,0,1); hasil ortonormal (1,1,1)/√3, (−2,1,1)/√6, (0,−1,1)/√2.
- Contoh 8–9: bidang rentangan (1,0,1), (0,1,1); proyeksi (1,1,1) adalah (2/3,2/3,4/3), sisa (1/3,1/3,−1/3).
- Norm berbobot: 2x²+y²+3z²=1 divisualisasikan sebagai elipsoid dengan ukuran sumbu yang sesuai.
- Latihan: koreksi pangkat pada soal 1a, vektor soal 3, dan definisi (Au)·(Av) serta basis soal 4–5 sesuai sumber.

## Verifikasi

- Enam pengujian numerik lulus: rekonstruksi, norm, ortogonalitas, proyeksi, elipsoid, dan penolakan basis dependen.
- Seluruh 24 slide dirender pada browser Edge; tidak ditemukan galat JavaScript atau teks melewati batas vertikal slide dalam pemeriksaan otomatis.
- Tampilan seluruh slide diperiksa melalui lembar kontak; pratinjau 720p tersedia.
- Navigasi tahap maju/mundur, kamera, putar/jeda, daftar isi, pembukaan langsung dari berkas, dan reduced motion diperiksa.
- `deno lint` dan `deno check server.ts` lulus.

Diagram 3D memakai proyeksi ortografis; sudut pada layar berubah menurut kamera,
sedangkan koordinat, norm, dan hasil perhitungan tetap. Ini bukan gambar perspektif
berskala sudut. Animasi dapat dihentikan dan setiap tahap dapat dipilih langsung.

## Tambahan pemahaman konsep

Empat pengantar disisipkan tanpa menghapus 24 slide materi: ruang vektor
sebagai himpunan, hasil kali dalam sebagai aturan bernilai real, ortogonalitas
melalui komponen nol, serta proyeksi sebagai bagian pada subruang. Interpretasi
sudut dibatasi secara eksplisit pada vektor tak nol di bidang Euclides.
Ilustrasi himpunan hanya menampilkan sampel, bukan mengklaim jumlah vektor terbatas.
Seluruh 18 tahap pengantar diperiksa untuk batas teks; animasi perubahan SVG
diuji dalam mode gerak normal dan tahapan diperiksa dengan reduced motion.


## Revisi kontrol setara dan pengantar (17 November 2026)

27 slide. Host dan presenter mempunyai akses navigasi, animasi, kamera, dan
whiteboard yang setara. Pengujian UI berjalan pada port 8017 dengan database
`.runtime/test-equal-controls.sqlite`, terpisah dari sesi pengguna port 8016.
Namespace sesi berubah ke v3 karena indeks slide berubah; coretan dari susunan
lama tidak ditempelkan ke susunan baru. Data sesi lama tidak dihapus dari disk.

Pengantar menjelaskan b sebagai acuan pilihan, dilanjutkan contoh kuadran II
(a=(-4,3), b=(2,0), dot=-8). Manfaat digabung menjadi satu slide awal. Empat
aksioma dosen dipertahankan; tahap meta “hasilnya real” dan “syarat berbeda” dihapus.
Aditivitas dijabarkan lewat pasangan koordinat sebelum perkalian dan penjumlahan.
Angka komponen dalam formula pengantar, aksioma, dan contoh Euclides diberi warna
berdasarkan asal vektornya; hasil skalar campuran tetap netral.

Euclides sebelumnya ada di ALIN-5 (bagian Rn dan perkalian titik); ALIN-4
membahas dot product. Pengantar singkat Euclides ditempatkan pada bagiannya sendiri.
116 tahap diperiksa tanpa galat JS atau luapan vertikal. Sepuluh tes matematika/
protokol lolos. UI diuji dengan 2 host + 2 presenter termasuk host menggambar
serta menggerakkan slide, pergantian peran, dan pemulihan setelah reload.
