import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; outline?: boolean };

export function Button({ children, outline = false, className = '', ...props }: ButtonProps) {
  return <button className={`flex h-12 w-full items-center justify-center rounded-2xl px-4 text-[15px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc4a27] disabled:cursor-not-allowed disabled:opacity-60 ${outline ? 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50' : 'bg-[#fc4a27] text-white shadow-[0_1px_3px_rgba(252,74,39,.2)] hover:bg-[#e84322]'} ${className}`} {...props}>{children}</button>;
}
