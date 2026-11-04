// Naskah narasi "Orbital Milik Bersama" — Kimia Kuantum pertemuan 11: Orbital Molekul Poliatomik & Hückel.
// Setiap adegan berisi baris narasi. Durasi baris dihitung otomatis dari jumlah
// suku kata (lihat timeline.ts) atau dari rekaman suara bila sudah ada,
// jadi cukup ubah teks di sini: visual, subtitle, dan musik ikut menyesuaikan.
//
// Aturan menulis teks narasi (dibaca mesin TTS):
//  - angka & simbol ditulis sebagai kata ("dua puluh meter per detik"),
//  - rumus ditulis sebagai kalimat; rumus rapi tampil di layar (komponen Formula).
// Angka & term sudah dicek di naskah/AUDIT.md (Atkins, Levine, CRC, NIST CCCBDB).
//
// hl     : kata/frasa yang disorot pada subtitle
// pause  : jeda (detik) SETELAH baris dibacakan
// lead   : jeda (detik) sebelum baris pertama adegan
// tail   : jeda (detik) setelah baris terakhir adegan
// fixed  : durasi tetap (detik) untuk adegan tanpa narasi

export type Line = {
  text: string;
  /** Teks khusus TTS (opsional). Bila kosong, dibuat otomatis oleh src/tts.ts. */
  tts?: string;
  hl?: string[];
  pause?: number;
};

export type SceneScript = {
  id: string;
  chapter: string; // nomor bab di heading, "" untuk tanpa heading
  part?: 1 | 2 | 3; // 1 prinsip & teori dasar, 2 implementasi dalam kimia, 3 penerapan
  title: string;
  lines: Line[];
  lead?: number;
  tail?: number;
  fixed?: number;
  mood: 'mystery' | 'title' | 'wonder' | 'build' | 'quantum' | 'tension' | 'bright' | 'resolve' | 'outro';
};

