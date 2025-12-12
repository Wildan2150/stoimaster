
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FlaskConical, Bot, BrainCircuit, GraduationCap, Sparkles, Atom, ChevronRight, Play, Calculator, ScrollText } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="h-full bg-slate-50 font-sans text-slate-900 overflow-y-auto overflow-x-hidden custom-scrollbar">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary-200">
                <FlaskConical size={18} className="fill-current" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
                StoiMaster
              </span>
            </div>
            <button 
              onClick={onStart}
              className="bg-slate-900 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-primary-600 transition-colors shadow-lg shadow-slate-200"
            >
              Masuk Kelas
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-sm text-slate-600 mb-6">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                Sesuai Kurikulum Merdeka Kelas 10
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Taklukkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-science-purple">Stoikiometri</span> <br className="hidden md:block"/> Tanpa Menghafal Mati.
            </h1>
            
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
              Pahami konsep mol, penyetaraan reaksi, dan perhitungan kimia kompleks bersama 
              <span className="font-bold text-slate-700"> Profesor Stoi (AI)</span>. Belajar jadi interaktif dengan simulasi lab virtual dan kuis adaptif.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={onStart}
                className="group bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Mulai Belajar Gratis
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={onStart}
                className="bg-white text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all border border-slate-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <Play size={20} className="fill-slate-700" />
                Coba Simulasi
              </button>
            </div>
          </motion.div>

          {/* Floating Cards / Visuals */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
              <div className="aspect-[16/9] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative group cursor-default">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white"></div>
                  
                  {/* Mock UI Elements */}
                  <div className="absolute top-4 left-4 right-4 h-8 bg-slate-100 rounded-lg flex items-center px-3 gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 md:p-12 w-full h-full mt-8 md:mt-12 items-center">
                             
                             {/* Feature 1 */}
                             <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex flex-col items-center justify-center text-center group-hover:-translate-y-2 transition-transform duration-500 shadow-sm">
                                 <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                    <Atom size={28} />
                                 </div>
                                 <h3 className="font-bold text-blue-900 text-lg">Konsep Mol Visual</h3>
                                 <p className="text-sm text-blue-700 mt-2">Pahami hubungan partikel, massa, dan volume dengan mudah.</p>
                             </div>

                             {/* Feature 2 (Center Highlight) */}
                             <div className="bg-purple-50 rounded-2xl p-8 border border-purple-100 flex flex-col items-center justify-center text-center scale-105 md:scale-110 shadow-xl z-10 relative overflow-hidden">
                                 <div className="absolute top-0 right-0 p-2 opacity-10">
                                     <Sparkles size={100} />
                                 </div>
                                 <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                    <Bot size={40} />
                                 </div>
                                 <h3 className="font-bold text-purple-900 text-xl">Tanya Prof. Stoi</h3>
                                 <p className="text-sm text-purple-700 mt-2 font-medium">
                                     "Kenapa jawaban saya salah?" <br/>
                                     <span className="font-normal opacity-80">AI mendiagnosis letak kesalahanmu secara spesifik.</span>
                                 </p>
                             </div>

                             {/* Feature 3 */}
                             <div className="bg-green-50 rounded-2xl p-6 border border-green-100 flex flex-col items-center justify-center text-center group-hover:-translate-y-2 transition-transform duration-500 delay-75 shadow-sm">
                                 <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                     <FlaskConical size={28} />
                                 </div>
                                 <h3 className="font-bold text-green-900 text-lg">Lab Virtual Aman</h3>
                                 <p className="text-sm text-green-700 mt-2">Campurkan larutan dan amati endapan tanpa risiko bahan kimia.</p>
                             </div>
                        </div>
                  </div>
              </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900">Kenapa StoiMaster?</h2>
                <p className="text-slate-500 mt-2 max-w-2xl mx-auto">Kami mengombinasikan kurikulum terstruktur dengan teknologi AI untuk membuat kimia terasa masuk akal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<BrainCircuit className="text-white" />}
                    color="bg-indigo-500"
                    title="Alur Belajar Adaptif"
                    description="Materi disusun bertingkat. Mulai dari konsep dasar atom hingga perhitungan hasil reaksi yang kompleks."
                />
                <FeatureCard 
                    icon={<Sparkles className="text-white" />}
                    color="bg-purple-500"
                    title="Bantuan Kontekstual"
                    description="Bingung dengan satu paragraf materi? Blok teksnya dan minta AI menjelaskannya dengan analogi sederhana."
                />
                 <FeatureCard 
                    icon={<FlaskConical className="text-white" />}
                    color="bg-teal-500"
                    title="Penyetaraan Reaksi"
                    description="Visualisasikan atom di kiri dan kanan panah reaksi untuk memahami Hukum Kekekalan Massa secara intuitif."
                />
                 <FeatureCard 
                    icon={<GraduationCap className="text-white" />}
                    color="bg-pink-500"
                    title="Diagnostik Kesalahan"
                    description="Saat salah menjawab kuis, AI tidak hanya memberi kunci jawaban, tapi menjelaskan letak kekeliruan logikamu."
                />
                 <FeatureCard 
                    icon={<Calculator className="text-white" />}
                    color="bg-blue-500"
                    title="Kalkulator Kimia"
                    description="Alat bantu hitung Mr, konversi mol-gram-volume, dan partikel tanpa perlu menghafal rumus manual."
                />
                 <FeatureCard 
                    icon={<ScrollText className="text-white" />}
                    color="bg-slate-800"
                    title="Bank Soal Lengkap"
                    description="Ribuan variasi soal latihan, dari tipe hafalan, hitungan, hingga soal cerita (HOTS) yang menantang."
                />
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white">
                    <FlaskConical size={18} className="fill-current" />
                </div>
                <div>
                    <span className="text-xl font-bold text-white block leading-none">StoiMaster</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Chemistry Learning</span>
                </div>
            </div>
            <div className="text-sm text-center md:text-right">
                <p>© 2025 StoiMaster Learning Platform.</p>
                <p className="mt-1 text-slate-600">Dibuat dengan ❤️ untuk siswa Indonesia.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, color, title, description }: { icon: any, color: string, title: string, description: string }) => (
    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all group">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 leading-relaxed text-sm">
            {description}
        </p>
    </div>
);
