import type { ReactNode } from 'react';
import { BrandPanel } from '@/components/BrandPanel';

type AuthLayoutProps = { children: ReactNode };

export function AuthLayout({ children }: AuthLayoutProps) { return <main className="auth-layout flex min-h-screen flex-col bg-gray-50 lg:flex-row"><BrandPanel /><section className="auth-right flex flex-1 flex-col items-center justify-center bg-white p-7 sm:p-12 lg:min-w-0 lg:p-8"><div className="flex w-full flex-col items-center">{children}<p className="pt-4 text-center text-xs text-[#546176]">ResUme NoW © 2026 - All rights reserved</p></div></section></main>; }
