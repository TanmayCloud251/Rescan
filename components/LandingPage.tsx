import React from 'react';
import FileUpload from './FileUpload';
import { 
  CheckCircle2, 
  Zap, 
  FileSearch, 
  ArrowRight, 
  ShieldCheck, 
  Target, 
  Briefcase,
  Award
} from 'lucide-react';

interface LandingPageProps {
  onFileSelect: (file: File) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onFileSelect }) => {
  return (
    <div className="bg-slate-950 flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              <Zap className="w-3 h-3" /> Powered by Advanced AI
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] md:leading-[0.85]">
              STOP GETTING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-600">GHOSTED.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Rescan uses elite-level recruitment intelligence to audit your resume for ATS compatibility and human impact.
            </p>
          </div>

          <div id="upload-section" className="relative group max-w-3xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <FileUpload onFileSelect={onFileSelect} />
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" /> Private & Encrypted
              </span>
              <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-800"></span>
              <span className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" /> 99.2% ATS Accuracy
              </span>
              <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-800"></span>
              <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-500" /> Fortune 500 Standards
              </span>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-slate-900 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-8">Optimized for Industry Giants</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale contrast-125">
            <span className="text-2xl font-black text-white italic tracking-tighter">Google</span>
            <span className="text-2xl font-black text-white tracking-tighter">AMAZON</span>
            <span className="text-2xl font-black text-white tracking-tight">META</span>
            <span className="text-2xl font-black text-white">Microsoft</span>
            <span className="text-2xl font-black text-white tracking-widest underline decoration-blue-500 underline-offset-4">TESLA</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-slate-950 relative">
        <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <div className="max-w-xl">
                    <span className="text-blue-500 font-bold text-sm uppercase tracking-widest">Process</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mt-4 leading-tight">The 3-Step Path to <br />Interview Calls.</h2>
                </div>
                <p className="text-slate-400 max-w-sm mb-2">
                  We've distilled the complex world of recruiter psychology into a simple, automated workflow.
                </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
                <div className="relative group">
                    <div className="text-8xl font-black text-slate-900 absolute -top-10 -left-4 group-hover:text-blue-900/20 transition-colors">01</div>
                    <div className="relative z-10 space-y-4">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/20 group-hover:scale-110 transition-transform">
                            <Zap className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Upload Resume</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Drop your PDF or Image. Our OCR engine extracts every detail without losing context.
                        </p>
                    </div>
                </div>

                <div className="relative group">
                    <div className="text-8xl font-black text-slate-900 absolute -top-10 -left-4 group-hover:text-indigo-900/20 transition-colors">02</div>
                    <div className="relative z-10 space-y-4">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-900/20 group-hover:scale-110 transition-transform">
                            <FileSearch className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">AI Deep Scan</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Llama 3.3 models audit your skills, grammar, and formatting against target industry benchmarks.
                        </p>
                    </div>
                </div>

                <div className="relative group">
                    <div className="text-8xl font-black text-slate-900 absolute -top-10 -left-4 group-hover:text-amber-900/20 transition-colors">03</div>
                    <div className="relative z-10 space-y-4">
                        <div className="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-900/20 group-hover:scale-110 transition-transform">
                            <Award className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Get Hired</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Apply the expert-level improvements and send your resume with 100% confidence.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="py-24 bg-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/10"></div>
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                  <div>
                      <div className="text-5xl font-black text-white mb-2">500+</div>
                      <div className="text-blue-100 font-semibold text-sm uppercase tracking-wider">Resumes Analyzed</div>
                  </div>
                  <div>
                      <div className="text-5xl font-black text-white mb-2">85%</div>
                      <div className="text-blue-100 font-semibold text-sm uppercase tracking-wider">Interview Rate</div>
                  </div>
                  <div>
                      <div className="text-5xl font-black text-white mb-2">12s</div>
                      <div className="text-blue-100 font-semibold text-sm uppercase tracking-wider">Avg. Analysis Time</div>
                  </div>
                  <div>
                      <div className="text-5xl font-black text-white mb-2">0$</div>
                      <div className="text-blue-100 font-semibold text-sm uppercase tracking-wider">Cost to You</div>
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-slate-950 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Ready to Beat the <br />Competition?</h2>
              <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto">Join thousands of successful candidates. Analyze your resume now.</p>
              <button 
                onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
          </div>
      </section>
    </div>
  );
};

export default LandingPage;