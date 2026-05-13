import { Globe2, Package, Users, Award } from "lucide-react"

const stats = [
  { icon: Globe2, value: "20+", label: "COUNTRIES", sublabel: "SERVED" },
  { icon: Package, value: "100+", label: "MINERAL", sublabel: "PRODUCTS" },
  { icon: Users, value: "500+", label: "TRUSTED", sublabel: "CLIENTS" },
  { icon: Award, value: "100%", label: "QUALITY", sublabel: "COMMITMENT" },
]

export function Stats() {
  return (
    <section className="py-20 relative overflow-hidden bg-card border-y border-border">
      {/* Decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="p-4 bg-primary/10 rounded-2xl mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/10">
                <stat.icon className="h-7 w-7 text-primary" />
              </div>
              <p className="text-4xl md:text-5xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-xs text-primary font-semibold tracking-wider">{stat.label}</p>
              <p className="text-xs text-muted-foreground tracking-wider">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
