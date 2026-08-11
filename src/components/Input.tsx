import type { InputHTMLAttributes } from 'react';
import { Mail } from 'lucide-react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: InputProps) {
  return <div className="relative"><Mail aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" /><input className={`h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 pl-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#fc4a27] focus:ring-4 focus:ring-[#fc4a27]/10 ${className}`} {...props} /></div>;
}
