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
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-premium/85 p-2 backdrop-blur-md sm:p-5">
      <div className="flex min-h-full items-start justify-center">
        <div className="mt-2 flex h-[calc(100vh-1rem)] w-full max-w-7xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-surface-950 shadow-2xl animate-in fade-in zoom-in duration-300 sm:mt-4 sm:h-[calc(100vh-2rem)] sm:rounded-[40px]">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4 sm:px-10 sm:py-8">
            <h2 className="font-display text-2xl font-black text-white sm:text-3xl">{title}</h2>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-500 transition-all hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 custom-scrollbar sm:px-10 sm:py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
