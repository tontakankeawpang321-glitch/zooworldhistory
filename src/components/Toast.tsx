import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

interface ToastProps {
  toast: ToastMessage | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
      <div className="px-4 py-2.5 rounded-full bg-[#1A1C18] border border-[#9BBF73] shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-bold text-[#E0E2DB]">
        {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#9BBF73] shrink-0" />}
        {toast.type === 'info' && <Info className="w-4 h-4 text-[#9BBF73] shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
