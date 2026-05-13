'use client';

import Link from 'next/link';
import { ArrowLeft, BarChart3, TrendingUp, Users, Globe, Clock } from 'lucide-react';

export default function AnalyticsPage() {
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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Analytics</h1>
        <p className="text-slate-500">Track website performance and visitor statistics</p>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 sm:p-12 text-white text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
          <BarChart3 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Analytics Coming Soon</h2>
        <p className="text-emerald-100 max-w-md mx-auto">
          We are working on a comprehensive analytics dashboard to help you track your website performance, visitor behavior, and more.
        </p>
      </div>

      {/* Preview Cards */}
      <h3 className="text-lg font-semibold text-slate-700 mb-4">What to expect</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="p-3 bg-blue-50 rounded-xl w-fit mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-slate-800 mb-1">Visitor Tracking</h4>
          <p className="text-slate-500 text-sm">Track unique visitors and page views</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="p-3 bg-emerald-50 rounded-xl w-fit mb-4">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
          <h4 className="font-semibold text-slate-800 mb-1">Traffic Trends</h4>
          <p className="text-slate-500 text-sm">View traffic patterns over time</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="p-3 bg-amber-50 rounded-xl w-fit mb-4">
            <Globe className="w-6 h-6 text-amber-600" />
          </div>
          <h4 className="font-semibold text-slate-800 mb-1">Geographic Data</h4>
          <p className="text-slate-500 text-sm">See where your visitors come from</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="p-3 bg-purple-50 rounded-xl w-fit mb-4">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-slate-800 mb-1">Real-time Stats</h4>
          <p className="text-slate-500 text-sm">Monitor activity in real-time</p>
        </div>
      </div>
    </div>
  );
}
