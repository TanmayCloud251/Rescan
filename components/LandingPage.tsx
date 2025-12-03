import React from 'react';
import FileUpload from './FileUpload';
import { CheckCircle2, BarChart2, Zap, FileSearch } from 'lucide-react';

interface LandingPageProps {
  onFileSelect: (file: File) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onFileSelect }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center space-y-6 mb-12 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Land Your Dream Job with <br />
            <span className="text-blue-500">AI-Optimized</span> Resumes
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Get an instant analysis of your resume, check your ATS score, and receive actionable 
            feedback to beat the bots and impress recruiters.
          </p>
        </div>

        <FileUpload onFileSelect={onFileSelect} />

        <div className="mt-12 flex items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Free to use
            </span>
            <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> No sign-up required
            </span>
            <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Secure & Private
            </span>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-950 py-24 border-t border-slate-900">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">How It Works</span>
                <h2 className="text-3xl font-bold text-white mt-2">Powerful Features to Optimize Your Resume</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                        <BarChart2 className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">ATS Compatibility Score</h3>
                    <p className="text-slate-400 leading-relaxed">
                        See how your resume scores against Applicant Tracking Systems and get tips to improve readability.
                    </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                        <FileSearch className="w-6 h-6 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Grammar & Mistake Detection</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Catch typos, grammatical errors, and passive voice usage that can get your resume discarded.
                    </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Actionable Feedback</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Receive a detailed report with clear next steps to enhance your content and formatting.
                    </p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;