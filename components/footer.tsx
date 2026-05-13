import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import type { CmsSettings } from "@/lib/cms"

const quickLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About Us" },
  { href: "#minerals", label: "Our Minerals" },
  { href: "#services", label: "Services" },
  { href: "#global", label: "Global Reach" },
  { href: "#contact", label: "Contact" },
]

const minerals = [
  "Tanzanite",
  "Gold Ore",
  "Chromite",
  "Kyanite",
  "Copper Ore",
  "Ruby",
]

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
]

interface FooterProps {
  settings?: CmsSettings
}

export function Footer({ settings }: FooterProps) {
  const brandName = settings?.site_title?.split('|')[0]?.trim() || "AXXEN"

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-14 w-14 bg-white rounded-lg p-1">
                <Image
                  src="/logo.png"
                  alt="AXXEN International Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-wide">{brandName.toUpperCase()}</span>
                <span className="text-[10px] text-white/70 tracking-[0.2em] -mt-1 font-medium">INTERNATIONAL GROUP</span>
              </div>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              {settings?.site_description || "Your trusted partner for premium quality minerals. Delivering excellence worldwide since 2009."}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2.5 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all group"
                >
                  <social.icon className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-white/50 rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-white/40 rounded-full group-hover:bg-white transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Minerals */}
          <div>
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-white/50 rounded-full" />
              Our Minerals
            </h3>
            <ul className="space-y-3">
              {minerals.map((mineral, index) => (
                <li key={index}>
                  <Link
                    href="#minerals"
                    className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-white/40 rounded-full group-hover:bg-white transition-colors" />
                    {mineral}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-white/50 rounded-full" />
              Contact Info
            </h3>
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                <p className="text-xs text-white/60 font-semibold mb-1">ADDRESS</p>
                <p className="text-white/90">{settings?.company_address || "Dar es Salaam, Tanzania"}</p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                <p className="text-xs text-white/60 font-semibold mb-1">PHONE</p>
                <p className="text-white/90">{settings?.company_phone || "+255 738 040 423"}</p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                <p className="text-xs text-white/60 font-semibold mb-1">EMAIL</p>
                <p className="text-white/90">{settings?.company_email || "info@axxeninternational.com"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} AXXEN International. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-white/60 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-white/60 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
