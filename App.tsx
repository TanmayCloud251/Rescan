
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AnalysisResultView from './components/AnalysisResult';
import { AppView, AnalysisResult, HistoryItem } from './types';
import { analyzeResume } from './services/groqService';
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
      const result = await analyzeResume(file);
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

  const handleStartAnalysis = () => {
    setCurrentView(AppView.LANDING);
    setTimeout(() => {
      const element = document.getElementById('upload-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
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

  const getSeoMetadata = () => {
    switch (currentView) {
      case AppView.LANDING:
        return {
          title: "Rescan - AI Resume Analyzer & ATS Checker",
          description: "Free AI resume analyzer & ATS scanner. Audit your CV for keyword gaps, formatting, and grammar errors using advanced AI. Optimize your resume & get hired!",
          canonical: "https://rescan-ai.vercel.app/"
        };
      case AppView.DASHBOARD:
        return {
          title: "Dashboard | Rescan Resume Scanner",
          description: "Access your Rescan dashboard to manage past resume audits, monitor ATS compatibility progress, and continue optimizing your CV for search and recruiter match.",
          canonical: "https://rescan-ai.vercel.app/dashboard"
        };
      case AppView.ANALYZING:
        return {
          title: "Analyzing Resume... | Rescan",
          description: "Analyzing your resume for ATS optimization... Our AI-powered scanner is auditing your CV against industry standards, parsing keywords, and formatting.",
          canonical: "https://rescan-ai.vercel.app/analyzing"
        };
      case AppView.RESULT:
        return {
          title: analysisResult 
            ? `ATS Score: ${analysisResult.atsScore}/100 - ${analysisResult.fileName} | Rescan`
            : "Analysis Results | Rescan",
          description: analysisResult
            ? `Detailed ATS resume scan results for ${analysisResult.fileName}. Your score is ${analysisResult.atsScore}/100. Check keywords breakdown, grammar, and formatting fixes.`
            : "Review your detailed ATS score, keywords analysis, structure checks, and resume improvement recommendations.",
          canonical: "https://rescan-ai.vercel.app/results"
        };
      default:
        return {
          title: "Rescan - AI Resume Analyzer & ATS Checker",
          description: "Free AI resume analyzer & ATS checker. Audit your CV for keyword gaps, formatting, and grammar errors. Optimize your resume to pass recruitment filters.",
          canonical: "https://rescan-ai.vercel.app/"
        };
    }
  };

  const seo = getSeoMetadata();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={seo.canonical} />
        <meta property="twitter:title" content={seo.title} />
        <meta property="twitter:description" content={seo.description} />
      </Helmet>
      <Header 
        currentView={currentView} 
        setView={setCurrentView} 
        onStartAnalysis={handleStartAnalysis} 
      />
      <main>
        {renderContent()}
      </main>
      
      {(currentView === AppView.LANDING || currentView === AppView.DASHBOARD) && (
        <Footer />
      )}
    </div>
  );
};

export default App;
