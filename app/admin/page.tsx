'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Settings, FileText, BarChart3, TrendingUp, Users, Globe, ArrowRight } from 'lucide-react';

interface Stats {
  totalContacts: number;
  unreadContacts: number;
  sections: number;
  siteTitle: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalContacts: 0,
    unreadContacts: 0,
    sections: 0,
    siteTitle: 'Loading...',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [settingsRes, sectionsRes, contactsRes] = await Promise.all([
          fetch('/api/cms/settings'),
          fetch('/api/cms/sections'),
          fetch('/api/cms/contacts'),
        ]);

        const settings = await settingsRes.json();
        const sections = await sectionsRes.json();
        const contacts = await contactsRes.json();

        const unreadCount = contacts.filter((c: any) => !c.is_read).length;

        setStats({
          totalContacts: contacts.length,
          unreadContacts: unreadCount,
          sections: sections.length,
          siteTitle: settings.site_title || 'AXXEN International',
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const cards = [
    {
      icon: Settings,
      title: 'Website Settings',
      description: 'Customize colors, fonts, images, and company information',
      href: '/admin/website-settings',
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-400/20',
      stat: 'Configure',
    },
    {
      icon: FileText,
      title: 'Page Sections',
      description: 'Edit content for hero, about, services and more',
      href: '/admin/page-sections',
      gradient: 'from-indigo-500 to-purple-600',
      iconBg: 'bg-indigo-400/20',
      stat: `${stats.sections} sections`,
    },
    {
      icon: Mail,
      title: 'Contact Messages',
      description: 'View and manage visitor inquiries and messages',
      href: '/admin/contacts',
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-400/20',
      stat: stats.unreadContacts > 0 ? `${stats.unreadContacts} new` : 'All read',
      badge: stats.unreadContacts > 0,
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Track website performance and visitor statistics',
      href: '/admin/analytics',
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-400/20',
      stat: 'Coming soon',
    },
  ];

  const quickStats = [
    { label: 'Total Messages', value: stats.totalContacts, icon: Mail, color: 'text-blue-600' },
    { label: 'Unread', value: stats.unreadContacts, icon: TrendingUp, color: 'text-amber-600' },
    { label: 'Active Sections', value: stats.sections, icon: FileText, color: 'text-emerald-600' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
              Welcome back, Admin
            </h1>
            <p className="text-slate-500 text-sm sm:text-base">
              Manage your AXXEN International website content and settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 sm:h-14 sm:w-14">
              <Image
                src="/logo.png"
                alt="AXXEN"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-24 mb-3"></div>
              <div className="h-8 bg-slate-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                    <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-slate-50`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-100 rounded-2xl p-8 animate-pulse h-48"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group relative"
              >
                <div className={`
                  relative overflow-hidden rounded-2xl p-6 sm:p-8 
                  bg-gradient-to-br ${card.gradient} 
                  text-white shadow-lg 
                  hover:shadow-xl hover:scale-[1.02] 
                  transition-all duration-300 ease-out
                  h-full min-h-[180px]
                `}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/20"></div>
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full bg-white/10"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${card.iconBg}`}>
                        <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                      </div>
                      <div className="flex items-center gap-2">
                        {card.badge && (
                          <span className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                          </span>
                        )}
                        <span className="text-xs sm:text-sm bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium">
                          {card.stat}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2">{card.title}</h3>
                    <p className="text-white/80 text-sm sm:text-base mb-4">{card.description}</p>
                    <div className="flex items-center text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                      <span>Open</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Quick Tips */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-xl hidden sm:block">
            <Globe className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-3 text-lg">Quick Tips</h3>
            <ul className="text-blue-800 space-y-2 text-sm sm:text-base">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Website Settings:</strong> Update your site colors, fonts, and company information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Page Sections:</strong> Edit content for each section like Hero, About, Services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Contact Messages:</strong> View and manage emails from your website visitors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Live Updates:</strong> All changes are saved to the database and reflect live on your website</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
