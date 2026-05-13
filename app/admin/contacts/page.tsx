'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Trash2, CheckCircle, ArrowLeft, User, Phone, Building2, Calendar, MessageSquare } from 'lucide-react';

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function ContactsPage() {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const res = await fetch('/api/cms/contacts');
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch('/api/cms/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_read: true }),
      });
      
      setSubmissions(prev =>
        prev.map(s => s.id === id ? { ...s, is_read: true } : s)
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const deleteSubmission = async (id: number) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    setDeleting(true);
    try {
      await fetch('/api/cms/contacts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      setSubmissions(prev => prev.filter(s => s.id !== id));
      setSelectedId(null);
    } catch (err) {
      alert('Failed to delete submission');
    } finally {
      setDeleting(false);
    }
  };

  const selected = submissions.find(s => s.id === selectedId);
  const unreadCount = submissions.filter(s => !s.is_read).length;

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500 font-medium">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Contact Messages</h1>
        <p className="text-slate-500">View and manage visitor inquiries and messages</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-600 text-xs font-bold">!</span>
          </div>
          {error}
        </div>
      )}

      {/* Stats Bar */}
      <div className="mb-6 grid grid-cols-2 sm:flex gap-3">
        <div className="bg-white rounded-xl px-4 py-3 border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs mb-1">Total</p>
          <p className="text-xl font-bold text-slate-800">{submissions.length}</p>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl px-4 py-3 border border-amber-100">
          <p className="text-amber-600 text-xs mb-1">Unread</p>
          <p className="text-xl font-bold text-amber-700">{unreadCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <h3 className="font-semibold text-slate-700">All Messages</h3>
            </div>
            <div className="max-h-[500px] lg:max-h-[600px] overflow-y-auto">
              {submissions.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">No messages yet</p>
                  <p className="text-slate-400 text-sm mt-1">Messages from your website will appear here</p>
                </div>
              ) : (
                submissions.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedId(sub.id);
                      if (!sub.is_read) markAsRead(sub.id);
                    }}
                    className={`
                      w-full text-left p-4 border-b border-slate-100 hover:bg-blue-50/50 transition-colors
                      ${selectedId === sub.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
                      ${!sub.is_read ? 'bg-amber-50/50' : ''}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {!sub.is_read && (
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-2 flex-shrink-0 animate-pulse"></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{sub.name}</p>
                        <p className="text-xs text-slate-500 truncate">{sub.email}</p>
                        {sub.subject && (
                          <p className="text-xs text-slate-400 mt-1 truncate">{sub.subject}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(sub.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Detail Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-white">
                    <h2 className="text-xl font-bold">{selected.name}</h2>
                    <p className="text-blue-100 text-sm">{selected.email}</p>
                  </div>
                  <div className="flex gap-2">
                    {!selected.is_read && (
                      <button
                        onClick={() => markAsRead(selected.id)}
                        className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Mark Read</span>
                      </button>
                    )}
                    <button
                      onClick={() => deleteSubmission(selected.id)}
                      disabled={deleting}
                      className="bg-red-500/80 hover:bg-red-500 disabled:bg-slate-400 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {selected.phone && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Phone className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Phone</p>
                        <p className="font-medium text-slate-800">{selected.phone}</p>
                      </div>
                    </div>
                  )}
                  {selected.company && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Company</p>
                        <p className="font-medium text-slate-800">{selected.company}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Received</p>
                      <p className="font-medium text-slate-800">{new Date(selected.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                {selected.subject && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-slate-700 mb-2 text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Subject
                    </h3>
                    <p className="text-slate-800 font-medium">{selected.subject}</p>
                  </div>
                )}

                {/* Message */}
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-700 mb-2 text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Message
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                  </div>
                </div>

                {/* Reply CTA */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Reply via email:</strong> Click the email below to send a response
                  </p>
                  <a 
                    href={`mailto:${selected.email}`}
                    className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {selected.email}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                <Mail className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-500 text-lg font-medium mb-2">Select a message</p>
              <p className="text-slate-400 text-sm">Click on a message from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
