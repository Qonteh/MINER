"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X, MapPin, Award, Gem, Scale, Sparkles, Shield, ArrowRight } from "lucide-react"
import type { CmsSection } from "@/lib/cms"

const minerals = [
  {
    name: "Tanzanite",
    quality: "Premium Quality",
    image: "/images/amethyst.jpg",
    origin: "Tanzania",
    description: "Tanzanite is a rare and valuable gemstone found exclusively in the Mererani Hills of Tanzania. Known for its stunning blue-violet color, it is one of the most sought-after gems in the world.",
    properties: {
      hardness: "6.5 - 7 Mohs",
      color: "Blue-Violet",
      clarity: "Eye Clean to VVS",
      cut: "Various Cuts Available"
    },
    uses: ["Fine Jewelry", "Investment Gems", "Collector Items"],
    certification: "GIA Certified Available",
    priceRange: "Premium Tier"
  },
  {
    name: "Gold Ore",
    quality: "Pure & Refined",
    image: "/images/gold-ore.jpg",
    origin: "East Africa",
    description: "High-quality gold ore sourced from verified mines across East Africa. Our gold meets international purity standards and comes with complete documentation.",
    properties: {
      purity: "22K - 24K",
      form: "Ore, Nuggets, Bars",
      weight: "Custom Weights",
      certification: "Assay Certified"
    },
    uses: ["Jewelry Manufacturing", "Investment", "Industrial Applications"],
    certification: "LBMA Standards",
    priceRange: "Market Rate"
  },
  {
    name: "Quartz",
    quality: "High Grade",
    image: "/images/quartz.jpg",
    origin: "Tanzania",
    description: "Premium quality quartz crystals with exceptional clarity. Our quartz is sourced from pristine deposits and is perfect for both industrial and decorative applications.",
    properties: {
      hardness: "7 Mohs",
      color: "Clear to Rose",
      clarity: "High Transparency",
      form: "Crystals & Clusters"
    },
    uses: ["Electronics", "Jewelry", "Healing Crystals", "Decorative"],
    certification: "Quality Assured",
    priceRange: "Competitive"
  },
  {
    name: "Sapphire",
    quality: "Natural & Premium",
    image: "/images/sapphire.jpg",
    origin: "East Africa",
    description: "Natural sapphires with vivid blue coloration. Each stone is carefully selected for its exceptional color saturation and clarity.",
    properties: {
      hardness: "9 Mohs",
      color: "Royal Blue",
      clarity: "Eye Clean",
      treatment: "Heat Treated / Untreated"
    },
    uses: ["Fine Jewelry", "Engagement Rings", "Collector Gems"],
    certification: "GIA / AGL Available",
    priceRange: "Premium Tier"
  },
  {
    name: "Emerald",
    quality: "High Concentrate",
    image: "/images/emerald.jpg",
    origin: "Tanzania",
    description: "Stunning green emeralds with excellent color and clarity. Our emeralds are ethically sourced and come with full provenance documentation.",
    properties: {
      hardness: "7.5 - 8 Mohs",
      color: "Vivid Green",
      clarity: "Slightly Included",
      origin: "Tanzanian Origin"
    },
    uses: ["Fine Jewelry", "Investment", "Collector Items"],
    certification: "GIA Certified Available",
    priceRange: "Premium Tier"
  },
]

interface MineralsProps {
  section?: CmsSection
}

export function Minerals({ section }: MineralsProps) {
  const [selectedMineral, setSelectedMineral] = useState<typeof minerals[0] | null>(null)
  
  const title = section?.title || "OUR MINERALS"
  const subtitle = section?.subtitle || "PREMIUM MINERALS. GLOBAL DEMAND."
  const buttonText = section?.button_text || "View All Minerals"
  const buttonUrl = section?.button_url || "#contact"
  const heroImage = section?.image_url

  const displayMinerals = heroImage
    ? minerals.map((item, index) => (index === 0 ? { ...item, image: heroImage } : item))
    : minerals

  return (
    <>
      <section id="minerals" className="py-24 relative overflow-hidden bg-secondary">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <p className="text-primary font-semibold tracking-widest text-sm mb-4">
                {title}
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
                {subtitle}
              </h2>
            </div>
            <Button asChild className="bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground self-start md:self-auto group transition-all duration-300">
              <Link href={buttonUrl}>
                <span>{buttonText}</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </Button>
          </div>

          {/* Minerals Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {displayMinerals.map((mineral, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all duration-500 card-hover cursor-pointer"
                onClick={() => setSelectedMineral(mineral)}
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={mineral.image}
                    alt={mineral.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-transparent" />
                  
                  {/* Shimmer on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <p className="text-primary text-xs font-bold tracking-wider">{mineral.name.toUpperCase()}</p>
                  </div>
                  <p className="text-white/70 text-xs mb-1">{mineral.quality}</p>
                  <p className="text-white/50 text-[10px]">Origin: {mineral.origin}</p>
                  <button 
                    className="inline-flex items-center text-xs text-white/60 mt-3 group-hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedMineral(mineral)
                    }}
                  >
                    VIEW DETAILS
                    <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedMineral && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedMineral(null)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedMineral(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Image Section */}
              <div className="relative aspect-square md:aspect-auto md:h-full min-h-[300px]">
                <Image
                  src={selectedMineral.image}
                  alt={selectedMineral.name}
                  fill
                  className="object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r" />
                
                {/* Floating Badge */}
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold shadow-lg">
                    <Sparkles className="h-4 w-4" />
                    {selectedMineral.quality}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-2">
                    <MapPin className="h-4 w-4" />
                    {selectedMineral.origin}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-primary mb-3">
                    {selectedMineral.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedMineral.description}
                  </p>
                </div>

                {/* Properties */}
                <div className="bg-gray-50 rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-primary font-semibold mb-4">
                    <Gem className="h-5 w-5" />
                    Properties
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedMineral.properties).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{key}</p>
                        <p className="text-sm font-medium text-gray-800">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Uses */}
                <div>
                  <div className="flex items-center gap-2 text-primary font-semibold mb-3">
                    <Scale className="h-5 w-5" />
                    Applications
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMineral.uses.map((use, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full font-medium"
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certification & Price */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Award className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase">Certification</span>
                    </div>
                    <p className="text-sm text-gray-700">{selectedMineral.certification}</p>
                  </div>
                  <div className="flex-1 p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Shield className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase">Price Range</span>
                    </div>
                    <p className="text-sm text-gray-700">{selectedMineral.priceRange}</p>
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  asChild 
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-xl shadow-lg shadow-primary/25"
                >
                  <Link href="#contact" onClick={() => setSelectedMineral(null)}>
                    <span>Inquire About {selectedMineral.name}</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
