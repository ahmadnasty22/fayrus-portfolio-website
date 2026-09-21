# Muhammad Syach Fayrus — Personal Website

Website personal statis: HTML5, CSS3, dan Vanilla JavaScript. Tanpa framework, tanpa `npm`, tanpa build step, tanpa backend.

Semua foto, thumbnail, dan video yang ada sekarang hanyalah **placeholder**. Ganti dengan file milikmu sendiri memakai **nama file yang sama**, maka struktur website tidak perlu diubah.

## Struktur folder

```text
portfolio/
├── index.html          ← isi halaman (teks, project, link)
├── style.css           ← tampilan (warna ada di bagian :root)
├── script.js           ← navbar mobile, animasi scroll, video lightbox
├── README.md
└── assets/
    ├── images/
    │   ├── profile.jpg            foto profil (hero)
    │   ├── campus.jpg             foto di bagian About
    │   ├── running.jpg            foto di bagian Running
    │   ├── frame-01.jpg           ┐
    │   ├── daily-life.jpg         │ foto di bagian "Stills"
    │   ├── behind-the-scenes.jpg  │ (Cinematic)
    │   └── frame-02.jpg           ┘
    ├── videos/
    │   ├── cinematic-01.mp4
    │   ├── cinematic-02.mp4
    │   └── cinematic-03.mp4
    └── thumbnails/
        ├── cinematic-01.jpg
        ├── cinematic-02.jpg
        └── cinematic-03.jpg
```

## 1. Menjalankan secara lokal

**Cara paling mudah:** klik dua kali `index.html`, atau buka lewat browser (Chrome, Edge, Firefox, Safari).

**Dengan local server (opsional):** kalau kamu punya Python, jalankan di dalam folder `portfolio/`:

```bash
python -m http.server 8000
```

lalu buka `http://localhost:8000`.

## 2. Mengganti foto profil

Timpa file `assets/images/profile.jpg` dengan fotomu.

- Rasio terbaik **4:5** (portrait), misalnya 1200 × 1500 px.
- Ukuran file sebaiknya di bawah 300 KB (kompres di squoosh.app kalau perlu).
- Ubah teks `alt` di `index.html` (cari `Portrait of Muhammad Syach Fayrus`) kalau mau deskripsi yang lebih spesifik.

## 3. Menambah atau mengganti foto

Foto di website ini ada di `assets/images/`. Cara termudah: **timpa file yang sudah ada** dengan nama yang sama.

| File | Dipakai di | Rasio yang cocok |
| --- | --- | --- |
| `campus.jpg` | About | 16:10 (landscape) |
| `running.jpg` | Running | 4:5 (portrait) |
| `frame-01.jpg` | Stills (besar, kiri) | 16:10 |
| `daily-life.jpg` | Stills (portrait, kanan) | 4:5 |
| `behind-the-scenes.jpg` | Stills (portrait, kiri bawah) | 4:5 |
| `frame-02.jpg` | Stills (besar, kanan bawah) | 16:10 |

Foto otomatis di-crop dengan `object-fit: cover`, jadi rasio yang sedikit berbeda tetap aman.

Untuk **menambah foto baru**, salin satu blok `<figure class="still ...">` di `index.html` (bagian `stills__grid`), lalu ganti `src`, `alt`, dan teks `figcaption`. Kalau ingin menambah posisi baru di layout, atur kolomnya di `style.css` (cari `.still--a`, `.still--b`, dan seterusnya).

## 4. Menambah video cinematic

1. Simpan videomu di `assets/videos/`, misalnya `cinematic-01.mp4`.
2. Format yang paling aman adalah **MP4 (H.264 + AAC)**. Untuk memperkecil ukuran dengan `ffmpeg`:

   ```bash
   ffmpeg -i input.mov -vf "scale=-2:1080" -c:v libx264 -crf 26 -preset slow -c:a aac -b:a 128k -movflags +faststart cinematic-01.mp4
   ```

3. Judul dan keterangan diubah di `index.html`, pada bagian dengan komentar `CINEMATIC` (atau cari `VIDEO GALLERY`). Setiap video punya satu `<article class="film">`. Ada dua tempat yang perlu disamakan:

   ```html
   <button class="film__trigger" type="button"
           data-video="assets/videos/cinematic-01.mp4"
           data-poster="assets/thumbnails/cinematic-01.jpg"
           data-title="A Day Around Campus"
           data-meta="Campus / 2026"
           aria-label="Play video: A Day Around Campus">
   ```

   dan teks di bawah thumbnail (`film__title` dan `film__meta`).

