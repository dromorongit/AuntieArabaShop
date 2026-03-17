'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Lock, Unlock, Clock, Image as ImageIcon, 
  Save, Loader2, Check, X, Upload
} from 'lucide-react';

interface SiteSettings {
  siteLocked: boolean;
  lockHeading: string;
  lockMessage: string;
  enableCountdown: boolean;
  countdownDateTime: string;
  backgroundImage: string;
}

const defaultSettings: SiteSettings = {
  siteLocked: false,
  lockHeading: 'We Are Coming Soon',
  lockMessage: 'We are preparing something extraordinary for you. Stay tuned!',
  enableCountdown: false,
  countdownDateTime: '',
  backgroundImage: '/LADYSTANDARD.PNG',
};

export default function SiteSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/site-settings');
      const data = await response.json();
      
      if (data.error) {
        console.error('Error from API:', data.error);
        setError(data.error);
        return;
      }
      
      if (data.settings) {
        console.log('Loaded settings:', data.settings);
        setSettings({
          siteLocked: data.settings.siteLocked ?? false,
          lockHeading: data.settings.lockHeading ?? 'We Are Coming Soon',
          lockMessage: data.settings.lockMessage ?? '',
          enableCountdown: data.settings.enableCountdown ?? false,
          countdownDateTime: data.settings.countdownDateTime ?? '',
          backgroundImage: data.settings.backgroundImage ?? '/LADYSTANDARD.PNG',
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      console.log('Saving settings:', settings);
      
      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      
      console.log('Save response:', response.status, data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      // Refresh settings after save
      await fetchSettings();
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, we'll use a simple approach - in production you'd upload to Cloudinary
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      // Store as data URL for immediate preview (in production, upload to Cloudinary)
      setSettings(prev => ({ ...prev, backgroundImage: result }));
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Site Settings</h1>
            <p className="text-gray-600 mt-2">Control website lock and maintenance mode</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <Check className="w-5 h-5" />
              Settings saved successfully!
            </div>
          )}

          {/* Site Lock Toggle */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  settings.siteLocked ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {settings.siteLocked ? (
                    <Lock className="w-6 h-6 text-red-600" />
                  ) : (
                    <Unlock className="w-6 h-6 text-green-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Website Lock</h2>
                  <p className="text-gray-600 text-sm">
                    {settings.siteLocked 
                      ? 'Visitors are being redirected to the locked page' 
                      : 'Website is currently visible to all visitors'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, siteLocked: !prev.siteLocked }))}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  settings.siteLocked ? 'bg-red-500' : 'bg-green-500'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    settings.siteLocked ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Locked Page Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Locked Page Content</h2>
            
            {/* Lock Heading */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lock Heading
              </label>
              <input
                type="text"
                value={settings.lockHeading}
                onChange={(e) => setSettings(prev => ({ ...prev, lockHeading: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="We Are Coming Soon"
              />
            </div>

            {/* Lock Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lock Message
              </label>
              <textarea
                value={settings.lockMessage}
                onChange={(e) => setSettings(prev => ({ ...prev, lockMessage: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="We are preparing something extraordinary for you. Stay tuned!"
              />
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Image
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-32 h-40 bg-gray-100 rounded-lg overflow-hidden">
                  {settings.backgroundImage ? (
                    <img 
                      src={settings.backgroundImage} 
                      alt="Background preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-5 h-5" />
                  <span>Upload Image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, backgroundImage: '/LADYSTANDARD.PNG' }))}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Use Default
                </button>
              </div>
            </div>
          </div>

          {/* Countdown Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  settings.enableCountdown ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <Clock className={`w-6 h-6 ${settings.enableCountdown ? 'text-purple-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Countdown Timer</h2>
                  <p className="text-gray-600 text-sm">
                    Show a countdown timer to visitors
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, enableCountdown: !prev.enableCountdown }))}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  settings.enableCountdown ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    settings.enableCountdown ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {settings.enableCountdown && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Countdown Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={settings.countdownDateTime}
                  onChange={(e) => setSettings(prev => ({ ...prev, countdownDateTime: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-gray-500 text-sm mt-2">
                  Website will automatically unlock when the countdown reaches zero
                </p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
