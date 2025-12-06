import { ModuleContent } from '../types';

export const KadarZatContent: ModuleContent = {
  id: 'mod-7',
  title: 'Kadar Zat',
  description: 'Memahami berbagai cara menyatakan konsentrasi larutan: persen massa, persen volume, dan ppm.',
  difficulty: 'Medium',
  content: `
# Kadar Zat

## Pengertian
**Kadar zat** atau **konsentrasi** menyatakan jumlah zat terlarut dalam sejumlah larutan atau pelarut.

## Jenis-Jenis Kadar Zat

### 1. Persen Massa (% m/m atau % b/b)
Menyatakan massa zat terlarut dalam 100 gram larutan.

$$\\% \\frac{m}{m} = \\frac{\\text{massa zat terlarut}}{\\text{massa larutan}} \\times 100\\%$$

$$\\% \\frac{m}{m} = \\frac{\\text{massa zat terlarut}}{\\text{massa zat terlarut + massa pelarut}} \\times 100\\%$$

**Contoh:**
Larutan gula 10% (m/m) berarti dalam 100 gram larutan terdapat 10 gram gula.

### 2. Persen Volume (% v/v)
Menyatakan volume zat terlarut dalam 100 mL larutan.

$$\\% \\frac{v}{v} = \\frac{\\text{volume zat terlarut}}{\\text{volume larutan}} \\times 100\\%$$

**Contoh:**
Alkohol 70% (v/v) berarti dalam 100 mL larutan terdapat 70 mL alkohol murni.

### 3. Persen Massa-Volume (% m/v atau % b/v)
Menyatakan massa zat terlarut (gram) dalam 100 mL larutan.

$$\\% \\frac{m}{v} = \\frac{\\text{massa zat terlarut (g)}}{\\text{volume larutan (mL)}} \\times 100\\%$$

**Contoh:**
Larutan NaCl 0,9% (m/v) berarti dalam 100 mL larutan terdapat 0,9 gram NaCl.

### 4. Part Per Million (ppm)
Menyatakan jumlah zat terlarut dalam satu juta bagian larutan. Digunakan untuk larutan sangat encer.

$$\\text{ppm} = \\frac{\\text{massa zat terlarut}}{\\text{massa larutan}} \\times 10^6$$

Untuk larutan encer (massa jenis ≈ 1 g/mL):
$$\\text{ppm} = \\frac{\\text{massa zat terlarut (mg)}}{\\text{volume larutan (L)}}$$

**Konversi:**
- 1 ppm = 1 mg/L = 0,0001% (m/v)
- 1% = 10.000 ppm

## Hubungan Kadar dengan Molaritas

Untuk larutan dengan massa jenis ($\\rho$) diketahui:

$$M = \\frac{\\% \\times \\rho \\times 10}{M_r}$$

Dimana:
- $M$ = Molaritas (mol/L)
- $\\%$ = Persen massa
- $\\rho$ = Massa jenis (g/mL)
- $M_r$ = Massa molekul relatif

### Contoh Soal 1:
Berapa gram NaOH yang dibutuhkan untuk membuat 500 mL larutan NaOH 20% (m/v)?

**Penyelesaian:**
$$\\% \\frac{m}{v} = \\frac{\\text{massa NaOH}}{\\text{volume larutan}} \\times 100\\%$$

$$20\\% = \\frac{\\text{massa NaOH}}{500 \\text{ mL}} \\times 100\\%$$

$$\\text{massa NaOH} = \\frac{20 \\times 500}{100} = 100 \\text{ gram}$$

### Contoh Soal 2:
Konsentrasi ion timbal (Pb) dalam air sebesar 5 ppm. Berapa gram ion Pb dalam 2 liter air tersebut?

**Penyelesaian:**
$$\\text{ppm} = \\frac{\\text{massa Pb (mg)}}{\\text{volume (L)}}$$

$$5 = \\frac{\\text{massa Pb (mg)}}{2}$$

$$\\text{massa Pb} = 10 \\text{ mg} = 0,01 \\text{ gram}$$
  `
};