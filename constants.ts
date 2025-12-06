import { ModuleContent, ElementData, Question } from './types';
import { ConceptMol } from './modules/conceptMol';
import { MolarMass } from './modules/molarMass';
import { ReactionEquation } from './modules/reactionEquation';
import { LimitingReactant } from './modules/limitingReactant';
import { RumusEmpirisModuleContent } from './modules/empiricalFormula';
import { SenyawaHidratContent } from './modules/senyawaHidrat';
import { KadarZatContent } from './modules/kadarZat';
import { PengenceranLarutanContent } from './modules/pengenceranLarutan';
// New Modules
import { GasIdealContent } from './modules/gasIdeal';
import { TitrationContent } from './modules/titration';
import { ThermochemistryContent } from './modules/thermochemistry';
import { PercentYieldContent } from './modules/percentYield';
import { CombustionAnalysisContent } from './modules/combustionAnalysis';
import { EquilibriumStoicContent } from './modules/equilibriumStoic';
import { ContextualBankContent } from './modules/contextualBank';

// Inject Prerequisites to create a dependency chain
ConceptMol.prerequisites = []; // Starting point
MolarMass.prerequisites = ['mod-1'];
ReactionEquation.prerequisites = ['mod-2'];
LimitingReactant.prerequisites = ['mod-3'];
RumusEmpirisModuleContent.prerequisites = ['mod-2']; // Can be done after Molar Mass
SenyawaHidratContent.prerequisites = ['mod-5'];
KadarZatContent.prerequisites = ['mod-2'];
PengenceranLarutanContent.prerequisites = ['mod-7'];
GasIdealContent.prerequisites = ['mod-1'];
TitrationContent.prerequisites = ['mod-8', 'mod-3'];
ThermochemistryContent.prerequisites = ['mod-3'];
PercentYieldContent.prerequisites = ['mod-4'];
CombustionAnalysisContent.prerequisites = ['mod-5', 'mod-3'];
EquilibriumStoicContent.prerequisites = ['mod-4'];
ContextualBankContent.prerequisites = ['mod-4']; // Unlocks after mastering Limiting Reactant

export const LEARNING_MODULES: ModuleContent[] = [
  ConceptMol,
  MolarMass,
  ReactionEquation,
  LimitingReactant,
  RumusEmpirisModuleContent,
  SenyawaHidratContent,
  KadarZatContent,
  PengenceranLarutanContent,
  GasIdealContent,
  TitrationContent,
  ThermochemistryContent,
  PercentYieldContent,
  CombustionAnalysisContent,
  EquilibriumStoicContent,
  ContextualBankContent
];

export const SHELL_LABELS = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

export const ELEMENTS: ElementData[] = [
  { 
    atomicNumber: 1, 
    symbol: 'H', 
    name: 'Hidrogen', 
    atomicMass: 1.008, 
    color: '#ef4444', 
    shells: [1],
    category: 'Non-Logam',
    summary: 'Elemen paling ringan dan paling melimpah di alam semesta. Komponen utama air dan bahan bakar organik.'
  },
  { 
    atomicNumber: 6, 
    symbol: 'C', 
    name: 'Karbon', 
    atomicMass: 12.011, 
    color: '#334155', 
    shells: [2, 4],
    category: 'Non-Logam',
    summary: 'Dasar dari semua kehidupan organik. Dapat membentuk ikatan rantai panjang yang kompleks.'
  },
  { 
    atomicNumber: 7, 
    symbol: 'N', 
    name: 'Nitrogen', 
    atomicMass: 14.007, 
    color: '#3b82f6', 
    shells: [2, 5],
    category: 'Non-Logam',
    summary: 'Gas yang menyusun 78% atmosfer bumi. Penting untuk asam amino dan DNA.'
  },
  { 
    atomicNumber: 8, 
    symbol: 'O', 
    name: 'Oksigen', 
    atomicMass: 15.999, 
    color: '#0ea5e9', 
    shells: [2, 6],
    category: 'Non-Logam',
    summary: 'Sangat reaktif dan penting untuk respirasi makhluk hidup serta proses pembakaran.'
  },
  { 
    atomicNumber: 11, 
    symbol: 'Na', 
    name: 'Natrium', 
    atomicMass: 22.990, 
    color: '#eab308', 
    shells: [2, 8, 1],
    category: 'Logam Alkali',
    summary: 'Logam lunak yang sangat reaktif dengan air. Komponen utama garam dapur (NaCl).'
  },
  { 
    atomicNumber: 16, 
    symbol: 'S', 
    name: 'Belerang', 
    atomicMass: 32.06, 
    color: '#facc15', 
    shells: [2, 8, 6],
    category: 'Non-Logam',
    summary: 'Padatan kuning rapuh. Ditemukan di daerah vulkanik dan digunakan dalam asam sulfat.'
  },
  { 
    atomicNumber: 17, 
    symbol: 'Cl', 
    name: 'Klorin', 
    atomicMass: 35.45, 
    color: '#22c55e', 
    shells: [2, 8, 7],
    category: 'Halogen',
    summary: 'Gas berwarna kuning-hijau yang beracun. Digunakan sebagai disinfektan air.'
  },
  { 
    atomicNumber: 18, 
    symbol: 'Ar', 
    name: 'Argon', 
    atomicMass: 39.95, 
    color: '#a855f7', 
    shells: [2, 8, 8],
    category: 'Gas Mulia',
    summary: 'Gas mulia yang stabil dan tidak reaktif. Digunakan dalam bola lampu pijar.'
  }
];

