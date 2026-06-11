
import React from 'react';
import { Github, Instagram, Mail, Twitter, Linkedin, ScanLine, Shield, Globe, Heart, FileText } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-transparent border border-blue-500 rounded-full flex items-center justify-center transition-transform group-hover:rotate-6">
                <ScanLine className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Rescan</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Empowering job seekers with AI-driven resume analysis. Get professional feedback and ATS optimization in seconds.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/TanmayCloud251" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/tanmaymishra251" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="mailto:tanmaycloud251@gmail.com" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-white font-semibold mb-6">Product</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-blue-500 text-sm transition-colors">AI Analysis</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-500 text-sm transition-colors">ATS Scoring</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-500 text-sm transition-colors">Grammar Check</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-500 text-sm transition-colors">Templates</a></li>
            </ul>
          </div>

          {/* Projects Column */}
          <div>
            <h4 className="text-white font-semibold mb-6">Projects</h4>
            <ul className="space-y-4">
              <li><a href="https://video-tube-frontend-sepia.vercel.app" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 text-sm transition-colors">VideoTube</a></li>
              <li><a href="https://mega-blog-indol.vercel.app" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 text-sm transition-colors">MegaBlog</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-white font-semibold mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-blue-500 text-sm transition-colors flex items-center gap-2"><Shield className="w-4 h-4" /> Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-500 text-sm transition-colors flex items-center gap-2"><FileText className="w-4 h-4" /> Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-500 text-sm transition-colors flex items-center gap-2"><Globe className="w-4 h-4" /> Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} RESCAN. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-slate-500 text-sm">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>by</span>
            <a href="https://github.com/TanmayCloud251" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors font-medium">Tanmay Mishra</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
