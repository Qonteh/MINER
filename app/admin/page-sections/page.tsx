'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, EyeOff, Edit3, X, Check, FileText } from 'lucide-react';
import { broadcastCmsUpdate } from '@/components/cms-live-refresh';

interface PageSection {
  id: number;
  section_name: string;
  section_key: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  button_text: string;
  button_url: string;
  is_visible: boolean;
  order_index: number;
}

export default function PageSectionsPage() {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editForm, setEditForm] = useState<Partial<PageSection>>({});

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const res = await fetch('/api/cms/sections');
      if (res.ok) {
        const data = await res.json();
        setSections(data);
      }
    } catch (err) {
      setError('Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (section: PageSection) => {
    setEditingId(section.id);
    setEditForm(section);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm(prev => ({
      ...prev,
      is_visible: e.target.checked,
    }));
  };

  const handleSave = async () => {
    if (!editingId) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/cms/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error('Failed to save');

      const updated = await res.json();
      setSections(prev => prev.map(s => s.id === updated.id ? updated : s));
      broadcastCmsUpdate();
      setSuccess('Section updated successfully!');
      setEditingId(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async (section: PageSection) => {
    setSaving(true);
    try {
      const res = await fetch('/api/cms/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...section,
          is_visible: !section.is_visible,
        }),
      });

      if (!res.ok) throw new Error('Failed to update');

      const updated = await res.json();
      setSections(prev => prev.map(s => s.id === updated.id ? updated : s));
      broadcastCmsUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500 font-medium">Loading sections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Page Sections</h1>
        <p className="text-slate-500">Edit content for each section on your landing page</p>
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

      {/* Sections List */}
      <div className="space-y-4">
        {sections.map(section => (
          <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {editingId === section.id ? (
              /* Edit Mode */
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 sm:px-6 py-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <Edit3 className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Editing: {section.section_name}</h3>
                    </div>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-2 text-sm">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={editForm.title || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-2 text-sm">Subtitle</label>
                      <input
                        type="text"
                        name="subtitle"
                        value={editForm.subtitle || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-2 text-sm">Description</label>
                    <textarea
                      name="description"
                      value={editForm.description || ''}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-2 text-sm">Image URL</label>
                      <input
                        type="text"
                        name="image_url"
                        value={editForm.image_url || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-2 text-sm">Button Text</label>
                      <input
                        type="text"
                        name="button_text"
                        value={editForm.button_text || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-2 text-sm">Button URL</label>
                    <input
                      type="text"
                      name="button_url"
                      value={editForm.button_url || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={editForm.is_visible !== false}
                        onChange={handleCheckboxChange}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-slate-700">Visible on website</span>
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800">{section.section_name}</h3>
                      <p className="text-slate-400 text-sm font-mono">Key: {section.section_key}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleVisibility(section)}
                    disabled={saving}
                    className={`
                      inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all
                      ${section.is_visible
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }
                    `}
                  >
                    {section.is_visible ? (
                      <>
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span className="hidden sm:inline">Hidden</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
                  <p><span className="font-semibold text-slate-600">Title:</span> <span className="text-slate-800">{section.title || '(not set)'}</span></p>
                  <p><span className="font-semibold text-slate-600">Subtitle:</span> <span className="text-slate-800">{section.subtitle || '(not set)'}</span></p>
                  <p><span className="font-semibold text-slate-600">Description:</span> <span className="text-slate-800">{section.description ? section.description.substring(0, 100) + '...' : '(not set)'}</span></p>
                  {section.image_url && <p><span className="font-semibold text-slate-600">Image:</span> <span className="text-slate-800 break-all">{section.image_url.substring(0, 50)}...</span></p>}
                  {section.button_text && <p><span className="font-semibold text-slate-600">Button:</span> <span className="text-slate-800">{section.button_text}</span></p>}
                </div>
                
                <button
                  onClick={() => startEdit(section)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Section
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
