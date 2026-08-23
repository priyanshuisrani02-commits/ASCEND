import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', isLoading = false, className, disabled, ...props }) => {
  const baseStyle = 'inline-flex items-center justify-center font-semibold tracking-[.08em] uppercase rounded-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#b89a5a]/30 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-b from-[#c8aa67] to-[#80683a] hover:from-[#dbc27e] hover:to-[#967a45] text-[#110e09] shadow-[0_8px_25px_rgba(184,154,90,.12)] border border-[#e1c984]/40 active:scale-[.98]',
    secondary: 'bg-[#191613] hover:bg-[#24201a] text-[#d9ceb7] border border-[#b89a5a]/20 hover:border-[#b89a5a]/40',
    outline: 'bg-transparent hover:bg-[#b89a5a]/5 text-[#cdb77e] border border-[#b89a5a]/35 hover:border-[#d7bd7a]/70',
    danger: 'bg-[#722e35]/80 hover:bg-[#8a3941] text-[#f1dddd] border border-[#b85e66]/40',
    ghost: 'bg-transparent hover:bg-white/[.03] text-[#817a6f] hover:text-[#d7bd7a]',
  };
  const sizes = { sm: 'px-3 py-1.5 text-[10px]', md: 'px-4 py-2.5 text-[11px]', lg: 'px-6 py-3.5 text-xs font-bold' };

  return <button className={clsx(baseStyle, variants[variant], sizes[size], className)} disabled={disabled || isLoading} {...props}>
    {isLoading ? <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg><span>Processing...</span></span> : children}
  </button>;
};
