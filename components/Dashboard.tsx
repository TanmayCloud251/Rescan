import React, { useEffect, useState, useMemo } from 'react';
import { HistoryItem } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Inbox, 
  Trash2, 
  BarChart3,
  Calendar,
  Zap,
  Activity,
  Award,
  Briefcase,
  User
} from 'lucide-react';

interface DashboardProps {
  onViewResult: (item: HistoryItem) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewResult }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  useEffect(() => {
    const loadHistory = () => {
      const historyJson = localStorage.getItem('rescan_history');
      if (historyJson) {
        try {
          const parsed: HistoryItem[] = JSON.parse(historyJson);
          setHistory(parsed);
        } catch (e) {
          console.error("Failed to parse history", e);
        }
      }
    };
    loadHistory();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm("Delete this resume record? This action cannot be undone.")) {
      const updatedHistory = history.filter(item => item.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem('rescan_history', JSON.stringify(updatedHistory));
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to clear your entire history?")) {
      setIsDeletingAll(true);
      setTimeout(() => {
        localStorage.removeItem('rescan_history');
        setHistory([]);
        setIsDeletingAll(false);
      }, 400);
    }
  };

  const stats = useMemo(() => {
    if (history.length === 0) {
      return { avgScore: 0, highestScore: 0, total: 0, trend: 0 };
    }

    const total = history.length;
    const sortedByDateDesc = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const sum = history.reduce((acc, curr) => acc + curr.atsScore, 0);
    const avgScore = Math.round(sum / total);
    const highestScore = Math.max(...history.map(h => h.atsScore));

    let trend = 0;
    if (total > 1) {
      const lastScore = sortedByDateDesc[0].atsScore;
      const prevSum = sortedByDateDesc.slice(1).reduce((acc, curr) => acc + curr.atsScore, 0);
      const prevAvg = prevSum / (total - 1);
      trend = Math.round(((lastScore - prevAvg) / (prevAvg || 1)) * 100);
    }

    return { avgScore, highestScore, total, trend };
  }, [history]);

  const chartData = useMemo(() => {
    return [...history]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10)
      .map(item => ({
        name: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: item.atsScore
      }));
  }, [history]);

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.atsScore - a.atsScore;
      }
    });
  }, [history, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 text-slate-200 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className={`container mx-auto max-w-7xl space-y-10 relative z-10 transition-opacity duration-500 ${isDeletingAll ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/50 pb-10">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                  <Activity className="w-3 h-3" /> System Operational
                </div>
                <h1 className="text-5xl font-black text-white tracking-tight">
                  Recruitment <span className="text-slate-500">Dashboard</span>
                </h1>
                <p className="text-slate-400 max-w-md">
                  Professional-grade analysis of your professional trajectory. Review, optimize, and excel.
                </p>
            </div>
            <div className="flex items-center gap-3">
                {history.length > 0 && (
                  <button 
                    onClick={handleClearAll}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all text-sm font-bold text-slate-400"
                  >
                    <Trash2 className="w-4 h-4" />
                    Purge History
                  </button>
                )}
                <div className="h-10 w-10 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center text-blue-500">
                    <User className="w-5 h-5" />
                </div>
            </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Avg Score */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                        <Zap className="w-5 h-5" />
                    </div>
                    {history.length > 1 && (
                        <div className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-md ${stats.trend >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {stats.trend >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {Math.abs(stats.trend)}%
                        </div>
                    )}
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Average Score</p>
                <h3 className="text-3xl font-black text-white">{stats.avgScore}<span className="text-sm text-slate-600 ml-1 font-bold">/100</span></h3>
                <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 group-hover:bg-blue-400 transition-colors" style={{ width: `${stats.avgScore}%` }}></div>
                </div>
            </div>

            {/* Peak Performance */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-500">
                        <Award className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Peak Score</p>
                <h3 className="text-3xl font-black text-white">{stats.highestScore}<span className="text-sm text-slate-600 ml-1 font-bold">MAX</span></h3>
                <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 group-hover:bg-indigo-400 transition-colors" style={{ width: `${stats.highestScore}%` }}></div>
                </div>
            </div>

            {/* Total Analyzed */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
                        <FileText className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Audits</p>
                <h3 className="text-3xl font-black text-white">{stats.total}<span className="text-sm text-slate-600 ml-1 font-bold">SCANS</span></h3>
                <p className="mt-2 text-[10px] text-slate-500 font-medium">History depth: {history.length} items</p>
            </div>

            {/* Efficiency */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                        <Briefcase className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Market Readiness</p>
                <h3 className="text-3xl font-black text-white">{stats.avgScore > 75 ? 'HIGH' : stats.avgScore > 50 ? 'MID' : 'LOW'}</h3>
                <div className="mt-4 flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i <= (stats.avgScore / 20) ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
                    ))}
                </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Analytics Visualizer */}
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-500" />
                                Growth Trajectory
                            </h2>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Last 10 Performance Metrics</p>
                        </div>
                    </div>
                    
                    <div className="h-[300px] w-full">
                        {history.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} 
                                        dy={10} 
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} 
                                        domain={[0, 100]} 
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc' }}
                                        cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="score" 
                                        stroke="#3b82f6" 
                                        strokeWidth={3} 
                                        fillOpacity={1} 
                                        fill="url(#colorScore)" 
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/50">
                                <Inbox className="w-12 h-12 text-slate-700 mb-3" />
                                <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Awaiting Analysis Data</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-500" />
                            AI Insight
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            {history.length > 0 
                                ? `Your latest score of ${history[0].atsScore} shows ${history[0].atsScore > 80 ? 'excellent' : 'strong'} alignment with ATS standards. Focusing on quantifiable impact could push you even higher.`
                                : "Start your first analysis to receive personalized AI-driven career insights and improvement strategies."}
                        </p>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <h5 className="font-bold text-white">Career Acceleration</h5>
                                <p className="text-xs text-slate-500">Optimized resumes are 3x more likely to land interviews.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Ledger */}
            <div className="lg:col-span-4">
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl backdrop-blur-sm h-full flex flex-col">
                    <div className="p-6 border-b border-slate-800/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-white">Recent Scans</h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Document History</p>
                        </div>
                        <select 
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                        >
                            <option value="date">Date</option>
                            <option value="score">Score</option>
                        </select>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
                        {sortedHistory.length > 0 ? (
                            sortedHistory.map((item) => (
                                <div 
                                    key={item.id} 
                                    onClick={() => onViewResult(item)}
                                    className="p-5 border-b border-slate-800/30 hover:bg-slate-800/20 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all shrink-0">
                                                <FileText className="w-5 h-5 text-slate-400 group-hover:text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-white text-sm truncate group-hover:text-blue-500 transition-colors">
                                                    {item.fileName}
                                                </h4>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase mt-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xl font-black ${
                                                item.atsScore >= 80 ? 'text-green-500' : 
                                                item.atsScore >= 60 ? 'text-amber-500' : 'text-red-500'
                                            }`}>
                                                {item.atsScore}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all">
                                            View Report
                                        </button>
                                        <button 
                                          onClick={(e) => handleDelete(item.id, e)}
                                          className="p-2 bg-slate-800 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">No documents found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
