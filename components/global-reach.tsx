import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { CmsSection } from "@/lib/cms"

interface GlobalReachProps {
  section?: CmsSection
}

export function GlobalReach({ section }: GlobalReachProps) {
  const title = section?.title || "GLOBAL REACH"
  const subtitle = section?.subtitle || "DELIVERING VALUE ACROSS THE WORLD."
  const description =
    section?.description ||
    "With a strong global network, we connect quality minerals from reliable sources to industries that build the future. From our base in Tanzania, we reach every corner of the globe."
  const buttonText = section?.button_text || "Our Global Reach"
  const buttonUrl = section?.button_url || "#contact"

  return (
    <section id="global" className="py-24 relative overflow-hidden bg-secondary">
      {/* Background Pattern - World Map Dots */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* World map dots pattern */}
          <g fill="currentColor" className="text-primary">
            {/* North America */}
            <circle cx="150" cy="120" r="4" />
            <circle cx="170" cy="130" r="3" />
            <circle cx="190" cy="125" r="4" />
            <circle cx="160" cy="140" r="3" />
            <circle cx="180" cy="145" r="4" />
            <circle cx="140" cy="150" r="3" />
            <circle cx="120" cy="135" r="2" />
            <circle cx="200" cy="135" r="3" />
            {/* South America */}
            <circle cx="220" cy="220" r="4" />
            <circle cx="230" cy="240" r="3" />
            <circle cx="225" cy="260" r="4" />
            <circle cx="210" cy="280" r="3" />
            <circle cx="240" cy="250" r="3" />
            {/* Europe */}
            <circle cx="400" cy="110" r="4" />
            <circle cx="420" cy="115" r="3" />
            <circle cx="440" cy="120" r="4" />
            <circle cx="410" cy="130" r="3" />
            <circle cx="430" cy="135" r="4" />
            <circle cx="380" cy="125" r="3" />
            <circle cx="460" cy="130" r="3" />
            {/* Africa - Highlight Tanzania */}
            <circle cx="420" cy="200" r="4" />
            <circle cx="440" cy="210" r="4" />
            <circle cx="450" cy="230" r="8" className="text-primary animate-pulse" />
            <circle cx="430" cy="250" r="4" />
            <circle cx="420" cy="270" r="3" />
            <circle cx="400" cy="240" r="3" />
            <circle cx="460" cy="250" r="3" />
            {/* Asia */}
            <circle cx="550" cy="130" r="4" />
            <circle cx="580" cy="140" r="3" />
            <circle cx="610" cy="150" r="4" />
            <circle cx="640" cy="145" r="4" />
            <circle cx="570" cy="160" r="3" />
            <circle cx="600" cy="170" r="4" />
            <circle cx="520" cy="150" r="3" />
            <circle cx="660" cy="160" r="3" />
            {/* Australia */}
            <circle cx="650" cy="280" r="4" />
            <circle cx="670" cy="290" r="4" />
            <circle cx="680" cy="275" r="3" />
            <circle cx="640" cy="295" r="3" />
          </g>
          {/* Connection lines from Tanzania (450,230) to other continents */}
          <g stroke="currentColor" strokeWidth="1.5" className="text-primary" opacity="0.5">
            <line x1="450" y1="230" x2="170" y2="130" strokeDasharray="4,4" />
            <line x1="450" y1="230" x2="420" y2="115" strokeDasharray="4,4" />
            <line x1="450" y1="230" x2="580" y2="140" strokeDasharray="4,4" />
            <line x1="450" y1="230" x2="220" y2="220" strokeDasharray="4,4" />
            <line x1="450" y1="230" x2="650" y2="280" strokeDasharray="4,4" />
          </g>
        </svg>
      </div>

      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <p className="text-primary font-semibold tracking-widest text-sm mb-4">
              {title}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight mb-6">
              {subtitle}
            </h2>
            <p className="text-secondary-foreground/70 text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {description}
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground group">
              <Link href={buttonUrl}>
                {buttonText}
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </Button>
          </div>

          {/* Right - Stats Grid */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-secondary-foreground/5 backdrop-blur-sm rounded-2xl p-6 border border-secondary-foreground/10 hover:border-primary/30 transition-all card-hover group">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">6</p>
              <p className="text-secondary-foreground/70 text-sm">Continents Covered</p>
              <div className="h-1 w-12 bg-primary/30 rounded-full mt-3 group-hover:w-full group-hover:bg-primary/50 transition-all duration-500" />
            </div>
            <div className="bg-secondary-foreground/5 backdrop-blur-sm rounded-2xl p-6 border border-secondary-foreground/10 hover:border-primary/30 transition-all card-hover group">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">50+</p>
              <p className="text-secondary-foreground/70 text-sm">Partner Companies</p>
              <div className="h-1 w-12 bg-primary/30 rounded-full mt-3 group-hover:w-full group-hover:bg-primary/50 transition-all duration-500" />
            </div>
            <div className="bg-secondary-foreground/5 backdrop-blur-sm rounded-2xl p-6 border border-secondary-foreground/10 hover:border-primary/30 transition-all card-hover group">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">24/7</p>
              <p className="text-secondary-foreground/70 text-sm">Global Support</p>
              <div className="h-1 w-12 bg-primary/30 rounded-full mt-3 group-hover:w-full group-hover:bg-primary/50 transition-all duration-500" />
            </div>
            <div className="bg-secondary-foreground/5 backdrop-blur-sm rounded-2xl p-6 border border-secondary-foreground/10 hover:border-primary/30 transition-all card-hover group">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">15+</p>
              <p className="text-secondary-foreground/70 text-sm">Years Experience</p>
              <div className="h-1 w-12 bg-primary/30 rounded-full mt-3 group-hover:w-full group-hover:bg-primary/50 transition-all duration-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
