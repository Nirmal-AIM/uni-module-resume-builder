"use client"

import { useState, useEffect } from "react"
import { ResumeSurvey } from "@/components/resume-builder/resume-survey"
import { ResumePreview } from "@/components/resume-builder/resume-preview"
import { Button } from "@/components/ui/button"
import { Download, Share2, LogOut, Copy, Check, ChevronLeft, ChevronRight, Save } from "lucide-react"
import { TemplateSelector } from "@/components/resume-builder/template-selector"
import { PortfolioView } from "@/components/portfolio/portfolio-view"
import { AuthGate } from "@/components/auth/auth-gate"
import { useAuth } from "@/components/auth/auth-provider"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const STEPS = [
  { id: 1, title: "Choose Template", shortTitle: "Template" },
  { id: 2, title: "Fill Information", shortTitle: "Details" },
  { id: 3, title: "Preview & Export", shortTitle: "Preview" },
]

export default function BuilderPage() {
  const [resumeData, setResumeData] = useState({
    personal: {},
    education_list: [{}],
    experience: [{}],
    projects: [{}],
    skills: [],
    languages: [],
    summary: {},
    certificates: [{}],
  })
  const [selectedTemplate, setSelectedTemplate] = useState("modern-blue")
  const [showPortfolio, setShowPortfolio] = useState(false)
  const [copied, setCopied] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const { user, logout } = useAuth()

  // Load user data from database on mount
  useEffect(() => {
    if (user?.id) {
      loadUserProfile(user.id)
    }
  }, [user?.id])

  // Auto-save when data changes (debounced)
  useEffect(() => {
    if (user?.id && saveStatus !== 'saving') {
      const timer = setTimeout(() => {
        saveToDatabase()
      }, 2000) // Auto-save after 2 seconds of no changes

      return () => clearTimeout(timer)
    }
  }, [resumeData, selectedTemplate])

  const loadUserProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/profile?userId=${userId}`)
      const data = await response.json()

      if (data.exists && data.profile) {
        // Map database profile to resumeData format
        setResumeData({
          personal: {
            ...data.profile.basicInfo,
            address: data.profile.basicInfo.streetAddress || '', // Map streetAddress to address for form
          },
          education_list: data.profile.education || [{}],
          experience: data.profile.experience || [{}],
          projects: data.profile.projects || [{}],
          skills: data.profile.skills || [],
          languages: data.profile.languages || [],
          summary: { text: data.profile.summary || '' },
          certificates: data.profile.coursesCertificates || [{}],
        })

        if (data.profile.basicInfo?.templateId) {
          setSelectedTemplate(data.profile.basicInfo.templateId)
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const saveToDatabase = async () => {
    if (!user?.id) return

    setSaveStatus('saving')
    setSaving(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          templateId: selectedTemplate,
          fullName: resumeData.personal?.fullName || '',
          jobTitle: resumeData.personal?.jobTitle || '',
          email: resumeData.personal?.email || '',
          phone: resumeData.personal?.phone || '',
          location: resumeData.personal?.location || '',
          website: resumeData.personal?.website || '',
          country: resumeData.personal?.country || '',
          streetAddress: resumeData.personal?.address || '',
          summary: resumeData.summary?.text || '',
          education: resumeData.education_list || [],
          experience: resumeData.experience || [],
          projects: resumeData.projects || [],
          skills: resumeData.personal?.skillsText ? resumeData.personal.skillsText.split(',').map((s: string) => s.trim()) : [],
          languages: resumeData.languages || [],
          coursesCertificates: resumeData.certificates || [],
        })
      })

      const result = await response.json()

      if (result.success) {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        setSaveStatus('error')
      }
    } catch (error) {
      console.error('Error saving to database:', error)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handleExportPDF = () => {
    document.body.classList.add("printing-resume")
    window.print()
    document.body.classList.remove("printing-resume")
  }

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/p/${user?.id || "demo"}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      const textArea = document.createElement("textarea")
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const goToNextStep = () => {
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1)
  }

  const goToPrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <AuthGate>
      <div className="flex flex-col h-screen bg-background text-foreground print:bg-white">
        <header className="border-b px-4 lg:px-6 py-3 lg:py-4 flex justify-between items-center bg-card shadow-sm print:hidden">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="h-7 w-7 lg:h-8 lg:w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm lg:text-base">
              U
            </div>
            <div>
              <h1 className="text-base lg:text-lg font-bold leading-none">UniSynic</h1>
              <p className="text-[10px] lg:text-xs text-muted-foreground mt-0.5 lg:mt-1 hidden sm:block">
                Welcome, {user?.name}
              </p>
            </div>
          </div>
          <div className="flex gap-1.5 lg:gap-2 items-center">
            {/* Save Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
              {saveStatus === 'saving' && (
                <>
                  <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
                  <span>Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <Check className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">Saved to database</span>
                </>
              )}
              {saveStatus === 'error' && (
                <span className="text-red-600">Save failed</span>
              )}
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 lg:h-9 px-2 lg:px-3 bg-transparent">
                  <Share2 className="h-4 w-4 lg:mr-2" />
                  <span className="hidden lg:inline">Share Portfolio</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl h-[90vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="p-6 border-b">
                  <DialogTitle>Public Portfolio Preview</DialogTitle>
                  <DialogDescription>
                    This is how your shareable portfolio website looks to recruiters.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto bg-slate-50">
                  <PortfolioView data={resumeData} />
                </div>
                <div className="p-4 border-t flex justify-between items-center bg-white">
                  <p className="text-sm text-muted-foreground italic">
                    Link: <span className="font-mono text-primary select-all">unisynic.app/p/{user?.id}</span>
                  </p>
                  <Button size="sm" onClick={handleCopyLink}>
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" /> Copy Shareable Link
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              size="sm"
              onClick={handleExportPDF}
              className="h-8 lg:h-9 px-2 lg:px-3 bg-green-600 hover:bg-green-700 text-white hidden lg:flex"
            >
              <Download className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Export PDF</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={logout} className="h-8 lg:h-9 px-2">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="lg:hidden border-b bg-card px-4 py-3 print:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-xs font-medium">{STEPS[currentStep - 1].title}</span>
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-all",
                  currentStep >= step.id ? "bg-green-600" : "bg-muted",
                )}
              />
            ))}
          </div>
        </div>

        <main className="flex-1 overflow-hidden hidden lg:flex print:block print:overflow-visible">
          <div className="w-5/12 overflow-y-auto p-6 border-r scrollbar-hide print:hidden">
            <div className="mb-8">
              <h2 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">
                1. Choose Template
              </h2>
              <TemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />
            </div>

            <div className="mb-4">
              <h2 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">
                2. Fill Information
              </h2>
              <ResumeSurvey data={resumeData} updateData={setResumeData} selectedTemplate={selectedTemplate} />
            </div>
          </div>

          <div className="flex w-7/12 overflow-y-auto p-8 bg-secondary/20 items-start justify-center print:p-0 print:bg-white print:w-full print:block">
            <div className="w-full max-w-[850px] print:max-w-none">
              <h2 className="text-sm font-semibold mb-6 uppercase tracking-wider text-center text-muted-foreground print:hidden">
                Live Preview
              </h2>
              <div id="resume-content" className="print:shadow-none print:border-none">
                <ResumePreview data={resumeData} template={selectedTemplate} />
              </div>
            </div>
          </div>
        </main>

        <main className="flex-1 overflow-y-auto lg:hidden print:hidden">
          {/* Step 1: Choose Template */}
          {currentStep === 1 && (
            <div className="p-4">
              <h2 className="text-lg font-bold mb-1">Choose Your Template</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Select a design that best represents your professional style.
              </p>
              <TemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />
            </div>
          )}

          {/* Step 2: Fill Information */}
          {currentStep === 2 && (
            <div className="p-4">
              <h2 className="text-lg font-bold mb-1">Fill Your Information</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your details to generate a professional resume.
              </p>
              <ResumeSurvey data={resumeData} updateData={setResumeData} selectedTemplate={selectedTemplate} />
            </div>
          )}

          {/* Step 3: Preview & Export */}
          {currentStep === 3 && (
            <div className="p-4 bg-secondary/20 min-h-full">
              <h2 className="text-lg font-bold mb-1">Preview Your Resume</h2>
              <p className="text-sm text-muted-foreground mb-4">Review your resume and export it as a PDF.</p>
              <div className="mb-4">
                <Button
                  onClick={handleExportPDF}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold"
                >
                  <Download className="mr-2 h-5 w-5" /> Download PDF
                </Button>
              </div>
              <div id="resume-content-mobile" className="bg-white rounded-lg shadow-lg overflow-hidden">
                <ResumePreview data={resumeData} template={selectedTemplate} />
              </div>
            </div>
          )}
        </main>

        <div className="lg:hidden border-t bg-card px-4 py-3 flex justify-between items-center print:hidden">
          <Button
            variant="outline"
            onClick={goToPrevStep}
            disabled={currentStep === 1}
            className="h-10 px-4 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <div className="flex gap-2">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all",
                  currentStep === step.id ? "bg-green-600 scale-125" : "bg-muted",
                )}
              />
            ))}
          </div>

          <Button
            onClick={currentStep === STEPS.length ? handleExportPDF : goToNextStep}
            className={cn("h-10 px-4", currentStep === STEPS.length ? "bg-green-600 hover:bg-green-700" : "bg-primary")}
          >
            {currentStep === STEPS.length ? (
              <>
                <Download className="h-4 w-4 mr-1" />
                Export
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </AuthGate>
  )
}
