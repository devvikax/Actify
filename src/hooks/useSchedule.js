import { useMemo } from 'react';
import useTasks from './useTasks';
import useSettings from './useSettings';
import { generateSchedule } from '../utils/planningEngine';

/**
 * Hook to provide real-time AI-generated schedule based on tasks and settings.
 * @returns {Object} - { schedule, todaysTasks, isLoading }
 */
export const useSchedule = () => {
  const { tasks, loading: tasksLoading } = useTasks();
  const { settings, loading: settingsLoading } = useSettings();

  const schedule = useMemo(() => {
    if (tasksLoading || settingsLoading || !tasks) return [];
    
    // Default capacity to 4 if not set
    const dailyHours = settings?.dailyStudyHours || 4;
    return generateSchedule(tasks, dailyHours);
  }, [tasks, settings, tasksLoading, settingsLoading]);

  const todaysTasks = useMemo(() => {
    const today = schedule.find(day => day.dayIndex === 0);
    return today ? today.tasks : [];
  }, [schedule]);

  return {
    schedule,
    todaysTasks,
    loading: tasksLoading || settingsLoading
  };
};
