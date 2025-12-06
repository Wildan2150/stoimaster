import { ModuleContent } from '../types';

export const RumusEmpirisModuleContent: ModuleContent = {
  id: 'mod-5',
  title: 'Rumus Empiris & Molekul',
  description: 'Memahami perbedaan rumus empiris dan rumus molekul serta cara menentukannya.',
  difficulty: 'Medium',
  content: `
# Rumus Empiris & Molekul

## Rumus Empiris
**Rumus empiris** adalah rumus kimia yang menyatakan perbandingan atom-atom penyusun senyawa dalam bentuk **bilangan bulat paling sederhana**.

### Contoh:
- Glukosa (C₆H₁₂O₆) memiliki rumus empiris **CH₂O**
- Hidrogen peroksida (H₂O₂) memiliki rumus empiris **HO**
- Benzena (C₆H₆) memiliki rumus empiris **CH**

## Rumus Molekul
**Rumus molekul** adalah rumus kimia yang menyatakan **jumlah atom sebenarnya** dari setiap unsur dalam satu molekul senyawa.

### Hubungan Rumus Empiris dan Molekul:
$$\\text{Rumus Molekul} = (\\text{Rumus Empiris})_n$$

Dimana $n$ adalah bilangan bulat positif.

## Cara Menentukan Rumus Empiris

### Langkah-langkah:
1. **Ubah massa atau persentase menjadi mol**
   $$n = \\frac{\\text{massa}}{A_r} \\text{ atau } n = \\frac{\\text{persentase}}{A_r}$$

2. **Bagi semua hasil dengan nilai mol terkecil**
   
3. **Bulatkan ke bilangan bulat sederhana**
   - Jika mendapat 1,5 → kalikan semua dengan 2
   - Jika mendapat 1,33 → kalikan semua dengan 3
   - Jika mendapat 1,25 → kalikan semua dengan 4

### Contoh Soal:
Suatu senyawa mengandung 40% C, 6,7% H, dan 53,3% O. Tentukan rumus empirisnya!
($A_r$ C = 12, H = 1, O = 16)

**Penyelesaian:**
- Mol C = $\\frac{40}{12} = 3,33$
- Mol H = $\\frac{6,7}{1} = 6,7$
- Mol O = $\\frac{53,3}{16} = 3,33$

Bagi dengan nilai terkecil (3,33):
- C : H : O = 1 : 2 : 1

**Rumus empiris: CH₂O**

## Menentukan Rumus Molekul

Jika diketahui **massa molekul relatif** ($M_r$):

$$n = \\frac{M_r \\text{ molekul}}{M_r \\text{ empiris}}$$

$$\\text{Rumus Molekul} = (\\text{Rumus Empiris})_n$$

### Contoh:
Rumus empiris suatu senyawa adalah CH₂O dengan $M_r$ = 180. Tentukan rumus molekulnya!

**Penyelesaian:**
- $M_r$ empiris CH₂O = 12 + 2(1) + 16 = 30
- $n = \\frac{180}{30} = 6$
- Rumus molekul = (CH₂O)₆ = **C₆H₁₂O₆**
  `
};