
import React, { useEffect, useState, useMemo } from 'react';
import { HistoryItem } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, ChevronRight, TrendingUp, TrendingDown, Inbox, Trash2, Eye, AlertTriangle } from 'lucide-react';

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
    // Crucial: Stop the event from reaching the row's onClick (onViewResult)
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

  // Derived Statistics - These update automatically whenever 'history' state changes
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

  // Chart Data - Re-calculates on every history change
  const chartData = useMemo(() => {
    return [...history]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10) // Only show the last 10 entries for clarity
      .map(item => ({
        name: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: item.atsScore
      }));
  }, [history]);

  // Sorted History List for the Table
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
    <div className="min-h-screen bg-slate-950 p-6 md:p-8 text-slate-200">
      <div className={`container mx-auto max-w-6xl space-y-8 transition-opacity duration-300 ${isDeletingAll ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Analytics Dashboard</h1>
                <p className="text-slate-400 mt-1">Review and manage your resume scan history.</p>
            </div>
            <div className="flex items-center gap-3">
                {history.length > 0 && (
                  <button 
                    type="button"
                    onClick={handleClearAll}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-2 rounded-lg border border-red-900/30 hover:bg-red-900/20 transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear All
                  </button>
                )}
                <div className="text-sm font-medium text-slate-500 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
                    Local History
                </div>
            </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 hover:border-blue-900/50 transition-colors">
                <h3 className="text-sm font-medium text-slate-400">Average Score</h3>
                <div className="flex items-end gap-3 mt-2">
                    <span className="text-4xl font-bold text-white">{stats.avgScore}</span>
                    {history.length > 1 && (
                        <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stats.trend >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {stats.trend >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {stats.trend > 0 ? `+${stats.trend}` : stats.trend}%
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 hover:border-blue-900/50 transition-colors">
                <h3 className="text-sm font-medium text-slate-400">Personal Best</h3>
                <div className="flex items-end gap-2 mt-2">
                    <span className="text-4xl font-bold text-white">{stats.highestScore}</span>
                    <span className="text-xs text-slate-500 mb-1.5 font-semibold uppercase tracking-tighter">Peak</span>
                </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 hover:border-blue-900/50 transition-colors">
                <h3 className="text-sm font-medium text-slate-400">Files Analyzed</h3>
                <div className="mt-2">
                    <span className="text-4xl font-bold text-white">{stats.total}</span>
                    <span className="text-xs text-slate-500 ml-2">Total</span>
                </div>
            </div>
        </div>

        {/* Chart Card */}
        <div className="bg-slate-900 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-800">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-xl font-bold text-white">Score Progress</h2>
                    <p className="text-sm text-slate-400 mt-1">Timeline of your recent ATS scores</p>
                </div>
            </div>
            <div className="h-[300px] w-full">
                {history.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" key={history.length}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} domain={[0, 100]} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc' }}
                                itemStyle={{ color: '#60a5fa' }}
                                cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="score" 
                                stroke="#2563eb" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorScore)" 
                                animationDuration={800}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
                        <Inbox className="w-12 h-12 mb-4 opacity-10" />
                        <p className="text-sm font-medium">No performance data to display.</p>
                    </div>
                )}
            </div>
        </div>

        {/* History Table */}
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-bold text-white">Scan History</h2>
                <div className="flex gap-3 w-full sm:w-auto">
                   <select 
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value as any)}
                     className="w-full sm:w-auto text-sm bg-slate-950 border-slate-700 rounded-lg text-slate-300 px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                   >
                       <option value="date">Sort by Date</option>
                       <option value="score">Sort by Score</option>
                   </select>
                </div>
            </div>
            
            <div className="divide-y divide-slate-800">
                {sortedHistory.length > 0 ? (
                    sortedHistory.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => onViewResult(item)}
                            className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-slate-800/40 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600/10 transition-all">
                                    <FileText className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-white text-sm md:text-base truncate group-hover:text-blue-400 transition-colors">
                                        {item.fileName}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {new Date(item.date).toLocaleDateString(undefined, { 
                                            month: 'short', day: 'numeric', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8">
                                <div className="flex flex-col items-end">
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-xl font-black ${
                                            item.atsScore >= 80 ? 'text-green-500' : 
                                            item.atsScore >= 60 ? 'text-amber-500' : 'text-red-500'
                                        }`}>
                                            {item.atsScore}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase">ATS</span>
                                    </div>
                                    <div className="w-24 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ease-out ${
                                                item.atsScore >= 80 ? 'bg-green-500' : 
                                                item.atsScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                            }`} 
                                            style={{ width: `${item.atsScore}%` }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); onViewResult(item); }}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all border border-slate-700 hover:border-transparent"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Details</span>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={(e) => handleDelete(item.id, e)}
                                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        title="Delete Permanently"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-20 text-center bg-slate-900/30">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                            <Inbox className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-white font-bold text-lg">History Empty</h3>
                        <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                            Start analyzing resumes to track your improvement over time.
                        </p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
