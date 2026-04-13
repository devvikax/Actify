import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  getUserTasks,
  addTask,
  updateTask,
  deleteTask,
  completeTask,
  logTaskProgress,
  clearCompletedTasks,
} from '../services/taskService';

/**
 * useTasks — manages task state with Firestore CRUD.
 * Fetches on mount, re-fetches after every mutation.
 */
export default function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!user?.uid) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const snapshot = await getUserTasks(user.uid);
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Fetch tasks when user changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (taskData) => {
    try {
      setError(null);
      await addTask(user.uid, taskData);
      await fetchTasks();
    } catch (err) {
      console.error('Failed to add task:', err);
      setError('Failed to add task. Please try again.');
      throw err;
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      setError(null);
      await updateTask(user.uid, taskId, updates);
      await fetchTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task. Please try again.');
      throw err;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setError(null);
      await deleteTask(user.uid, taskId);
      await fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task. Please try again.');
      throw err;
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      setError(null);
      await completeTask(user.uid, taskId);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#db2777', '#2563eb']
      });
      await fetchTasks();
    } catch (err) {
      console.error('Failed to complete task:', err);
      setError('Failed to complete task. Please try again.');
      throw err;
    }
  };

  const handleClearCompletedTasks = async (taskIds) => {
    if (!user) return;
    try {
      setError(null);
      await clearCompletedTasks(user.uid, taskIds);
      await fetchTasks();
    } catch (err) {
      console.error('Failed to clear completed tasks:', err);
      setError('Failed to clear completed tasks. Please try again.');
      throw err;
    }
  };

  const logProgress = async (task, hours) => {
    if (!user) return;
    try {
      await logTaskProgress(user.uid, task, hours);
      
      // Track hours completed today locally to prevent infinite schedule refilling
      const todayIso = new Date().toLocaleDateString('en-CA');
      const key = `completedToday_${todayIso}`;
      const current = parseFloat(localStorage.getItem(key)) || 0;
      localStorage.setItem(key, current + hours);

      await fetchTasks();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    handleCompleteTask,
    handleClearCompletedTasks,
    logProgress,
    fetchTasks,
  };
}
