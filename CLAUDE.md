# Konteks repo (untuk asisten AI)

- Video **"Orbital Milik Bersama" — Kimia Kuantum: Orbital Molekul Poliatomik & Hückel** (S1 Kimia UNESA, RPS pertemuan 11) milik **Yayan** (Septian Anugrah). Mesin disalin dari `video-orbital-molekul` (komponen moA–moD: diagram MO, peta kerapatan; vbC: orbital 3D). Sebelumnya: MOT diatomik. Berikutnya: simetri & grup titik. Aturan umum & pelajaran teknis: repo `septiananugrah-ship-it/science-intro` → `CLAUDE.md`.
- Gaya seri kuantum Yayan: panggung gelap, aksen **emas–sian**, font Outfit + Source Serif 4 + JetBrains Mono, subtitle kata-per-kata. Tanpa nama di video (aturan video kuantum).
- Benang merah cerita: **dua puncak fotoelektron metana** (14 & 23 eV) yang tampak bertentangan dengan empat sp³ identik → orbital kelompok, BeH₂, CH₄ (terpecahkan: kedua gambaran setara), H₂O → Hückel (butadiena, benzena & lingkaran Frost, 4n+2, warna) → logam–CO, katalis, elektronika organik → teaser simetri.
- **Kode warna**: orbital ikatan = sian `C.cyan`, antiikatan = merah `C.red`, orbital atom = abu-biru `C.muted`/`C.blue`, fase + / − = emas `C.gold` / ungu `C.violet`, σ = sian, π = jingga `C.amber`, π* = merah muda `C.pink`, spin ↑ sian / ↓ merah muda, HOMO = emas, LUMO = mint `C.mint`, tingkat Hückel: ikatan sian / nonikatan abu / antiikatan merah; atom CPK (O merah, N biru, C abu, H putih).
- Diagram MO: dua kolom orbital atom di kiri/kanan, MO di tengah, garis putus-putus penghubung, elektron sebagai panah ↑↓ yang diisi bergiliran (Aufbau, Pauli, Hund); energi kualitatif (tidak berskala).
- **Semua adegan harus terus bergerak** (elektron di kotak orbital, vektor L/S berpresesi, tabel mikrostatus yang terkelupas, garis spektrum menyala).
- **Claude tidak menjalankan workflow GitHub Actions.** Setelah merge ke `main`, minta pengguna menekan *Run workflow*.
- Narasi menyusul. Selalu sediakan versi tanpa narasi.

## Aturan konten & tata letak
- Rumus/simbol term utama ≥ 56 px (`Formula`), satu kartu per momen; zona subtitle (bawah 180 px) bebas; margin ≥ 80 px. Komponen HTML di luar `<Stage>`.
- Rumus kimia & hibrida ditulis dengan subskrip/superskrip benar (H₂, sp³; `Sup`/`Sub` di HTML, `tspan baselineShift` di SVG). Orbital 3D digambar dengan proyeksi sederhana dan rotasi pelan. Angka dicek di `naskah/AUDIT.md`.
- Teks TTS terpisah dari subtitle (`tts:` per baris; huruf tunggal dieja di `src/tts.ts`).
- Kemulusan: `EASE` lembut, fade keluar `EASE_IN_OUT`; tanpa ganti berdasarkan ambang (silang-pudar); tanpa CSS blur; tanpa filter pada garis lurus.

## QA
- `CHROME_PATH=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell node scripts/qa-lines.mjs out/x <adegan...>` lalu `python3 scripts/contact.py out/x out/x-s 9`.
- `npm run check` (cek kata `wordOf`), uji kemulusan `node scripts/qa-film.mjs out/a.mp4 0 99999 0.25` lalu `python3 scripts/qa-glitch.py out/a.mp4 0`.
