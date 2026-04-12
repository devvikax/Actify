import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const MAX_STUDY_HOURS = 15;
const MIN_STUDY_HOURS = 0.5;

const DEFAULTS = {
  dailyStudyHours: 4,
};

/**
 * Get user settings document. Returns defaults if not found.
 * Enforces study hours cap.
 * @param {string} uid - User ID
 * @returns {Promise<object>}
 */
export async function getUserSettings(uid) {
  const docRef = doc(db, 'users', uid);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = { ...DEFAULTS, ...snap.data() };
    // Enforce cap
    data.dailyStudyHours = Math.min(data.dailyStudyHours, MAX_STUDY_HOURS);
    data.dailyStudyHours = Math.max(data.dailyStudyHours, MIN_STUDY_HOURS);
    return data;
  }
  return { ...DEFAULTS };
}

/**
 * Update user settings (merge).
 * Enforces max 15 hours study cap before saving.
 * @param {string} uid - User ID
 * @param {object} settings - Partial settings to update
 */
export async function updateUserSettings(uid, settings) {
  const docRef = doc(db, 'users', uid);

  // Enforce study hours cap
  const sanitized = { ...settings };
  if (sanitized.dailyStudyHours !== undefined) {
    sanitized.dailyStudyHours = Math.min(sanitized.dailyStudyHours, MAX_STUDY_HOURS);
    sanitized.dailyStudyHours = Math.max(sanitized.dailyStudyHours, MIN_STUDY_HOURS);
  }

  return setDoc(docRef, {
    ...sanitized,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
