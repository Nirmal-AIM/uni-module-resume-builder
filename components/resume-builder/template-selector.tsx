"use client"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean lines and bold headings.",
    color: "#374151",
    image: "/template-modern.jpg",
  },
  {
    id: "minimal",
    name: "Minimalist",
    description: "Essential information, maximum white space.",
    color: "#6b7280",
    image: "/template-minimal.jpg",
  },
  {
    id: "academic",
    name: "Academic CV",
    description: "Detailed structure for research and education.",
    color: "#1f2937",
    image: "/template-academic.jpg",
  },
  {
    id: "modern-blue",
    name: "Professional Blue",
    description: "Two-column layout with professional blue sidebar.",
    color: "#1a365d",
    image: "/Blue Simple Professional CV Resume.png",
  },
  {
    id: "minimalist-orange",
    name: "Warm Minimalist",
    description: "Clean layout with warm orange accents.",
    color: "#c05621",
    image: "/Marketing and Sales Resume in White Dark Orange Simple Style.png",
  },
  {
    id: "clean-teal",
    name: "Clean Modern",
    description: "Modern design with teal highlights.",
    color: "#2c7a7b",
    image: "/White Blue Modern Clean Professional Marketing Resume.png",
  },
  {
    id: "bold-black",
    name: "Bold Minimal",
    description: "High-contrast, bold typography.",
    color: "#111827",
    image: "/Systems Design Resume in White Black Simple Style.png",
  },
]

export function TemplateSelector({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 mb-8">
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          type="button"
          className="group relative flex flex-col text-left"
          onClick={() => onSelect(template.id)}
        >
          <div
            className={cn(
              "relative aspect-[1/1.414] w-full overflow-hidden rounded-lg border-2 transition-all duration-200",
              selected === template.id
                ? "border-green-600 ring-2 ring-green-600/20 shadow-lg"
                : "border-muted-foreground/10 hover:border-green-600/50 hover:shadow-md bg-white",
            )}
          >
            {/* Template Preview Image */}
            <Image
              src={template.image || "/placeholder.svg"}
              alt={template.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {/* Selection Overlay */}
            {selected === template.id && (
              <div className="absolute inset-0 bg-green-600/5 flex items-center justify-center">
                <div className="absolute top-2 right-2 rounded-full bg-green-600 p-1 text-white shadow-sm">
                  <Check className="h-3 w-3 stroke-[3px]" />
                </div>
              </div>
            )}

            {/* Hover State Button UI */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-white text-black px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {selected === template.id ? "Selected" : "Select"}
              </span>
            </div>
          </div>

          <div className="mt-2 px-0.5">
            <h3 className="font-semibold text-xs tracking-tight truncate">{template.name}</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{template.description}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
