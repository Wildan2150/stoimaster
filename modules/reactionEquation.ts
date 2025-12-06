import { ModuleContent } from '../types';

export const ReactionEquation: ModuleContent = {
  id: 'mod-3',
  title: 'Persamaan Reaksi',
  description: 'Memahami cara menyetarakan persamaan reaksi dan perhitungan stoikiometri dasar.',
  difficulty: 'Medium',
  content: `
# Persamaan Reaksi

## Pengertian
**Persamaan reaksi kimia** adalah representasi simbolik dari reaksi kimia yang menunjukkan reaktan (zat yang bereaksi) dan produk (zat hasil reaksi).

### Bentuk Umum:
$$\\text{Reaktan} \\longrightarrow \\text{Produk}$$

atau

$$aA + bB \\longrightarrow cC + dD$$

Dimana: $a, b, c, d$ = koefisien reaksi

## Hukum Kekekalan Massa

> **"Massa zat sebelum dan sesudah reaksi adalah tetap"**
> — Hukum Lavoisier

Konsekuensi: Jumlah atom setiap unsur di ruas kiri = jumlah atom di ruas kanan

## Menyetarakan Persamaan Reaksi

### Metode 1: Trial and Error (Coba-coba)

**Langkah-langkah:**
1. Tulis persamaan reaksi yang belum setara
2. Hitung jumlah atom setiap unsur di kiri dan kanan
3. Tambahkan koefisien untuk menyetarakan
4. Periksa kembali semua atom

**Tips:**
- Mulai dari atom yang paling kompleks atau paling sedikit muncul
- Setarakan atom logam terlebih dahulu
- Setarakan atom non-logam berikutnya
- Setarakan atom O dan H terakhir
- Gunakan koefisien bulat terkecil

### Contoh 1:
Setarakan: $C_3H_8 + O_2 \\longrightarrow CO_2 + H_2O$

**Penyelesaian:**

| Tahap | Reaksi | C | H | O |
|-------|--------|---|---|---|
| Awal | $C_3H_8 + O_2 \\rightarrow CO_2 + H_2O$ | 3≠1 | 8≠2 | 2≠3 |
| Setarakan C | $C_3H_8 + O_2 \\rightarrow 3CO_2 + H_2O$ | 3=3 | 8≠2 | 2≠7 |
| Setarakan H | $C_3H_8 + O_2 \\rightarrow 3CO_2 + 4H_2O$ | 3=3 | 8=8 | 2≠10 |
| Setarakan O | $C_3H_8 + 5O_2 \\rightarrow 3CO_2 + 4H_2O$ | 3=3 | 8=8 | 10=10 |

**Persamaan setara:**
$$C_3H_8 + 5O_2 \\longrightarrow 3CO_2 + 4H_2O$$

### Contoh 2:
Setarakan: $Fe + O_2 \\longrightarrow Fe_2O_3$

**Penyelesaian:**
$$4Fe + 3O_2 \\longrightarrow 2Fe_2O_3$$

Cek:
- Fe: kiri = 4, kanan = 2×2 = 4 ✓
- O: kiri = 3×2 = 6, kanan = 2×3 = 6 ✓

### Metode 2: Setengah Reaksi (untuk reaksi redoks)
Akan dipelajari lebih lanjut di materi Reaksi Redoks.

## Perhitungan Stoikiometri

### Prinsip Dasar:
Koefisien reaksi = perbandingan mol

$$\\frac{n_A}{a} = \\frac{n_B}{b} = \\frac{n_C}{c} = \\frac{n_D}{d}$$

### Contoh Soal 1:
Reaksi: $N_2 + 3H_2 \\longrightarrow 2NH_3$

Jika 2 mol N₂ bereaksi sempurna, berapa mol NH₃ yang dihasilkan?

**Penyelesaian:**
$$\\frac{n_{N_2}}{1} = \\frac{n_{NH_3}}{2}$$
$$\\frac{2}{1} = \\frac{n_{NH_3}}{2}$$
$$n_{NH_3} = 4 \\text{ mol}$$

### Contoh Soal 2:
Reaksi: $2H_2 + O_2 \\longrightarrow 2H_2O$

Berapa gram H₂O yang terbentuk dari 4 gram H₂?
($M_r$ H₂ = 2, H₂O = 18)

**Penyelesaian:**
1. Hitung mol H₂:
   $$n_{H_2} = \\frac{4}{2} = 2 \\text{ mol}$$

2. Hitung mol H₂O:
   $$\\frac{n_{H_2}}{2} = \\frac{n_{H_2O}}{2}$$
   $$n_{H_2O} = 2 \\text{ mol}$$

3. Hitung massa H₂O:
   $$m_{H_2O} = 2 \\times 18 = 36 \\text{ gram}$$

### Contoh Soal 3:
Reaksi: $C_3H_8 + 5O_2 \\longrightarrow 3CO_2 + 4H_2O$

Berapa liter gas CO₂ (STP) yang dihasilkan dari pembakaran 22 gram C₃H₈?
($M_r$ C₃H₈ = 44)

**Penyelesaian:**
1. Mol C₃H₈:
   $$n_{C_3H_8} = \\frac{22}{44} = 0,5 \\text{ mol}$$

2. Mol CO₂:
   $$\\frac{n_{C_3H_8}}{1} = \\frac{n_{CO_2}}{3}$$
   $$n_{CO_2} = 0,5 \\times 3 = 1,5 \\text{ mol}$$

3. Volume CO₂ pada STP:
   $$V = n \\times 22,4 = 1,5 \\times 22,4 = 33,6 \\text{ liter}$$

## Jenis-Jenis Reaksi

### 1. Reaksi Sintesis (Pembentukan)
$$A + B \\longrightarrow AB$$
Contoh: $2H_2 + O_2 \\longrightarrow 2H_2O$

### 2. Reaksi Penguraian (Dekomposisi)
$$AB \\longrightarrow A + B$$
Contoh: $2H_2O \\longrightarrow 2H_2 + O_2$

### 3. Reaksi Substitusi (Penggantian)
$$AB + C \\longrightarrow AC + B$$
Contoh: $Zn + CuSO_4 \\longrightarrow ZnSO_4 + Cu$

### 4. Reaksi Metatesis (Pertukaran)
$$AB + CD \\longrightarrow AD + CB$$
Contoh: $AgNO_3 + NaCl \\longrightarrow AgCl + NaNO_3$

## Tips Penting

- Koefisien reaksi tidak boleh pecahan (kecuali untuk penyederhanaan sementara)
- Koefisien 1 biasanya tidak ditulis
- Persamaan reaksi harus setara (jumlah atom sama di kedua ruas)
- Gunakan koefisien terkecil yang mungkin
- Mol adalah kunci dalam perhitungan stoikiometri
  `
};
