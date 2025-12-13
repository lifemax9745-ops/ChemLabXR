import React, { useState } from 'react';
import { CHEMICALS, LAB_TOOLS } from '../constants';
import { Beaker, Flame, Pipette, Plus, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAI } from '../components/AIContext';
import { useUser } from '../components/UserContext';
import { analyzeReaction } from '../services/geminiService';

export const VirtualLab: React.FC = () => {
  const [bench, setBench] = useState<any[]>([]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [reactionResult, setReactionResult] = useState<string | null>(null);
  const [isReacting, setIsReacting] = useState(false);
  const { askAI } = useAI();
  const { addXP } = useUser();

  const addToBench = (item: any) => {
    setBench([...bench, { ...item, instanceId: Math.random().toString() }]);
  };

  const clearBench = () => {
    setBench([]);
    setReactionResult(null);
  };

  const simulateReaction = async () => {
    if (bench.length < 2) return;
    setIsReacting(true);
    
    // Simulate API delay
    setTimeout(async () => {
      const chemicalNames = bench.map(b => b.name);
      const result = await analyzeReaction(chemicalNames);
      setReactionResult(result);
      setIsReacting(false);
      
      if (!result.includes("no reaction")) {
        addXP(50);
      }
    }, 2000);
  };

  return (
    <div className="h-full flex gap-6">
      {/* Tools Panel */}
      <div className="w-64 glass-panel rounded-xl p-4 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h4 className="text-neon-blue font-bold mb-3 text-sm uppercase tracking-wider">Equipment</h4>
          <div className="grid grid-cols-2 gap-2">
            {LAB_TOOLS.map(tool => (
              <button 
                key={tool.id}
                onClick={() => addToBench(tool)}
                className="p-3 bg-white/5 rounded-lg hover:bg-neon-blue/20 transition-colors flex flex-col items-center gap-2 text-center"
              >
                {tool.id === 'beaker' && <Beaker size={20} />}
                {tool.id === 'burner' && <Flame size={20} />}
                {tool.id === 'pipette' && <Pipette size={20} />}
                {tool.id === 'flask' && <Beaker size={20} className="scale-y-125" />}
                <span className="text-xs text-gray-300">{tool.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-neon-purple font-bold mb-3 text-sm uppercase tracking-wider">Chemicals</h4>
          <div className="space-y-2">
            {CHEMICALS.map(chem => (
              <button 
                key={chem.id}
                onClick={() => addToBench(chem)}
                className="w-full p-2 bg-white/5 rounded flex items-center justify-between hover:bg-white/10 group"
              >
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chem.color }}></div>
                   <span className="text-sm">{chem.name}</span>
                </div>
                <span className="text-xs font-mono text-gray-500 group-hover:text-white">{chem.formula}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Bench */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 glass-panel rounded-xl relative overflow-hidden bg-gradient-to-b from-gray-900 to-black border-2 border-white/5 p-8 flex items-center justify-center">
          
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

          {bench.length === 0 && (
            <div className="text-center text-gray-500">
              <Plus size={48} className="mx-auto mb-2 opacity-20" />
              <p>Drag equipment or chemicals here to start experimenting</p>
            </div>
          )}

          <div className="flex gap-8 items-end z-10 flex-wrap justify-center">
            {bench.map((item, idx) => (
              <div key={idx} className="relative group animate-in zoom-in duration-300">
                 <div className="w-32 h-40 border-2 border-white/20 rounded-lg bg-white/5 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
                    {/* Liquid Simulation */}
                    {item.color && (
                       <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-60 transition-all duration-1000" style={{ backgroundColor: item.color }} />
                    )}
                    {/* Icon */}
                    <div className="z-10 text-white opacity-80">
                      {item.formula ? <span className="text-2xl font-bold font-mono">{item.formula}</span> : <Beaker size={40} />}
                    </div>
                 </div>
                 <div className="text-center mt-2 text-xs font-bold">{item.name}</div>
                 <button 
                   onClick={() => setBench(b => b.filter((_, i) => i !== idx))}
                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <Plus size={12} className="rotate-45" />
                 </button>
              </div>
            ))}
          </div>

          {/* Reaction Overlay */}
          {reactionResult && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 bg-black/80 backdrop-blur-xl border border-neon-blue rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-neon-blue shrink-0" size={32} />
                <div>
                   <h3 className="text-xl font-bold text-white mb-2">Reaction Analysis</h3>
                   <p className="text-gray-300 text-sm leading-relaxed mb-4">{reactionResult}</p>
                   <div className="flex gap-3">
                     <button onClick={() => askAI("This reaction", reactionResult)} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20">Ask AI Why</button>
                     <button onClick={() => setReactionResult(null)} className="text-xs bg-neon-blue text-black font-bold px-3 py-1 rounded hover:opacity-80">Continue</button>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="h-16 glass-panel rounded-xl flex items-center px-6 justify-between">
          <div className="text-sm text-gray-400">
            Current Workbench Items: <span className="text-white font-bold">{bench.length}</span>
          </div>
          <div className="flex gap-3">
            <button 
               onClick={clearBench}
               className="px-4 py-2 rounded border border-white/10 hover:bg-white/5 text-gray-300 flex items-center gap-2 text-sm"
            >
              <RefreshCw size={14} /> Clear Bench
            </button>
            <button 
              onClick={simulateReaction}
              disabled={bench.length < 2 || isReacting}
              className={`px-6 py-2 rounded font-bold text-sm flex items-center gap-2 transition-all ${
                bench.length < 2 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-[0_0_20px_rgba(188,19,254,0.3)] hover:shadow-[0_0_30px_rgba(188,19,254,0.5)]'
              }`}
            >
              {isReacting ? 'Analyzing...' : 'Simulate Reaction'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};