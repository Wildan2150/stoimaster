import { ModuleContent } from '../types';

export const ConceptMol: ModuleContent = {
  id: 'mod-1',
  title: 'Konsep Mol',
  description: 'Pengenalan dasar tentang satuan mol, bilangan Avogadro, dan konversi dasar.',
  difficulty: 'Easy',
  content: `
# Konsep Mol

**Mol** adalah satuan dasar dalam kimia untuk menyatakan jumlah zat. Satu mol zat mengandung jumlah partikel yang sama dengan jumlah atom yang terdapat dalam 12 gram karbon-12.

## Bilangan Avogadro ($N_A$)
Jumlah partikel dalam satu mol didefinisikan sebagai:
$$N_A = 6,022 \\times 10^{23} \\text{ partikel/mol}$$

Partikel ini bisa berupa:
- **Atom** (untuk unsur)
- **Molekul** (untuk senyawa kovalen)
- **Ion** (untuk senyawa ionik)
- **Elektron**, proton, neutron, dll.

## Rumus Dasar

### 1. Hubungan Mol dan Jumlah Partikel
$$n = \\frac{X}{N_A} = \\frac{X}{6,022 \\times 10^{23}}$$

Dimana:
- $n$ = jumlah mol
- $X$ = jumlah partikel
- $N_A$ = bilangan Avogadro

### 2. Hubungan Mol dan Massa
$$n = \\frac{m}{M_r} \\text{ atau } n = \\frac{m}{A_r}$$

Dimana:
- $m$ = massa zat (gram)
- $M_r$ = massa molekul relatif (untuk senyawa)
- $A_r$ = massa atom relatif (untuk unsur)

### 3. Hubungan Mol dan Volume Gas (STP)
Pada keadaan standar (STP: 0°C, 1 atm):
$$n = \\frac{V}{22,4}$$

Dimana:
- $V$ = volume gas (liter)
- 22,4 L = volume molar gas pada STP

## Segitiga Konversi Mol

\`\`\`
        Jumlah Partikel (X)
              ↑ ↓
              × N_A  ÷ N_A
              ↑ ↓
            MOL (n)
         ↗    ↑ ↓    ↖
    × Ar/Mr   ↑ ↓   ÷ Ar/Mr
       ↗      ↑ ↓      ↖
   Massa    × 22,4    Volume Gas
    (m)     ÷ 22,4      (V, STP)
\`\`\`

## Contoh Soal

### Contoh 1: Mol ke Jumlah Partikel
Berapa jumlah molekul dalam 2 mol air (H₂O)?

**Penyelesaian:**
$$X = n \\times N_A$$
$$X = 2 \\times 6,022 \\times 10^{23}$$
$$X = 1,2044 \\times 10^{24} \\text{ molekul}$$

### Contoh 2: Massa ke Mol
Berapa mol dalam 36 gram air (H₂O)?
($M_r$ H₂O = 18)

**Penyelesaian:**
$$n = \\frac{m}{M_r} = \\frac{36}{18} = 2 \\text{ mol}$$

### Contoh 3: Volume Gas ke Mol
Berapa mol gas oksigen (O₂) dalam 11,2 liter pada STP?

**Penyelesaian:**
$$n = \\frac{V}{22,4} = \\frac{11,2}{22,4} = 0,5 \\text{ mol}$$

### Contoh 4: Konversi Lengkap
Berapa jumlah atom dalam 8 gram gas oksigen (O₂)?
($A_r$ O = 16)

**Penyelesaian:**
1. Hitung mol O₂:
   $$n_{O_2} = \\frac{8}{32} = 0,25 \\text{ mol}$$

2. Hitung jumlah molekul O₂:
   $$\\text{Molekul } O_2 = 0,25 \\times 6,022 \\times 10^{23} = 1,5055 \\times 10^{23}$$

3. Karena 1 molekul O₂ = 2 atom O:
   $$\\text{Atom O} = 2 \\times 1,5055 \\times 10^{23} = 3,011 \\times 10^{23} \\text{ atom}$$

## Aplikasi Konsep Mol

### Menghitung Jumlah Atom dalam Senyawa
Untuk senyawa dengan rumus $A_xB_y$:
- Jumlah atom A = $n \\times x \\times N_A$
- Jumlah atom B = $n \\times y \\times N_A$

**Contoh:**
Berapa jumlah atom H dan O dalam 0,5 mol H₂O?

- Atom H = $0,5 \\times 2 \\times 6,022 \\times 10^{23} = 6,022 \\times 10^{23}$ atom
- Atom O = $0,5 \\times 1 \\times 6,022 \\times 10^{23} = 3,011 \\times 10^{23}$ atom

## Tips Penting

- Selalu perhatikan satuan yang digunakan
- Mol adalah "jembatan" untuk konversi antar besaran
- Untuk senyawa, gunakan $M_r$; untuk unsur, gunakan $A_r$
- Volume molar 22,4 L hanya berlaku pada STP
- Bedakan antara jumlah molekul dan jumlah atom
  `
};
