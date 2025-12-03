import React from 'react';
import { ScanLine, LayoutDashboard } from 'lucide-react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => setView(AppView.LANDING)}
        >
          <div className="bg-transparent border border-blue-500 rounded-full p-1.5">
            <ScanLine className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Rescan</span>
        </div>

        <nav className="flex items-center gap-6">
            <button 
                onClick={() => setView(AppView.DASHBOARD)}
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${currentView === AppView.DASHBOARD ? 'text-blue-500' : 'text-slate-400'}`}
            >
                Dashboard
            </button>
            <button 
                onClick={() => setView(AppView.LANDING)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
            >
                Start Analysis
            </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;