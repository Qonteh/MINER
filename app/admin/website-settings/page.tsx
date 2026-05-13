'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Palette, Image as ImageIcon, Building2, Check } from 'lucide-react';
import { broadcastCmsUpdate } from '@/components/cms-live-refresh';

interface Settings {
  id?: number;
  site_title: string;
  site_description: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url: string;
  favicon_url: string;
  font_family: string;
  company_email: string;
  company_phone: string;
  company_address: string;
}

const colorPresets = {
  primary_color: ['#1e3a5f', '#2563eb', '#0f766e', '#7c3aed', '#be123c'],
  secondary_color: ['#1e2b4a', '#1e40af', '#0f172a', '#374151', '#14532d'],
  accent_color: ['#daa520', '#f59e0b', '#84cc16', '#ec4899', '#22d3ee'],
} as const;

const defaultSettings: Settings = {
  site_title: '',
  site_description: '',
  primary_color: '#1e3a5f',
  secondary_color: '#1e40af',
  accent_color: '#daa520',
  logo_url: '',
  favicon_url: '',
  font_family: 'Inter, sans-serif',
  company_email: '',
  company_phone: '',
  company_address: '',
};

function safeText(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function safeColor(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) ? value : fallback;
}

function normalizeSettings(data: Partial<Settings> | null | undefined): Settings {
  return {
    site_title: safeText(data?.site_title, defaultSettings.site_title),
    site_description: safeText(data?.site_description, defaultSettings.site_description),
    primary_color: safeColor(data?.primary_color, defaultSettings.primary_color),
    secondary_color: safeColor(data?.secondary_color, defaultSettings.secondary_color),
    accent_color: safeColor(data?.accent_color, defaultSettings.accent_color),
    logo_url: safeText(data?.logo_url),
    favicon_url: safeText(data?.favicon_url),
    font_family: safeText(data?.font_family, defaultSettings.font_family),
    company_email: safeText(data?.company_email),
    company_phone: safeText(data?.company_phone),
    company_address: safeText(data?.company_address),
  };
}

export default function WebsiteSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/cms/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(normalizeSettings(data));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (field: 'primary_color' | 'secondary_color' | 'accent_color', value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/cms/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed to save settings');

      broadcastCmsUpdate();
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Website Settings</h1>
        <p className="text-slate-500">Customize your website appearance and company information</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-600 text-xs font-bold">!</span>
          </div>
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="w-3 h-3 text-emerald-600" />
          </div>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <div className="flex items-center gap-3 text-white">
              <Building2 className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Site Information</h2>
            </div>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-2 text-sm">Site Title</label>
              <input
                type="text"
                name="site_title"
                value={settings.site_title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                placeholder="Your website title"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-2 text-sm">Site Description</label>
              <textarea
                name="site_description"
                value={settings.site_description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 resize-none"
                placeholder="Brief description of your website"
              />
            </div>
          </div>
        </div>

        {/* Colors Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <div className="flex items-center gap-3 text-white">
              <Palette className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Brand Colors</h2>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Primary Color */}
              <div>
                <label className="block font-semibold text-slate-700 mb-3 text-sm">Primary Color</label>
                <div className="flex gap-2 mb-3">
                  <div className="relative">
                    <input
                      type="color"
                      name="primary_color"
                      value={settings.primary_color}
                      onChange={(e) => handleColorChange('primary_color', e.target.value)}
                      className="w-14 h-14 rounded-xl cursor-pointer border-2 border-slate-200 overflow-hidden"
                    />
                  </div>
                  <input
                    type="text"
                    value={settings.primary_color}
                    readOnly
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-600 font-mono text-sm"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {colorPresets.primary_color.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorChange('primary_color', color)}
                      className={`h-8 w-8 rounded-lg border-2 transition-all hover:scale-110 ${settings.primary_color === color ? 'border-slate-900 ring-2 ring-offset-2 ring-slate-400' : 'border-slate-200'}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block font-semibold text-slate-700 mb-3 text-sm">Secondary Color</label>
                <div className="flex gap-2 mb-3">
                  <div className="relative">
                    <input
                      type="color"
                      name="secondary_color"
                      value={settings.secondary_color}
                      onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                      className="w-14 h-14 rounded-xl cursor-pointer border-2 border-slate-200 overflow-hidden"
                    />
                  </div>
                  <input
                    type="text"
                    value={settings.secondary_color}
                    readOnly
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-600 font-mono text-sm"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {colorPresets.secondary_color.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorChange('secondary_color', color)}
                      className={`h-8 w-8 rounded-lg border-2 transition-all hover:scale-110 ${settings.secondary_color === color ? 'border-slate-900 ring-2 ring-offset-2 ring-slate-400' : 'border-slate-200'}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="block font-semibold text-slate-700 mb-3 text-sm">Accent Color</label>
                <div className="flex gap-2 mb-3">
                  <div className="relative">
                    <input
                      type="color"
                      name="accent_color"
                      value={settings.accent_color}
                      onChange={(e) => handleColorChange('accent_color', e.target.value)}
                      className="w-14 h-14 rounded-xl cursor-pointer border-2 border-slate-200 overflow-hidden"
                    />
                  </div>
                  <input
                    type="text"
                    value={settings.accent_color}
                    readOnly
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-600 font-mono text-sm"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {colorPresets.accent_color.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorChange('accent_color', color)}
                      className={`h-8 w-8 rounded-lg border-2 transition-all hover:scale-110 ${settings.accent_color === color ? 'border-slate-900 ring-2 ring-offset-2 ring-slate-400' : 'border-slate-200'}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Images & Branding Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
            <div className="flex items-center gap-3 text-white">
              <ImageIcon className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Images & Branding</h2>
            </div>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-2 text-sm">Logo URL</label>
                <input
                  type="text"
                  name="logo_url"
                  value={settings.logo_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-2 text-sm">Favicon URL</label>
                <input
                  type="text"
                  name="favicon_url"
                  value={settings.favicon_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-2 text-sm">Font Family</label>
              <input
                type="text"
                name="font_family"
                value={settings.font_family}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                placeholder="Inter, sans-serif"
              />
            </div>
          </div>
        </div>

        {/* Company Information Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
            <div className="flex items-center gap-3 text-white">
              <Building2 className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Company Information</h2>
            </div>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-2 text-sm">Email</label>
                <input
                  type="email"
                  name="company_email"
                  value={settings.company_email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                  placeholder="info@company.com"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-2 text-sm">Phone</label>
                <input
                  type="tel"
                  name="company_phone"
                  value={settings.company_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                  placeholder="+255 738 040 423"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-2 text-sm">Address</label>
              <textarea
                name="company_address"
                value={settings.company_address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 resize-none"
                placeholder="123 Main St, City, Country"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
          <Link
            href="/admin"
            className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-8 rounded-xl transition-all duration-300 text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