4. **Menambah video ke-4 dan seterusnya:** salin satu blok `<article class="film reveal">`, ganti isinya, lalu letakkan di dalam `.film-grid`. Layout sekarang dirancang untuk 3 video (satu besar, dua kecil). Video tambahan akan mengikuti sebagai baris baru; kalau ingin mengatur posisinya, lihat `.film-grid` di `style.css`.

Perilaku video: tidak ada autoplay sebelum diklik, file baru dimuat setelah thumbnail diklik (`preload="metadata"`), dan video mulai **tanpa suara**. Penonton bisa menyalakan suara lewat kontrol volume. Tombol play/pause, volume, dan fullscreen memakai kontrol bawaan browser.

### Kalau file video terlalu besar

GitHub menolak file di atas 100 MB, dan video besar membuat website lambat. Solusinya: upload video ke **YouTube** (mode *Unlisted* juga bisa) atau **Vimeo**, lalu pakai `data-embed` dan hapus `data-video`:

```html
<button class="film__trigger" type="button"
        data-embed="https://www.youtube.com/embed/VIDEO_ID"
        data-poster="assets/thumbnails/cinematic-01.jpg"
        data-title="A Day Around Campus"
        data-meta="Campus / 2026"
        aria-label="Play video: A Day Around Campus">
```

Untuk Vimeo, formatnya `https://player.vimeo.com/video/VIDEO_ID`. Thumbnail di `assets/thumbnails/` tetap dipakai.

## 5. Mengganti thumbnail video

Timpa `assets/thumbnails/cinematic-01.jpg` (dan `-02`, `-03`) dengan gambarmu. Pakai rasio **16:9**, misalnya 1600 × 900 px.

Mengambil thumbnail langsung dari video (detik ke-3) dengan `ffmpeg`:

```bash
ffmpeg -ss 00:00:03 -i cinematic-01.mp4 -frames:v 1 -q:v 2 cinematic-01.jpg
```

## 6. Mengganti project

Buka `index.html`, cari komentar `PROJECTS` (atau ketik `Selected Projects`). Setiap project adalah satu `<li class="project reveal">`. Ubah:

- judul di `project__title`
- deskripsi di `project__desc`
- teknologi di `project__tech`
- link GitHub di `href` dan `aria-label`

Sekarang semua link GitHub mengarah ke profilmu (`https://github.com/ahmadnasty22`). Ganti dengan link repository yang spesifik kalau sudah ada. Untuk menambah project, salin satu blok `<li>`. Untuk menghapus, hapus blok tersebut.

## 7. Mengganti link social media dan email

Semua ada di `index.html`:

| Yang diganti | Cari teks |
| --- | --- |
| GitHub, Instagram, Strava (bagian Connect With Me) | komentar `CONNECT` |
| Tombol View Strava (bagian Running) | `View Strava` |
| Email | `your.email@example.com` (ada dua tempat: `href="mailto:..."` dan teks link) |
| Personal best | `Personal bests` |
| Teks preview saat link dibagikan | `og:title`, `og:description`, `og:image` di bagian `<head>` |

Setelah website online, ubah `og:image` menjadi URL lengkap, misalnya `https://nama-websitemu.vercel.app/assets/images/profile.jpg`, supaya preview di WhatsApp/Instagram/LinkedIn muncul dengan benar.

## 8. Deploy ke Vercel

### a. Upload ke GitHub

1. Buat repository baru di GitHub (misalnya `portfolio`).
2. Pastikan `index.html` berada di **root** repository (bukan di dalam subfolder).
3. Di terminal, dari dalam folder `portfolio/`:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/ahmadnasty22/portfolio.git
   git push -u origin main
   ```

### b. Hubungkan ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub.
2. Klik **Add New… → Project**.
3. Pilih repository `portfolio` (klik **Import**).

### c. Deploy

Website ini statis, jadi tidak ada yang perlu diatur:

- **Framework Preset:** `Other`
- **Build Command:** kosongkan
- **Output Directory:** kosongkan
- **Install Command:** kosongkan

Klik **Deploy**. Dalam beberapa detik website online di alamat `nama-project.vercel.app`.

### d. Update setelah `git push`

Setiap kali kamu mengubah file lalu push, Vercel otomatis deploy ulang:

```bash
git add .
git commit -m "Update portfolio"
git push
```

Tunggu sekitar satu menit, lalu refresh websitemu. Kalau tampilan belum berubah, coba hard refresh (`Ctrl + Shift + R`).

## Catatan

- Warna, font, dan jarak utama ada di bagian `:root` pada `style.css`. Warna aksen diubah lewat `--accent`.
- Animasi otomatis dimatikan untuk pengunjung yang mengaktifkan *reduce motion* di perangkatnya.
- Font (Space Grotesk dan Manrope) dimuat dari Google Fonts. Kalau offline, website memakai font sistem sebagai cadangan.
