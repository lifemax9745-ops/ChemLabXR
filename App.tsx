import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { MoleculeExplorer } from './views/MoleculeExplorer';
import { VirtualLab } from './views/VirtualLab';
import { TheoryCenter } from './views/TheoryCenter';
import { AIContext } from './components/AIContext';
import { UserContext } from './components/UserContext';
import { View } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [userXP, setUserXP] = useState(120);
  const [userLevel, setUserLevel] = useState(2);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock initial load
  useEffect(() => {
    console.log("ChemLabXR Initialized v1.0");
  }, []);

  const addXP = (amount: number) => {
    const newXP = userXP + amount;
    setUserXP(newXP);
    if (newXP > userLevel * 100) {
      setUserLevel(l => l + 1);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case View.MOLECULES: return <MoleculeExplorer />;
      case View.LAB: return <VirtualLab />;
      case View.THEORY: return <TheoryCenter />;
      case View.DASHBOARD:
      default: return <Dashboard changeView={setCurrentView} />;
    }
  };

  return (
    <UserContext.Provider value={{ xp: userXP, level: userLevel, addXP }}>
      <AIContext>
        <div className="flex h-screen w-full bg-[#050508] text-white overflow-hidden relative">
          {/* Background Ambient Glow */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon-purple opacity-20 blur-[150px] pointer-events-none rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neon-blue opacity-10 blur-[150px] pointer-events-none rounded-full" />

          <Sidebar 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen} 
            currentView={currentView} 
            onChangeView={setCurrentView} 
          />
          
          <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} h-full`}>
            <Navbar currentView={currentView} />
            <main className="flex-1 overflow-y-auto p-6 relative z-10">
              {renderView()}
            </main>
          </div>
        </div>
      </AIContext>
    </UserContext.Provider>
  );
}