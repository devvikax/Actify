import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Get the tasks collection reference for a user.
 */
function tasksRef(uid) {
  return collection(db, 'users', uid, 'tasks');
}

/**
 * Add a new task for a user.
 * @param {string} uid - User ID
 * @param {object} taskData - Task fields (name, type, deadline, priority, difficulty, estimatedHours, notes)
 * @returns {Promise<DocumentReference>}
 */
export async function addTask(uid, taskData) {
  return addDoc(tasksRef(uid), {
    ...taskData,
    completedHours: 0,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update an existing task.
 * @param {string} uid - User ID
 * @param {string} taskId - Task document ID
 * @param {object} updates - Partial fields to update
 */
export async function updateTask(uid, taskId, updates) {
  const taskDoc = doc(db, 'users', uid, 'tasks', taskId);
  return updateDoc(taskDoc, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a task.
 * @param {string} uid - User ID
 * @param {string} taskId - Task document ID
 */
export async function deleteTask(uid, taskId) {
  const taskDoc = doc(db, 'users', uid, 'tasks', taskId);
  return deleteDoc(taskDoc);
}

/**
 * Get all tasks for a user, ordered by deadline ascending.
 * @param {string} uid - User ID
 * @returns {Promise<QuerySnapshot>}
 */
export async function getUserTasks(uid) {
  const q = query(tasksRef(uid), orderBy('deadline', 'asc'));
  return getDocs(q);
}

/**
 * Mark a task as completed.
 * @param {string} uid - User ID
 * @param {string} taskId - Task document ID
 */
export async function completeTask(uid, taskId) {
  const taskDoc = doc(db, 'users', uid, 'tasks', taskId);
  return updateDoc(taskDoc, {
    status: 'completed',
    updatedAt: serverTimestamp(),
  });
}
