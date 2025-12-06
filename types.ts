export enum ViewState {
  MODULES = 'MODULES',
  SIMULATION = 'SIMULATION',
  CALCULATOR = 'CALCULATOR',
  AI_CONSULTANT = 'AI_CONSULTANT',
  ASSESSMENT = 'ASSESSMENT',
  MINI_LAB = 'MINI_LAB'
}

export type LearningMode = 'TIMELINE' | 'FREE';

export interface ModuleContent {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown supported
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prerequisites?: string[]; // Array of Module IDs required to unlock this
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  color: string;
  shells: number[];
  category: string;
  summary: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
  topic: string;
}

export type ModuleStatus = 'LOCKED' | 'UNLOCKED' | 'COMPLETED';

export interface UserProgress {
  [moduleId: string]: {
    status: ModuleStatus;
    score: number;
  };
}