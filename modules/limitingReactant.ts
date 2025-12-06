import { ModuleContent } from '../types';

export const LimitingReactant: ModuleContent = {
  id: 'mod-4',
  title: 'Pereaksi Pembatas',
  description: 'Memahami konsep pereaksi pembatas, pereaksi berlebih, dan perhitungan hasil reaksi.',
  difficulty: 'Hard',
  content: `
# Pereaksi Pembatas

## Pengertian

### Pereaksi Pembatas (Limiting Reactant)
**Pereaksi pembatas** adalah reaktan yang habis bereaksi terlebih dahulu dan menentukan jumlah produk yang dihasilkan.

### Pereaksi Berlebih (Excess Reactant)
**Pereaksi berlebih** adalah reaktan yang masih tersisa setelah reaksi selesai.

## Konsep Dasar

Seperti membuat sandwich:
- 1 roti + 1 keju → 1 sandwich
- Jika ada 5 roti dan 3 keju, hanya bisa membuat 3 sandwich
- Keju = pembatas, Roti = berlebih (sisa 2)

## Cara Menentukan Pereaksi Pembatas

### Metode 1: Perbandingan Mol dengan Koefisien

**Langkah-langkah:**
1. Hitung mol setiap reaktan
2. Bagi mol dengan koefisien masing-masing: $\\frac{n}{\\text{koefisien}}$
3. Nilai terkecil = pereaksi pembatas
4. Nilai terbesar = pereaksi berlebih

### Contoh 1:
Reaksi: $N_2 + 3H_2 \\longrightarrow 2NH_3$

Jika direaksikan 2 mol N₂ dengan 4 mol H₂, tentukan pereaksi pembatas!

**Penyelesaian:**

$$\\frac{n_{N_2}}{\\text{koefisien}} = \\frac{2}{1} = 2$$

$$\\frac{n_{H_2}}{\\text{koefisien}} = \\frac{4}{3} = 1,33$$

Karena 1,33 < 2, maka **H₂ adalah pereaksi pembatas**.

### Metode 2: Hitung Kebutuhan Salah Satu Reaktan

**Langkah-langkah:**
1. Anggap salah satu reaktan sebagai pembatas
2. Hitung kebutuhan reaktan lainnya
3. Bandingkan dengan jumlah yang tersedia
4. Jika kebutuhan > tersedia → yang diasumsikan bukan pembatas
5. Jika kebutuhan < tersedia → yang diasumsikan adalah pembatas

### Contoh 2:
Reaksi: $2Al + 3Cl_2 \\longrightarrow 2AlCl_3$

Jika 5,4 gram Al direaksikan dengan 10,65 gram Cl₂, tentukan pereaksi pembatas!
($A_r$ Al = 27, Cl = 35,5)

**Penyelesaian:**

1. Hitung mol:
   - $n_{Al} = \\frac{5,4}{27} = 0,2$ mol
   - $n_{Cl_2} = \\frac{10,65}{71} = 0,15$ mol

2. Metode perbandingan:
   - $\\frac{n_{Al}}{2} = \\frac{0,2}{2} = 0,1$
   - $\\frac{n_{Cl_2}}{3} = \\frac{0,15}{3} = 0,05$

**Cl₂ adalah pereaksi pembatas** (nilai terkecil).

## Perhitungan dengan Pereaksi Pembatas

### Langkah-langkah:
1. Tentukan pereaksi pembatas
2. Gunakan mol pereaksi pembatas untuk menghitung produk
3. Hitung sisa pereaksi berlebih

### Contoh Soal Lengkap:
Reaksi: $4Fe + 3O_2 \\longrightarrow 2Fe_2O_3$

Jika 11,2 gram Fe direaksikan dengan 4,8 gram O₂, tentukan:
a) Pereaksi pembatas
b) Massa Fe₂O₃ yang terbentuk
c) Sisa pereaksi berlebih
($A_r$ Fe = 56, O = 16, $M_r$ Fe₂O₃ = 160)

**Penyelesaian:**

**a) Menentukan pereaksi pembatas:**

$$n_{Fe} = \\frac{11,2}{56} = 0,2 \\text{ mol}$$
$$n_{O_2} = \\frac{4,8}{32} = 0,15 \\text{ mol}$$

$$\\frac{n_{Fe}}{4} = \\frac{0,2}{4} = 0,05$$
$$\\frac{n_{O_2}}{3} = \\frac{0,15}{3} = 0,05$$

Kedua reaktan habis bersamaan (reaksi sempurna), tetapi untuk perhitungan kita gunakan salah satu. Mari gunakan Fe sebagai acuan.

**b) Massa Fe₂O₃:**

$$\\frac{n_{Fe}}{4} = \\frac{n_{Fe_2O_3}}{2}$$
$$n_{Fe_2O_3} = \\frac{0,2 \\times 2}{4} = 0,1 \\text{ mol}$$
$$m_{Fe_2O_3} = 0,1 \\times 160 = 16 \\text{ gram}$$

**c) Sisa pereaksi berlebih:**

Karena perbandingan tepat, tidak ada sisa (kedua reaktan habis).

### Contoh Soal dengan Sisa:
Reaksi: $2H_2 + O_2 \\longrightarrow 2H_2O$

Jika 6 gram H₂ direaksikan dengan 32 gram O₂, tentukan sisa pereaksi berlebih!
($M_r$ H₂ = 2, O₂ = 32)

**Penyelesaian:**

1. Hitung mol:
   - $n_{H_2} = \\frac{6}{2} = 3$ mol
   - $n_{O_2} = \\frac{32}{32} = 1$ mol

2. Tentukan pembatas:
   - $\\frac{n_{H_2}}{2} = \\frac{3}{2} = 1,5$
   - $\\frac{n_{O_2}}{1} = \\frac{1}{1} = 1$

   **O₂ adalah pereaksi pembatas**

3. Hitung H₂ yang bereaksi:
   $$\\frac{n_{O_2}}{1} = \\frac{n_{H_2}}{2}$$
   $$n_{H_2} \\text{ bereaksi} = 1 \\times 2 = 2 \\text{ mol}$$

4. Sisa H₂:
   $$n_{H_2} \\text{ sisa} = 3 - 2 = 1 \\text{ mol}$$
   $$m_{H_2} \\text{ sisa} = 1 \\times 2 = 2 \\text{ gram}$$

## Persen Hasil (Percent Yield)

### Hasil Teoritis vs Hasil Aktual

**Hasil teoritis** = hasil maksimum yang dapat diperoleh (berdasarkan perhitungan)
**Hasil aktual** = hasil yang benar-benar diperoleh di laboratorium

$$\\% \\text{ Hasil} = \\frac{\\text{Hasil Aktual}}{\\text{Hasil Teoritis}} \\times 100\\%$$

### Contoh:
Reaksi menghasilkan hasil teoritis 20 gram produk, tetapi di lab hanya diperoleh 15 gram.

$$\\% \\text{ Hasil} = \\frac{15}{20} \\times 100\\% = 75\\%$$

## Diagram Alur Perhitungan

\`\`\`
1. Hitung mol semua reaktan
   ↓
2. Tentukan pereaksi pembatas
   (bagi mol dengan koefisien)
   ↓
3. Gunakan mol pembatas untuk
   hitung produk
   ↓
4. Hitung sisa pereaksi berlebih
   (jika diminta)
   ↓
5. Hitung % hasil
   (jika ada data aktual)
\`\`\`

## Tips Penting

- **Selalu** tentukan pereaksi pembatas terlebih dahulu
- Gunakan mol pembatas untuk menghitung produk, bukan mol berlebih
- Sisa pereaksi = mol awal - mol yang bereaksi
- Di laboratorium, hasil aktual selalu < hasil teoritis (% hasil < 100%)
- Penyebab hasil < 100%: reaksi tidak sempurna, produk hilang saat pemindahan, produk samping, dll.
- Koefisien reaksi sangat penting untuk menentukan perbandingan mol

## Latihan Soal

**Soal:**
Reaksi: $C_3H_8 + 5O_2 \\longrightarrow 3CO_2 + 4H_2O$

22 gram C₃H₈ direaksikan dengan 64 gram O₂.
a) Tentukan pereaksi pembatas
b) Hitung massa CO₂ yang terbentuk
c) Hitung sisa pereaksi berlebih

($M_r$ C₃H₈ = 44, O₂ = 32, CO₂ = 44)

**Coba kerjakan sendiri terlebih dahulu!**
  `
};
