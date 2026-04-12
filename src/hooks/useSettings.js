import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserSettings, updateUserSettings } from '../services/settingsService';

/**
 * useSettings — manages user settings (e.g. daily study hours) from Firestore.
 */
export default function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({ dailyStudyHours: 4 });
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getUserSettings(user.uid);
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (newSettings) => {
    if (!user?.uid) return;

    try {
      const merged = { ...settings, ...newSettings };
      setSettings(merged);
      await updateUserSettings(user.uid, newSettings);
    } catch (err) {
      console.error('Failed to update settings:', err);
      // Revert on error
      await fetchSettings();
    }
  };

  return {
    settings,
    loading,
    updateSettings,
  };
}
