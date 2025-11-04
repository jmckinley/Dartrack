import React from 'react';
import { Settings, View } from '../types';
import Icon from './Icon';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Loader from './Loader';
import GmailConnect from './GmailConnect';

interface SettingsViewProps {
    settings: Settings | undefined;
    setSettings: (settings: Settings) => void;
    setCurrentView: (view: View) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings, setCurrentView }) => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  if (!settings || !user) {
    return <Loader message="Loading settings..." />;
  }

  const handleSettingsChange = (updatedFields: Partial<Settings>) => {
    setSettings({ ...settings, ...updatedFields });
  };

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
  }

  return (
    <div className="p-4 space-y-6">
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Account</h3>
        <div className="flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-400">You are logged in as</p>
                <p className="font-medium text-gray-200">{user.email}</p>
            </div>
            <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-gray-500"
            >
                Log Out
            </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Data Syncing</h3>
        <p className="text-sm text-gray-400 mb-4">Configure data sources for automatic task import.</p>
        <div className="space-y-4">
            <div>
              <label htmlFor="icalUrl" className="block text-sm font-medium text-gray-300">Canvas iCal URL</label>
              <input
                type="url"
                id="icalUrl"
                value={settings.canvasIcalUrl || ''}
                onChange={(e) => handleSettingsChange({ canvasIcalUrl: e.target.value })}
                placeholder="Paste your iCal feed URL here"
                className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <p className="mt-2 text-xs text-gray-500">Note: Calendar fetching is done via the backend to avoid browser security issues.</p>
            </div>
            <div>
              <label htmlFor="schoolDomain" className="block text-sm font-medium text-gray-300">School Email Domain</label>
              <input
                type="text"
                id="schoolDomain"
                value={settings.schoolEmailDomain || ''}
                onChange={(e) => handleSettingsChange({ schoolEmailDomain: e.target.value })}
                placeholder="e.g., university.edu"
                className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <p className="mt-2 text-xs text-gray-500">The app will only parse emails from this domain for safety.</p>
            </div>
        </div>
      </div>

      <GmailConnect />

       <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">About & Reminders</h3>
        <p className="text-sm text-gray-400">
           DarTrack helps students stay organized by aggregating tasks. 
           Email parsing is powered by Google's Gemini API.
        </p>
        <p className="text-sm text-gray-400 mt-2">
            <strong>For Reminders:</strong> Use the "Add to Google Calendar" option on any task to create an event in your Google Calendar and receive reliable, native notifications on all your devices.
        </p>
      </div>

       <div className="bg-gray-800 rounded-lg p-4">
        <button onClick={() => setCurrentView('help')} className="w-full flex items-center justify-between text-left text-white">
            <div className="flex items-center space-x-3">
                <Icon name="question-mark-circle" className="w-6 h-6 text-indigo-400"/>
                <div>
                    <h3 className="font-semibold">Help & FAQ</h3>
                    <p className="text-sm text-gray-400">Find answers to common questions.</p>
                </div>
            </div>
            <span className="text-gray-500">&rarr;</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsView;