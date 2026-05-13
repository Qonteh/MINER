import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, CheckCircle, Truck } from "lucide-react"
import type { CmsSection } from "@/lib/cms"

const features = [
  {
    icon: Leaf,
    title: "ETHICAL SOURCING",
    description: "Responsibly sourced minerals with full traceability.",
  },
  {
    icon: CheckCircle,
    title: "QUALITY ASSURED",
    description: "Rigorous quality control for international standards.",
  },
  {
    icon: Truck,
    title: "RELIABLE SUPPLY",
    description: "Consistent supply chain and on-time global delivery.",
  },
]

interface AboutProps {
  section?: CmsSection
}

export function About({ section }: AboutProps) {
  const title = section?.title || "ABOUT AXXEN INTERNATIONAL"
  const subtitle = section?.subtitle || "Who We Are"
  const description =
    section?.description ||
    "We source, trade, and supply high-quality minerals to industries worldwide. Our commitment to ethical sourcing, quality assurance, and long-term partnerships sets us apart in the global market."
  const imageUrl = section?.image_url || "/images/amethyst.jpg"
  const buttonText = section?.button_text || "Learn More"
  const buttonUrl = section?.button_url || "#services"

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <p className="text-primary font-semibold tracking-widest text-sm mb-4">
                {title}
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
                {subtitle}
              </h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {description}
            </p>
            <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent" />
            <Button asChild className="bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground group transition-all duration-300">
              <Link href={buttonUrl}>
                <span>{buttonText}</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </Button>
          </div>

          {/* Right Content with Image and Feature Cards */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl glow-blue">
              <Image
                src={imageUrl}
                alt="Premium Amethyst Crystal"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            </div>

            {/* Feature Cards - Overlapping */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 space-y-4 hidden md:block">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card/95 backdrop-blur-sm p-5 rounded-xl shadow-xl border border-border max-w-[260px] hover:border-primary/40 transition-all duration-300 card-hover group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-primary/10 rounded-xl shrink-0 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground tracking-wide">{feature.title}</p>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Feature Cards */}
            <div className="grid grid-cols-1 gap-4 mt-8 md:hidden">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card p-5 rounded-xl border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{feature.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
