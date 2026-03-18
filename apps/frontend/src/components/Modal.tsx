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
    <div className="fixed inset-0 z-[100] bg-premium/80 p-3 backdrop-blur-md sm:p-6">
      <div className="flex h-full items-center justify-center">
        <div className="flex h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-[40px] border border-white/10 bg-surface-950 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-5 sm:px-10 sm:py-8">
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
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 custom-scrollbar sm:px-10 sm:py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
