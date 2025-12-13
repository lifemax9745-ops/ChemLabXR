import React from 'react';
import { View } from '../types';
import { Bell, Search, User } from 'lucide-react';
import { useUser } from './UserContext';

export const Navbar: React.FC<{ currentView: View }> = ({ currentView }) => {
  const { level } = useUser();

  return (
    <header className="h-20 px-8 flex items-center justify-between z-40 bg-transparent">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white capitalize">
          {currentView.toLowerCase().replace('_', ' ')}
        </h2>
        <p className="text-sm text-gray-400">Welcome back, Student.</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search compounds..." 
            className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-neon-blue/50 focus:bg-white/10 w-64 transition-all"
          />
        </div>

        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-neon-purple rounded-full animate-pulse"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-white">Alex Doe</div>
            <div className="text-xs text-neon-blue">Level {level}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-700 border border-white/20 flex items-center justify-center overflow-hidden">
             <User className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};
