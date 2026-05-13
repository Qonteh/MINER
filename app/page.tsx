import type { Metadata } from 'next'
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Stats } from "@/components/stats"
import { About } from "@/components/about"
import { Minerals } from "@/components/minerals"
import { Services } from "@/components/services"
import { GlobalReach } from "@/components/global-reach"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { CmsLiveRefresh } from "@/components/cms-live-refresh"
import { getCmsPayload } from "@/lib/cms"

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getCmsPayload()
  return {
    title: settings.site_title,
    description: settings.site_description,
  }
}

export default async function Home() {
  const { settings, sections } = await getCmsPayload()

  return (
    <main
      className="min-h-screen"
      style={{
        ['--primary' as string]: settings.primary_color,
        ['--secondary' as string]: settings.secondary_color,
        ['--accent' as string]: settings.accent_color,
        ['--font-sans' as string]: settings.font_family,
      }}
    >
      <CmsLiveRefresh />
      <Header siteTitle={settings.site_title} />
      {sections.hero?.is_visible !== false && <Hero section={sections.hero} />}
      <Stats />
      {sections.about?.is_visible !== false && <About section={sections.about} />}
      {sections.minerals?.is_visible !== false && <Minerals section={sections.minerals} />}
      {sections.services?.is_visible !== false && <Services section={sections.services} />}
      {sections['global-reach']?.is_visible !== false && <GlobalReach section={sections['global-reach']} />}
      {sections.contact?.is_visible !== false && (
        <Contact section={sections.contact} settings={settings} />
      )}
      <Footer settings={settings} />
    </main>
  )
}
