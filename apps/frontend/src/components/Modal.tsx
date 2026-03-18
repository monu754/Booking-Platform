import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-6 bg-premium/80 backdrop-blur-md overflow-y-auto pt-20 pb-20">
      <div className="w-full max-w-2xl bg-surface-950 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-display text-2xl font-black text-white">{title}</h2>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all flex items-center justify-center"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
