'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Save, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Profile form
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  
  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Messages
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setUsername(data.username);
        setEmail(data.email);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setSaving(true);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        setProfile(prev => prev ? { ...prev, username, email } : null);
      } else {
        setProfileMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'An error occurred while updating profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'An error occurred while changing password' });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">Profile Settings</h1>
        <p className="text-slate-500">Manage your account settings and change your password</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Information Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Profile Information</h2>
                <p className="text-sm text-slate-500">Update your account details</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {profileMessage && (
              <div className={`flex items-center gap-3 p-4 rounded-xl ${
                profileMessage.type === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {profileMessage.type === 'success' 
                  ? <CheckCircle className="h-5 w-5 text-green-600" />
                  : <AlertCircle className="h-5 w-5 text-red-600" />
                }
                <p className={profileMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                  {profileMessage.text}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Change Password</h2>
                <p className="text-sm text-slate-500">Keep your account secure with a strong password</p>
              </div>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="p-6 space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {passwordMessage && (
              <div className={`flex items-center gap-3 p-4 rounded-xl ${
                passwordMessage.type === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {passwordMessage.type === 'success' 
                  ? <CheckCircle className="h-5 w-5 text-green-600" />
                  : <AlertCircle className="h-5 w-5 text-red-600" />
                }
                <p className={passwordMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                  {passwordMessage.text}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={changingPassword}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 transition-all disabled:opacity-50"
              >
                {changingPassword ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Changing...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Account Info Card */}
        {profile && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Account Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Account Created</p>
                <p className="font-medium text-slate-800">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">User ID</p>
                <p className="font-medium font-mono text-slate-800">#{profile.id}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
