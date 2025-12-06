import { ModuleContent } from '../types';

export const PengenceranLarutanContent: ModuleContent = {
  id: 'mod-8',
  title: 'Pengenceran Larutan',
  description: 'Memahami prinsip pengenceran dan cara menghitung konsentrasi larutan setelah pengenceran.',
  difficulty: 'Easy',
  content: `
# Pengenceran Larutan

## Pengertian
**Pengenceran** adalah proses menambahkan pelarut ke dalam larutan untuk mengurangi konsentrasinya, tanpa mengubah jumlah mol zat terlarut.

### Prinsip Dasar:
$$\\text{mol sebelum pengenceran} = \\text{mol setelah pengenceran}$$

## Rumus Pengenceran

### Rumus Utama:
$$V_1 \\times M_1 = V_2 \\times M_2$$

Dimana:
- $V_1$ = Volume larutan awal (sebelum diencerkan)
- $M_1$ = Konsentrasi larutan awal
- $V_2$ = Volume larutan akhir (setelah diencerkan)
- $M_2$ = Konsentrasi larutan akhir

### Rumus untuk Persen:
$$V_1 \\times \\%_1 = V_2 \\times \\%_2$$

### Menghitung Volume Pelarut yang Ditambahkan:
$$V_{\\text{pelarut}} = V_2 - V_1$$

## Faktor Pengenceran (FP)

$$FP = \\frac{V_2}{V_1} = \\frac{M_1}{M_2}$$

Konsentrasi setelah pengenceran:
$$M_2 = \\frac{M_1}{FP}$$

## Langkah-Langkah Pengenceran

1. Identifikasi data yang diketahui ($V_1$, $M_1$, $V_2$, atau $M_2$)
2. Tentukan besaran yang ditanyakan
3. Gunakan rumus $V_1 \\times M_1 = V_2 \\times M_2$
4. Hitung volume pelarut jika diperlukan: $V_{pelarut} = V_2 - V_1$

## Contoh Soal

### Contoh 1:
Berapa mL air yang harus ditambahkan ke dalam 50 mL larutan HCl 6 M untuk membuat larutan HCl 2 M?

**Penyelesaian:**
$$V_1 \\times M_1 = V_2 \\times M_2$$
$$50 \\times 6 = V_2 \\times 2$$
$$V_2 = \\frac{300}{2} = 150 \\text{ mL}$$

Volume air yang ditambahkan:
$$V_{air} = V_2 - V_1 = 150 - 50 = 100 \\text{ mL}$$

### Contoh 2:
Larutan H₂SO₄ 98% (m/m) dengan massa jenis 1,8 g/mL akan diencerkan menjadi larutan 20% (m/m). Berapa mL air yang harus ditambahkan ke dalam 100 mL larutan H₂SO₄ pekat?

**Penyelesaian:**
Massa larutan pekat:
$$m_1 = V_1 \\times \\rho = 100 \\times 1,8 = 180 \\text{ gram}$$

Massa H₂SO₄ murni:
$$m_{H_2SO_4} = 98\\% \\times 180 = 176,4 \\text{ gram}$$

Massa larutan encer yang diinginkan:
$$\\%_2 = \\frac{m_{H_2SO_4}}{m_2} \\times 100\\%$$
$$20\\% = \\frac{176,4}{m_2} \\times 100\\%$$
$$m_2 = \\frac{176,4}{0,2} = 882 \\text{ gram}$$

Massa air yang ditambahkan:
$$m_{air} = 882 - 180 = 702 \\text{ gram} \\approx 702 \\text{ mL}$$

### Contoh 3:
Sebanyak 200 mL larutan NaOH 0,5 M diencerkan dengan menambahkan 300 mL air. Berapakah konsentrasi larutan setelah pengenceran?

**Penyelesaian:**
$$V_2 = V_1 + V_{air} = 200 + 300 = 500 \\text{ mL}$$
$$V_1 \\times M_1 = V_2 \\times M_2$$
$$200 \\times 0,5 = 500 \\times M_2$$
$$M_2 = \\frac{100}{500} = 0,2 \\text{ M}$$

## Tips Penting

- Selalu tambahkan **asam ke air**, bukan sebaliknya (untuk keamanan)
- Jumlah mol zat terlarut **tetap** saat pengenceran
- Volume akhir = Volume awal + Volume pelarut yang ditambahkan
- Pengenceran menurunkan konsentrasi tetapi tidak mengubah sifat kimia zat
  `
};