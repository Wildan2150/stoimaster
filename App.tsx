
import React, { useState, useEffect, useRef } from 'react';
import { ViewState, UserProgress, LearningMode } from './types';
import { LEARNING_MODULES } from './constants';
import { ModuleViewer } from './components/ModuleViewer';
import { Simulation } from './components/Simulation';
import { Calculator } from './components/Calculator';
import { AIChat } from './components/AIChat';
import { Assessment } from './components/Assessment';
import { MiniLab } from './components/MiniLab';
import { LandingPage } from './components/LandingPage';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  FlaskConical, 
  Calculator as CalcIcon, 
  BookOpen, 
  Bot, 
  Menu, 
  X, 
  ClipboardCheck, 
  Beaker,
  Bell,
  Search,
  HelpCircle,
  Heart,
  Unlock,
  GitMerge,
  Settings,
  Moon,
  Sun,
  Monitor,
  Check,
  LogOut,
  Volume2,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Localization Dictionary ---
const TRANSLATIONS = {
  id: {
    menu_main: "Menu Utama",
    menu_learning_path: "Jalur Belajar",
    menu_sim_lab: "Simulasi & Lab",
    menu_minilab: "Mini-Lab Digital",
    menu_balancing: "Penyetaraan Reaksi",
    menu_calc: "Kalkulator Mol",
    menu_eval: "Evaluasi",
    menu_assess: "Asesmen & Kuis",
    menu_help: "Bantuan",
    menu_ai: "Konsultan AI",
    mode_timeline: "Mode Alur",
    mode_free: "Mode Bebas",
    user_settings: "Pengaturan Akun",
    search_placeholder: "Cari materi...",
    title_learning_path: "Jalur Belajar",
    title_virtual_lab: "Laboratorium Virtual",
    title_calculator: "Kalkulator Mol",
    title_ai: "Profesor Stoi AI",
    title_assessment: "Asesmen & Evaluasi",
    title_minilab: "Digital Mini-Lab",
    settings_title: "Pengaturan",
    settings_appearance: "Tampilan",
    settings_light: "Terang",
    settings_dark: "Gelap",
    settings_system: "Sistem",
    settings_language: "Bahasa",
    settings_prefs: "Preferensi",
    settings_notif: "Notifikasi",
    settings_notif_desc: "Ingatkan jadwal belajar",
    settings_sound: "Efek Suara",
    settings_sound_desc: "Suara tombol & kuis",
    settings_save: "Simpan",
    settings_logout: "Keluar Akun",
    footer_privacy: "Kebijakan Privasi"
  },
  en: {
    menu_main: "Main Menu",
    menu_learning_path: "Learning Path",
    menu_sim_lab: "Simulation & Lab",
    menu_minilab: "Digital Mini-Lab",
    menu_balancing: "Reaction Balancing",
    menu_calc: "Mole Calculator",
    menu_eval: "Evaluation",
    menu_assess: "Assessment & Quiz",
    menu_help: "Help",
    menu_ai: "AI Consultant",
    mode_timeline: "Timeline Mode",
    mode_free: "Free Mode",
    user_settings: "Account Settings",
    search_placeholder: "Search topics...",
    title_learning_path: "Learning Path",
    title_virtual_lab: "Virtual Laboratory",
    title_calculator: "Mole Calculator",
    title_ai: "Professor Stoi AI",
    title_assessment: "Assessment & Evaluation",
    title_minilab: "Digital Mini-Lab",
    settings_title: "Settings",
    settings_appearance: "Appearance",
    settings_light: "Light",
    settings_dark: "Dark",
    settings_system: "System",
    settings_language: "Language",
    settings_prefs: "Preferences",
    settings_notif: "Notifications",
    settings_notif_desc: "Study schedule reminders",
    settings_sound: "Sound Effects",
    settings_sound_desc: "Button & quiz sounds",
    settings_save: "Save",
    settings_logout: "Logout",
    footer_privacy: "Privacy Policy"
  }
};

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeView, setActiveView] = useState<ViewState>(ViewState.MODULES);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [targetQuizTopic, setTargetQuizTopic] = useState<string | null>(null);
  const [learningMode, setLearningMode] = useState<LearningMode>('TIMELINE');
  
  // Settings State with Persistence
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appSettings, setAppSettings] = useState(() => {
    // Try to load from local storage
    const saved = localStorage.getItem('stoi-settings');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      theme: 'light', // FORCE DEFAULT TO LIGHT
      language: 'id', // 'id', 'en'
      notifications: true,
      sound: true
    };
  });

  // Search & Notification State
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Translation Helper
  const t = (key: keyof typeof TRANSLATIONS['id']) => {
    const lang = appSettings.language as 'id' | 'en';
    return TRANSLATIONS[lang][key] || TRANSLATIONS['id'][key];
  };

  // Apply Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (appSettings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(appSettings.theme);
    }

    // Save to local storage
    localStorage.setItem('stoi-settings', JSON.stringify(appSettings));
  }, [appSettings]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus Search with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        if (activeView !== ViewState.MODULES) {
            setActiveView(ViewState.MODULES);
        }
      }
      // Close modals with Escape
      if (e.key === 'Escape') {
        setIsNotificationsOpen(false);
        setIsSettingsOpen(false);
        if (document.activeElement === searchInputRef.current) {
            searchInputRef.current.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView]);
  
  // State to force open a specific module (for seamless navigation)
  const [targetModuleId, setTargetModuleId] = useState<string | null>(null);

  // Initialize progress: First module unlocked
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const initial: UserProgress = {};
    LEARNING_MODULES.forEach(m => {
        initial[m.id] = { status: 'LOCKED', score: 0 };
    });
    // Start with Concept Mol unlocked
    initial['mod-1'].status = 'UNLOCKED';
    return initial;
  });

  if (!hasStarted) {
    return <LandingPage onStart={() => setHasStarted(true)} />;
  }

  const getViewTitle = (view: ViewState) => {
    switch (view) {
      case ViewState.MODULES: return t('title_learning_path');
      case ViewState.SIMULATION: return t('title_virtual_lab');
      case ViewState.CALCULATOR: return t('title_calculator');
      case ViewState.AI_CONSULTANT: return t('title_ai');
      case ViewState.ASSESSMENT: return t('title_assessment');
      case ViewState.MINI_LAB: return t('title_minilab');
      default: return 'StoiMaster';
    }
  };

  const handleTakeQuiz = (topic: string) => {
      setTargetQuizTopic(topic);
      setActiveView(ViewState.ASSESSMENT);
  };

  const handleQuizComplete = (topic: string, scorePercentage: number) => {
      const completedModule = LEARNING_MODULES.find(m => m.title === topic);
      
      if (completedModule) {
          setUserProgress(prev => {
              const newState = { ...prev };
              const currentData = newState[completedModule.id];
              if (scorePercentage > 70 && currentData.status !== 'COMPLETED') {
                   newState[completedModule.id].status = 'COMPLETED';
                   newState[completedModule.id].score = Math.max(currentData.score, scorePercentage);
                   
                   const nextModules = LEARNING_MODULES.filter(m => 
                       m.prerequisites?.includes(completedModule.id)
                   );
                   
                   nextModules.forEach(nm => {
                       if (newState[nm.id].status === 'LOCKED') {
                           newState[nm.id].status = 'UNLOCKED';
                       }
                   });
              } else {
                   newState[completedModule.id].score = Math.max(currentData.score, scorePercentage);
              }
              return newState;
          });

          if (scorePercentage > 70) {
              setTimeout(() => {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#FFD700', '#FFA500']
                });
              }, 500);
          }
      }
  };

  const handleContinueLearning = (currentTopic: string) => {
    const currentIndex = LEARNING_MODULES.findIndex(m => m.title === currentTopic);
    
    if (currentIndex !== -1 && currentIndex < LEARNING_MODULES.length - 1) {
        const nextModule = LEARNING_MODULES[currentIndex + 1];
        setTargetModuleId(nextModule.id);
        setActiveView(ViewState.MODULES);
    } else {
        setActiveView(ViewState.MODULES);
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => {
    const isActive = activeView === view;
    return (
      <button
        onClick={() => {
          setActiveView(view);
          setIsMobileMenuOpen(false);
          if (view !== ViewState.ASSESSMENT) setTargetQuizTopic(null);
        }}
        className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out font-medium mb-1 overflow-hidden ${
          isActive
            ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 shadow-sm ring-1 ring-primary-200 dark:ring-primary-700'
            : 'text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white dark:hover:from-slate-800 dark:hover:to-slate-700/50'
        }`}
      >
        {isActive && (
            <motion.div layoutId="activeNavIndicator" className="absolute left-0 top-1/2 -translate-x-1/2 md:-translate-x-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
        )}
        <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:-rotate-6'}`}>
            <Icon size={20} className={isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary-500 dark:group-hover:text-primary-400'} />
        </div>
        <span className={`transition-transform duration-300 ${!isActive && 'group-hover:translate-x-1'}`}>
            {label}
        </span>
      </button>
    );
  };

  // --- Modal Renders ---

  const renderNotificationsModal = () => {
    return (
      <AnimatePresence>
        {isNotificationsOpen && (
           <>
             {/* Transparent Backdrop */}
             <div className="fixed inset-0 z-[60]" onClick={() => setIsNotificationsOpen(false)}></div>
             
             {/* Hanging Modal */}
             <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed top-[4.5rem] right-4 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden z-[70] border border-slate-100 dark:border-slate-700 origin-top-right"
             >
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Notifikasi</h3>
                    <div className="flex gap-2">
                        <span className="text-[10px] bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 px-2 py-0.5 rounded-full font-bold">0 Baru</span>
                    </div>
                </div>
                <div className="p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3 text-slate-400 dark:text-slate-500">
                        <Bell size={24} />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Semua Bersih!</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Belum ada notifikasi baru untukmu saat ini.
                    </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 text-center">
                    <button onClick={() => setIsNotificationsOpen(false)} className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                        Tutup
                    </button>
                </div>
             </motion.div>
           </>
        )}
      </AnimatePresence>
    );
  };

  const renderSettingsModal = () => {
    return (
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-slate-900/30 dark:bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-slate-100 dark:border-slate-800"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Settings className="text-primary-600 dark:text-primary-400" size={24} />
                  {t('settings_title')}
                </h2>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
                
                {/* Theme Section */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">{t('settings_appearance')}</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'light', icon: Sun, label: t('settings_light') },
                      { id: 'dark', icon: Moon, label: t('settings_dark') },
                      { id: 'system', icon: Monitor, label: t('settings_system') },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setAppSettings(p => ({ ...p, theme: mode.id }))}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                          appSettings.theme === mode.id 
                          ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300 ring-1 ring-primary-500' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <mode.icon size={24} />
                        <span className="text-xs font-medium">{mode.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language Section */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">{t('settings_language')}</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
                      { id: 'en', label: 'English (US)', flag: '🇺🇸' },
                    ].map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setAppSettings(p => ({ ...p, language: lang.id }))}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                           appSettings.language === lang.id
                           ? 'bg-white dark:bg-slate-800 border-primary-500 shadow-sm ring-1 ring-primary-500/20'
                           : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{lang.flag}</span>
                          <span className={`text-sm font-medium ${appSettings.language === lang.id ? 'text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'}`}>
                            {lang.label}
                          </span>
                        </div>
                        {appSettings.language === lang.id && <Check size={18} className="text-primary-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">{t('settings_prefs')}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                          <Bell size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{t('settings_notif')}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t('settings_notif_desc')}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setAppSettings(p => ({ ...p, notifications: !p.notifications }))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${appSettings.notifications ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${appSettings.notifications ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                          <Volume2 size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{t('settings_sound')}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t('settings_sound_desc')}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setAppSettings(p => ({ ...p, sound: !p.sound }))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${appSettings.sound ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${appSettings.sound ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                 <button className="text-xs font-bold text-red-500 dark:text-red-400 flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors">
                    <LogOut size={14} /> {t('settings_logout')}
                 </button>
                 <button 
                    onClick={() => setIsSettingsOpen(false)}
                    className="bg-primary-600 text-white text-sm font-bold px-6 py-2 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 dark:shadow-none"
                 >
                    {t('settings_save')}
                 </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  const renderContent = () => {
    switch(activeView) {
        case ViewState.AI_CONSULTANT:
            return <AIChat />;
        case ViewState.MODULES:
            return (
                <ModuleViewer 
                    userProgress={userProgress} 
                    onTakeQuiz={handleTakeQuiz} 
                    learningMode={learningMode}
                    targetModuleId={targetModuleId}
                    onClearTargetModule={() => setTargetModuleId(null)}
                    searchQuery={searchQuery}
                />
            );
        case ViewState.ASSESSMENT:
            return (
                <Assessment 
                    initialTopic={targetQuizTopic} 
                    onQuizComplete={handleQuizComplete} 
                    onContinueLearning={handleContinueLearning}
                />
            );
        default:
            return (
                <div className="h-full overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50 dark:bg-slate-900">
                    <div className="max-w-5xl mx-auto h-full flex flex-col">
                        {activeView === ViewState.SIMULATION && <Simulation />}
                        {activeView === ViewState.MINI_LAB && <MiniLab />}
                        {activeView === ViewState.CALCULATOR && <Calculator />}
                    </div>
                </div>
            );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 overflow-hidden selection:bg-primary-100 dark:selection:bg-primary-900 selection:text-primary-900 dark:selection:text-primary-100 animate-fade-in">
      
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out flex flex-col
        md:relative md:translate-x-0 shadow-xl md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 shrink-0 px-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800 relative z-10">
            <div 
                className="flex items-center gap-2.5 text-primary-700 dark:text-primary-400 font-bold text-xl group cursor-pointer"
                onClick={() => setHasStarted(false)} // Return to Landing
                title="Kembali ke Halaman Depan"
            >
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200 dark:shadow-none group-hover:rotate-12 transition-transform duration-300">
                  <FlaskConical className="fill-current" size={20} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-lg group-hover:text-primary-800 dark:group-hover:text-primary-300 transition-colors">StoiMaster</span>
                  <span className="text-xs text-primary-400 dark:text-primary-500 font-medium tracking-wider uppercase">Learning App</span>
                </div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative bg-white dark:bg-slate-800">
            <div className="mb-6 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl flex">
                <button 
                    onClick={() => setLearningMode('TIMELINE')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${learningMode === 'TIMELINE' ? 'bg-white dark:bg-slate-600 text-primary-700 dark:text-primary-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <GitMerge size={14} /> {t('mode_timeline')}
                </button>
                <button 
                    onClick={() => setLearningMode('FREE')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${learningMode === 'FREE' ? 'bg-white dark:bg-slate-600 text-green-700 dark:text-green-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <Unlock size={14} /> {t('mode_free')}
                </button>
            </div>

            <div className="space-y-1">
                <div className="px-4 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{t('menu_main')}</div>
                <NavItem view={ViewState.MODULES} icon={BookOpen} label={t('menu_learning_path')} />
                
                <div className="px-4 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-6">{t('menu_sim_lab')}</div>
                <NavItem view={ViewState.MINI_LAB} icon={Beaker} label={t('menu_minilab')} />
                <NavItem view={ViewState.SIMULATION} icon={FlaskConical} label={t('menu_balancing')} />
                <NavItem view={ViewState.CALCULATOR} icon={CalcIcon} label={t('menu_calc')} />
                
                <div className="px-4 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-6">{t('menu_eval')}</div>
                <NavItem view={ViewState.ASSESSMENT} icon={ClipboardCheck} label={t('menu_assess')} />

                <div className="px-4 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-6">{t('menu_help')}</div>
                <NavItem view={ViewState.AI_CONSULTANT} icon={Bot} label={t('menu_ai')} />
            </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
             <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-full flex items-center gap-3 bg-white dark:bg-slate-700 p-3 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-all cursor-pointer group text-left relative overflow-hidden"
             >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-science-purple to-neon-blue flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform z-10">
                    10
                </div>
                <div className="flex-1 min-w-0 z-10">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">Siswa Kimia</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{t('user_settings')}</p>
                </div>
                <Settings size={20} className="text-slate-300 dark:text-slate-500 group-hover:text-primary-500 group-hover:rotate-90 transition-all ml-auto z-10" />
                
                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-primary-50 dark:bg-slate-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/20 dark:bg-slate-900/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 dark:bg-slate-900/50 h-full relative">
        <header className="h-16 shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-8 z-20 shadow-sm/50 relative">
             <div className="flex items-center gap-3 md:gap-4">
                 <button 
                    onClick={() => setIsMobileMenuOpen(true)} 
                    className="md:hidden p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                 >
                    <Menu size={20} />
                 </button>
                 
                 <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                 
                 <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    {getViewTitle(activeView)}
                    {activeView === ViewState.MODULES && (
                        <span className={`hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ml-2 ${
                            learningMode === 'TIMELINE' 
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800' 
                            : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
                        }`}>
                            {learningMode === 'TIMELINE' ? t('mode_timeline') : t('mode_free')}
                        </span>
                    )}
                 </h1>
             </div>

             <div className="flex items-center gap-2 md:gap-4">
                 <div className="relative hidden md:block w-64 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={16} />
                    <input 
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (e.target.value && activeView !== ViewState.MODULES) {
                                setActiveView(ViewState.MODULES);
                            }
                        }}
                        placeholder={t('search_placeholder')}
                        className="w-full pl-9 pr-12 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-white dark:bg-slate-600 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-500 text-slate-400 dark:text-slate-300 pointer-events-none">⌘K</span>
                 </div>
                 
                 <button 
                    onClick={() => {
                        setIsNotificationsOpen(!isNotificationsOpen);
                    }}
                    className={`p-2 rounded-full transition-colors relative group ${isNotificationsOpen ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30'}`}
                 >
                    <Bell size={20} className={!isNotificationsOpen ? "group-hover:swing" : ""} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                 </button>
                 <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-full transition-colors">
                    <HelpCircle size={20} />
                 </button>
             </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -15, filter: 'blur(5px)' }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full w-full"
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </main>

        <footer className="h-12 shrink-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-8 text-xs text-slate-400 dark:text-slate-500 z-20">
             <div className="flex items-center gap-1">
                 <span>© 2025 StoiMaster</span>
                 <span className="hidden md:inline">•</span>
                 <span className="hidden md:inline hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors">{t('footer_privacy')}</span>
             </div>
             <div className="flex items-center gap-2">
                 <span className="flex items-center gap-1 group cursor-pointer">
                    Made with <Heart size={10} className="text-red-400 fill-current group-hover:scale-125 transition-transform" /> by AI Studio
                 </span>
                 <span className="w-px h-3 bg-slate-300 dark:bg-slate-600 mx-1"></span>
                 <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">v1.3.0</span>
             </div>
        </footer>
      </div>

      {/* Render Modals Portal */}
      {renderSettingsModal()}
      {renderNotificationsModal()}
    </div>
  );
};

export default App;
