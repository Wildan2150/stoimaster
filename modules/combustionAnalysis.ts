import { ModuleContent } from '../types';

export const CombustionAnalysisContent: ModuleContent = {
  id: 'mod-13',
  title: 'Pembakaran & Analisis Produk',
  description: 'Menentukan rumus kimia senyawa organik melalui data hasil pembakaran (CO2 dan H2O).',
  difficulty: 'Hard',
  content: `
# Stoikiometri Reaksi Pembakaran

*(Preview Konten - Silakan lengkapi detail materi di sini)*

## Poin Utama:
1. **Prinsip Analisis Unsur**
   - Semua C dalam sampel $\\rightarrow$ $CO_2$.
   - Semua H dalam sampel $\\rightarrow$ $H_2O$.
   - Massa O dicari dari selisih massa total.

2. **Alur Perhitungan**
   - Massa Absorber $\\rightarrow$ Massa C & H $\\rightarrow$ Mol C & H $\\rightarrow$ Rasio Mol.

3. **Mencari Rumus Molekul**
   - Hubungan rumus empiris hasil pembakaran dengan massa molar zat.

## Aplikasi
- Uji emisi kendaraan bermotor.
- Biofuel dan pembakaran sempurna vs tidak sempurna.
`
};