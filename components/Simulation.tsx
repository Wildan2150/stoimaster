
import React, { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export const Simulation: React.FC = () => {
  // Scenario: Formation of Water: 2 H2 + 1 O2 -> 2 H2O
  const [coeffH2, setCoeffH2] = useState(1);
  const [coeffO2, setCoeffO2] = useState(1);
  const [coeffH2O, setCoeffH2O] = useState(1);

  // Calculate atoms
  const reactH = coeffH2 * 2;
  const reactO = coeffO2 * 2;
  const prodH = coeffH2O * 2;
  const prodO = coeffH2O * 1;

  const isBalanced = reactH === prodH && reactO === prodO;

  const Atom = ({ color }: { color: string }) => (
    <div className={`w-6 h-6 rounded-full shadow-inner ${color} border border-white/20`}></div>
  );

  const MoleculeH2 = () => (
    <div className="flex items-center bg-white/50 dark:bg-slate-700/50 p-1 rounded-full border border-slate-200 dark:border-slate-600">
      <Atom color="bg-slate-200 dark:bg-slate-400" />
      <Atom color="bg-slate-200 dark:bg-slate-400" />
    </div>
  );

  const MoleculeO2 = () => (
    <div className="flex items-center bg-white/50 dark:bg-slate-700/50 p-1 rounded-full border border-slate-200 dark:border-slate-600">
      <Atom color="bg-red-500" />
      <Atom color="bg-red-500" />
    </div>
  );

  const MoleculeH2O = () => (
    <div className="relative w-10 h-8 bg-white/50 dark:bg-slate-700/50 p-1 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center">
       {/* Oxygen */}
       <div className="absolute top-1 z-10"><Atom color="bg-red-500" /></div>
       {/* Hydrogens */}
       <div className="absolute bottom-0 left-0 scale-75"><Atom color="bg-slate-200 dark:bg-slate-400" /></div>
       <div className="absolute bottom-0 right-0 scale-75"><Atom color="bg-slate-200 dark:bg-slate-400" /></div>
    </div>
  );

  const renderMolecules = (Component: React.FC, count: number) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center min-h-[60px] p-2 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="animate-pop-in">
            <Component />
          </div>
        ))}
      </div>
    );
  };

  const Control = ({ label, value, setter }: { label: string, value: number, setter: (n: number) => void }) => (
    <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
      <span className="font-bold text-slate-700 dark:text-slate-300 mb-2">{label}</span>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setter(Math.max(1, value - 1))}
          className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center transition-colors"
        >-</button>
        <span className="text-xl font-bold w-6 text-center text-slate-800 dark:text-slate-200">{value}</span>
        <button 
          onClick={() => setter(Math.min(10, value + 1))}
          className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800 text-primary-700 dark:text-primary-300 font-bold flex items-center justify-center transition-colors"
        >+</button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Laboratorium Virtual</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Seimbangkan reaksi pembentukan air: Hidrogen + Oksigen &rarr; Air</p>

        {/* Reaction Equation Display */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-2xl md:text-4xl font-mono font-bold text-slate-700 dark:text-slate-200 mb-10 bg-slate-50 dark:bg-slate-900 p-8 rounded-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
            {isBalanced && (
                 <div className="absolute inset-0 bg-green-50/50 dark:bg-green-900/50 flex items-center justify-center backdrop-blur-sm z-10 animate-fade-in">
                     <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg flex items-center gap-2 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
                        <CheckCircle size={32} />
                        <span className="text-lg font-sans font-bold">Reaksi Setara!</span>
                     </div>
                 </div>
            )}
            
            <span className="text-primary-600 dark:text-primary-400">{coeffH2}</span> H₂
            <span className="text-slate-400">+</span>
            <span className="text-primary-600 dark:text-primary-400">{coeffO2}</span> O₂
            <span className="text-slate-400">&rarr;</span>
            <span className="text-primary-600 dark:text-primary-400">{coeffH2O}</span> H₂O
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-4 mb-8">
            <Control label="H₂" value={coeffH2} setter={setCoeffH2} />
            <Control label="O₂" value={coeffO2} setter={setCoeffO2} />
            <Control label="H₂O" value={coeffH2O} setter={setCoeffH2O} />
        </div>

        {/* Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
           
           {/* Reactants */}
           <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900">
              <h3 className="text-center font-bold text-blue-800 dark:text-blue-200 mb-4 border-b border-blue-100 dark:border-blue-900 pb-2">Reaktan (Kiri)</h3>
              <div className="space-y-4">
                 <div>
                    <div className="text-xs uppercase font-bold text-slate-400 mb-1">Molekul Hidrogen</div>
                    {renderMolecules(MoleculeH2, coeffH2)}
                 </div>
                 <div>
                    <div className="text-xs uppercase font-bold text-slate-400 mb-1">Molekul Oksigen</div>
                    {renderMolecules(MoleculeO2, coeffO2)}
                 </div>
                 <div className="mt-4 pt-4 border-t border-blue-100 dark:border-blue-900 flex justify-around">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">{reactH}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Atom H</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">{reactO}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Atom O</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Products */}
           <div className="bg-green-50/50 dark:bg-green-900/10 rounded-xl p-4 border border-green-100 dark:border-green-900">
              <h3 className="text-center font-bold text-green-800 dark:text-green-200 mb-4 border-b border-green-100 dark:border-green-900 pb-2">Produk (Kanan)</h3>
              <div className="space-y-4">
                 <div>
                    <div className="text-xs uppercase font-bold text-slate-400 mb-1">Molekul Air</div>
                    {renderMolecules(MoleculeH2O, coeffH2O)}
                 </div>
                 <div className="mt-auto pt-20 border-t border-green-100 dark:border-green-900 flex justify-around">
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${reactH === prodH ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{prodH}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Atom H</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${reactO === prodO ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{prodO}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Atom O</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Arrow in middle (Desktop) */}
           <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
              <div className="bg-white dark:bg-slate-700 p-2 rounded-full shadow-md border border-slate-200 dark:border-slate-600">
                <RefreshCw className={`w-6 h-6 text-slate-400 ${!isBalanced && 'animate-spin-slow'}`} />
              </div>
           </div>
        </div>

        {/* Status Message */}
        {!isBalanced && (
            <div className="mt-6 flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-900/50">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <p className="text-sm">
                    Jumlah atom belum sama di kedua ruas! <br/>
                    {reactH !== prodH && <span>• Hidrogen: {reactH} vs {prodH} (Perlu disamakan)<br/></span>}
                    {reactO !== prodO && <span>• Oksigen: {reactO} vs {prodO} (Perlu disamakan)</span>}
                </p>
            </div>
        )}
      </div>
    </div>
  );
};
