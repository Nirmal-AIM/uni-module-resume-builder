"use client"
import { useState, useRef } from "react"
import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus,
  Trash2,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Languages,
  Award,
  FileText,
  ChevronLeft,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Building2,
  Link2,
  MapPin,
  Calendar,
  Home,
  Phone,
  Mail,
  Camera,
  Upload,
} from "lucide-react"
import { cn } from "@/lib/utils"

const SECTIONS = [
  { id: "personal", label: "Personal Information", icon: User, required: true },
  { id: "education", label: "Education", icon: GraduationCap, required: true },
  { id: "experience", label: "Professional Experience", icon: Briefcase, required: false },
  { id: "projects", label: "Projects", icon: Code, required: false },
  { id: "skills", label: "Skills", icon: Sparkles, required: true },
  { id: "languages", label: "Languages", icon: Languages, required: true },
  { id: "certificates", label: "Courses and Certificates", icon: Award, required: false },
  { id: "summary", label: "Summary", icon: FileText, required: true },
]

export function ResumeSurvey({
  data,
  updateData,
  selectedTemplate,
}: { data: any; updateData: (newData: any) => void; selectedTemplate?: string }) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [generatingAI, setGeneratingAI] = useState<{ [key: string]: boolean }>({})

  const handleChange = (section: string, field: string, value: any) => {
    updateData({
      ...data,
      [section]: {
        ...(data[section] || {}),
        [field]: value,
      },
    })
  }

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handleChange("personal", "profileImage", reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleArrayChange = (section: string, index: number, field: string, value: any) => {
    const currentArray = data[section] || []
    const newArray = [...currentArray]
    if (!newArray[index]) newArray[index] = {}
    newArray[index] = { ...newArray[index], [field]: value }
    updateData({ ...data, [section]: newArray })
  }

  const addItem = (section: string) => {
    updateData({
      ...data,
      [section]: [...(data[section] || []), {}],
    })
  }

  const removeItem = (section: string, index: number) => {
    const newArray = [...(data[section] || [])]
    newArray.splice(index, 1)
    updateData({ ...data, [section]: newArray })
  }

  const generateWithAI = async (type: 'job-description' | 'project-description' | 'summary', context: any, section: string, index?: number, field?: string) => {
    const key = index !== undefined ? `${section}-${index}` : section
    setGeneratingAI({ ...generatingAI, [key]: true })

    try {
      const response = await fetch('/api/generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, context })
      })

      const result = await response.json()

      if (result.success && result.text) {
        if (index !== undefined && field) {
          handleArrayChange(section, index, field, result.text)
        } else if (field) {
          handleChange(section, field, result.text)
        }
      } else {
        alert('Failed to generate content. Please try again.')
      }
    } catch (error) {
      console.error('AI generation error:', error)
      alert('Failed to generate content. Please try again.')
    } finally {
      setGeneratingAI({ ...generatingAI, [key]: false })
    }
  }

  if (!activeSection) {
    return (
      <div className="space-y-3">
        {selectedTemplate === "modern-blue" && (
          <div className="mb-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <Camera className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Profile Photo (Template 4)</span>
            </div>
            <p className="text-xs text-blue-700 mb-3">
              This template supports a profile photo in the sidebar. Upload your professional headshot.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="hidden"
            />
            <div className="flex items-center gap-4">
              {data.personal?.profileImage ? (
                <div className="relative">
                  <img
                    src={data.personal.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-300"
                  />
                  <button
                    onClick={() => handleChange("personal", "profileImage", null)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-dashed border-blue-300 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-400" />
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Upload className="h-4 w-4 mr-2" />
                {data.personal?.profileImage ? "Change Photo" : "Upload Photo"}
              </Button>
            </div>
          </div>
        )}
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all border-r-4 text-left",
              section.required ? "border-r-green-600" : "border-r-transparent",
            )}
          >
            <div className="p-2 rounded-lg bg-background shadow-sm">
              <section.icon className="h-5 w-5 text-green-600" />
            </div>
            <span className="font-medium flex-1">{section.label}</span>
          </button>
        ))}
        <p className="text-xs text-muted-foreground pt-2">Sections with a green border are required.</p>
        <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold mt-4">View Resume</Button>
      </div>
    )
  }

  const renderHeader = (title: string, icon?: React.ReactNode) => (
    <div className="flex flex-col items-center mb-8">
      <div className="w-full flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => setActiveSection(null)}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="w-10" />
      </div>
      {icon && (
        <div className="mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          {icon}
        </div>
      )}
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return (
          <div className="space-y-6">
            {renderHeader("Personal Information")}
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                <Input
                  className="pl-12 h-12 bg-muted/30 rounded-xl"
                  placeholder="Enter Full Name"
                  value={data.personal?.fullName || ""}
                  onChange={(e) => handleChange("personal", "fullName", e.target.value)}
                />
              </div>
              <div className="relative">
                <Briefcase className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                <Input
                  className="pl-12 h-12 bg-muted/30 rounded-xl"
                  placeholder="Enter Job Title"
                  value={data.personal?.jobTitle || ""}
                  onChange={(e) => handleChange("personal", "jobTitle", e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground px-2">
                Appears next to your name. You can write your current profession or the position you are applying for.
                Examples: Salesperson, Web Developer
              </p>
              <div className="flex gap-2">
                <div className="w-24 h-12 bg-muted/30 rounded-xl flex items-center justify-center gap-1 text-sm">
                  <ChevronDown className="h-4 w-4" /> +1
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                  <Input
                    className="pl-12 h-12 bg-muted/30 rounded-xl"
                    placeholder="Enter Phone Number"
                    value={data.personal?.phone || ""}
                    onChange={(e) => handleChange("personal", "phone", e.target.value)}
                  />
                </div>
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                <Input
                  className="pl-12 h-12 bg-muted/30 rounded-xl"
                  placeholder="Enter Email"
                  value={data.personal?.email || ""}
                  onChange={(e) => handleChange("personal", "email", e.target.value)}
                />
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-bold mb-4">Address</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter your Country"
                      value={data.personal?.country || ""}
                      onChange={(e) => handleChange("personal", "country", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Select your Location"
                      value={data.personal?.location || ""}
                      onChange={(e) => handleChange("personal", "location", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Home className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter Street Address"
                      value={data.personal?.address || ""}
                      onChange={(e) => handleChange("personal", "address", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full h-12 border-green-600 text-green-600 rounded-xl bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Another Section
              </Button>
            </div>
          </div>
        )
      case "education":
        return (
          <div className="space-y-6">
            {renderHeader("Education", <GraduationCap className="h-16 w-16" />)}
            <div className="space-y-8">
              {(data.education_list || [{}]).map((edu: any, index: number) => (
                <div key={index} className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="font-bold">Education {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem("education_list", index)}
                      className="text-green-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter University Name"
                      value={edu.university || ""}
                      onChange={(e) => handleArrayChange("education_list", index, "university", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter your speciality"
                      value={edu.degree || ""}
                      onChange={(e) => handleArrayChange("education_list", index, "degree", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter your Grade (Optional)"
                      value={edu.grade || ""}
                      onChange={(e) => handleArrayChange("education_list", index, "grade", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="From"
                      value={edu.from || ""}
                      onChange={(e) => handleArrayChange("education_list", index, "from", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="To"
                      value={edu.to || ""}
                      onChange={(e) => handleArrayChange("education_list", index, "to", e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2 px-2">
                    <Checkbox
                      id={`study-${index}`}
                      checked={edu.currentlyStudying}
                      onCheckedChange={(checked) =>
                        handleArrayChange("education_list", index, "currentlyStudying", checked)
                      }
                    />
                    <label htmlFor={`study-${index}`} className="text-sm font-medium">
                      I still study here
                    </label>
                  </div>
                </div>
              ))}
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full h-12 border-green-600 text-green-600 rounded-xl bg-transparent"
                  onClick={() => addItem("education_list")}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Education
                </Button>
                <Button
                  className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl font-bold"
                  onClick={() => setActiveSection(null)}
                >
                  Save & Continue
                </Button>
              </div>
            </div>
          </div>
        )
      case "experience":
        return (
          <div className="space-y-6">
            {renderHeader("Professional Experience", <Briefcase className="h-16 w-16" />)}
            <p className="text-center font-bold text-lg mb-4">Where do you work?</p>
            <div className="space-y-8">
              {(data.experience || [{}]).map((exp: any, index: number) => (
                <div key={index} className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="font-bold">Experience {index + 1}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem("experience", index)}
                        className="text-green-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                      <ChevronRight className="h-5 w-5 rotate-90" />
                    </div>
                  </div>
                  <h4 className="font-bold px-2">Company Details</h4>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter Company Name"
                      value={exp.company || ""}
                      onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter Company URL (Optional)"
                      value={exp.url || ""}
                      onChange={(e) => handleArrayChange("experience", index, "url", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter Location"
                      value={exp.location || ""}
                      onChange={(e) => handleArrayChange("experience", index, "location", e.target.value)}
                    />
                  </div>
                  <h4 className="font-bold px-2">Job Details</h4>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter Job Title"
                      value={exp.role || ""}
                      onChange={(e) => handleArrayChange("experience", index, "role", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <div className="pl-12 h-12 bg-muted/30 rounded-xl flex items-center justify-between px-4 cursor-pointer">
                      <span>Full Time</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="From"
                      value={exp.from || ""}
                      onChange={(e) => handleArrayChange("experience", index, "from", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="To"
                      value={exp.to || ""}
                      onChange={(e) => handleArrayChange("experience", index, "to", e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2 px-2">
                    <Checkbox
                      id={`work-${index}`}
                      checked={exp.currentlyWorking}
                      onCheckedChange={(checked) => handleArrayChange("experience", index, "currentlyWorking", checked)}
                    />
                    <label htmlFor={`work-${index}`} className="text-sm font-medium">
                      I currently work in this role
                    </label>
                  </div>
                  <div className="relative">
                    <Textarea
                      className="min-h-[150px] bg-muted/30 rounded-xl pt-4"
                      placeholder="Enter Job Description"
                      value={exp.desc || ""}
                      onChange={(e) => handleArrayChange("experience", index, "desc", e.target.value)}
                    />
                    <Button
                      size="sm"
                      type="button"
                      disabled={generatingAI[`experience-${index}`]}
                      onClick={() => generateWithAI(
                        'job-description',
                        {
                          jobTitle: exp.role || '',
                          company: exp.company || '',
                          from: exp.from || '',
                          to: exp.to || exp.currentlyWorking ? 'Present' : ''
                        },
                        'experience',
                        index,
                        'desc'
                      )}
                      className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 rounded-full flex gap-1 items-center"
                    >
                      {generatingAI[`experience-${index}`] ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          GENERATING...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" /> GENERATE WITH AI
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full h-12 border-green-600 text-green-600 rounded-xl bg-transparent"
                  onClick={() => addItem("experience")}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Section
                </Button>
                <Button
                  className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl font-bold"
                  onClick={() => setActiveSection(null)}
                >
                  Save & Continue
                </Button>
              </div>
            </div>
          </div>
        )
      case "projects":
        return (
          <div className="space-y-6">
            {renderHeader("Project Details", <Code className="h-16 w-16" />)}
            <p className="text-center font-bold text-lg mb-4">What projects do you work on?</p>
            <div className="space-y-8">
              {(data.projects || [{}]).map((proj: any, index: number) => (
                <div key={index} className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="font-bold">Project {index + 1}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem("projects", index)}
                        className="text-green-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                      <ChevronRight className="h-5 w-5 rotate-90" />
                    </div>
                  </div>
                  <h4 className="font-bold px-2">Project Details</h4>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter Project Name"
                      value={proj.name || ""}
                      onChange={(e) => handleArrayChange("projects", index, "name", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter your Role (optional)"
                      value={proj.role || ""}
                      onChange={(e) => handleArrayChange("projects", index, "role", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter project URL (optional)"
                      value={proj.url || ""}
                      onChange={(e) => handleArrayChange("projects", index, "url", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="From"
                      value={proj.from || ""}
                      onChange={(e) => handleArrayChange("projects", index, "from", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="To"
                      value={proj.to || ""}
                      onChange={(e) => handleArrayChange("projects", index, "to", e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2 px-2">
                    <Checkbox
                      id={`project-work-${index}`}
                      checked={proj.currentlyWorking}
                      onCheckedChange={(checked) => handleArrayChange("projects", index, "currentlyWorking", checked)}
                    />
                    <label htmlFor={`project-work-${index}`} className="text-sm font-medium">
                      I currently work on this project
                    </label>
                  </div>
                  <div className="relative">
                    <Textarea
                      className="min-h-[150px] bg-muted/30 rounded-xl pt-4"
                      placeholder="Enter Job Description"
                      value={proj.desc || ""}
                      onChange={(e) => handleArrayChange("projects", index, "desc", e.target.value)}
                    />
                    <Button
                      size="sm"
                      type="button"
                      disabled={generatingAI[`projects-${index}`]}
                      onClick={() => generateWithAI(
                        'project-description',
                        {
                          name: proj.name || '',
                          role: proj.role || '',
                          from: proj.from || '',
                          to: proj.to || proj.currentlyWorking ? 'Present' : ''
                        },
                        'projects',
                        index,
                        'desc'
                      )}
                      className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 rounded-full flex gap-1 items-center"
                    >
                      {generatingAI[`projects-${index}`] ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          GENERATING...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" /> GENERATE WITH AI
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full h-12 border-green-600 text-green-600 rounded-xl bg-transparent"
                  onClick={() => addItem("projects")}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Project
                </Button>
                <Button
                  className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl font-bold"
                  onClick={() => setActiveSection(null)}
                >
                  Save & Continue
                </Button>
              </div>
            </div>
          </div>
        )
      case "skills":
        return (
          <div className="space-y-6">
            {renderHeader("Skills", <Sparkles className="h-16 w-16" />)}
            <p className="text-sm text-muted-foreground px-2 mb-6">
              List your top skills, separated by commas. These will be highlighted in your resume and portfolio.
            </p>
            <div className="relative">
              <Sparkles className="absolute left-4 top-3 h-5 w-5 text-green-600" />
              <Textarea
                className="pl-12 min-h-[150px] bg-muted/30 rounded-xl pt-4"
                placeholder="e.g. JavaScript, React, Project Management, UI/UX Design"
                value={data.personal?.skillsText || ""}
                onChange={(e) => handleChange("personal", "skillsText", e.target.value)}
              />
            </div>
            <Button
              className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl font-bold mt-8"
              onClick={() => setActiveSection(null)}
            >
              Save & Continue
            </Button>
          </div>
        )
      case "languages":
        return (
          <div className="space-y-6">
            {renderHeader("Languages", <Languages className="h-16 w-16" />)}
            <div className="space-y-8">
              {(data.languages || [{}]).map((lang: any, index: number) => (
                <div key={index} className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="font-bold">Language {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem("languages", index)}
                      className="text-green-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Languages className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter Language (e.g. English)"
                      value={lang.name || ""}
                      onChange={(e) => handleArrayChange("languages", index, "name", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Input
                      className="h-12 bg-muted/30 rounded-xl"
                      placeholder="Level (e.g. Fluent, Native, Basic)"
                      value={lang.level || ""}
                      onChange={(e) => handleArrayChange("languages", index, "level", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full h-12 border-green-600 text-green-600 rounded-xl bg-transparent"
                onClick={() => addItem("languages")}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Another Language
              </Button>
            </div>
            <Button
              className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl font-bold mt-8"
              onClick={() => setActiveSection(null)}
            >
              Save & Continue
            </Button>
          </div>
        )
      case "certificates":
        return (
          <div className="space-y-6">
            {renderHeader("Courses and Certificates", <Award className="h-16 w-16" />)}
            <div className="space-y-8">
              {(data.certificates || [{}]).map((cert: any, index: number) => (
                <div key={index} className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="font-bold">Certificate {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem("certificates", index)}
                      className="text-green-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Award className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter your Certificate Title"
                      value={cert.title || ""}
                      onChange={(e) => handleArrayChange("certificates", index, "title", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter your Issuing Organization"
                      value={cert.org || ""}
                      onChange={(e) => handleArrayChange("certificates", index, "org", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter your Issue Date"
                      value={cert.date || ""}
                      onChange={(e) => handleArrayChange("certificates", index, "date", e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-3 h-5 w-5 text-green-600" />
                    <Input
                      className="pl-12 h-12 bg-muted/30 rounded-xl"
                      placeholder="Enter your Certificate URL (optional)"
                      value={cert.url || ""}
                      onChange={(e) => handleArrayChange("certificates", index, "url", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full h-12 border-green-600 text-green-600 rounded-xl bg-transparent"
                  onClick={() => addItem("certificates")}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Certificate
                </Button>
                <Button
                  className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl font-bold"
                  onClick={() => setActiveSection(null)}
                >
                  Save & Continue
                </Button>
              </div>
            </div>
          </div>
        )
      case "summary":
        return (
          <div className="space-y-6">
            {renderHeader("Summary")}
            <p className="text-sm text-muted-foreground px-2 mb-6">
              Summarize your experience, key skills, and career goals in a few sentences. Highlight what makes you
              unique and the value you bring. Keep it clear, concise, and impactful.
            </p>
            <div className="relative">
              <Textarea
                className="min-h-[300px] bg-muted/30 rounded-xl p-6 text-base"
                placeholder="Enter your Summary"
                value={data.summary?.text || ""}
                onChange={(e) => handleChange("summary", "text", e.target.value)}
              />
              <Button
                size="sm"
                type="button"
                disabled={generatingAI['summary']}
                onClick={() => generateWithAI(
                  'summary',
                  {
                    name: data.personal?.fullName || '',
                    jobTitle: data.personal?.jobTitle || '',
                    skills: data.personal?.skillsText || ''
                  },
                  'summary',
                  undefined,
                  'text'
                )}
                className="absolute bottom-6 right-6 bg-green-600 hover:bg-green-700 rounded-full flex gap-1 items-center"
              >
                {generatingAI['summary'] ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    GENERATING...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> GENERATE WITH AI
                  </>
                )}
              </Button>
            </div>
            <Button
              className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl font-bold mt-8"
              onClick={() => setActiveSection(null)}
            >
              Save & Continue
            </Button>
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            {renderHeader(SECTIONS.find((s) => s.id === activeSection)?.label || "Section")}
            <Button
              className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl font-bold mt-8"
              onClick={() => setActiveSection(null)}
            >
              Save & Continue
            </Button>
          </div>
        )
    }
  }

  return <div className="max-w-xl mx-auto">{renderSection()}</div>
}
