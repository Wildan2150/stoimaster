
import React, { useState } from 'react';
import { Beaker, Plus, ArrowRight, RotateCcw, Pipette } from 'lucide-react';

export const MiniLab: React.FC = () => {
  const [volA, setVolA] = useState(50);
  const [concA, setConcA] = useState(1);
  const [volB, setVolB] = useState(50);
  const [concB, setConcB] = useState(1);
  const [mixed, setMixed] = useState(false);

  // Mock calculation for preview
  const molA = (volA * concA) / 1000;
  const molB = (volB * concB) / 1000;
  
  // Scenario: AgNO3(aq) + NaCl(aq) -> AgCl(s) + NaNO3(aq)
  // Ratio 1:1
  const limiting = molA < molB ? 'AgNO3' : molB < molA ? 'NaCl' : 'Setara';
  const precipMol = Math.min(molA, molB);
  const precipMass = precipMol * 143.32; // Mr AgCl

  const handleMix = () => {
    setMixed(true);
  };

  const reset = () => {
    setMixed(false);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                <Beaker size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Mini-Lab Digital</h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400">Simulasi pencampuran larutan, pembentukan endapan, dan penentuan pereaksi pembatas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Solution A Controls */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-bl-full -mr-4 -mt-4 z-0"></div>
             <div className="relative z-10">
                <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Larutan A (AgNO₃)
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-500 dark:text-slate-400 font-medium flex justify-between">
                            Volume (mL) <span>{volA} mL</span>
                        </label>
                        <input 
                            type="range" min="10" max="200" step="10" 
                            value={volA} onChange={(e) => setVolA(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            disabled={mixed}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-slate-500 dark:text-slate-400 font-medium flex justify-between">
                            Konsentrasi (M) <span>{concA} M</span>
                        </label>
                        <input 
                            type="range" min="0.1" max="2.0" step="0.1" 
                            value={concA} onChange={(e) => setConcA(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            disabled={mixed}
                        />
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center text-blue-800 dark:text-blue-300 font-mono text-sm">
                        n = {molA.toFixed(3)} mol
                    </div>
                </div>
             </div>
          </div>

          {/* Solution B Controls */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 dark:bg-green-900/10 rounded-bl-full -mr-4 -mt-4 z-0"></div>
             <div className="relative z-10">
                <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Larutan B (NaCl)
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-500 dark:text-slate-400 font-medium flex justify-between">
                            Volume (mL) <span>{volB} mL</span>
                        </label>
                        <input 
                            type="range" min="10" max="200" step="10" 
                            value={volB} onChange={(e) => setVolB(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            disabled={mixed}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-slate-500 dark:text-slate-400 font-medium flex justify-between">
                            Konsentrasi (M) <span>{concB} M</span>
                        </label>
                        <input 
                            type="range" min="0.1" max="2.0" step="0.1" 
                            value={concB} onChange={(e) => setConcB(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            disabled={mixed}
                        />
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-center text-green-800 dark:text-green-300 font-mono text-sm">
                        n = {molB.toFixed(3)} mol
                    </div>
                </div>
             </div>
          </div>
      </div>

      {/* Action Area */}
      <div className="flex justify-center">
          {!mixed ? (
            <button 
                onClick={handleMix}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-purple-200 dark:shadow-none flex items-center gap-2 transition-transform active:scale-95"
            >
                <Pipette size={20} /> Campurkan Larutan
            </button>
          ) : (
            <button 
                onClick={reset}
                className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-colors"
            >
                <RotateCcw size={20} /> Reset Lab
            </button>
          )}
      </div>

      {/* Results View */}
      {mixed && (
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 animate-pop-in">
              <h3 className="text-center font-bold text-xl text-slate-800 dark:text-slate-100 mb-6">Hasil Reaksi</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Visual Representation */}
                  <div className="flex flex-col items-center justify-center">
                      <div className="w-32 h-40 border-b-4 border-x-2 border-slate-300 dark:border-slate-600 rounded-b-xl bg-blue-50/30 dark:bg-blue-900/20 relative overflow-hidden flex items-end justify-center">
                           <div className="w-full h-4 bg-white/50 dark:bg-white/10 absolute bottom-0 animate-pulse"></div>
                           {/* Precipitate */}
                           <div className="w-full h-8 bg-white dark:bg-slate-300 opacity-90 absolute bottom-0 border-t border-slate-200 dark:border-slate-500"></div>
                           <div className="absolute bottom-2 text-xs font-bold text-slate-500 dark:text-slate-700">AgCl (s)</div>
                      </div>
                      <span className="text-xs text-slate-400 mt-2">Gelas Kimia</span>
                  </div>

                  {/* Reaction Stats */}
                  <div className="col-span-2 space-y-4">
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                          <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-100 dark:border-slate-700 pb-2">Persamaan Reaksi</h4>
                          <p className="font-mono text-sm md:text-base text-slate-900 dark:text-slate-200">AgNO₃(aq) + NaCl(aq) &rarr; AgCl(s) + NaNO₃(aq)</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/50">
                              <span className="text-xs text-yellow-700 dark:text-yellow-400 font-bold uppercase">Pereaksi Pembatas</span>
                              <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{limiting}</div>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-100 dark:border-purple-900/50">
                              <span className="text-xs text-purple-700 dark:text-purple-400 font-bold uppercase">Massa Endapan AgCl</span>
                              <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{precipMass.toFixed(3)} gram</div>
                          </div>
                      </div>

                       <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg text-sm text-slate-600 dark:text-slate-300">
                          <strong>Analisis:</strong> {limiting === 'Setara' ? 'Kedua reaktan habis bereaksi.' : `${limiting} habis bereaksi lebih dulu, membatasi jumlah produk yang terbentuk.`}
                       </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
