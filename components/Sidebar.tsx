import React from 'react';
import { View } from '../types';
import { LayoutDashboard, Atom, FlaskConical, BookOpen, Menu, Settings, LogOut } from 'lucide-react';
import { useUser } from './UserContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  currentView: View;
  onChangeView: (v: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, currentView, onChangeView }) => {
  const { xp, level } = useUser();

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => onChangeView(view)}
      className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
        currentView === view 
        ? 'bg-neon-blue/10 text-neon-blue border-r-2 border-neon-blue' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={20} className={currentView === view ? "animate-pulse" : ""} />
      {isOpen && <span className="font-medium tracking-wide text-sm">{label}</span>}
      {currentView === view && (
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-transparent opacity-50" />
      )}
    </button>
  );

  return (
    <aside 
      className={`fixed left-0 top-0 h-full glass-panel z-50 transition-all duration-300 border-r border-white/10 flex flex-col ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="p-5 flex items-center justify-between border-b border-white/5">
        <div className={`flex items-center gap-2 ${!isOpen && 'justify-center w-full'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-[0_0_15px_rgba(188,19,254,0.5)]">
             <Atom className="text-white w-5 h-5" />
          </div>
          {isOpen && <h1 className="font-bold text-lg tracking-wider">Chem<span className="text-neon-blue">Lab</span>XR</h1>}
        </div>
        {isOpen && (
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
            <Menu size={18} />
          </button>
        )}
      </div>

      {!isOpen && (
         <button onClick={() => setIsOpen(true)} className="p-4 mx-auto text-gray-500 hover:text-white">
            <Menu size={24} />
         </button>
      )}

      {/* User Stats Mini */}
      {isOpen && (
        <div className="mx-4 mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
           <div className="flex justify-between items-end mb-2">
             <span className="text-xs text-gray-400 font-mono">Lvl {level} Scholar</span>
             <span className="text-xs text-neon-purple font-bold">{xp} XP</span>
           </div>
           <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
             <div 
                className="h-full bg-gradient-to-r from-neon-blue to-neon-purple" 
                style={{ width: `${Math.min((xp % 100), 100)}%` }}
             />
           </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-6 space-y-2">
        <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
        <NavItem view={View.MOLECULES} icon={Atom} label="Molecule Explorer" />
        <NavItem view={View.LAB} icon={FlaskConical} label="Virtual Lab" />
        <NavItem view={View.THEORY} icon={BookOpen} label="Theory Center" />
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <button className="w-full flex items-center gap-4 p-2 text-gray-500 hover:text-white transition-colors">
          <Settings size={20} />
          {isOpen && <span className="text-sm">Settings</span>}
        </button>
         <button className="w-full flex items-center gap-4 p-2 text-gray-500 hover:text-red-400 transition-colors">
          <LogOut size={20} />
          {isOpen && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