export const SCRIPT: SceneScript[] = [
  {
    "id": "hook",
    "chapter": "",
    "title": "Dua puncak metana",
    "mood": "mystery",
    "lead": 1.6,
    "tail": 1.2,
    "lines": [
      {
        "text": "Menurut hibridisasi, metana punya empat ikatan C–H yang identik, dari empat orbital sp tiga yang sama persis.",
        "hl": [
          "identik"
        ],
        "pause": 0.7,
        "tts": "Menurut hibridisasi, metana punya empat ikatan ce ha yang identik, dari empat orbital es pe tiga yang sama persis."
      },
      {
        "text": "Kalau begitu, melepas elektron dari metana seharusnya selalu butuh energi yang sama.",
        "hl": [
          "energi yang sama"
        ],
        "pause": 0.7
      },
      {
        "text": "Tetapi spektroskopi fotoelektron menunjukkan dua puncak: sekitar empat belas dan dua puluh tiga elektronvolt.",
        "hl": [
          "dua puncak"
        ],
        "pause": 0.7
      },
      {
        "text": "Ada elektron yang terikat jauh lebih kuat daripada yang lain. Siapa yang benar?",
        "hl": [
          "Siapa yang benar"
        ],
        "pause": 1.0
      },
      {
        "text": "Jawabannya membawa kita ke orbital yang menyebar ke seluruh molekul: orbital milik bersama.",
        "hl": [
          "orbital milik bersama"
        ],
        "pause": 1.0
      }
    ]
  },
  {
    "id": "title",
    "chapter": "",
    "title": "Orbital Milik Bersama",
    "mood": "title",
    "fixed": 7,
    "lines": []
  },
  {
    "id": "roadmap",
    "chapter": "",
    "title": "Peta video",
    "mood": "wonder",
    "lead": 0.8,
    "tail": 1.4,
    "lines": [
      {
        "text": "Perjalanan kita punya tiga bagian.",
        "pause": 0.6
      },
      {
        "text": "Pertama, prinsip dasar: orbital kelompok, lalu orbital molekul berilium hidrida, metana, dan air.",
        "hl": [
          "prinsip dasar"
        ],
        "pause": 0.7
      },
      {
        "text": "Kedua, implementasi dalam kimia: metode Hückel untuk elektron pi, butadiena, benzena, aromatisitas, dan warna.",
        "hl": [
          "implementasi dalam kimia"
        ],
        "pause": 0.7,
        "tts": "Kedua, implementasi dalam kimia: metode Hukel untuk elektron pi, butadiena, benzena, aromatisitas, dan warna."
      },
      {
        "text": "Ketiga, penerapan: logam dan karbon monoksida, desain katalis, dan elektronika organik.",
        "hl": [
          "penerapan"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "salc",
    "chapter": "01",
    "title": "Orbital kelompok",
    "mood": "build",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Pada molekul banyak atom, kita tidak menggabungkan orbital satu per satu. Ada cara yang lebih rapi.",
        "hl": [
          "lebih rapi"
        ],
        "pause": 0.7
      },
      {
        "text": "Pertama, gabungkan dulu orbital atom-atom luar, misalnya orbital satu s semua hidrogen, menjadi orbital kelompok.",
        "hl": [
          "orbital kelompok"
        ],
        "pause": 0.7,
        "tts": "Pertama, gabungkan dulu orbital atom-atom luar, misalnya orbital satu es semua hidrogen, menjadi orbital kelompok."
      },
      {
        "text": "Setiap orbital kelompok punya pola fase tertentu: semua sefase, atau sebagian positif dan sebagian negatif.",
        "hl": [
          "pola fase"
        ],
        "pause": 0.7
      },
      {
        "text": "Kedua, cocokkan tiap orbital kelompok dengan orbital atom pusat yang simetrinya sama.",
        "hl": [
          "simetrinya sama"
        ],
        "pause": 0.7
      },
      {
        "text": "Yang cocok bergabung menjadi orbital ikatan dan antiikatan. Yang tidak punya pasangan tetap sebagai orbital nonikatan.",
        "hl": [
          "orbital nonikatan"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "beh2",
    "chapter": "02",
    "title": "Berilium hidrida: tiga atom",
    "mood": "quantum",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Contoh paling sederhana: berilium hidrida dalam fase gas, molekul lurus H–Be–H.",
        "hl": [
          "berilium hidrida"
        ],
        "pause": 0.7,
        "tts": "Contoh paling sederhana: berilium hidrida dalam fase gas, molekul lurus ha be ha."
      },
      {
        "text": "Dua orbital satu s hidrogen membentuk dua orbital kelompok: satu sefase, satu berlawanan fase.",
        "hl": [
          "dua orbital kelompok"
        ],
        "pause": 0.7,
        "tts": "Dua orbital satu es hidrogen membentuk dua orbital kelompok: satu sefase, satu berlawanan fase."
      },
      {
        "text": "Kelompok sefase cocok dengan orbital dua s berilium. Kelompok berlawanan fase cocok dengan dua p z.",
        "hl": [
          "cocok"
        ],
        "pause": 0.7,
        "tts": "Kelompok sefase cocok dengan orbital dua es berilium. Kelompok berlawanan fase cocok dengan dua pe zet."
      },
      {
        "text": "Hasilnya dua orbital ikatan, masing-masing membentang di atas ketiga atom sekaligus.",
        "hl": [
          "ketiga atom sekaligus"
        ],
        "pause": 0.7
      },
      {
        "text": "Empat elektron mengisi keduanya. Tidak ada ikatan yang terkunci di antara dua atom saja: inilah orbital terdelokalisasi.",
        "hl": [
          "terdelokalisasi"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "methane",
    "chapter": "03",
    "title": "Metana: misteri dua puncak",
    "mood": "wonder",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Kembali ke metana. Empat orbital satu s hidrogen membentuk empat orbital kelompok.",
        "hl": [
          "empat orbital kelompok"
        ],
        "pause": 0.7,
        "tts": "Kembali ke metana. Empat orbital satu es hidrogen membentuk empat orbital kelompok."
      },
      {
        "text": "Satu kelompok semua sefase, cocok dengan dua s karbon. Tiga lainnya cocok dengan tiga orbital dua p.",
        "hl": [
          "tiga orbital dua p"
        ],
        "pause": 0.7,
        "tts": "Satu kelompok semua sefase, cocok dengan dua es karbon. Tiga lainnya cocok dengan tiga orbital dua pe."
      },
      {
        "text": "Jadi ada satu orbital ikatan yang rendah sekali, dan tiga orbital ikatan setara yang lebih tinggi.",
        "hl": [
          "tiga orbital ikatan setara"
        ],
        "pause": 0.7
      },
      {
        "text": "Dua elektron di orbital rendah memberi puncak dua puluh tiga elektronvolt. Enam elektron di tiga orbital tinggi memberi puncak empat belas.",
        "hl": [
          "dua puluh tiga elektronvolt"
        ],
        "pause": 0.7
      },
      {
        "text": "Apakah hibridisasi salah? Tidak. Kerapatan elektron totalnya sama. Hibridisasi menggambarkan ikatan, orbital molekul menggambarkan energi tiap elektron.",
        "hl": [
          "Kerapatan elektron totalnya sama"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "water",
    "chapter": "04",
    "title": "Air: pasangan bebas yang sebenarnya",
    "mood": "build",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Air punya delapan elektron valensi, yang mengisi empat orbital molekul terisi.",
        "hl": [
          "empat orbital molekul terisi"
        ],
        "pause": 0.7
      },
      {
        "text": "Spektrum fotoelektronnya memang menunjukkan empat puncak: sekitar dua belas koma enam, empat belas koma tujuh, delapan belas koma lima, dan tiga puluh dua elektronvolt.",
        "hl": [
          "empat puncak"
        ],
        "pause": 0.7
      },
      {
        "text": "Orbital terisi tertinggi air adalah orbital p oksigen yang tegak lurus bidang molekul. Ia tidak bergabung dengan hidrogen sama sekali.",
        "hl": [
          "tegak lurus bidang molekul"
        ],
        "pause": 0.7,
        "tts": "Orbital terisi tertinggi air adalah orbital pe oksigen yang tegak lurus bidang molekul. Ia tidak bergabung dengan hidrogen sama sekali."
      },
      {
        "text": "Inilah pasangan elektron bebas versi orbital molekul: orbital nonikatan.",
        "hl": [
          "orbital nonikatan"
        ],
        "pause": 0.7
      },
      {
        "text": "Elektron di orbital inilah yang pertama dipakai air saat mendonorkan elektron, misalnya ketika membentuk ikatan hidrogen.",
        "hl": [
          "ikatan hidrogen"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "huckel",
    "chapter": "05",
    "title": "Metode Hückel",
    "mood": "quantum",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Untuk molekul organik terkonjugasi, ada cara cepat yang diusulkan Erich Hückel tahun seribu sembilan ratus tiga puluh satu.",
        "hl": [
          "Erich Hückel"
        ],
        "pause": 0.7,
        "tts": "Untuk molekul organik terkonjugasi, ada cara cepat yang diusulkan Erik Hukel tahun seribu sembilan ratus tiga puluh satu."
      },
      {
        "text": "Idenya: pisahkan elektron pi dari kerangka sigma, dan hitung hanya orbital p yang tegak lurus bidang molekul.",
        "hl": [
          "hanya orbital p"
        ],
        "pause": 0.7,
        "tts": "Idenya: pisahkan elektron pi dari kerangka sigma, dan hitung hanya orbital pe yang tegak lurus bidang molekul."
      },
      {
        "text": "Cukup dua parameter. Alfa: energi elektron di orbital p satu karbon. Beta: interaksi antara dua karbon yang bertetangga.",
        "hl": [
          "Alfa",
          "Beta"
        ],
        "pause": 0.7,
        "tts": "Cukup dua parameter. Alfa: energi elektron di orbital pe satu karbon. Beta: interaksi antara dua karbon yang bertetangga."
      },
      {
        "text": "Atom yang tidak bertetangga dianggap tidak berinteraksi sama sekali.",
        "hl": [
          "tidak berinteraksi"
        ],
        "pause": 0.7
      },
      {
        "text": "Beta bernilai negatif, jadi energi alfa ditambah beta lebih rendah, lebih stabil, daripada alfa.",
        "hl": [
          "lebih stabil"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "butadiene",
    "chapter": "06",
    "title": "Etilena dan butadiena",
    "mood": "build",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Etilena: dua orbital p memberi dua orbital pi, dengan energi alfa ditambah beta dan alfa dikurangi beta.",
        "hl": [
          "alfa ditambah beta"
        ],
        "pause": 0.7,
        "tts": "Etilena: dua orbital pe memberi dua orbital pi, dengan energi alfa ditambah beta dan alfa dikurangi beta."
      },
      {
        "text": "Butadiena: empat karbon, empat orbital p, empat orbital pi.",
        "hl": [
          "empat orbital pi"
        ],
        "pause": 0.7,
        "tts": "Butadiena: empat karbon, empat orbital pe, empat orbital pi."
      },
      {
        "text": "Energinya alfa ditambah satu koma enam dua beta, alfa ditambah nol koma enam dua beta, lalu pasangan cerminnya di atas alfa.",
        "hl": [
          "satu koma enam dua beta"
        ],
        "pause": 0.7
      },
      {
        "text": "Perhatikan simpulnya: orbital terendah tanpa simpul, lalu satu, dua, dan tiga simpul. Makin banyak simpul, makin tinggi energinya.",
        "hl": [
          "Makin banyak simpul"
        ],
        "pause": 0.7
      },
      {
        "text": "Empat elektron pi mengisi dua orbital terbawah. Energinya lebih rendah daripada dua ikatan rangkap terpisah: elektron pi menyebar ke keempat karbon.",
        "hl": [
          "menyebar ke keempat karbon"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "benzene",
    "chapter": "07",
    "title": "Benzena dan lingkaran Frost",
    "mood": "wonder",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Benzena: enam orbital p membentuk enam orbital pi.",
        "hl": [
          "enam orbital pi"
        ],
        "pause": 0.7,
        "tts": "Benzena: enam orbital pe membentuk enam orbital pi."
      },
      {
        "text": "Ada trik indah untuk cincin: gambar segi enam di dalam lingkaran, satu sudut menunjuk ke bawah. Setiap sudut adalah satu tingkat energi.",
        "hl": [
          "segi enam di dalam lingkaran"
        ],
        "pause": 0.7
      },
      {
        "text": "Hasilnya: satu orbital alfa ditambah dua beta, dua orbital alfa ditambah beta, dua orbital alfa dikurangi beta, dan satu alfa dikurangi dua beta.",
        "hl": [
          "alfa ditambah dua beta"
        ],
        "pause": 0.7
      },
      {
        "text": "Enam elektron pi mengisi tepat tiga orbital ikatan. Tidak satu pun masuk ke orbital antiikatan.",
        "hl": [
          "tepat tiga orbital ikatan"
        ],
        "pause": 0.7
      },
      {
        "text": "Dibanding tiga ikatan rangkap terpisah, benzena lebih stabil sebesar dua beta, sekitar seratus lima puluh kilojoule per mol, sama dengan energi resonansi yang kita temui di video ikatan valensi.",
        "hl": [
          "dua beta"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "aromatic",
    "chapter": "08",
    "title": "Aturan aromatisitas",
    "mood": "tension",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Lingkaran Frost menjelaskan aturan Hückel: cincin datar terkonjugasi stabil istimewa bila punya empat n tambah dua elektron pi.",
        "hl": [
          "empat n tambah dua"
        ],
        "pause": 0.7,
        "tts": "Lingkaran Frost menjelaskan aturan Hukel: cincin datar terkonjugasi stabil istimewa bila punya empat en tambah dua elektron pi."
      },
      {
        "text": "Dua, enam, sepuluh elektron: semua orbital ikatan terisi penuh. Benzena, anion siklopentadienil, dan kation tropilium semuanya punya enam.",
        "hl": [
          "anion siklopentadienil"
        ],
        "pause": 0.7
      },
      {
        "text": "Tapi siklobutadiena hanya punya empat elektron pi.",
        "hl": [
          "siklobutadiena"
        ],
        "pause": 0.7
      },
      {
        "text": "Lingkaran Frost-nya memberi dua orbital tak berikatan yang sama energinya, dan dua elektron terakhir masuk satu-satu, tak berpasangan.",
        "hl": [
          "tak berpasangan"
        ],
        "pause": 0.7
      },
      {
        "text": "Molekul ini sangat tidak stabil, disebut antiaromatik. Ia baru bisa diamati pada suhu sangat rendah, dan bentuknya terdistorsi menjadi persegi panjang.",
        "hl": [
          "antiaromatik"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "color",
    "chapter": "09",
    "title": "Konjugasi dan warna",
    "mood": "bright",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Makin panjang rantai terkonjugasi, makin rapat orbital-orbital pi, dan celah HOMO–LUMO makin kecil.",
        "hl": [
          "celah HOMO–LUMO makin kecil"
        ],
        "pause": 0.7,
        "tts": "Makin panjang rantai terkonjugasi, makin rapat orbital-orbital pi, dan celah homo lumo makin kecil."
      },
      {
        "text": "Polanya mirip partikel dalam kotak: kotak yang lebih panjang, tingkat energi yang lebih rapat.",
        "hl": [
          "partikel dalam kotak"
        ],
        "pause": 0.7
      },
      {
        "text": "Butadiena menyerap ultraviolet. Tapi beta-karoten, dengan sebelas ikatan rangkap terkonjugasi, menyerap cahaya biru sekitar empat ratus lima puluh nanometer.",
        "hl": [
          "beta-karoten"
        ],
        "pause": 0.7
      },
      {
        "text": "Mata kita melihat sisanya: jingga. Itulah warna wortel.",
        "hl": [
          "warna wortel"
        ],
        "pause": 0.7
      },
      {
        "text": "Pewarna, pigmen daun, dan zat penglihatan di mata kita bekerja dengan prinsip yang sama.",
        "hl": [
          "prinsip yang sama"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "metalco",
    "chapter": "10",
    "title": "Logam dan karbon monoksida",
    "mood": "wonder",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Ingat karbon monoksida: HOMO-nya di ujung karbon, dan LUMO-nya adalah orbital pi bintang.",
        "hl": [
          "pi bintang"
        ],
        "pause": 0.7,
        "tts": "Ingat karbon monoksida: homo-nya di ujung karbon, dan lumo-nya adalah orbital pi bintang."
      },
      {
        "text": "Saat CO mendekati logam transisi, HOMO karbon mendonorkan elektron ke orbital d logam yang kosong.",
        "hl": [
          "mendonorkan"
        ],
        "pause": 0.7,
        "tts": "Saat ce o mendekati logam transisi, homo karbon mendonorkan elektron ke orbital de logam yang kosong."
      },
      {
        "text": "Sebaliknya, orbital d logam yang terisi mengembalikan elektron ke pi bintang CO. Ini disebut donasi balik.",
        "hl": [
          "donasi balik"
        ],
        "pause": 0.7,
        "tts": "Sebaliknya, orbital de logam yang terisi mengembalikan elektron ke pi bintang ce o. Ini disebut donasi balik."
      },
      {
        "text": "Elektron di pi bintang melemahkan ikatan C–O. Frekuensi regangannya turun dari dua ribu seratus empat puluh tiga per sentimeter pada CO bebas menjadi sekitar dua ribu atau kurang.",
        "hl": [
          "melemahkan ikatan"
        ],
        "pause": 0.7,
        "tts": "Elektron di pi bintang melemahkan ikatan ce o. Frekuensi regangannya turun dari dua ribu seratus empat puluh tiga per sentimeter pada ce o bebas menjadi sekitar dua ribu atau kurang."
      },
      {
        "text": "Model donasi dan donasi balik ini menjelaskan cara kerja banyak katalis logam.",
        "hl": [
          "katalis logam"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "catalyst",
    "chapter": "11",
    "title": "Merancang katalis dengan orbital",
    "mood": "build",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Katalis bekerja dengan mengatur aliran elektron antara orbital perbatasan pereaksi dan permukaan katalis.",
        "hl": [
          "orbital perbatasan"
        ],
        "pause": 0.7
      },
      {
        "text": "Ikatan yang terlalu lemah membuat pereaksi tidak menempel. Terlalu kuat, produknya tidak mau lepas.",
        "hl": [
          "Terlalu kuat"
        ],
        "pause": 0.7
      },
      {
        "text": "Katalis terbaik berada di tengah, dan posisi orbital logam menentukan di mana letak tengah itu.",
        "hl": [
          "di tengah"
        ],
        "pause": 0.7
      },
      {
        "text": "Kini kimiawan menghitung orbital calon katalis di komputer dengan teori fungsional kerapatan, sebelum mensintesisnya di laboratorium.",
        "hl": [
          "teori fungsional kerapatan"
        ],
        "pause": 0.7
      },
      {
        "text": "Bahkan material berbasis karbon dirancang dengan mengatur orbitalnya, misalnya dengan menyisipkan atom nitrogen ke kerangka karbon.",
        "hl": [
          "menyisipkan atom nitrogen"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "organic",
    "chapter": "12",
    "title": "Elektronika organik",
    "mood": "bright",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Molekul terkonjugasi juga bisa menjadi semikonduktor.",
        "hl": [
          "semikonduktor"
        ],
        "pause": 0.7
      },
      {
        "text": "Pada sel surya organik, cahaya mengangkat elektron dari HOMO ke LUMO molekul pendonor.",
        "hl": [
          "sel surya organik"
        ],
        "pause": 0.7,
        "tts": "Pada sel surya organik, cahaya mengangkat elektron dari homo ke lumo molekul pendonor."
      },
      {
        "text": "Elektron itu lalu melompat ke LUMO molekul penerima yang sedikit lebih rendah, dan arus listrik mengalir.",
        "hl": [
          "molekul penerima"
        ],
        "pause": 0.7,
        "tts": "Elektron itu lalu melompat ke lumo molekul penerima yang sedikit lebih rendah, dan arus listrik mengalir."
      },
      {
        "text": "Pada layar OLED, prosesnya terbalik: elektron dan lubang bertemu, dan selisih energinya keluar sebagai cahaya.",
        "hl": [
          "prosesnya terbalik"
        ],
        "pause": 0.7,
        "tts": "Pada layar o-led, prosesnya terbalik: elektron dan lubang bertemu, dan selisih energinya keluar sebagai cahaya."
      },
      {
        "text": "Warna layar ditentukan oleh celah HOMO–LUMO, yang dirancang dengan memilih panjang konjugasi.",
        "hl": [
          "dirancang"
        ],
        "pause": 0.9,
        "tts": "Warna layar ditentukan oleh celah homo lumo, yang dirancang dengan memilih panjang konjugasi."
      }
    ]
  },
  {
    "id": "recap",
    "chapter": "13",
    "title": "Merangkai semuanya",
    "mood": "resolve",
    "lead": 1.0,
    "tail": 2.4,
    "lines": [
      {
        "text": "Mari rangkum.",
        "pause": 0.6
      },
      {
        "text": "Orbital kelompok dari atom luar dicocokkan dengan orbital atom pusat yang simetrinya sama.",
        "hl": [
          "Orbital kelompok"
        ],
        "pause": 0.7
      },
      {
        "text": "Orbital molekul metana menjelaskan dua puncak fotoelektron, tanpa membantah hibridisasi.",
        "hl": [
          "dua puncak fotoelektron"
        ],
        "pause": 0.7
      },
      {
        "text": "Metode Hückel dengan alfa dan beta meramal energi elektron pi butadiena dan benzena.",
        "hl": [
          "Metode Hückel"
        ],
        "pause": 0.7,
        "tts": "Metode Hukel dengan alfa dan beta meramal energi elektron pi butadiena dan benzena."
      },
      {
        "text": "Aturan empat n tambah dua memisahkan aromatik dari antiaromatik, dan panjang konjugasi menentukan warna.",
        "hl": [
          "empat n tambah dua"
        ],
        "pause": 0.7,
        "tts": "Aturan empat en tambah dua memisahkan aromatik dari antiaromatik, dan panjang konjugasi menentukan warna."
      },
      {
        "text": "Donasi dan donasi balik menjelaskan ikatan logam dengan CO dan cara kerja katalis.",
        "hl": [
          "donasi balik"
        ],
        "pause": 0.7,
        "tts": "Donasi dan donasi balik menjelaskan ikatan logam dengan ce o dan cara kerja katalis."
      },
      {
        "text": "Di balik semua pencocokan itu ada satu kata kunci: simetri. Itulah topik video berikutnya.",
        "hl": [
          "simetri"
        ],
        "pause": 1.0
      }
    ]
  },
  {
    "id": "outro",
    "chapter": "",
    "title": "Penutup",
    "mood": "outro",
    "fixed": 15,
    "lines": []
  }
];
