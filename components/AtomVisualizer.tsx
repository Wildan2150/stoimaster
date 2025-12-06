import React, { useState } from 'react';
import { ELEMENTS } from '../constants';
import Atom from './atom/Atom';
import Controls from './atom/Controls';
import InfoPanel from './atom/InfoPanel';

export const AtomVisualizer: React.FC = () => {
  // Default to Carbon (Atomic number 6)
  const [currentElement, setCurrentElement] = useState(ELEMENTS[1]); 
  const [isExcited, setIsExcited] = useState(false);

  const handleExcite = () => {
    setIsExcited(true);
    setTimeout(() => setIsExcited(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="min-h-[600px] bg-space-900 rounded-2xl overflow-hidden shadow-2xl relative">
       {/* Background decoration */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-space-800 to-space-900 -z-10"></div>
       <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

       <div className="p-6 md:p-8">
         <div className="flex flex-col xl:flex-row gap-8 items-start">
            
            {/* Left Column: Visualizer */}
            <div className="flex-1 w-full flex flex-col items-center">
                <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
                  Model <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Bohr</span>
                </h2>
                <p className="text-slate-400 mb-8 text-center max-w-lg">
                  Visualisasi interaktif struktur atom. Lihat bagaimana elektron mengorbit inti dalam kulit energi yang berbeda.
                </p>
                <div className="w-full flex justify-center bg-space-800/50 rounded-3xl p-4 border border-white/5 backdrop-blur-sm">
                   <Atom element={currentElement} isExcited={isExcited} />
                </div>
            </div>

            {/* Right Column: Controls & Info */}
            <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0">
                <Controls 
                  currentElement={currentElement} 
                  onElementChange={setCurrentElement}
                  onExcite={handleExcite}
                  isExcited={isExcited}
                />
                <InfoPanel element={currentElement} />
            </div>

         </div>
       </div>
    </div>
  );
};