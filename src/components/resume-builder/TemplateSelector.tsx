import React from "react";
import { Check } from "lucide-react";

const TEMPLATES = [
  {
    id: "modern-blue",
    name: "Executive Navy (Richard Sanchez)",
    description: "Two-column layout with professional navy blue sidebar.",
    color: "#1a365d",
    image: "/templates/richard-sanchez.png",
  },
  {
    id: "minimalist-orange",
    name: "Warm Terracotta (Zola Bekker)",
    description: "Clean serif layout with warm terracotta orange accents.",
    color: "#c05621",
    image: "/templates/zola-bekker.png",
  },
  {
    id: "clean-teal",
    name: "Clean Teal (Drew Feig)",
    description: "Modern layout with clean teal highlights.",
    color: "#2c7a7b",
    image: "/templates/drew-feig.png",
  },
  {
    id: "bold-black",
    name: "Bold Systems (Laurice Moretti)",
    description: "High-contrast design with bold typography.",
    color: "#111827",
    image: "/templates/laurice-moretti.png",
  },
];

export function TemplateSelector({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
      {TEMPLATES.map((template) => {
        const isSelected = selected === template.id || 
          (selected === "richard-sanchez" && template.id === "modern-blue") ||
          (selected === "zola-bekker" && template.id === "minimalist-orange") ||
          (selected === "drew-feig" && template.id === "clean-teal") ||
          (selected === "laurice-moretti" && template.id === "bold-black");

        return (
          <button
            key={template.id}
            type="button"
            className="group relative flex flex-col text-left focus:outline-none"
            onClick={() => onSelect(template.id)}
          >
            <div
              className={`relative aspect-[1/1.414] w-full overflow-hidden rounded-xl border-2 transition-all duration-200 bg-gray-50 ${
                isSelected
                  ? "border-[#fc4a27] ring-2 ring-[#fc4a27]/20 shadow-lg scale-[1.01]"
                  : "border-gray-200 hover:border-[#fc4a27]/50 hover:shadow-md"
              }`}
            >
              {/* Template Image Preview */}
              <img
                src={template.image}
                alt={template.name}
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Selection Badge */}
              {isSelected && (
                <div className="absolute inset-0 bg-[#fc4a27]/10 flex items-start justify-end p-2.5">
                  <div className="rounded-full bg-[#fc4a27] p-1.5 text-white shadow-md">
                    <Check className="h-4 w-4 stroke-[3px]" />
                  </div>
                </div>
              )}

              {/* Hover overlay with button */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="bg-white text-gray-900 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md">
                  {isSelected ? "Selected" : "Use Template"}
                </span>
              </div>
            </div>

            <div className="mt-2.5 px-0.5">
              <h3 className="font-bold text-xs text-gray-900 tracking-tight">{template.name}</h3>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-tight">{template.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
