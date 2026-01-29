
import React, { useState } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AnalysisResultView from './components/AnalysisResult';
import { AppView, AnalysisResult, HistoryItem } from './types';
import { analyzeResume, helperFileToBase64 } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const saveToHistory = (result: AnalysisResult) => {
    try {
      const historyJson = localStorage.getItem('rescan_history');
      const history: HistoryItem[] = historyJson ? JSON.parse(historyJson) : [];
      
      const newItem: HistoryItem = {
        id: generateId(),
        fileName: result.fileName,
        date: new Date().toISOString(),
        atsScore: result.atsScore,
        fullResult: result
      };
      
      const updatedHistory = [newItem, ...history];
      localStorage.setItem('rescan_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save history", error);
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setCurrentView(AppView.ANALYZING);
    try {
      const base64 = await helperFileToBase64(file);
      const result = await analyzeResume(base64, file.type, file.name);
      setAnalysisResult(result);
      saveToHistory(result);
      setCurrentView(AppView.RESULT);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Failed to analyze resume. Please try again.");
      setCurrentView(AppView.LANDING);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewHistoryItem = (item: HistoryItem) => {
    setAnalysisResult(item.fullResult);
    setCurrentView(AppView.RESULT);
  };

  const handleReanalyze = () => {
    setAnalysisResult(null);
    setCurrentView(AppView.LANDING);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.LANDING:
        return <LandingPage onFileSelect={handleFileSelect} />;
      
      case AppView.ANALYZING:
        return (
          <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-slate-950">
            <div className="bg-slate-900 p-12 rounded-2xl shadow-xl text-center max-w-md w-full border border-slate-800">
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Analyzing Resume...</h2>
                <p className="text-slate-400">
                    Our AI is reviewing your experience, checking ATS compatibility, and finding improvements.
                </p>
                <div className="mt-6 flex flex-col gap-2">
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 animate-[progress_2s_ease-in-out_infinite] w-1/3"></div>
                    </div>
                    <p className="text-xs text-slate-500">This usually takes about 10-20 seconds.</p>
                </div>
            </div>
            <style>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
            `}</style>
          </div>
        );

      case AppView.RESULT:
        return analysisResult ? (
          <AnalysisResultView result={analysisResult} onReanalyze={handleReanalyze} />
        ) : (
          <div className="flex items-center justify-center h-screen text-slate-400">Error loading results</div>
        );

      case AppView.DASHBOARD:
        return <Dashboard onViewResult={handleViewHistoryItem} />;

      default:
        return <LandingPage onFileSelect={handleFileSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <Header currentView={currentView} setView={setCurrentView} />
      <main>
        {renderContent()}
      </main>
      
      {(currentView === AppView.LANDING || currentView === AppView.DASHBOARD) && (
        <footer className="bg-slate-950 border-t border-slate-900 py-12">
            <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
                <p>Tanmay Mishra</p>
                <div className="flex justify-center gap-6 mt-4">
                    <a href="mailto:tanmaycloud251@gmail.com" className="hover:text-white transition-colors">Mail</a>
                    <a href="https://github.com/TanmayCloud251" className="hover:text-white transition-colors">Github</a>
                    <a href="https://www.instagram.com/tanmaymishra251" className="hover:text-white transition-colors">Instagram</a>
                </div>
            </div>
        </footer>
      )}
    </div>
  );
};

export default App;
