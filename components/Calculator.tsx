
import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, ArrowRightLeft } from 'lucide-react';
import { ELEMENTS } from '../constants';

type Mode = 'MASS_TO_MOLE' | 'MOLE_TO_MASS' | 'PARTICLE_TO_MOLE';

export const Calculator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('MASS_TO_MOLE');
  const [inputValue, setInputValue] = useState<string>('');
  const [molarMass, setMolarMass] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  
  // Quick Element Picker
  const [selectedElement, setSelectedElement] = useState<string>('');

  useEffect(() => {
    if (selectedElement) {
        const el = ELEMENTS.find(e => e.symbol === selectedElement);
        if (el) {
            setMolarMass(el.atomicMass.toString());
        }
    }
  }, [selectedElement]);

  const calculate = () => {
    const val = parseFloat(inputValue);
    const mm = parseFloat(molarMass);
    const AVOGADRO = 6.022e23;

    if (isNaN(val)) {
        setResult(null);
        return;
    }

    switch (mode) {
        case 'MASS_TO_MOLE':
            if (!isNaN(mm) && mm > 0) setResult(val / mm);
            break;
        case 'MOLE_TO_MASS':
            if (!isNaN(mm) && mm > 0) setResult(val * mm);
            break;
        case 'PARTICLE_TO_MOLE':
             setResult(val / AVOGADRO);
             break;
    }
  };

  useEffect(() => {
    calculate();
  }, [inputValue, molarMass, mode]);

  const formatNumber = (num: number) => {
     if (num === 0) return '0';
     if (num < 0.001 || num > 10000) return num.toExponential(3);
     return num.toFixed(3);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 bg-primary-600 dark:bg-primary-900 text-white">
          <div className="flex items-center gap-3 mb-2">
            <CalcIcon className="opacity-80" />
            <h2 className="text-xl font-bold">Kalkulator Stoikiometri</h2>
          </div>
          <p className="text-primary-100 dark:text-primary-200 text-sm">Hitung hubungan antara massa, mol, dan massa molar dengan mudah.</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Mode Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
            {[
                { id: 'MASS_TO_MOLE', label: 'Massa → Mol' },
                { id: 'MOLE_TO_MASS', label: 'Mol → Massa' },
                { id: 'PARTICLE_TO_MOLE', label: 'Partikel → Mol' }
            ].map(m => (
                <button
                    key={m.id}
                    onClick={() => {
                        setMode(m.id as Mode);
                        setInputValue('');
                        setResult(null);
                    }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                        mode === m.id 
                        ? 'bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-300 shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                    {m.label}
                </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Inputs */}
             <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {mode === 'MASS_TO_MOLE' ? 'Massa Zat (gram)' : 
                         mode === 'MOLE_TO_MASS' ? 'Jumlah Mol (n)' : 
                         'Jumlah Partikel (X)'}
                    </label>
                    <input 
                        type="number" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="0.0"
                        className="w-full p-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    />
                    {mode === 'PARTICLE_TO_MOLE' && <p className="text-xs text-slate-400 mt-1">Gunakan notasi ilmiah (e.g. 6.02e23) jika perlu.</p>}
                </div>

                {mode !== 'PARTICLE_TO_MOLE' && (
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Massa Molar (Mr/Ar)</label>
                            <span className="text-xs text-slate-400">g/mol</span>
                        </div>
                        <input 
                            type="number" 
                            value={molarMass}
                            onChange={(e) => {
                                setMolarMass(e.target.value);
                                setSelectedElement(''); // Clear selection if manual typing
                            }}
                            placeholder="Contoh: 18 untuk Air"
                            className="w-full p-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        />
                        
                        {/* Quick Picks */}
                        <div className="mt-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Pilih Unsur Cepat:</p>
                            <div className="flex flex-wrap gap-2">
                                {ELEMENTS.map(el => (
                                    <button
                                        key={el.symbol}
                                        onClick={() => setSelectedElement(el.symbol)}
                                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                                            selectedElement === el.symbol 
                                            ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300' 
                                            : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-primary-300'
                                        }`}
                                    >
                                        {el.symbol}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
             </div>

             {/* Result */}
             <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 flex flex-col justify-center items-center text-center border border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-2">Hasil Perhitungan</span>
                {result !== null ? (
                    <div className="animate-pop-in">
                        <span className="text-4xl font-bold text-primary-600 dark:text-primary-400 block mb-1">
                            {formatNumber(result)}
                        </span>
                        <span className="text-slate-400 font-medium">
                            {mode === 'MASS_TO_MOLE' || mode === 'PARTICLE_TO_MOLE' ? 'Mol (n)' : 'Gram (g)'}
                        </span>
                    </div>
                ) : (
                    <div className="text-slate-300 dark:text-slate-500 flex flex-col items-center">
                        <ArrowRightLeft className="mb-2" />
                        <span className="text-sm">Masukkan angka untuk melihat hasil</span>
                    </div>
                )}
             </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-xs text-yellow-800 dark:text-yellow-200 border border-yellow-100 dark:border-yellow-900/50">
             <strong>Info:</strong> 
             {mode === 'MASS_TO_MOLE' && " Rumus: n = m / Mr"}
             {mode === 'MOLE_TO_MASS' && " Rumus: m = n × Mr"}
             {mode === 'PARTICLE_TO_MOLE' && " Rumus: n = X / 6.022×10²³"}
          </div>

        </div>
      </div>
    </div>
  );
};
