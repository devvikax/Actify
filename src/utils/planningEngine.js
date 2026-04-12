/**
 * Planning Engine Utilities
 * Rule-based logic for task prioritization and breakdown
 */

const PRIORITY_WEIGHTS = {
  High: 3,
  Medium: 2,
  Low: 1
};

const DIFFICULTY_WEIGHTS = {
  Hard: 3,
  Medium: 2,
  Easy: 1
};

/**
 * Calculates a priority score for a task based on urgency, priority, and difficulty.
 * @param {Object} task - The task object
 * @returns {number} - Calculated priority score (higher = more important)
 */
export const calculatePriorityScore = (task) => {
  const now = new Date();
  const deadline = new Date(task.deadline);
  
  // Calculate relative urgency in days
  const diffTime = deadline - now;
  let diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  // Minimal floor for diffDays to avoid division by zero and handle overdue/immediate tasks
  // If it's today or overdue, give it a very high modifier (e.g., 0.5 days)
  if (diffDays <= 0) diffDays = 0.1;
  else if (diffDays < 1) diffDays = 0.5;

  const priorityWeight = PRIORITY_WEIGHTS[task.priority] || 1;
  const difficultyWeight = DIFFICULTY_WEIGHTS[task.difficulty] || 1;

  // Formula: (Priority Weight * Difficulty Weight) / Days Left
  // Scaling by 10 for better readability of scores
  return (priorityWeight * difficultyWeight * 10) / diffDays;
};

/**
 * Breaks a task down into manageable micro-tasks (max 2 hours each).
 * @param {Object} task - The task object
 * @returns {Array} - Array of micro-task objects
 */
export const breakdownTask = (task) => {
  const maxHours = 2;
  const estimatedHours = parseFloat(task.estimatedHours) || 0;
  
  if (estimatedHours <= maxHours) {
    return [{
      ...task,
      microId: `${task.id}-m1`,
      parentId: task.id,
      plannedHours: estimatedHours,
      title: task.name
    }];
  }

  const microTasks = [];
  let remainingHours = estimatedHours;
  let count = 1;

  while (remainingHours > 0) {
    const chunk = Math.min(remainingHours, maxHours);
    microTasks.push({
      ...task,
      microId: `${task.id}-m${count}`,
      parentId: task.id,
      plannedHours: chunk,
      title: `${task.name} (Part ${count})`,
      isPartial: true
    });
    remainingHours -= chunk;
    count++;
  }

  return microTasks;
};

/**
 * Generates a day-wise schedule for tasks.
 * @param {Array} tasks - Array of active task objects
 * @param {number} dailyHours - Capacity per day in hours
 * @returns {Array} - Array of objects { dayIndex, date, tasks, totalHours }
 */
export const generateSchedule = (tasks = [], dailyHours = 4) => {
  if (!tasks.length) return [];

  // 1. Filter out completed tasks and prepare micro-tasks
  const allMicroTasks = tasks
    .filter(t => t.status !== 'completed')
    .flatMap(t => {
      const micros = breakdownTask(t);
      const score = calculatePriorityScore(t);
      return micros.map(m => ({ ...m, score }));
    });

  // 2. Sort all micro-tasks by priority score (descending)
  allMicroTasks.sort((a, b) => b.score - a.score);

  // 3. Allocate to days
  const schedule = [];
  let dayIndex = 0;
  let remainingMicroTasks = [...allMicroTasks];

  // Plan for the next 30 days or until all tasks allocated
  while (remainingMicroTasks.length > 0 && dayIndex < 30) {
    const dayTasks = [];
    let dayAllocatedHours = 0;
    const nextDayMicroTasks = [];

    const date = new Date();
    date.setDate(date.getDate() + dayIndex);

    for (const m of remainingMicroTasks) {
      if (dayAllocatedHours + m.plannedHours <= dailyHours) {
        dayTasks.push(m);
        dayAllocatedHours += m.plannedHours;
      } else {
        nextDayMicroTasks.push(m);
      }
    }

    schedule.push({
      dayIndex,
      date: date.toISOString(),
      tasks: dayTasks,
      totalHours: dayAllocatedHours
    });

    remainingMicroTasks = nextDayMicroTasks;
    dayIndex++;
  }

  // Handle leftovers (tasks that didn't fit in 30 days)
  if (remainingMicroTasks.length > 0) {
    schedule.push({
      dayIndex: -1,
      title: 'Backlog (Beyond 30 Days)',
      tasks: remainingMicroTasks,
      totalHours: remainingMicroTasks.reduce((sum, m) => sum + m.plannedHours, 0)
    });
  }

  return schedule;
};

/**
 * Calculate the procrastination risk factor for a task.
 * @param {Object} task - The task object.
 * @param {number} dailyCapacity - The daily study hour capacity.
 * @returns {string} - 'low' | 'warning' | 'danger'
 */
export const calculateRiskFactor = (task, dailyCapacity) => {
  if (task.status === 'completed') return 'low';

  const totalHours = task.estimatedHours || 1;
  const completedHours = task.completedHours || 0;
  const hoursRemaining = Math.max(0, totalHours - completedHours);

  // Time remaining (at least 1 day for calculation safety)
  const deadline = new Date(task.deadline + 'T23:59:59');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = deadline - today;
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Risk = Hours needed per day / Capacity available per day
  const dailyNeeded = hoursRemaining / diffDays;
  const riskScore = dailyNeeded / dailyCapacity;

  if (riskScore > 0.8) return 'danger';
  if (riskScore > 0.5) return 'warning';
  return 'low';
};
