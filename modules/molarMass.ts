import { ModuleContent } from '../types';

export const MolarMass: ModuleContent = {
  id: 'mod-2',
  title: 'Massa Molar',
  description: 'Memahami cara menghitung massa atom relatif, massa molekul relatif, dan aplikasinya.',
  difficulty: 'Easy',
  content: `
# Massa Molar

## Pengertian

### Massa Atom Relatif ($A_r$)
**Massa atom relatif** adalah perbandingan massa rata-rata satu atom suatu unsur terhadap 1/12 massa satu atom karbon-12.

$$A_r = \\frac{\\text{massa rata-rata 1 atom unsur}}{\\frac{1}{12} \\times \\text{massa 1 atom C-12}}$$

### Massa Molekul Relatif ($M_r$)
**Massa molekul relatif** adalah jumlah massa atom relatif semua atom yang menyusun satu molekul senyawa.

$$M_r = \\sum (A_r \\times \\text{jumlah atom})$$

### Massa Molar
**Massa molar** adalah massa satu mol zat, satuannya gram/mol (g/mol).

Secara numerik: **Massa Molar = $A_r$ atau $M_r$**

Contoh: $M_r$ H₂O = 18, maka massa molar H₂O = 18 g/mol

## Cara Menghitung Massa Molekul Relatif

### Langkah-langkah:
1. Tentukan rumus kimia senyawa
2. Hitung jumlah setiap atom dalam rumus
3. Kalikan $A_r$ setiap atom dengan jumlahnya
4. Jumlahkan semua hasil perkalian

### Contoh 1: H₂SO₄
$$M_r = (2 \\times A_r \\text{ H}) + (1 \\times A_r \\text{ S}) + (4 \\times A_r \\text{ O})$$
$$M_r = (2 \\times 1) + (1 \\times 32) + (4 \\times 16)$$
$$M_r = 2 + 32 + 64 = 98$$

### Contoh 2: Ca(OH)₂
$$M_r = (1 \\times A_r \\text{ Ca}) + (2 \\times A_r \\text{ O}) + (2 \\times A_r \\text{ H})$$
$$M_r = (1 \\times 40) + (2 \\times 16) + (2 \\times 1)$$
$$M_r = 40 + 32 + 2 = 74$$

### Contoh 3: Al₂(SO₄)₃
$$M_r = (2 \\times A_r \\text{ Al}) + (3 \\times A_r \\text{ S}) + (12 \\times A_r \\text{ O})$$
$$M_r = (2 \\times 27) + (3 \\times 32) + (12 \\times 16)$$
$$M_r = 54 + 96 + 192 = 342$$

## Hubungan Massa, Mol, dan Massa Molar

### Rumus Dasar:
$$n = \\frac{m}{M_r}$$

Atau:
$$m = n \\times M_r$$

Dimana:
- $n$ = jumlah mol
- $m$ = massa (gram)
- $M_r$ = massa molekul relatif (g/mol)

## Massa Atom Relatif Rata-rata (Isotop)

Jika suatu unsur memiliki beberapa isotop:

$$A_r \\text{ rata-rata} = \\frac{\\sum (A_r \\text{ isotop} \\times \\% \\text{ kelimpahan})}{100}$$

### Contoh:
Unsur klorin memiliki dua isotop:
- $^{35}Cl$ dengan kelimpahan 75%
- $^{37}Cl$ dengan kelimpahan 25%

Hitung $A_r$ rata-rata Cl!

**Penyelesaian:**
$$A_r \\text{ Cl} = \\frac{(35 \\times 75) + (37 \\times 25)}{100}$$
$$A_r \\text{ Cl} = \\frac{2625 + 925}{100} = \\frac{3550}{100} = 35,5$$

## Aplikasi dalam Perhitungan

### Contoh Soal 1:
Berapa gram massa 0,25 mol glukosa (C₆H₁₂O₆)?
($A_r$ C = 12, H = 1, O = 16)

**Penyelesaian:**
1. Hitung $M_r$ glukosa:
   $$M_r = (6 \\times 12) + (12 \\times 1) + (6 \\times 16) = 180$$

2. Hitung massa:
   $$m = n \\times M_r = 0,25 \\times 180 = 45 \\text{ gram}$$

### Contoh Soal 2:
Berapa mol dalam 49 gram asam sulfat (H₂SO₄)?
($M_r$ H₂SO₄ = 98)

**Penyelesaian:**
$$n = \\frac{m}{M_r} = \\frac{49}{98} = 0,5 \\text{ mol}$$

### Contoh Soal 3:
Manakah yang memiliki jumlah partikel lebih banyak: 32 gram O₂ atau 32 gram SO₂?
($A_r$ O = 16, S = 32)

**Penyelesaian:**
1. Mol O₂:
   $$n_{O_2} = \\frac{32}{32} = 1 \\text{ mol}$$

2. Mol SO₂:
   $$M_r \\text{ SO}_2 = 32 + (2 \\times 16) = 64$$
   $$n_{SO_2} = \\frac{32}{64} = 0,5 \\text{ mol}$$

**Kesimpulan:** O₂ memiliki jumlah partikel lebih banyak karena molnya lebih besar.

## Tips Penting

- Perhatikan tanda kurung dalam rumus kimia: Ca(OH)₂ berarti 2 atom O dan 2 atom H
- Massa molar dalam gram/mol secara numerik sama dengan $M_r$
- Mol yang lebih besar = jumlah partikel yang lebih banyak
- Selalu hitung $M_r$ dengan teliti, kesalahan di sini akan mempengaruhi semua perhitungan
  `
};
