"use client"

import type React from "react"

import { useAuth } from "./auth-provider"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user && pathname !== "/") {
      router.push("/")
    }
  }, [user, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
