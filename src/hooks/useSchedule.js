import { useMemo, useState, useEffect, useCallback } from 'react';
import useTasks from './useTasks';
import useSettings from './useSettings';
import { generateSchedule } from '../utils/planningEngine';
import { getAIAdjustedPlan, getMaxStudyHours } from '../services/aiPlanningService';

/**
 * useSchedule — AI-driven schedule hook.
 *
 * Flow:
 * 1. Loads tasks + settings
 * 2. Sends ALL task data to AI planning service (Gemini or rule-based fallback)
 * 3. AI analyzes: student strength, per-subject proficiency, difficulty, deadlines
 * 4. AI returns: adjusted daily hours + per-task adjusted hours
 * 5. Planning engine generates the COMPLETE day-wise schedule using AI output
 * 6. Today's plan, schedule, and AI plan are all derived from this single source of truth
 *
 * @returns {Object} - { schedule, todaysTasks, aiPlan, loading }
 */
export const useSchedule = (tasks, tasksLoading) => {
  const { settings, loading: settingsLoading } = useSettings();
  const [aiPlan, setAiPlan] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);

  // Stable reference for task data to avoid unnecessary re-fetches
  const taskFingerprint = useMemo(() => {
    if (!tasks || tasks.length === 0) return '';
    return tasks.map(t => `${t.id}:${t.status}:${t.completedHours || 0}`).join('|');
  }, [tasks]);

  // Step 1: Fetch AI plan whenever tasks or settings change
  const fetchAiPlan = useCallback(async () => {
    if (tasksLoading || settingsLoading || !tasks || tasks.length === 0) {
      setAiPlan(null);
      setAiLoading(false);
      return;
    }

    setAiLoading(true);
    try {
      const dailyHours = Math.min(settings?.dailyStudyHours || 4, getMaxStudyHours());
      const plan = await getAIAdjustedPlan(tasks, dailyHours);
      setAiPlan(plan);
    } catch (err) {
      console.error('AI plan generation failed:', err);
      setAiPlan(null);
    } finally {
      setAiLoading(false);
    }
  }, [taskFingerprint, settings?.dailyStudyHours, tasksLoading, settingsLoading]);

  useEffect(() => {
    fetchAiPlan();
  }, [fetchAiPlan]);

  // Step 2: Generate schedule using AI plan as the single source of truth
  const schedule = useMemo(() => {
    if (tasksLoading || settingsLoading || !tasks) return [];
    
    const dailyHours = Math.min(settings?.dailyStudyHours || 4, getMaxStudyHours());
    
    // Pass the FULL AI plan to the schedule generator
    // The engine will use AI-adjusted daily hours AND per-task adjusted hours
    return generateSchedule(tasks, dailyHours, aiPlan);
  }, [tasks, settings, tasksLoading, settingsLoading, aiPlan]);

  // Step 3: Extract today's tasks from the AI-generated schedule
  const todaysTasks = useMemo(() => {
    const today = schedule.find(day => day.dayIndex === 0);
    return today ? today.tasks : [];
  }, [schedule]);

  return {
    schedule,
    todaysTasks,
    aiPlan,
    loading: tasksLoading || settingsLoading || aiLoading,
    refreshPlan: fetchAiPlan,
  };
};
