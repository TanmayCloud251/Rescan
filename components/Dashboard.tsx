import React, { useEffect, useState, useMemo } from 'react';
import { HistoryItem } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Inbox, 
  Trash2, 
  Eye, 
  BarChart3,
  Calendar,
  Zap,
  Activity
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
    <div className="min-h-screen bg-slate-950 p-4 md:p-12 text-slate-200 relative overflow-hidden">
      {/* Visual background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className={`container mx-auto max-w-7xl space-y-12 relative z-10 transition-opacity duration-300 ${isDeletingAll ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/10 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                  </div>
                  <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Analytics Hub</h1>
                </div>
                <p className="text-slate-500 font-medium">Monitoring your evolution through recruiter-grade metrics.</p>
            </div>
            <div className="flex items-center gap-4">
                {history.length > 0 && (
                  <button 
                    type="button"
                    onClick={handleClearAll}
                    className="group px-5 py-2.5 rounded-xl border border-red-900/30 bg-red-900/10 hover:bg-red-900/20 text-red-400 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    Reset History
                  </button>
                )}
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Activity className="w-3.5 h-3.5 text-blue-500" /> 
                    Live Updates
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group overflow-hidden bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap className="w-24 h-24 text-blue-500" />
                </div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Average Quality</h3>
                <div className="flex items-end gap-4">
                    <span className="text-6xl font-black text-white tracking-tighter leading-none">{stats.avgScore}</span>
                    {history.length > 1 && (
                        <div className={`mb-1 flex items-center text-xs font-black px-3 py-1.5 rounded-lg ${stats.trend >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {stats.trend >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                            {stats.trend > 0 ? `+${stats.trend}` : stats.trend}%
                        </div>
                    )}
                </div>
                <div className="mt-4 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${stats.avgScore}%` }}></div>
                </div>
            </div>

            <div className="relative group overflow-hidden bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Award className="w-24 h-24 text-indigo-500" />
                </div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Personal Peak</h3>
                <div className="flex items-end gap-3">
                    <span className="text-6xl font-black text-white tracking-tighter leading-none">{stats.highestScore}</span>
                    <span className="text-xs font-black text-slate-600 uppercase mb-1">Max Score</span>
                </div>
                <div className="mt-4 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${stats.highestScore}%` }}></div>
                </div>
            </div>

            <div className="relative group overflow-hidden bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <FileText className="w-24 h-24 text-amber-500" />
                </div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Total Audits</h3>
                <div className="flex items-end gap-3">
                    <span className="text-6xl font-black text-white tracking-tighter leading-none">{stats.total}</span>
                    <span className="text-xs font-black text-slate-600 uppercase mb-1">Analyzed</span>
                </div>
                <div className="mt-4 flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= stats.total ? 'bg-amber-500' : 'bg-slate-800'}`}></div>
                    ))}
                </div>
            </div>
        </div>

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Chart Column */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800 backdrop-blur-md shadow-2xl">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Performance Curve</h2>
                            <p className="text-sm text-slate-500 font-medium">Tracking score velocity over time</p>
                        </div>
                    </div>
                    
                    <div className="h-[350px] w-full">
                        {history.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%" key={history.length}>
                                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#1e293b" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} dy={15} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} domain={[0, 100]} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px', color: '#f8fafc', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#3b82f6' }}
                                        cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '4 4' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="score" 
                                        stroke="#3b82f6" 
                                        strokeWidth={4} 
                                        fillOpacity={1} 
                                        fill="url(#colorScore)" 
                                        animationDuration={1200}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-700 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-950/50">
                                <Inbox className="w-16 h-16 mb-4 opacity-20" />
                                <p className="text-sm font-bold uppercase tracking-widest">No metrics detected.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* List Column */}
            <div className="lg:col-span-1">
                <div className="bg-slate-900/40 rounded-[2rem] border border-slate-800 backdrop-blur-md shadow-2xl h-full flex flex-col">
                    <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Recent Scans</h2>
                        <select 
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="bg-slate-950 border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                            <option value="date">Date</option>
                            <option value="score">Score</option>
                        </select>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
                        {sortedHistory.length > 0 ? (
                            sortedHistory.map((item) => (
                                <div 
                                    key={item.id} 
                                    onClick={() => onViewResult(item)}
                                    className="p-6 border-b border-slate-800 hover:bg-slate-800/30 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-all">
                                                <FileText className="w-5 h-5 text-slate-500 group-hover:text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-white text-sm truncate group-hover:text-blue-500 transition-colors">
                                                    {item.fileName}
                                                </h4>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className={`text-2xl font-black leading-none ${
                                                item.atsScore >= 80 ? 'text-green-500' : 
                                                item.atsScore >= 60 ? 'text-amber-500' : 'text-red-500'
                                            }`}>
                                                {item.atsScore}
                                            </div>
                                            <div className="text-[8px] font-black text-slate-600 uppercase mt-1 tracking-widest">ATS Score</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <button className="flex-1 h-10 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                            Open Report
                                        </button>
                                        <button 
                                          onClick={(e) => handleDelete(item.id, e)}
                                          className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-red-500/20 text-slate-600 hover:text-red-500 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-xs font-black text-slate-600 uppercase tracking-[0.2em]">Queue is empty</p>
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
