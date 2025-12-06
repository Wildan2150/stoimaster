
import React, { useState, useEffect, useRef } from 'react';
import { ModuleContent, UserProgress, LearningMode } from '../types';
import { LEARNING_MODULES } from '../constants';
import { BookOpen, ChevronRight, ArrowLeft, ArrowRight, Lock, CheckCircle, Star, GraduationCap, Unlock, Sparkles, X, MessageSquare, Loader2 } from 'lucide-react';
import katex from 'katex';
import { getContextualExplanation } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

interface ModuleViewerProps {
    userProgress?: UserProgress;
    onTakeQuiz?: (topic: string) => void;
    learningMode?: LearningMode;
    targetModuleId?: string | null;
    onClearTargetModule?: () => void;
}

// Wrapper for contextual AI help (Hover/Click blocks)
const AIWrapper: React.FC<{ text: string; onAsk: (t: string) => void; children: React.ReactNode; type?: string }> = ({ text, onAsk, children, type }) => {
    return (
        <div className="group relative transition-all duration-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 rounded-lg -mx-2 px-2">
            {children}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onAsk(text);
                }}
                className={`absolute right-0 top-0 translate-x-full md:opacity-0 group-hover:opacity-100 opacity-100 transition-all duration-200 z-10 
                           p-1.5 rounded-full shadow-sm border border-transparent hover:scale-110 
                           ${type === 'header' 
                             ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800' 
                             : 'bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-300 hover:border-primary-100 dark:hover:border-primary-800'}`}
                title="Tanya Prof. Stoi tentang bagian ini"
            >
                <Sparkles size={16} className="fill-current" />
            </button>
        </div>
    );
};

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const ModuleViewer: React.FC<ModuleViewerProps> = ({ 
    userProgress, 
    onTakeQuiz, 
    learningMode = 'TIMELINE',
    targetModuleId,
    onClearTargetModule
}) => {
  const [activeModule, setActiveModule] = useState<ModuleContent | null>(null);

  // Contextual AI State
  const [showAIModal, setShowAIModal] = useState(false);
  const [contextText, setContextText] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Selection State
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectionButton, setSelectionButton] = useState<{x: number, y: number, text: string} | null>(null);

  // Effect to automatically open a module if requested
  useEffect(() => {
    if (targetModuleId) {
        const module = LEARNING_MODULES.find(m => m.id === targetModuleId);
        if (module) {
            setActiveModule(module);
        }
        if (onClearTargetModule) onClearTargetModule();
    }
  }, [targetModuleId, onClearTargetModule]);

  // Handle Text Selection
  useEffect(() => {
    const handleSelectionChange = () => {
        const selection = window.getSelection();
        
        // Ensure we have a valid selection inside the content area
        // We also check if the selection is not collapsed (length > 0)
        if (selection && !selection.isCollapsed && selection.toString().trim().length > 0 && contentRef.current?.contains(selection.anchorNode)) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            // Only show if the selection is visible on screen
            if (rect.width > 0 && rect.height > 0) {
                 setSelectionButton({
                    x: rect.left + (rect.width / 2) - 55, // Center the button (approx width 110px)
                    y: rect.top - 50, // Position above the text
                    text: selection.toString()
                });
            }
        } else {
            // Hide button if selection is cleared or empty
            setSelectionButton(null);
        }
    };

    // We use mouseup/keyup to detect end of selection or clearing of selection
    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('keyup', handleSelectionChange);

    return () => {
        document.removeEventListener('mouseup', handleSelectionChange);
        document.removeEventListener('keyup', handleSelectionChange);
    };
  }, []);

  const clearSelection = () => {
      setSelectionButton(null);
      window.getSelection()?.removeAllRanges();
  }

  const getModuleStatus = (moduleId: string) => {
      if (!userProgress) return 'UNLOCKED'; 

      const realStatus = userProgress[moduleId]?.status || 'LOCKED';
      
      // Free Mode Logic: Overwrite LOCKED status to UNLOCKED
      if (learningMode === 'FREE') {
          return realStatus === 'COMPLETED' ? 'COMPLETED' : 'UNLOCKED';
      }
      
      return realStatus;
  };

  const handleContextualAsk = (text: string) => {
      setContextText(text);
      setAiResponse('');
      setUserQuery('');
      setShowAIModal(true);
      clearSelection();
  };

  const submitContextQuery = async (customQuery?: string) => {
      if (!contextText) return;
      setIsAiLoading(true);
      const query = customQuery || userQuery || "Jelaskan bagian ini lebih detail dan sederhana.";
      
      const response = await getContextualExplanation(contextText, query);
      setAiResponse(response);
      setIsAiLoading(false);
  };

  // Rendering Utilities
  const renderMath = (latex: string, displayMode: boolean = false) => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
      });
    } catch (error) {
      return latex;
    }
  };

  const renderInlineMarkdown = (text: string) => {
      // Split by $ for inline math
      const parts = text.split(/(\$[^$]+\$)/g);
      
      return parts.map((part, index) => {
          if (part.startsWith('$') && part.endsWith('$')) {
              const latex = part.slice(1, -1);
              return <span key={index} dangerouslySetInnerHTML={{ __html: renderMath(latex, false) }} />;
          }
          
          // Basic Markdown
          let html = part;
          html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
          html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-slate-700 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-200 dark:border-slate-600">$1</code>');
          
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
      });
  };

  // Improved AI Response Renderer within Modal
  const renderAIResponse = (text: string) => {
      const lines = text.split('\n');
      return lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <br key={idx} />;
          
          // Math Block
          if (trimmed.startsWith('$$')) {
               const latex = trimmed.replace(/\$\$/g, '');
               return <div key={idx} className="my-2 overflow-x-auto text-center" dangerouslySetInnerHTML={{__html: renderMath(latex, true)}} />;
          }

          // Headers
          if (line.startsWith('### ')) return <h4 key={idx} className="font-bold text-slate-800 dark:text-slate-200 mt-2 mb-1">{renderInlineMarkdown(line.replace('### ', ''))}</h4>;
          if (line.startsWith('## ')) return <h3 key={idx} className="font-bold text-lg text-primary-700 dark:text-primary-400 mt-3 mb-1">{renderInlineMarkdown(line.replace('## ', ''))}</h3>;

          // Lists
          if (trimmed.startsWith('- ')) {
              return (
                  <div key={idx} className="flex gap-2 ml-2 mb-1 text-slate-700 dark:text-slate-300">
                      <span className="text-primary-500 mt-1.5">•</span>
                      <span>{renderInlineMarkdown(line.replace('- ', ''))}</span>
                  </div>
              )
          }
          if (/^\d+\./.test(trimmed)) {
              const match = trimmed.match(/^(\d+)\.\s(.*)/);
              if (match) {
                   return (
                      <div key={idx} className="flex gap-2 ml-2 mb-1 text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-primary-600 dark:text-primary-400 min-w-[1.2rem]">{match[1]}.</span>
                          <span>{renderInlineMarkdown(match[2])}</span>
                      </div>
                   )
              }
          }

          return <p key={idx} className="mb-2 text-slate-700 dark:text-slate-300 leading-relaxed">{renderInlineMarkdown(line)}</p>
      });
  };

  const renderTable = (lines: string[], keyPrefix: number) => {
    if (lines.length < 3) return null;
    const headerLine = lines[0];
    const bodyLines = lines.slice(2);
    const headers = headerLine.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
    
    // We treat the whole table as a chunk
    const fullTableText = lines.join('\n');

    return (
      <AIWrapper key={`table-${keyPrefix}`} text={fullTableText} onAsk={handleContextualAsk}>
        <div className="overflow-x-auto my-6 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                {headers.map((h, i) => (
                    <th key={i} className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {renderInlineMarkdown(h)}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800/50 divide-y divide-slate-200 dark:divide-slate-700">
                {bodyLines.map((rowLine, i) => {
                const cells = rowLine.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
                return (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    {cells.map((cell, j) => (
                        <td key={j} className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                        {renderInlineMarkdown(cell)}
                        </td>
                    ))}
                    </tr>
                );
                })}
            </tbody>
            </table>
        </div>
      </AIWrapper>
    );
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const nodes: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('```')) {
        if (inCodeBlock) {
          const fullCode = codeBlockContent.join('\n');
          nodes.push(
            <AIWrapper key={`code-${i}`} text={fullCode} onAsk={handleContextualAsk}>
                <div className="relative group">
                <pre className="bg-slate-800 dark:bg-slate-900 text-slate-50 p-4 rounded-lg my-4 overflow-x-auto font-mono text-sm leading-relaxed whitespace-pre shadow-inner border border-slate-700 dark:border-slate-800">
                    <code>{fullCode}</code>
                </pre>
                </div>
            </AIWrapper>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      if (!trimmedLine) {
        nodes.push(<div key={`spacer-${i}`} className="h-4"></div>);
        continue;
      }

      if (trimmedLine.startsWith('>')) {
        let level = 0;
        let contentStr = trimmedLine;
        while (contentStr.startsWith('>')) {
          level++;
          contentStr = contentStr.substring(1);
        }
        contentStr = contentStr.trim();

        nodes.push(
          <AIWrapper key={i} text={contentStr} onAsk={handleContextualAsk}>
            <blockquote className={`
              my-4 py-2 pl-4 border-l-4 rounded-r-lg
              ${level === 1 
                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 text-slate-700 dark:text-slate-300' 
                : 'border-science-purple bg-purple-50/50 dark:bg-purple-900/20 text-slate-600 dark:text-slate-400 ml-6'
              }
            `}>
              <div className="italic">
                {renderInlineMarkdown(contentStr)}
              </div>
            </blockquote>
          </AIWrapper>
        );
        continue;
      }

      if (line.startsWith('# ')) {
        const text = line.replace('# ', '');
        nodes.push(
            <AIWrapper key={i} text={text} onAsk={handleContextualAsk} type="header">
                <h1 className="text-2xl font-bold mb-4 mt-8 text-primary-900 dark:text-primary-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                    {renderInlineMarkdown(text)}
                </h1>
            </AIWrapper>
        );
        continue;
      }
      if (line.startsWith('## ')) {
        const text = line.replace('## ', '');
        nodes.push(
          <AIWrapper key={i} text={text} onAsk={handleContextualAsk} type="header">
            <h2 className="text-xl font-bold mb-3 mt-6 text-primary-700 dark:text-primary-400 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary-500 rounded-full inline-block"></span>
                {renderInlineMarkdown(text)}
            </h2>
          </AIWrapper>
        );
        continue;
      }
      if (line.startsWith('### ')) {
        const text = line.replace('### ', '');
        nodes.push(
            <AIWrapper key={i} text={text} onAsk={handleContextualAsk} type="header">
                <h3 className="text-lg font-semibold mb-2 mt-4 text-primary-600 dark:text-primary-400">
                    {renderInlineMarkdown(text)}
                </h3>
            </AIWrapper>
        );
        continue;
      }

      if (trimmedLine.startsWith('$$') && trimmedLine.endsWith('$$')) {
        const latex = trimmedLine.replace(/\$\$/g, '');
        nodes.push(
            <AIWrapper key={i} text={latex} onAsk={handleContextualAsk}>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl my-4 text-center text-slate-800 dark:text-slate-200 overflow-x-auto border border-slate-200 dark:border-slate-700 shadow-sm"
                dangerouslySetInnerHTML={{ __html: renderMath(latex, true) }}
                />
            </AIWrapper>
        );
        continue;
      }

      if (trimmedLine.startsWith('|') && i + 1 < lines.length && lines[i+1].trim().startsWith('|') && lines[i+1].includes('---')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }
        i--;
        nodes.push(renderTable(tableLines, i));
        continue;
      }

      if (trimmedLine.startsWith('- ')) {
        nodes.push(
            <AIWrapper key={i} text={line.replace('- ', '')} onAsk={handleContextualAsk}>
                <div className="flex gap-3 mb-2 ml-2 text-slate-700 dark:text-slate-300 items-start">
                    <span className="text-primary-500 font-bold mt-1.5 text-xs">●</span>
                    <span className="leading-relaxed">{renderInlineMarkdown(line.replace('- ', ''))}</span>
                </div>
            </AIWrapper>
        );
        continue;
      }

      if (/^\d+\.\s/.test(trimmedLine)) {
        const match = trimmedLine.match(/^(\d+)\.\s(.*)/);
        if (match) {
             nodes.push(
                <AIWrapper key={i} text={match[2]} onAsk={handleContextualAsk}>
                    <div className="flex gap-3 mb-2 ml-2 text-slate-700 dark:text-slate-300 items-start">
                        <span className="text-primary-600 dark:text-primary-400 font-bold min-w-[1.5rem] mt-0.5">{match[1]}.</span>
                        <span className="leading-relaxed">{renderInlineMarkdown(match[2])}</span>
                    </div>
                </AIWrapper>
            );
            continue;
        }
      }

      nodes.push(
        <AIWrapper key={i} text={line} onAsk={handleContextualAsk}>
            <p className="mb-3 text-slate-600 dark:text-slate-300 leading-relaxed">
            {renderInlineMarkdown(line)}
            </p>
        </AIWrapper>
      );
    }
    
    if (inCodeBlock && codeBlockContent.length > 0) {
        const fullCode = codeBlockContent.join('\n');
        nodes.push(
            <AIWrapper key={`code-end`} text={fullCode} onAsk={handleContextualAsk}>
                <div className="relative group">
                <pre className="bg-slate-800 dark:bg-slate-900 text-slate-50 p-4 rounded-lg my-4 overflow-x-auto font-mono text-sm leading-relaxed whitespace-pre shadow-inner border border-slate-700 dark:border-slate-800">
                    <code>{fullCode}</code>
                </pre>
                </div>
            </AIWrapper>
        );
    }
    
    return nodes;
  };

  return (
    <AnimatePresence mode="wait">
      {activeModule ? (
        <motion.div 
            key="module-detail"
            initial={{ opacity: 0, x: 50, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="flex flex-col h-full bg-white dark:bg-slate-800 md:m-4 md:rounded-2xl shadow-sm border-x md:border-y border-slate-200 dark:border-slate-700 overflow-hidden relative"
        >
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 bg-slate-50 dark:bg-slate-800 shrink-0">
            <button 
              onClick={() => setActiveModule(null)}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-colors text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">{activeModule.title}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeModule.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                activeModule.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}>
                {activeModule.difficulty}
              </span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-800 relative">
              <div className="p-6 md:p-8 prose prose-slate dark:prose-invert md:w-2/3 mx-auto pb-20" ref={contentRef}>
                  {renderContent(activeModule.content)}

                  {/* Integration with Assessment: The "Bridge" */}
                  <div className="mt-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-8 text-center border border-indigo-100 dark:border-indigo-800">
                      <GraduationCap className="w-12 h-12 text-indigo-500 dark:text-indigo-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-2">Paham dengan materi ini?</h3>
                      <p className="text-indigo-600 dark:text-indigo-300 mb-6">Uji pemahamanmu sekarang untuk membuka modul selanjutnya!</p>
                      <button 
                          onClick={() => onTakeQuiz && onTakeQuiz(activeModule.title)}
                          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 flex items-center justify-center gap-2 mx-auto"
                      >
                          Uji Pemahaman <ArrowRight size={20} />
                      </button>
                  </div>
              </div>
          </div>
          
          {/* Floating Selection Button */}
          {selectionButton && (
              <div 
                  className="fixed z-50 animate-pop-in"
                  style={{ top: selectionButton.y, left: selectionButton.x }}
              >
                  <button
                      onMouseDown={(e) => {
                          e.preventDefault(); // Prevent losing focus/selection before action
                          handleContextualAsk(selectionButton.text);
                      }}
                      className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary-700 hover:scale-105 transition-all text-sm font-bold border-2 border-white dark:border-slate-800 ring-2 ring-primary-200 dark:ring-primary-800"
                  >
                      <Sparkles size={16} className="fill-current" />
                      Tanya AI
                  </button>
                  <div className="w-3 h-3 bg-primary-600 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b border-primary-600"></div>
              </div>
          )}

          {/* Contextual AI Modal */}
          {showAIModal && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                  <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[85%] border border-slate-200 dark:border-slate-700">
                      <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-primary-600 text-white rounded-t-2xl shrink-0">
                          <div className="flex items-center gap-2">
                              <Sparkles size={18} />
                              <h3 className="font-bold">Profesor Stoi Menjelaskan</h3>
                          </div>
                          <button onClick={() => setShowAIModal(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                              <X size={20} />
                          </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm italic mb-4 border-l-4 border-l-primary-400 max-h-32 overflow-y-auto custom-scrollbar">
                              "{contextText}"
                          </div>
                          
                          {aiResponse ? (
                              <div className="prose prose-sm prose-slate dark:prose-invert max-w-none animate-slide-up">
                                  {renderAIResponse(aiResponse)}
                              </div>
                          ) : isAiLoading ? (
                              <div className="flex flex-col items-center justify-center py-8 text-primary-600 dark:text-primary-400">
                                  <Loader2 size={32} className="animate-spin mb-2" />
                                  <span className="text-sm font-medium">Sedang menganalisis teks...</span>
                              </div>
                          ) : (
                              <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                                  <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                                  <p>Apa yang ingin kamu tanyakan tentang potongan teks di atas?</p>
                              </div>
                          )}
                      </div>

                      <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl shrink-0">
                          {!aiResponse && (
                              <div className="flex flex-col gap-2">
                                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                      <button 
                                          onClick={() => submitContextQuery("Jelaskan bagian ini dengan bahasa yang lebih sederhana.")}
                                          className="whitespace-nowrap px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                      >
                                          Jelaskan Sederhana
                                      </button>
                                      <button 
                                          onClick={() => submitContextQuery("Berikan contoh analogi sehari-hari yang relevan dengan ini.")}
                                          className="whitespace-nowrap px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                      >
                                          Berikan Analogi
                                      </button>
                                      <button 
                                          onClick={() => submitContextQuery("Apa kaitan bagian ini dengan konsep kimia sebelumnya?")}
                                          className="whitespace-nowrap px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                      >
                                          Kaitan Konsep
                                      </button>
                                  </div>
                                  <div className="flex gap-2">
                                      <input 
                                          type="text" 
                                          value={userQuery}
                                          onChange={(e) => setUserQuery(e.target.value)}
                                          placeholder="Ketik pertanyaan spesifik..."
                                          className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                          onKeyDown={(e) => e.key === 'Enter' && submitContextQuery()}
                                      />
                                      <button 
                                          onClick={() => submitContextQuery()}
                                          disabled={isAiLoading || (!userQuery && !aiResponse)}
                                          className="bg-primary-600 text-white p-2 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors"
                                      >
                                          <ArrowRight size={20} />
                                      </button>
                                  </div>
                              </div>
                          )}
                          {aiResponse && (
                              <button 
                                  onClick={() => {
                                      setAiResponse('');
                                      setUserQuery('');
                                  }}
                                  className="w-full py-2 text-sm font-bold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors border border-primary-200 dark:border-primary-700 border-dashed"
                              >
                                  Tanya Hal Lain
                              </button>
                          )}
                      </div>
                  </div>
              </div>
          )}
        </motion.div>
      ) : (
        <motion.div 
            key="module-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50 dark:bg-slate-900"
        >
            <div className="max-w-3xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Peta Perjalanan Belajar</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {learningMode === 'TIMELINE' 
                            ? 'Selesaikan setiap modul untuk membuka tantangan berikutnya.' 
                            : 'Mode Bebas Aktif: Jelajahi materi sesuka hatimu.'}
                    </p>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-4 relative"
                >
                    {/* Connecting Line (Absolute) */}
                    <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700 z-0 hidden md:block"></div>

                    {LEARNING_MODULES.map((module, index) => {
                        const status = getModuleStatus(module.id);
                        const isLocked = status === 'LOCKED';
                        const isCompleted = status === 'COMPLETED';
                        const score = userProgress ? userProgress[module.id]?.score : 0;

                        return (
                            <motion.div key={module.id} variants={itemVariants} className={`relative pl-0 md:pl-16 transition-all duration-500 ${isLocked ? 'opacity-70 grayscale' : 'opacity-100'}`}>
                                {/* Timeline Node (Desktop) */}
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-4 border-white dark:border-slate-800 z-10 shadow-sm hidden md:block ${
                                    isCompleted ? 'bg-green-500' : isLocked ? 'bg-slate-300 dark:bg-slate-600' : 'bg-primary-500'
                                }`}></div>

                                <button
                                    onClick={() => !isLocked && setActiveModule(module)}
                                    disabled={isLocked}
                                    className={`w-full group relative flex flex-col md:flex-row items-start md:items-center p-5 rounded-2xl border text-left transition-all duration-300 ease-out ${
                                        isLocked 
                                        ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 cursor-not-allowed' 
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-600 hover:-translate-y-1'
                                    }`}
                                >
                                    {/* Left Icon */}
                                    <div className={`p-4 rounded-xl shrink-0 mr-4 mb-4 md:mb-0 ${
                                        isLocked ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500' : 
                                        isCompleted ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                        'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                                    }`}>
                                        {isLocked ? <Lock size={24} /> : isCompleted ? <CheckCircle size={24} /> : (learningMode === 'FREE' ? <Unlock size={24} /> : <BookOpen size={24} />)}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                                module.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                                module.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                            }`}>
                                                {module.difficulty}
                                            </span>
                                            {isCompleted && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                                                    <Star size={10} fill="currentColor" /> Skor: {score}
                                                </span>
                                            )}
                                            {learningMode === 'FREE' && !isCompleted && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                                    Unlocked
                                                </span>
                                            )}
                                        </div>

                                        <h3 className={`text-lg font-bold mb-1 ${isLocked ? 'text-slate-500 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100 group-hover:text-primary-700 dark:group-hover:text-primary-300'}`}>
                                            {module.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                            {module.description}
                                        </p>
                                    </div>

                                    {/* Right Action */}
                                    <div className="mt-4 md:mt-0 md:ml-4 flex items-center">
                                        {!isLocked && (
                                            <span className="p-2 rounded-full bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                <ChevronRight size={20} />
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
