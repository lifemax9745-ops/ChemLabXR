import React, { useState } from 'react';
import { generateQuizQuestion } from '../services/geminiService';
import { useUser } from '../components/UserContext';
import { Book, BrainCircuit, Check, X } from 'lucide-react';

const TOPICS = [
  "Atomic Structure", "Periodic Table", "Chemical Bonding", "Stoichiometry", "Acids & Bases"
];

interface QuizState {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  userAnswer: number | null;
}

export const TheoryCenter: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState(TOPICS[0]);
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [loading, setLoading] = useState(false);
  const { addXP } = useUser();

  const startQuiz = async () => {
    setLoading(true);
    setQuiz(null);
    const qData = await generateQuizQuestion(activeTopic);
    setQuiz({ ...qData, userAnswer: null });
    setLoading(false);
  };

  const handleAnswer = (idx: number) => {
    if (quiz?.userAnswer !== null) return;
    
    setQuiz(prev => prev ? { ...prev, userAnswer: idx } : null);
    
    if (idx === quiz?.correct) {
      addXP(25);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
          Theory & Practice
        </h1>
        <p className="text-gray-400">Master chemistry concepts with AI-generated challenges.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl md:col-span-1 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Book className="text-neon-purple" size={20} /> Modules
          </h3>
          <div className="space-y-1">
            {TOPICS.map(topic => (
              <button
                key={topic}
                onClick={() => setActiveTopic(topic)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                  activeTopic === topic 
                  ? 'bg-neon-blue text-black font-bold' 
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-xl md:col-span-2 min-h-[400px] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BrainCircuit size={150} />
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
            {activeTopic} Assessment
          </h2>

          {!quiz && !loading && (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
               <p className="text-gray-400 text-center max-w-md">
                 Ready to test your knowledge on {activeTopic}? 
                 Our AI will generate a unique question for you.
               </p>
               <button 
                 onClick={startQuiz}
                 className="px-8 py-3 bg-neon-purple hover:bg-neon-purple/80 text-white font-bold rounded-lg shadow-lg shadow-neon-purple/20 transition-all transform hover:scale-105"
               >
                 Generate Question
               </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-64 gap-4 animate-pulse">
               <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
               <p className="text-neon-blue font-mono text-sm">Synthesizing Challenge...</p>
            </div>
          )}

          {quiz && (
            <div className="space-y-6 animate-in slide-in-from-right-10">
              <div className="text-lg font-medium leading-relaxed">
                {quiz.question}
              </div>

              <div className="space-y-3">
                {quiz.options.map((option, idx) => {
                  let statusClass = "bg-white/5 border-transparent hover:bg-white/10";
                  if (quiz.userAnswer !== null) {
                    if (idx === quiz.correct) statusClass = "bg-green-500/20 border-green-500 text-green-200";
                    else if (idx === quiz.userAnswer) statusClass = "bg-red-500/20 border-red-500 text-red-200";
                    else statusClass = "opacity-50";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={quiz.userAnswer !== null}
                      className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between ${statusClass}`}
                    >
                      <span>{option}</span>
                      {quiz.userAnswer !== null && idx === quiz.correct && <Check size={20} className="text-green-500" />}
                      {quiz.userAnswer === idx && idx !== quiz.correct && <X size={20} className="text-red-500" />}
                    </button>
                  );
                })}
              </div>

              {quiz.userAnswer !== null && (
                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg animate-in fade-in">
                  <h4 className="font-bold text-neon-blue mb-1">Explanation</h4>
                  <p className="text-sm text-gray-300">{quiz.explanation}</p>
                  <button onClick={startQuiz} className="mt-4 text-sm underline hover:text-white">Next Question</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
