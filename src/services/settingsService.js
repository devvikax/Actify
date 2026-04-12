import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const DEFAULTS = {
  dailyStudyHours: 4,
};

/**
 * Get user settings document. Returns defaults if not found.
 * @param {string} uid - User ID
 * @returns {Promise<object>}
 */
export async function getUserSettings(uid) {
  const docRef = doc(db, 'users', uid);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { ...DEFAULTS, ...snap.data() };
  }
  return { ...DEFAULTS };
}

/**
 * Update user settings (merge).
 * @param {string} uid - User ID
 * @param {object} settings - Partial settings to update
 */
export async function updateUserSettings(uid, settings) {
  const docRef = doc(db, 'users', uid);
  return setDoc(docRef, {
    ...settings,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
