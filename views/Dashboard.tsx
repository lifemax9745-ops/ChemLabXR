import React from 'react';
import { View } from '../types';
import { ArrowRight, Trophy, Target, Sparkles, Microscope } from 'lucide-react';
import { useUser } from '../components/UserContext';

export const Dashboard: React.FC<{ changeView: (v: View) => void }> = ({ changeView }) => {
  const { xp, level } = useUser();

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      {/* Hero Section */}
      <div className="relative rounded-2xl p-10 overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 blur-xl"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Explore the Universe at an <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Atomic Level</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Welcome to ChemLabXR. Your portable, safe, and limitless augmented reality laboratory.
            Start an experiment or visualize complex molecules today.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => changeView(View.LAB)}
              className="px-8 py-3 bg-neon-blue text-black font-bold rounded-full hover:bg-cyan-400 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.4)]"
            >
              Enter Lab <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => changeView(View.MOLECULES)}
              className="px-8 py-3 bg-white/10 backdrop-blur border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-colors"
            >
              Browse Molecules
            </button>
          </div>
        </div>
        
        {/* Decorative Element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-black to-transparent z-0"></div>
        <Microscope className="absolute -right-10 -bottom-10 w-96 h-96 text-white/5 -rotate-12 pointer-events-none" />
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl border border-yellow-500/20 relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 bg-yellow-500/10 w-24 h-24 rounded-full blur-xl group-hover:bg-yellow-500/20 transition-all"></div>
           <Trophy className="text-yellow-500 mb-4" size={32} />
           <h3 className="text-xl font-bold">Level {level}</h3>
           <p className="text-sm text-gray-400">Master Chemist</p>
           <div className="mt-4 w-full bg-gray-800 h-2 rounded-full overflow-hidden">
             <div className="bg-yellow-500 h-full" style={{ width: `${xp % 100}%` }}></div>
           </div>
           <p className="text-xs text-right mt-1 text-gray-500">{100 - (xp % 100)} XP to next level</p>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-neon-blue/20 relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 bg-neon-blue/10 w-24 h-24 rounded-full blur-xl group-hover:bg-neon-blue/20 transition-all"></div>
           <Target className="text-neon-blue mb-4" size={32} />
           <h3 className="text-xl font-bold">Daily Goals</h3>
           <p className="text-sm text-gray-400">2/3 Tasks Completed</p>
           <ul className="mt-4 space-y-2 text-sm text-gray-300">
             <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon-blue"></div> Synthesize Water</li>
             <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon-blue"></div> Complete Acid Quiz</li>
             <li className="flex items-center gap-2 opacity-50"><div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div> Explore Methane Structure</li>
           </ul>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-neon-purple/20 relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 bg-neon-purple/10 w-24 h-24 rounded-full blur-xl group-hover:bg-neon-purple/20 transition-all"></div>
           <Sparkles className="text-neon-purple mb-4" size={32} />
           <h3 className="text-xl font-bold">Recent Badges</h3>
           <div className="flex gap-2 mt-4">
             {['First Reaction', 'Quiz Master', 'Lab Safety'].map(badge => (
               <span key={badge} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs hover:bg-neon-purple/20 cursor-default transition-colors">
                 {badge}
               </span>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};
