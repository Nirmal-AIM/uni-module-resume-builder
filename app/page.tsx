"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  const { user, login, isLoading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/builder")
    }
  }, [user, isLoading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      await login(email)
      router.push("/builder")
    }
  }

  if (isLoading || user) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 flex items-center justify-center">
            <img src="/unisync-logo.png" alt="UniSync Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900">UniSync</h1>
          <p className="mt-2 text-lg text-slate-600">Create professional resumes and portfolios in minutes.</p>
        </div>

        <Card className="border-slate-200 shadow-xl">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Enter your email to start building your professional future.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="name@university.edu"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.02]">
                Get Started
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 italic">No password required for this demo.</p>
      </div>
    </div>
  )
}
