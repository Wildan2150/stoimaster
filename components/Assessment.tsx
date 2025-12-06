
import React, { useState, useEffect } from 'react';
import { QUESTIONS, LEARNING_MODULES } from '../constants';
import { Question } from '../types';
import { Play, ClipboardCheck, Clock, CheckCircle, XCircle, RefreshCw, Trophy, AlertCircle, ArrowRight, BookOpen, Sparkles, BrainCircuit, ArrowLeft, Lightbulb, Zap, HelpCircle, LifeBuoy, BookOpenCheck, Bot, FastForward } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuizQuestions, explainMistake, generateRemedialLesson } from '../services/geminiService';
import katex from 'katex';
import { motion, AnimatePresence } from 'framer-motion';

type Mode = 'MENU' | 'LOADING_AI' | 'PRACTICE' | 'TEST' | 'RESULT';

interface AssessmentProps {
    initialTopic?: string | null;
    onQuizComplete?: (topic: string, score: number) => void;
    onContinueLearning?: (currentTopic: string) => void;
}

export const Assessment: React.FC<AssessmentProps> = ({ initialTopic, onQuizComplete, onContinueLearning }) => {
  const [view, setView] = useState<Mode>('MENU');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{qId: number, isCorrect: boolean, selected: number}[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes for test
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedTopicName, setSelectedTopicName] = useState('');
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // AI Analysis & Scaffolding State
  const [analyzingMistakeId, setAnalyzingMistakeId] = useState<number | null>(null);
  const [mistakeExplanations, setMistakeExplanations] = useState<{[key: number]: string}>({});
  
  // Remedial / Scaffolding State
  const [generatingRemedialId, setGeneratingRemedialId] = useState<number | null>(null);
  const [remedialLessons, setRemedialLessons] = useState<{[key: number]: string}>({});

  // Active Questions State
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);

  // Effect to handle initial topic coming from ModuleViewer
  useEffect(() => {
    if (initialTopic) {
        initSession('PRACTICE', initialTopic);
    }
  }, [initialTopic]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (view === 'TEST' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (view === 'TEST' && timeLeft === 0) {
      finishTest();
    }
    return () => clearInterval(timer);
  }, [view, timeLeft]);

  // Helper to get fallback questions if AI fails
  const getFallbackQuestions = (topic: string, count: number): Question[] => {
    // 1. Try to find exact topic matches in hardcoded data
    let pool = QUESTIONS.filter(q => q.topic.toLowerCase().includes(topic.toLowerCase()));
    
    // 2. If not enough, fill with random questions from hardcoded data
    if (pool.length < count) {
        const remaining = QUESTIONS.filter(q => !pool.includes(q));
        const shuffledRemaining = [...remaining].sort(() => 0.5 - Math.random());
        pool = [...pool, ...shuffledRemaining.slice(0, count - pool.length)];
    }

    // 3. Shuffle results
    return pool.sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const initSession = async (mode: 'PRACTICE' | 'TEST', topic: string) => {
    setView('LOADING_AI');
    setSelectedTopicName(topic);
    setIsUsingFallback(false);

    try {
        // Attempt AI Generation
        // If Test mode, we might ask for a mix, but for now let's use the topic or "Umum"
        const promptTopic = mode === 'TEST' && topic === 'Umum' ? 'Stoikiometri Kimia SMA Kelas 10 Campuran' : topic;
        const count = mode === 'TEST' ? 10 : 5;
        
        const aiQuestions = await generateQuizQuestions(promptTopic, count);

        if (aiQuestions && aiQuestions.length >= 1) {
            setActiveQuestions(aiQuestions);
        } else {
            throw new Error("Empty AI Response");
        }
    } catch (error) {
        console.warn("AI Generation failed, using fallback.", error);
        setIsUsingFallback(true);
        const fallback = getFallbackQuestions(topic === 'Umum' ? '' : topic, mode === 'TEST' ? 10 : 5);
        setActiveQuestions(fallback);
    }

    resetState();
    if (mode === 'TEST') setTimeLeft(600);
    setView(mode);
  };

  const resetState = () => {
    setCurrentQIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowExplanation(false);
    setMistakeExplanations({});
    setAnalyzingMistakeId(null);
    setRemedialLessons({});
    setGeneratingRemedialId(null);
  };

  const handleOptionSelect = (index: number) => {
    if (view === 'PRACTICE' && showExplanation) return; // Prevent changing after checking
    setSelectedOption(index);
  };

  const checkPracticeAnswer = () => {
    if (selectedOption === null) return;
    
    const currentQ = activeQuestions[currentQIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    
    if (isCorrect) {
        setScore(prev => prev + 1);
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
        });
    }

    setAnswers(prev => [...prev, { qId: currentQ.id, isCorrect, selected: selectedOption }]);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQIndex < activeQuestions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowExplanation(false);
    } else {
        finishTest();
    }
  };

  const submitTestAnswer = () => {
    if (selectedOption === null) return;
    
    const currentQ = activeQuestions[currentQIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    
    setAnswers(prev => [...prev, { qId: currentQ.id, isCorrect, selected: selectedOption }]);
    
    if (isCorrect) setScore(prev => prev + 1);

    if (currentQIndex < activeQuestions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setSelectedOption(null);
    } else {
        finishTest();
    }
  };

  const finishTest = () => {
    setView('RESULT');
    // Calculate final score
    // In React 18 setState is batched, so we calculate directly for the callback
    const finalScore = score + (selectedOption === activeQuestions[currentQIndex]?.correctAnswer && currentQIndex === activeQuestions.length -1 && !answers.some(a => a.qId === activeQuestions[currentQIndex].id) ? 1 : 0);
    
    // We actually need the accumulated score. Since submitTestAnswer updates state async, 
    // let's rely on re-render, but trigger callback in useEffect or here carefully.
    // For simplicity, let's just trigger it with a slight delay or pass the calculation.
    
    // Better way: Re-calculate score from answers array + last answer
    const totalCorrect = answers.filter(a => a.isCorrect).length + (view === 'TEST' && selectedOption === activeQuestions[currentQIndex]?.correctAnswer ? 1 : 0);
    
    // Wait for state update to settle before calling prop? 
    // Actually, let's just use a timeout or pass the calculated value
    const percentage = Math.round((totalCorrect / activeQuestions.length) * 100);
    
    if (onQuizComplete) {
        onQuizComplete(selectedTopicName, percentage);
    }
  };

  const handleAnalyzeMistake = async (questionId: number, userIdx: number) => {
    const question = activeQuestions.find(q => q.id === questionId);
    if (!question) return;

    setAnalyzingMistakeId(questionId);
    
    const explanation = await explainMistake(
        question.question,
        question.options[userIdx],
        question.options[question.correctAnswer],
        question.topic
    );

    setMistakeExplanations(prev => ({...prev, [questionId]: explanation}));
    setAnalyzingMistakeId(null);
  };

  const handleGenerateScaffolding = async (questionId: number) => {
    const question = activeQuestions.find(q => q.id === questionId);
    const prevExplanation = mistakeExplanations[questionId] || "Kesalahan konsep umum";
    
    if (!question) return;

    setGeneratingRemedialId(questionId);

    const lesson = await generateRemedialLesson(
        question.topic,
        question.question,
        prevExplanation
    );

    setRemedialLessons(prev => ({...prev, [questionId]: lesson}));
    setGeneratingRemedialId(null);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- Latex Rendering Helper ---
  const renderMathText = (text: string) => {
    if (!text) return "";
    
    // Split text by dollar signs for inline math
    const parts = text.split('$');
    
    return parts.map((part, index) => {
      // If index is odd, it's inside $...$
      if (index % 2 === 1) {
        try {
          const html = katex.renderToString(part, {
            throwOnError: false,
            displayMode: false
          });
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (e) {
          return <span key={index}>{part}</span>;
        }
      }
      
      // Regular text - Simple Markdown processing
      // Check for bold **text**
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      
      if (boldParts.length > 1) {
          return (
            <span key={index}>
                {boldParts.map((bp, i) => {
                    if (bp.startsWith('**') && bp.endsWith('**')) {
                        return <strong key={i}>{bp.slice(2, -2)}</strong>
                    }
                    return <span key={i}>{bp}</span>
                })}
            </span>
          )
      }

      return <span key={index}>{part}</span>;
    });
  };

  const renderMarkdownBlock = (text: string) => {
      // Simple block renderer for AI content
      const lines = text.split('\n');
      return (
          <div className="space-y-2">
              {lines.map((line, i) => {
                  const l = line.trim();
                  if (l.startsWith('###')) return <h4 key={i} className="font-bold text-slate-800 dark:text-slate-200 mt-3 mb-1">{renderMathText(l.replace('###', ''))}</h4>;
                  if (l.startsWith('##')) return <h3 key={i} className="font-bold text-lg text-primary-700 dark:text-primary-400 mt-4 mb-2">{renderMathText(l.replace('##', ''))}</h3>;
                  if (l.startsWith('**') && l.endsWith('**')) return <p key={i} className="font-bold text-slate-700 dark:text-slate-300">{renderMathText(l.replace(/\*\*/g, ''))}</p>;
                  if (l.startsWith('- ')) return <div key={i} className="flex gap-2 ml-2"><span className="text-primary-500">•</span><p>{renderMathText(l.replace('- ', ''))}</p></div>;
                  if (l.match(/^\d+\./)) return <div key={i} className="flex gap-2 ml-2"><span className="font-bold text-primary-600 dark:text-primary-400">{l.split('.')[0]}.</span><p>{renderMathText(l.replace(/^\d+\.\s/, ''))}</p></div>;
                  if (l === '') return <div key={i} className="h-2"></div>;
                  return <p key={i} className="leading-relaxed">{renderMathText(l)}</p>;
              })}
          </div>
      )
  }

  const renderMenu = () => (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-800 px-8 py-6 border-b border-slate-200 dark:border-slate-700 shrink-0">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2">
                <ClipboardCheck className="text-primary-600 dark:text-primary-400" />
                Asesmen & Evaluasi
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
                Pilih topik untuk latihan soal cerdas berbasis AI atau uji kemampuanmu dengan simulasi ujian.
            </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Hero / Featured Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Simulation Test Card */}
                    <div className="col-span-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-4 p-3 bg-white/20 w-fit rounded-xl backdrop-blur-sm">
                                <Clock className="text-white" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Simulasi Ujian Akhir</h3>
                            <p className="text-indigo-100 text-sm mb-6 flex-1">
                                Uji kesiapanmu dengan 10 soal acak mencakup semua materi. Waktu pengerjaan 10 menit.
                            </p>
                            <button 
                                onClick={() => initSession('TEST', 'Umum')}
                                className="bg-white text-indigo-600 py-3 px-6 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Play size={18} fill="currentColor" /> Mulai Ujian
                            </button>
                        </div>
                    </div>

                    {/* AI Challenge Card */}
                    <div className="col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-xl">
                                    <Sparkles size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Tantangan Harian AI</h3>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Topik Acak</p>
                                </div>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-1">
                                Biarkan AI memilihkan topik dan soal yang menantang untuk mengasah logikamu hari ini.
                            </p>
                            <button 
                                onClick={() => initSession('PRACTICE', 'Stoikiometri Menantang')}
                                className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 px-6 rounded-xl font-bold hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center justify-center gap-2"
                            >
                                <Zap size={18} /> Terima Tantangan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Topic Grid */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <BookOpen size={20} className="text-slate-400 dark:text-slate-500" />
                        Latihan per Topik
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {LEARNING_MODULES.map((module) => (
                            <button
                                key={module.id}
                                onClick={() => initSession('PRACTICE', module.title)}
                                className="group bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all text-left flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                        module.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                        module.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                    }`}>
                                        {module.difficulty}
                                    </span>
                                    <ArrowRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-primary-500 dark:group-hover:text-primary-400 transform group-hover:translate-x-1 transition-all" />
                                </div>
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors mb-1">
                                    {module.title}
                                </h4>
                                <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2">
                                    {module.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    </div>
  );

  const renderLoadingAI = () => (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 dark:bg-slate-900 animate-fade-in p-8 text-center">
          <div className="relative mb-8">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg animate-pulse ring-4 ring-primary-50 dark:ring-primary-900">
                  <BrainCircuit size={48} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-md border-2 border-white dark:border-slate-800">
                  <Sparkles size={20} className="text-white" />
              </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">Profesor Stoi Sedang Membuat Soal...</h2>
          <div className="max-w-md space-y-2">
             <p className="text-slate-600 dark:text-slate-300 font-medium">Topik: <span className="text-primary-600 dark:text-primary-400">{selectedTopicName}</span></p>
             <p className="text-slate-400 dark:text-slate-500 text-sm">
                  AI sedang menyusun soal unik beserta pembahasan lengkapnya. Mohon tunggu sebentar.
             </p>
          </div>
          
          <div className="mt-8 flex gap-2">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
          </div>
      </div>
  );

  const renderQuiz = () => {
    const question = activeQuestions[currentQIndex];
    if (!question) return <div>Error loading question</div>;

    const progress = ((currentQIndex) / activeQuestions.length) * 100;

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
            {/* Quiz Header */}
            <div className="bg-white dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setView('MENU')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
                        title="Keluar"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                {view === 'PRACTICE' ? 'Latihan Mandiri' : 'Ujian Simulasi'}
                            </span>
                            {isUsingFallback && (
                                <span className="px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-[10px] font-bold rounded uppercase tracking-wide border border-yellow-200 dark:border-yellow-800">
                                    Offline Mode
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                            Soal {currentQIndex + 1} dari {activeQuestions.length}
                        </span>
                    </div>
                </div>
                {view === 'TEST' && (
                    <div className={`px-4 py-2 rounded-lg font-mono font-bold flex items-center gap-2 ${timeLeft < 60 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 animate-pulse border border-red-100 dark:border-red-900' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'}`}>
                        <Clock size={16} />
                        {formatTime(timeLeft)}
                    </div>
                )}
            </div>

            {/* Progress Line */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1">
                <div 
                    className="bg-primary-500 h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Scrollable Question Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
                <div className="max-w-3xl mx-auto">
                    
                    {/* Question Card */}
                    <motion.div 
                        key={currentQIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-6"
                    >
                         <div className="mb-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold rounded-full mb-4 border border-primary-100 dark:border-primary-800">
                                <Lightbulb size={12} />
                                {question.topic}
                            </span>
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                                {renderMathText(question.question)}
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {question.options.map((option, idx) => {
                                let btnClass = "w-full p-4 text-left rounded-xl border-2 transition-all flex justify-between items-center group ";
                                
                                if (view === 'PRACTICE' && showExplanation) {
                                    if (idx === question.correctAnswer) {
                                        btnClass += "bg-green-50 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300";
                                    } else if (idx === selectedOption) {
                                        btnClass += "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300";
                                    } else {
                                        btnClass += "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-600 opacity-60";
                                    }
                                } else {
                                    if (selectedOption === idx) {
                                        btnClass += "bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-800 dark:text-primary-200 shadow-md transform scale-[1.01]";
                                    } else {
                                        btnClass += "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-slate-50 dark:hover:bg-slate-700/50";
                                    }
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(idx)}
                                        disabled={view === 'PRACTICE' && showExplanation}
                                        className={btnClass}
                                    >
                                        <div className="flex items-center gap-4 w-full">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-colors shrink-0 ${
                                                selectedOption === idx || (view === 'PRACTICE' && showExplanation && idx === question.correctAnswer)
                                                ? 'border-transparent bg-white/50 dark:bg-slate-800/50' 
                                                : 'border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 group-hover:border-primary-300 group-hover:text-primary-500'
                                            }`}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <span className="font-medium text-base flex-1">
                                                {renderMathText(option)}
                                            </span>
                                        </div>
                                        {(view === 'PRACTICE' && showExplanation) && (
                                            idx === question.correctAnswer ? <CheckCircle size={24} className="text-green-600 dark:text-green-400 shrink-0" /> :
                                            idx === selectedOption ? <XCircle size={24} className="text-red-600 dark:text-red-400 shrink-0" /> : null
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Explanation Box (Practice Only) */}
                    {view === 'PRACTICE' && showExplanation && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl shadow-sm mb-20"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-300 rounded-lg shrink-0">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2 text-lg">Pembahasan Prof. Stoi</h4>
                                    <div className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed prose prose-blue dark:prose-invert max-w-none">
                                        {renderMathText(question.explanation)}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="bg-white dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-700 shrink-0 z-20">
                <div className="max-w-3xl mx-auto flex justify-end">
                    {view === 'PRACTICE' ? (
                        !showExplanation ? (
                            <button
                                onClick={checkPracticeAnswer}
                                disabled={selectedOption === null}
                                className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-200 dark:shadow-none active:scale-95 w-full md:w-auto"
                            >
                                Cek Jawaban
                            </button>
                        ) : (
                            <button
                                onClick={nextQuestion}
                                className="bg-slate-800 dark:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2 shadow-lg w-full md:w-auto"
                            >
                                Soal Berikutnya <ArrowRight size={18} />
                            </button>
                        )
                    ) : (
                        <button
                            onClick={submitTestAnswer}
                            disabled={selectedOption === null}
                            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-200 dark:shadow-none w-full md:w-auto"
                        >
                            {currentQIndex === activeQuestions.length - 1 ? 'Selesai & Lihat Hasil' : 'Lanjut'} <ArrowRight size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
  };

  const renderResult = () => {
    const percentage = Math.round((score / activeQuestions.length) * 100);
    let message = "";
    let colorClass = "";

    const isPassed = percentage >= 70;

    if (percentage >= 90) { message = "Luar Biasa! Kamu Ahli Stoikiometri!"; colorClass = "text-green-600 dark:text-green-400"; }
    else if (percentage >= 70) { message = "Kerja Bagus! Tingkatkan Sedikit Lagi."; colorClass = "text-primary-600 dark:text-primary-400"; }
    else { message = "Jangan Menyerah, Pelajari Modul Lagi Ya!"; colorClass = "text-orange-600 dark:text-orange-400"; }

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
             {/* Result Scrollable Area */}
             <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
                 <div className="max-w-2xl mx-auto">
                    
                    {/* Score Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 text-center mb-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400"></div>
                        
                        <div className="w-24 h-24 bg-yellow-50 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-yellow-50/50 dark:ring-yellow-900/20">
                            <Trophy size={48} className="text-yellow-500 fill-current" />
                        </div>
                        
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Hasil Evaluasi</h2>
                        <p className={`text-lg font-medium mb-8 ${colorClass}`}>{message}</p>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <span className="block text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-1 font-bold">Skor</span>
                                <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{percentage}%</span>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800">
                                <span className="block text-green-600 dark:text-green-400 text-xs uppercase tracking-wider mb-1 font-bold">Benar</span>
                                <span className="text-3xl font-bold text-green-700 dark:text-green-300">{score}</span>
                            </div>
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800">
                                <span className="block text-red-600 dark:text-red-400 text-xs uppercase tracking-wider mb-1 font-bold">Salah</span>
                                <span className="text-3xl font-bold text-red-700 dark:text-red-300">{activeQuestions.length - score}</span>
                            </div>
                        </div>
                    </div>

                    {/* Review Section */}
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 px-2">Review Jawaban</h3>
                    <div className="space-y-4 mb-8">
                        {answers.map((ans, idx) => {
                            const q = activeQuestions.find(q => q.id === ans.qId);
                            if(!q) return null;
                            const isAnalyzing = analyzingMistakeId === q.id;
                            const explanation = mistakeExplanations[q.id];
                            
                            // Scaffolding states
                            const isGeneratingRemedial = generatingRemedialId === q.id;
                            const remedialContent = remedialLessons[q.id];

                            return (
                                <div key={idx} className={`rounded-xl border flex flex-col ${
                                    ans.isCorrect 
                                    ? 'bg-white dark:bg-slate-800 border-green-200 dark:border-green-900 shadow-sm' 
                                    : 'bg-white dark:bg-slate-800 border-red-200 dark:border-red-900 shadow-sm'
                                }`}>
                                    <div className="p-4 flex gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
                                            ans.isCorrect 
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                        }`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-slate-700 dark:text-slate-200 font-medium mb-2">{renderMathText(q.question)}</p>
                                            <div className="text-sm flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 dark:text-slate-500 text-xs uppercase w-16">Jawabanmu:</span>
                                                    <span className={ans.isCorrect ? 'text-green-600 dark:text-green-400 font-bold' : 'text-red-500 dark:text-red-400 font-bold line-through'}>
                                                        {renderMathText(q.options[ans.selected])}
                                                    </span>
                                                </div>
                                                {!ans.isCorrect && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-400 dark:text-slate-500 text-xs uppercase w-16">Kunci:</span>
                                                        <span className="text-green-600 dark:text-green-400 font-bold">
                                                            {renderMathText(q.options[q.correctAnswer])}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="shrink-0 pt-1">
                                            {ans.isCorrect ? <CheckCircle size={20} className="text-green-500 dark:text-green-400" /> : <XCircle size={20} className="text-red-500 dark:text-red-400" />}
                                        </div>
                                    </div>

                                    {/* AI Help Section for Incorrect Answers */}
                                    {!ans.isCorrect && (
                                        <div className="px-4 pb-4 pl-16 space-y-3">
                                            {/* Phase 1: Diagnosis & Explanation */}
                                            {!explanation ? (
                                                <button 
                                                    onClick={() => handleAnalyzeMistake(q.id, ans.selected)}
                                                    disabled={isAnalyzing}
                                                    className="text-xs bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 border border-red-100 dark:border-red-900/30"
                                                >
                                                    {isAnalyzing ? (
                                                        <>
                                                            <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                                            Mendiagnosis kesalahanmu...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <HelpCircle size={14} /> Jelaskan kenapa saya salah?
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 animate-fade-in relative">
                                                    <div className="absolute -top-3 left-4 bg-white dark:bg-slate-700 border border-blue-100 dark:border-blue-800 px-2 py-0.5 rounded text-[10px] font-bold text-blue-600 dark:text-blue-300 flex items-center gap-1">
                                                        <Bot size={12} /> Diagnosis Prof. Stoi
                                                    </div>
                                                    <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed mt-2 prose prose-sm max-w-none">
                                                        {renderMathText(explanation)}
                                                    </div>

                                                    {/* Phase 2: Scaffolding / Remedial */}
                                                    {!remedialContent ? (
                                                         <button 
                                                            onClick={() => handleGenerateScaffolding(q.id)}
                                                            disabled={isGeneratingRemedial}
                                                            className="mt-4 text-xs bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-3 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 border border-indigo-200 dark:border-indigo-800 shadow-sm w-full justify-center"
                                                        >
                                                            {isGeneratingRemedial ? (
                                                                <>
                                                                    <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                                                                    Menyiapkan materi remedial...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <LifeBuoy size={14} /> Saya Masih Bingung (Buka Remedial)
                                                                </>
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800 animate-slide-down">
                                                            <div className="bg-indigo-600 dark:bg-indigo-700 text-white px-3 py-2 rounded-t-lg flex items-center gap-2">
                                                                <BookOpenCheck size={16} />
                                                                <span className="font-bold text-sm">Modul Mikro Remedial</span>
                                                            </div>
                                                            <div className="bg-white dark:bg-slate-800 border-x border-b border-indigo-200 dark:border-indigo-800 p-4 rounded-b-lg text-sm text-slate-700 dark:text-slate-200 shadow-sm">
                                                                {renderMarkdownBlock(remedialContent)}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                 </div>
             </div>

             {/* Footer Actions */}
             <div className="bg-white dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-700 shrink-0">
                 <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4">
                    <button 
                        onClick={() => setView('MENU')}
                        className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-xl font-bold transition-colors"
                    >
                        Kembali ke Menu
                    </button>
                    
                    {/* Retry Button */}
                    {!isPassed && (
                        <button 
                            onClick={() => {
                            initSession('PRACTICE', selectedTopicName);
                            }}
                            className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-200 dark:shadow-none"
                        >
                            <RefreshCw size={18} /> Coba Lagi
                        </button>
                    )}

                    {/* Next Module Button (If Passed) */}
                    {isPassed && onContinueLearning && (
                        <button 
                            onClick={() => onContinueLearning(selectedTopicName)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200 dark:shadow-none animate-pulse-slow"
                        >
                            <FastForward size={18} /> Lanjut Modul Berikutnya
                        </button>
                    )}
                </div>
             </div>
        </div>
    );
  };

  return (
    <div className="h-full">
        <AnimatePresence mode="wait">
            {view === 'MENU' && (
                <motion.div 
                    key="menu"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                >
                    {renderMenu()}
                </motion.div>
            )}
            {view === 'LOADING_AI' && (
                 <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                 >
                    {renderLoadingAI()}
                 </motion.div>
            )}
            {(view === 'PRACTICE' || view === 'TEST') && (
                <motion.div 
                    key="quiz"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                >
                    {renderQuiz()}
                </motion.div>
            )}
            {view === 'RESULT' && (
                <motion.div 
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="h-full"
                >
                    {renderResult()}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};
