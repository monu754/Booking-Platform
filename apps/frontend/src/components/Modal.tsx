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
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#020817]/92 p-3 backdrop-blur-lg sm:p-5">
      <div className="flex min-h-screen items-start justify-center py-2 sm:py-6">
        <div className="flex w-full max-w-6xl flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,34,0.985),rgba(7,14,26,0.985))] shadow-[0_40px_120px_rgba(0,0,0,0.55)] animate-in fade-in zoom-in duration-300 sm:rounded-[36px] max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)]">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[linear-gradient(180deg,rgba(12,21,39,0.98),rgba(12,21,39,0.92))] px-5 py-4 backdrop-blur sm:px-8 sm:py-6">
            <h2 className="font-display text-2xl font-black text-white sm:text-3xl">{title}</h2>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-white/20 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 custom-scrollbar sm:px-8 sm:py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
