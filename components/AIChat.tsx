
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { getAIResponse } from '../services/geminiService';
import katex from 'katex';

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
        id: 'intro',
        role: 'model',
        text: 'Halo! Saya **Profesor Stoi**. Ada yang bisa saya bantu tentang Stoikiometri hari ini? Jangan ragu bertanya ya!',
        timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: input,
        timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    const responseText = await getAIResponse(history, userMsg.text);

    const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  // Improved Render Logic
  const renderFormattedContent = (text: string) => {
    // 1. Split by newlines first to handle blocks
    const lines = text.split('\n');
    
    return lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;

        // Block Math $$...$$
        if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
            const latex = trimmed.replace(/\$\$/g, '');
            try {
                const html = katex.renderToString(latex, { displayMode: true, throwOnError: false });
                return <div key={i} className="my-2 overflow-x-auto text-center" dangerouslySetInnerHTML={{ __html: html }} />;
            } catch (e) {
                return <code key={i} className="block bg-red-50 dark:bg-red-900/20 text-red-500 p-2">{latex}</code>;
            }
        }

        // Headers
        if (line.startsWith('### ')) return <h4 key={i} className="font-bold text-slate-800 dark:text-slate-200 mt-2 text-sm">{renderInlineMarkdown(line.replace('### ', ''))}</h4>;
        if (line.startsWith('## ')) return <h3 key={i} className="font-bold text-primary-700 dark:text-primary-300 mt-3 mb-1">{renderInlineMarkdown(line.replace('## ', ''))}</h3>;
        
        // Lists
        if (line.trim().startsWith('- ')) {
             return (
                 <div key={i} className="flex gap-2 ml-2 mb-1">
                     <span className="text-primary-500 mt-1.5">•</span>
                     <span>{renderInlineMarkdown(line.replace('- ', ''))}</span>
                 </div>
             )
        }
        if (/^\d+\./.test(trimmed)) {
             const match = trimmed.match(/^(\d+)\.\s(.*)/);
             if (match) {
                 return (
                     <div key={i} className="flex gap-2 ml-2 mb-1">
                         <span className="font-bold text-primary-600 dark:text-primary-400 min-w-[1rem]">{match[1]}.</span>
                         <span>{renderInlineMarkdown(match[2])}</span>
                     </div>
                 )
             }
        }

        return <p key={i} className="mb-1 leading-relaxed">{renderInlineMarkdown(line)}</p>;
    });
  };

  const renderInlineMarkdown = (text: string) => {
      // Split by $ for inline math
      const parts = text.split(/(\$[^$]+\$)/g);
      
      return parts.map((part, index) => {
          if (part.startsWith('$') && part.endsWith('$')) {
              const latex = part.slice(1, -1);
              try {
                  const html = katex.renderToString(latex, { throwOnError: false });
                  return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
              } catch (e) {
                  return <span key={index} className="text-red-500">{latex}</span>;
              }
          }
          
          // Markdown Bold/Italic/Code
          // We can use a simple parser or just dangerouslySetInnerHTML if we trust the source (AI)
          // For safety and simplicity, let's do simple replacement for React nodes
          let content: React.ReactNode[] = [];
          
          const boldParts = part.split(/(\*\*.*?\*\*)/g);
          boldParts.forEach((bp, bi) => {
              if (bp.startsWith('**') && bp.endsWith('**')) {
                  content.push(<strong key={`${index}-${bi}`}>{bp.slice(2, -2)}</strong>);
              } else {
                  // Check italic
                   const italicParts = bp.split(/(\*.*?\*)/g);
                   italicParts.forEach((ip, ii) => {
                        if (ip.startsWith('*') && ip.endsWith('*')) {
                             content.push(<em key={`${index}-${bi}-${ii}`}>{ip.slice(1, -1)}</em>);
                        } else {
                             // Check code
                             const codeParts = ip.split(/(`[^`]+`)/g);
                             codeParts.forEach((cp, ci) => {
                                 if (cp.startsWith('`') && cp.endsWith('`')) {
                                     content.push(<code key={`${index}-${bi}-${ii}-${ci}`} className="bg-slate-100 dark:bg-slate-700 text-pink-600 dark:text-pink-400 px-1 rounded text-xs font-mono border border-slate-200 dark:border-slate-600">{cp.slice(1, -1)}</code>);
                                 } else {
                                     content.push(<span key={`${index}-${bi}-${ii}-${ci}`}>{cp}</span>);
                                 }
                             })
                        }
                   })
              }
          });

          return <span key={index}>{content}</span>;
      });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-primary-600 dark:bg-primary-900 text-white flex items-center gap-3 shadow-sm">
        <div className="p-2 bg-white/20 rounded-full">
            <Sparkles size={20} />
        </div>
        <div>
            <h3 className="font-bold">Profesor Stoi AI</h3>
            <p className="text-xs text-primary-100">Konsultan Kimia Pribadi Anda</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900 custom-scrollbar">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[90%] md:max-w-[85%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
                    }`}>
                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-primary-600 dark:bg-primary-700 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                    }`}>
                        {msg.role === 'user' ? (
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        ) : (
                            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                                {renderFormattedContent(msg.text)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 flex items-center justify-center shrink-0">
                        <Bot size={16} />
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 relative">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Tanya tentang mol, rumus, atau soal kimia..."
                className="w-full p-3 pr-12 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none h-[52px] scrollbar-hide text-sm text-slate-900 dark:text-white placeholder-slate-400"
            />
            <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Send size={18} />
            </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2">
            AI dapat melakukan kesalahan. Selalu verifikasi informasi penting.
        </p>
      </div>
    </div>
  );
};
