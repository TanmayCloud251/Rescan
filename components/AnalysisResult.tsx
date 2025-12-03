import React, { useState } from 'react';
import { AnalysisResult, IssueSeverity } from '../types';
import { Download, RefreshCw, ChevronDown, ChevronUp, CheckCircle2, Share2, AlertTriangle, FileText, Tag, BarChart3, PieChart as PieChartIcon, AlertCircle } from 'lucide-react';
import { 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip
} from 'recharts';

interface AnalysisResultProps {
  result: AnalysisResult;
  onReanalyze: () => void;
}

const AnalysisResultView: React.FC<AnalysisResultProps> = ({ result, onReanalyze }) => {
    const [openIssueIndex, setOpenIssueIndex] = useState<number | null>(0);
    const [activeTab, setActiveTab] = useState<'detailed' | 'summary' | 'keywords'>('detailed');

    const getSeverityStyles = (severity: IssueSeverity) => {
        switch (severity) {
            case IssueSeverity.CRITICAL: 
                return { 
                    bg: 'bg-red-950/30', 
                    text: 'text-red-400', 
                    border: 'border-red-900/50',
                    badge: 'bg-red-900/50 text-red-400'
                };
            case IssueSeverity.MODERATE: 
                return { 
                    bg: 'bg-amber-950/30', 
                    text: 'text-amber-400', 
                    border: 'border-amber-900/50',
                    badge: 'bg-amber-900/50 text-amber-400'
                };
            case IssueSeverity.SUGGESTION: 
                return { 
                    bg: 'bg-blue-950/30', 
                    text: 'text-blue-400', 
                    border: 'border-blue-900/50',
                    badge: 'bg-blue-900/50 text-blue-400'
                };
        }
    };

    // --- Chart Data ---
    const gaugeData = [
        { name: 'Score', value: result.atsScore },
        { name: 'Remaining', value: 100 - result.atsScore },
    ];
    const scoreColor = result.atsScore >= 80 ? '#10b981' : result.atsScore >= 60 ? '#f59e0b' : '#ef4444';

    const breakdownData = [
        { name: 'Keywords', score: Math.round(result.atsScore * 1.15) > 100 ? 95 : Math.round(result.atsScore * 1.15) }, 
        { name: 'Formatting', score: result.formattingScore },
        { name: 'Clarity', score: result.grammarScore },
        { name: 'Impact', score: Math.round(result.atsScore * 0.85) }, 
    ];

    const criticalIssuesCount = result.issues.filter(i => i.severity === IssueSeverity.CRITICAL).length;

    return (
        <div className="min-h-screen bg-slate-950 py-8 px-4 font-sans text-slate-200">
            <div className="container mx-auto max-w-6xl">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">Analysis for {result.fileName}</h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm">
                            <Download className="w-4 h-4" /> Download Report
                        </button>
                        <button 
                            onClick={onReanalyze}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-900/30"
                        >
                            <RefreshCw className="w-4 h-4" /> Re-analyze
                        </button>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Card 1: ATS Score */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-slate-400 font-medium text-sm">ATS Score</h3>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-4xl font-extrabold text-white">{result.atsScore}</span>
                                <span className="text-sm font-medium text-slate-500">/100</span>
                            </div>
                        </div>
                        <div className="mt-4 text-xs font-semibold text-green-500 flex items-center">
                            +5% from last version
                        </div>
                    </div>

                    {/* Card 2: Total Mistakes */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
                         <div>
                            <h3 className="text-slate-400 font-medium text-sm">Total Mistakes</h3>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-4xl font-extrabold text-white">{result.totalMistakes}</span>
                            </div>
                        </div>
                        <div className="mt-4 text-xs font-semibold text-red-500 flex items-center">
                            -10% from last version
                        </div>
                    </div>

                    {/* Card 3: Critical Issues */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
                         <div>
                            <h3 className="text-slate-400 font-medium text-sm">Critical Issues</h3>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-4xl font-extrabold text-white">{criticalIssuesCount}</span>
                            </div>
                        </div>
                        <div className="mt-4 text-xs font-semibold text-green-500 flex items-center">
                            +2% improvement
                        </div>
                    </div>

                    {/* Card 4: Formatting Score */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
                         <div>
                            <h3 className="text-slate-400 font-medium text-sm">Formatting Score</h3>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-4xl font-extrabold text-white">{result.formattingScore}</span>
                                <span className="text-sm font-medium text-slate-500">%</span>
                            </div>
                        </div>
                        <div className="mt-4 text-xs font-semibold text-red-500 flex items-center">
                            -1% from last version
                        </div>
                    </div>
                </div>

                {/* Visual Charts Section */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                     {/* ATS Breakdown Chart */}
                     <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center gap-8">
                         <div className="h-40 w-40 shrink-0 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={gaugeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={0}
                                        dataKey="value"
                                        stroke="none"
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        <Cell fill={scoreColor} cornerRadius={10} />
                                        <Cell fill="#1e293b" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-white">{result.atsScore}</span>
                                <span className="text-slate-500 text-xs uppercase">/ 100</span>
                            </div>
                         </div>
                         <div className="flex-1">
                             <h3 className="text-lg font-bold text-white mb-4">ATS Score Breakdown</h3>
                             <div className="space-y-3">
                                {breakdownData.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${['bg-green-500', 'bg-amber-500', 'bg-red-500', 'bg-blue-500'][idx % 4]}`}></div>
                                            <span className="text-sm font-medium text-slate-300">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-white">{item.score}%</span>
                                    </div>
                                ))}
                             </div>
                         </div>
                     </div>

                     {/* Common Mistakes Chart */}
                     <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
                         <h3 className="text-lg font-bold text-white mb-2">Common Mistakes</h3>
                         <div className="h-40">
                             <ResponsiveContainer width="100%" height="100%">
                                 <BarChart layout="vertical" data={[
                                     { name: 'Grammar', value: 100 - result.grammarScore },
                                     { name: 'Formatting', value: 100 - result.formattingScore },
                                     { name: 'Clarity', value: Math.max(10, 100 - result.atsScore) }, // Mock inverse
                                 ]} margin={{ left: 0, right: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                                    <XAxis type="number" hide domain={[0, 100]} />
                                    <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                                    <Bar dataKey="value" barSize={12} radius={[0, 4, 4, 0]}>
                                        <Cell fill="#f87171" />
                                        <Cell fill="#fbbf24" />
                                        <Cell fill="#60a5fa" />
                                    </Bar>
                                    <Tooltip 
                                        cursor={{ fill: '#1e293b' }} 
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} 
                                    />
                                 </BarChart>
                             </ResponsiveContainer>
                         </div>
                     </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">Areas for Improvement</h2>
                </div>

                {/* Main Content Split */}
                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Tabs & Content */}
                    <div className="lg:col-span-2">
                        
                        {/* Tabs */}
                        <div className="flex border-b border-slate-800 mb-6">
                            <button 
                                onClick={() => setActiveTab('detailed')}
                                className={`pb-3 px-1 mr-6 text-sm font-semibold transition-colors relative ${activeTab === 'detailed' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Detailed Breakdown
                                {activeTab === 'detailed' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full"></div>}
                            </button>
                            <button 
                                onClick={() => setActiveTab('summary')}
                                className={`pb-3 px-1 mr-6 text-sm font-semibold transition-colors relative ${activeTab === 'summary' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Summary
                                {activeTab === 'summary' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full"></div>}
                            </button>
                            <button 
                                onClick={() => setActiveTab('keywords')}
                                className={`pb-3 px-1 text-sm font-semibold transition-colors relative ${activeTab === 'keywords' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Keywords
                                {activeTab === 'keywords' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full"></div>}
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div>
                            {activeTab === 'detailed' && (
                                <div className="space-y-4">
                                    {result.issues.map((issue, idx) => {
                                        const styles = getSeverityStyles(issue.severity);
                                        const isOpen = openIssueIndex === idx;
                                        return (
                                            <div key={idx} className={`bg-slate-900 border rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md ${styles.border}`}>
                                                <button 
                                                    onClick={() => setOpenIssueIndex(isOpen ? null : idx)}
                                                    className="w-full flex items-center justify-between p-5 text-left bg-slate-900 hover:bg-slate-800/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${styles.badge}`}>
                                                            {issue.severity}
                                                        </span>
                                                        <h4 className="text-sm font-semibold text-white">{issue.title}</h4>
                                                    </div>
                                                    {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                                                </button>
                                                {isOpen && (
                                                    <div className="px-5 pb-5 pt-0">
                                                        <div className="pl-2 border-l-2 border-slate-800 ml-1">
                                                            <p className="text-sm text-slate-400 leading-relaxed pl-4">
                                                                {issue.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {result.issues.length === 0 && (
                                        <div className="text-center py-12 bg-slate-900 rounded-xl border border-slate-800 border-dashed">
                                            <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                                            <h3 className="text-white font-medium">No critical issues found</h3>
                                            <p className="text-slate-400 text-sm mt-1">Your resume is in great shape!</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'summary' && (
                                <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-900/30 rounded-lg shrink-0">
                                            <FileText className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-2">Executive Summary</h3>
                                            <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                                                {result.summary}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                             {activeTab === 'keywords' && (
                                <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-sm">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-purple-900/30 rounded-lg shrink-0">
                                            <Tag className="w-6 h-6 text-purple-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">Keyword Analysis</h3>
                                            <p className="text-slate-500 text-sm mt-1">
                                                Skills and keywords detected in your resume.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {result.keywords && result.keywords.length > 0 ? (
                                            result.keywords.map((keyword, idx) => (
                                                <span key={idx} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium border border-slate-700 hover:bg-slate-800 hover:border-blue-500 hover:text-blue-400 transition-colors cursor-default">
                                                    {keyword}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-slate-500 italic">No specific keywords data available.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Improvement Plan */}
                    <div className="lg:col-span-1">
                         <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-white mb-6">Your Improvement Plan</h2>
                            
                            <div className="space-y-6">
                                {result.improvements.map((item, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <div className="shrink-0 mt-0.5">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            {item.includes(':') ? (
                                                <>
                                                    <span className="block text-sm font-bold text-slate-200 mb-1">{item.split(':')[0]}:</span>
                                                    <span className="block text-sm text-slate-400 leading-relaxed">{item.split(':')[1]}</span>
                                                </>
                                            ) : (
                                                <p className="text-sm text-slate-400 leading-relaxed">{item}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AnalysisResultView;