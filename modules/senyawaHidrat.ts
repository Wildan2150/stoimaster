import { ModuleContent } from '../types';

export const SenyawaHidratContent: ModuleContent = {
  id: 'mod-6',
  title: 'Senyawa Hidrat',
  description: 'Memahami senyawa hidrat, rumus kimia, dan cara menentukan jumlah air kristal.',
  difficulty: 'Medium',
  content: `
# Senyawa Hidrat

## Pengertian
**Senyawa hidrat** adalah senyawa yang mengikat molekul air ($H_2O$) dalam struktur kristalnya. Molekul air ini disebut **air kristal**.

### Contoh Senyawa Hidrat:
- $CuSO_4 \\cdot 5H_2O$ (Tembaga(II) sulfat pentahidrat)
- $Na_2CO_3 \\cdot 10H_2O$ (Natrium karbonat dekahidrat)
- $CaCl_2 \\cdot 6H_2O$ (Kalsium klorida heksahidrat)
- $MgSO_4 \\cdot 7H_2O$ (Magnesium sulfat heptahidrat)

## Penamaan
Format: **Nama senyawa + awalan jumlah air + hidrat**

| Jumlah $H_2O$ | Awalan |
|---------------|---------|
| 1 | mono |
| 2 | di |
| 3 | tri |
| 4 | tetra |
| 5 | penta |
| 6 | heksa |
| 7 | hepta |
| 8 | okta |
| 10 | deka |

## Senyawa Anhidrat
**Senyawa anhidrat** adalah senyawa hidrat yang telah kehilangan air kristalnya melalui pemanasan.

$$CuSO_4 \\cdot 5H_2O \\xrightarrow{\\text{dipanaskan}} CuSO_4 + 5H_2O$$

## Menentukan Rumus Senyawa Hidrat

### Rumus:
$$\\frac{n_{\\text{senyawa anhidrat}}}{n_{\\text{air kristal}}} = \\frac{1}{x}$$

Dimana $x$ = jumlah molekul air kristal

### Langkah-langkah:
1. Hitung massa air yang hilang
   $$\\text{massa } H_2O = \\text{massa hidrat} - \\text{massa anhidrat}$$

2. Hitung mol senyawa anhidrat dan mol air
   $$n = \\frac{\\text{massa}}{M_r}$$

3. Tentukan perbandingan mol (bagi dengan mol terkecil)

4. Tulis rumus hidrat

### Contoh Soal:
Sebanyak 12,5 gram $CuSO_4 \\cdot xH_2O$ dipanaskan hingga semua air kristalnya menguap. Massa padatan yang tersisa adalah 8 gram. Tentukan nilai $x$ dan rumus senyawa hidratnya!
($M_r$ $CuSO_4$ = 160, $H_2O$ = 18)

**Penyelesaian:**
- Massa $H_2O$ = 12,5 - 8 = 4,5 gram
- Mol $CuSO_4$ = $\\frac{8}{160} = 0,05$ mol
- Mol $H_2O$ = $\\frac{4,5}{18} = 0,25$ mol
- Perbandingan: $CuSO_4 : H_2O = 0,05 : 0,25 = 1 : 5$

**Rumus hidrat: $CuSO_4 \\cdot 5H_2O$**

## Perhitungan Kadar Air Kristal

### Rumus:
$$\\% \\text{ kadar air} = \\frac{\\text{massa } H_2O}{\\text{massa hidrat}} \\times 100\\%$$

Atau dengan $M_r$:
$$\\% \\text{ kadar air} = \\frac{x \\times M_r(H_2O)}{M_r \\text{ hidrat}} \\times 100\\%$$
  `
};