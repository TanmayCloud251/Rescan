import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndProcessFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF, PNG, or JPEG file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size exceeds 5MB limit.');
        return;
    }
    setError(null);
    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
            relative group border border-dashed rounded-xl p-8 transition-all duration-300 ease-in-out
            flex flex-col items-center justify-center text-center cursor-pointer
            ${isDragging 
                ? 'border-blue-500 bg-slate-900/80 scale-[1.02]' 
                : 'border-slate-700 hover:border-blue-500 hover:bg-slate-900 bg-slate-900/50'
            }
        `}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          accept=".pdf,.png,.jpg,.jpeg"
        />
        
        <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-blue-500/20' : 'bg-slate-800 group-hover:bg-blue-500/20'}`}>
          <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-500'}`} />
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">
          Upload your Resume
        </h3>
        <p className="text-sm text-slate-400 mb-6 max-w-xs">
          Drag & drop your file here or click to browse. Supports PDF and Images up to 5MB.
        </p>

        {error && (
            <div className="absolute -bottom-14 left-0 right-0 flex items-center justify-center text-red-400 text-sm bg-red-900/20 border border-red-900/50 py-2 rounded-lg animate-fade-in">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
            </div>
        )}

        <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><FileText className="w-3 h-3"/> PDF</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>JPG</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>PNG</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;