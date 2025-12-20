import React, { useState } from 'react';
import { settingsSync } from '../lib/settings-sync';

export function SettingsSync() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setMessage('');
      const data = await settingsSync.exportSettings();
      settingsSync.downloadSettings(data);
      setMessage('Settings exported successfully! Check your downloads folder.');
    } catch (error) {
      setMessage('Failed to export settings: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    try {
      setIsImporting(true);
      setMessage('');
      const data = await settingsSync.uploadSettings();
      await settingsSync.importSettings(data);
      setMessage('Settings imported successfully! Refresh the page to see changes.');
    } catch (error) {
      setMessage('Failed to import settings: ' + (error as Error).message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Settings Sync</h3>
      <p className="text-gray-600 mb-4">
        Export your settings to share across devices or create backups.
      </p>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mr-2"
          >
            {isExporting ? 'Exporting...' : 'Export Settings'}
          </button>
          <span className="text-sm text-gray-500">
            Download all settings as a JSON file
          </span>
        </div>

        <div>
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 mr-2"
          >
            {isImporting ? 'Importing...' : 'Import Settings'}
          </button>
          <span className="text-sm text-gray-500">
            Upload a settings file to restore configuration
          </span>
        </div>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded ${
          message.includes('successfully') 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h4 className="font-medium mb-2">Cross-Device Access:</h4>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Export settings on your desktop</li>
          <li>2. Transfer the file to your mobile device (email, cloud storage, etc.)</li>
          <li>3. Access the admin panel on mobile and import the settings</li>
        </ol>
      </div>
    </div>
  );
}