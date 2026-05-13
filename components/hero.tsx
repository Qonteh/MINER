import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Diamond, Shield, Globe, Leaf } from "lucide-react"
import type { CmsSection } from "@/lib/cms"

const trustBadges = [
  { icon: Diamond, label: "PREMIUM", sublabel: "QUALITY" },
  { icon: Shield, label: "TRUSTED", sublabel: "PARTNER" },
  { icon: Globe, label: "GLOBAL", sublabel: "NETWORK" },
  { icon: Leaf, label: "ETHICAL &", sublabel: "SUSTAINABLE" },
]

interface HeroProps {
  section?: CmsSection
}

export function Hero({ section }: HeroProps) {
  const subtitle = section?.subtitle || "GLOBAL MINERAL SOLUTIONS"
  const title = section?.title || "CONNECTING MINERALS. POWERING POSSIBILITIES."
  const description = section?.description || "AXXEN International is a trusted mineral dealer delivering premium quality minerals with integrity, reliability, and global excellence."
  const imageUrl = section?.image_url || "/images/hero-mineral.jpg"
  const buttonText = section?.button_text || "Explore Minerals"
  const buttonUrl = section?.button_url || "#minerals"

  return (
    <section id="home" className="relative min-h-screen pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
      
      {/* Main Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-primary font-semibold tracking-widest text-sm animate-fade-up">
                {subtitle}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-up stagger-1">
                {title}
              </h1>
              <p className="text-muted-foreground text-lg max-w-lg leading-relaxed animate-fade-up stagger-2">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 animate-fade-up stagger-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground group relative overflow-hidden">
                <Link href={buttonUrl}>
                  <span className="relative z-10">{buttonText}</span>
                  <span className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border hover:border-primary hover:bg-primary/10 text-foreground">
                <Link href="#about">About Us</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border animate-fade-up stagger-4">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <badge.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{badge.label}</p>
                    <p className="text-xs text-muted-foreground">{badge.sublabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-fade-in stagger-2">
            <div className="relative aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl glow-blue">
              <Image
                src={imageUrl}
                alt="Premium Amethyst Crystal"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-transparent to-transparent" />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -left-4 md:bottom-8 md:-left-8 bg-card p-4 md:p-6 rounded-xl shadow-xl border border-border backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">RARE BY NATURE.</p>
              <p className="text-sm font-bold text-foreground">VALUABLE BY TRUST.</p>
              <div className="mt-2 h-0.5 w-12 bg-primary" />
            </div>

            {/* Top floating element */}
            <div className="absolute -top-4 -right-4 md:top-8 md:-right-8 bg-primary p-4 rounded-xl shadow-xl">
              <p className="text-2xl font-bold text-primary-foreground">15+</p>
              <p className="text-xs text-primary-foreground/80">Years of Trust</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
