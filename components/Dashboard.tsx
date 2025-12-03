import React from 'react';
import { HistoryItem } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, ChevronRight, TrendingUp } from 'lucide-react';

// Mock Data for the chart
const data = [
  { name: 'Jan', score: 65 },
  { name: 'Feb', score: 72 },
  { name: 'Mar', score: 68 },
  { name: 'Apr', score: 85 },
  { name: 'May', score: 82 },
  { name: 'Jun', score: 95 },
];

const historyData: HistoryItem[] = [
    { id: '1', fileName: 'Software_Engineer_Resume_v3.pdf', date: 'June 15, 2024', atsScore: 95 },
    { id: '2', fileName: 'Product_Manager_Final.docx', date: 'May 28, 2024', atsScore: 78 },
    { id: '3', fileName: 'Data_Analyst_Resume_Draft_1.pdf', date: 'April 12, 2024', atsScore: 62 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-8 text-slate-200">
      <div className="container mx-auto max-w-6xl space-y-8">
        
        {/* Header */}
        <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400">Track your resume analysis history and improvements.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800">
                <h3 className="text-sm font-medium text-slate-400">Average Score</h3>
                <div className="flex items-end gap-2 mt-2">
                    <span className="text-4xl font-bold text-white">82</span>
                    <span className="text-sm font-medium text-green-500 mb-1 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> +5%
                    </span>
                </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800">
                <h3 className="text-sm font-medium text-slate-400">Highest Score</h3>
                <div className="flex items-end gap-2 mt-2">
                    <span className="text-4xl font-bold text-white">95</span>
                    <span className="text-sm font-medium text-green-500 mb-1 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> +2%
                    </span>
                </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800">
                <h3 className="text-sm font-medium text-slate-400">Resumes Analyzed</h3>
                <div className="mt-2">
                    <span className="text-4xl font-bold text-white">14</span>
                </div>
            </div>
        </div>

        {/* Chart Section */}
        <div className="bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-800">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Score Improvement Over Time</h2>
                    <p className="text-sm text-slate-400">82 ATS Score <span className="text-green-500 ml-2 text-xs font-semibold">Last 6 Months ↑ +12%</span></p>
                </div>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }}
                            itemStyle={{ color: '#f8fafc' }}
                            cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#2563eb" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorScore)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* History List */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">My Resume History</h2>
                <div className="flex gap-2">
                   <select className="text-sm bg-slate-950 border-slate-700 rounded-lg text-slate-300 px-3 py-1.5 border focus:outline-none focus:ring-2 focus:ring-blue-500">
                       <option>Sort by Date</option>
                       <option>Sort by Score</option>
                   </select>
                </div>
            </div>
            <div>
                {historyData.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-6 hover:bg-slate-800/50 transition-colors border-b last:border-0 border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white text-sm">{item.fileName}</h4>
                                <p className="text-xs text-slate-500">{item.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <span className={`text-lg font-bold ${item.atsScore >= 80 ? 'text-green-500' : item.atsScore >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                                    {item.atsScore}
                                </span>
                                <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${item.atsScore >= 80 ? 'bg-green-500' : item.atsScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                        style={{ width: `${item.atsScore}%` }}
                                    ></div>
                                </div>
                            </div>
                            <button className="text-blue-500 text-sm font-medium hover:underline">View Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;