'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Database, CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

export default function SetupPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const initializeDatabase = async () => {
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/db/init', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Database initialized successfully! Admin users have been created.');
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to initialize database');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Database Setup</h1>
            <p className="text-slate-500 mt-2">Initialize your database with admin users</p>
          </div>

          {/* Status Display */}
          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium">Success!</p>
                <p className="text-green-600 text-sm mt-1">{message}</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm mt-1">{message}</p>
              </div>
            </div>
          )}

          {/* Admin Users Info */}
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-sm font-semibold text-slate-700 mb-3">Admin users that will be created:</p>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-slate-100">
                <p className="text-sm text-slate-600">Email: <span className="font-mono font-medium text-slate-800">eugene@gmail.com</span></p>
                <p className="text-sm text-slate-600">Password: <span className="font-mono font-medium text-slate-800">eugene051@</span></p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-100">
                <p className="text-sm text-slate-600">Email: <span className="font-mono font-medium text-slate-800">abdulyusuph051@gmail.com</span></p>
                <p className="text-sm text-slate-600">Password: <span className="font-mono font-medium text-slate-800">Qontetina051@</span></p>
              </div>
            </div>
          </div>

          {/* Initialize Button */}
          {status !== 'success' && (
            <button
              onClick={initializeDatabase}
              disabled={status === 'loading'}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" />
                  Initialize Database
                </>
              )}
            </button>
          )}

          {/* Go to Login Button */}
          {status === 'success' && (
            <button
              onClick={() => router.push('/admin/login')}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              Go to Login
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {/* Footer */}
          <p className="text-center text-slate-400 text-xs mt-6">
            This will create the necessary database tables and admin users
          </p>
        </div>
      </div>
    </div>
  );
}
