'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Mail, 
  BarChart3,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [isLoginPage]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="relative h-16 w-16 mx-auto mb-4">
            <Image
              src="/logo.png"
              alt="AXXEN International"
              fill
              className="object-contain animate-pulse"
            />
          </div>
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground font-medium">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/website-settings', icon: Settings, label: 'Website Settings' },
    { href: '/admin/page-sections', icon: FileText, label: 'Page Sections' },
    { href: '/admin/contacts', icon: Mail, label: 'Contacts' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative h-full z-50
          ${sidebarOpen ? 'w-72' : 'w-20'} 
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-primary
          text-white transition-all duration-300 ease-in-out
          shadow-2xl
        `}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative h-10 w-10 bg-white rounded-lg p-1 shadow-lg">
              <Image
                src="/logo.png"
                alt="AXXEN"
                fill
                className="object-contain"
              />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-wide">AXXEN</span>
                <span className="text-[10px] text-blue-200 tracking-[0.15em] -mt-0.5">ADMIN PANEL</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden lg:flex"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${active 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }
                  ${!sidebarOpen && 'justify-center px-2'}
                `}
              >
                <Icon size={20} className={active ? 'text-blue-200' : ''} />
                {sidebarOpen && (
                  <>
                    <span className="font-medium flex-1">{item.label}</span>
                    {active && <ChevronRight size={16} className="text-blue-200" />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* View Site Link */}
        <div className="p-3 border-t border-white/10">
          <Link
            href="/"
            target="_blank"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              bg-gradient-to-r from-blue-500/20 to-cyan-500/20 
              text-blue-100 hover:from-blue-500/30 hover:to-cyan-500/30 hover:text-white
              ${!sidebarOpen && 'justify-center px-2'}
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            {sidebarOpen && <span className="font-medium">View Website</span>}
          </Link>
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              text-red-300 hover:bg-red-500/20 hover:text-red-200
              ${!sidebarOpen && 'justify-center px-2'}
            `}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={24} className="text-slate-600" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold text-slate-800">
                {pathname === '/admin' && 'Dashboard'}
                {pathname === '/admin/website-settings' && 'Website Settings'}
                {pathname === '/admin/page-sections' && 'Page Sections'}
                {pathname === '/admin/contacts' && 'Contact Submissions'}
                {pathname === '/admin/analytics' && 'Analytics'}
              </h2>
              <p className="text-sm text-slate-500">AXXEN International CMS</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-600">System Online</span>
            </div>
            <div className="relative h-8 w-8 lg:h-10 lg:w-10">
              <Image
                src="/logo.png"
                alt="AXXEN"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