export const QUESTIONS: Question[] = [
  {
    id: 1,
    topic: "Konsep Mol",
    question: "Berapakah jumlah partikel yang terkandung dalam 1 mol zat (Bilangan Avogadro)?",
    options: [
      "$6,022 \\times 10^{22}$",
      "$6,022 \\times 10^{23}$",
      "$6,022 \\times 10^{24}$",
      "$1,66 \\times 10^{-24}$",
      "$1,00 \\times 10^{23}$"
    ],
    correctAnswer: 1,
    explanation: "Satu mol zat mengandung $6,022 \\times 10^{23}$ partikel. Angka ini dikenal sebagai bilangan Avogadro."
  },
  {
    id: 2,
    topic: "Massa Molar",
    question: "Diketahui $A_r$ H = 1 dan O = 16. Berapakah massa molekul relatif ($M_r$) dari air ($H_2O$)?",
    options: [
      "17 g/mol",
      "18 g/mol",
      "20 g/mol",
      "32 g/mol",
      "36 g/mol"
    ],
    correctAnswer: 1,
    explanation: "$M_r H_2O = (2 \\times A_r H) + (1 \\times A_r O) = (2 \\times 1) + 16 = 18$ g/mol."
  },
  {
    id: 3,
    topic: "Persamaan Reaksi",
    question: "Agar reaksi $N_2 + H_2 \\rightarrow NH_3$ menjadi setara, koefisien untuk $H_2$ dan $NH_3$ berturut-turut adalah...",
    options: [
      "1 dan 2",
      "2 dan 3",
      "3 dan 2",
      "2 dan 1",
      "3 dan 1"
    ],
    correctAnswer: 2,
    explanation: "Reaksi setara: $N_2 + 3H_2 \\rightarrow 2NH_3$. Jadi koefisien $H_2$ adalah 3 dan $NH_3$ adalah 2."
  },
  {
    id: 4,
    topic: "Konsep Mol",
    question: "Berapa mol yang terdapat dalam 8 gram gas Metana ($CH_4$)? ($A_r$ C=12, H=1)",
    options: [
      "0,5 mol",
      "1,0 mol",
      "2,0 mol",
      "0,25 mol",
      "0,1 mol"
    ],
    correctAnswer: 0,
    explanation: "$M_r CH_4 = 12 + (4 \\times 1) = 16$. Mol = massa/$M_r$ = 8/16 = 0,5 mol."
  },
  {
    id: 5,
    topic: "Pereaksi Pembatas",
    question: "Jika 2 mol A bereaksi dengan 5 mol B menurut reaksi $A + 2B \\rightarrow C$, manakah pereaksi pembatasnya?",
    options: [
      "Zat A",
      "Zat B",
      "Zat C",
      "Tidak ada",
      "A dan B habis bersamaan"
    ],
    correctAnswer: 0,
    explanation: "Hitung mol/koefisien. A: 2/1 = 2. B: 5/2 = 2,5. Karena 2 < 2,5, maka A habis duluan (pembatas)."
  },
  {
    id: 6,
    topic: "Kadar Zat",
    question: "Berapa gram gula yang diperlukan untuk membuat 200 gram larutan gula 10% (m/m)?",
    options: [
      "10 gram",
      "20 gram",
      "200 gram",
      "50 gram",
      "100 gram"
    ],
    correctAnswer: 1,
    explanation: "Massa zat = (% $\\times$ massa larutan) / 100 = (10 $\\times$ 200) / 100 = 20 gram."
  },
  {
    id: 7,
    topic: "Rumus Empiris",
    question: "Senyawa dengan rumus molekul $C_6H_{12}O_6$ memiliki rumus empiris...",
    options: [
      "$CHO$",
      "$CH_2O$",
      "$C_2H_4O_2$",
      "$CH_2$",
      "$CHO_2$"
    ],
    correctAnswer: 1,
    explanation: "Bagi semua indeks dengan faktor persekutuan terbesar (6). C(6/6)H(12/6)O(6/6) = $CH_2O$."
  },
  {
    id: 8,
    topic: "Senyawa Hidrat",
    question: "Apa nama senyawa hidrat $CuSO_4 \\cdot 5H_2O$?",
    options: [
      "Tembaga(II) sulfat hidrat",
      "Tembaga sulfat pentahidrat",
      "Tembaga(II) sulfat pentahidrat",
      "Tembaga(II) sulfat heksahidrat",
      "Tembaga sulfat dekahidrat"
    ],
    correctAnswer: 2,
    explanation: "$CuSO_4$ adalah Tembaga(II) sulfat. Awalan 5 adalah penta. Jadi Tembaga(II) sulfat pentahidrat."
  }
];