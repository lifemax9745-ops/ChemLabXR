import React, { createContext, useContext, useState } from 'react';
import { getGeminiExplanation } from '../services/geminiService';
import { X, MessageSquare, Loader2 } from 'lucide-react';

interface AIContextType {
  askAI: (topic: string, context: string) => void;
}

const AIContextData = createContext<AIContextType>({ askAI: () => {} });

export const useAI = () => useContext(AIContextData);

export const AIContext: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState("");

  const askAI = async (topic: string, context: string) => {
    setIsOpen(true);
    setLoading(true);
    setCurrentQuery(topic);
    const result = await getGeminiExplanation(topic, context);
    setResponse(result);
    setLoading(false);
  };

  return (
    <AIContextData.Provider value={{ askAI }}>
      {children}
      
      {/* AI Overlay Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 glass-panel rounded-xl shadow-2xl z-50 border border-neon-blue/30 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in">
          <div className="bg-neon-dark/90 p-3 flex justify-between items-center border-b border-gray-700">
            <div className="flex items-center gap-2">
               <MessageSquare className="w-4 h-4 text-neon-blue" />
               <span className="font-mono text-sm font-bold text-neon-blue">AI Tutor</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-red-400"><X size={16}/></button>
          </div>
          
          <div className="p-4 min-h-[150px] max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                <Loader2 className="animate-spin text-neon-purple" />
                <span className="text-xs">Analyzing chemical data...</span>
              </div>
            ) : (
              <div className="space-y-2">
                 <h4 className="text-sm font-bold text-white capitalize">{currentQuery}</h4>
                 <p className="text-sm text-gray-300 leading-relaxed">{response}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AIContextData.Provider>
  );
};
