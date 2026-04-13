/**
 * Planning Engine Utilities
 * AI-driven logic for task prioritization, breakdown, and scheduling.
 * The AI analyzes all task details (proficiency, difficulty, deadlines, student strength)
 * and sets the complete plan automatically.
 */

const MAX_DAILY_HOURS = 15;

const PRIORITY_WEIGHTS = {
  High: 3, high: 3,
  Medium: 2, medium: 2,
  Low: 1, low: 1
};

const DIFFICULTY_WEIGHTS = {
  Hard: 3, hard: 3,
  Medium: 2, medium: 2,
  Easy: 1, easy: 1
};

const PROFICIENCY_WEIGHTS = {
  beginner: 1.8,
  intermediate: 1.2,
  advanced: 0.9,
  expert: 0.7,
};

/**
 * Calculates a priority score for a task based on urgency, priority, difficulty,
 * AND proficiency level — low proficiency boosts priority (student needs more help).
 * @param {Object} task - The task object
 * @returns {number} - Calculated priority score (higher = more important)
 */
export const calculatePriorityScore = (task) => {
  const now = new Date();
  const deadline = new Date(task.deadline);
  
  let diffDays = (deadline - now) / (1000 * 60 * 60 * 24);
  if (diffDays <= 0) diffDays = 0.1;
  else if (diffDays < 1) diffDays = 0.5;

  const priorityWeight = PRIORITY_WEIGHTS[task.priority] || 1;
  const difficultyWeight = DIFFICULTY_WEIGHTS[task.difficulty] || 1;
  
  // Proficiency factor: lower proficiency = higher priority (student needs more focus)
  const proficiencyWeight = PROFICIENCY_WEIGHTS[task.proficiencyLevel] || 1.0;

  // Formula: (Priority × Difficulty × ProficiencyNeed) / Days Left
  return (priorityWeight * difficultyWeight * proficiencyWeight * 10) / diffDays;
};

/**
 * Breaks a task down into manageable micro-tasks (max 2 hours each).
 * Uses AI-adjusted hours when provided.
 * @param {Object} task - The task object
 * @param {number} [adjustedHours] - AI-adjusted hours (overrides estimatedHours)
 * @returns {Array} - Array of micro-task objects
 */
export const breakdownTask = (task, adjustedHours = null) => {
  const maxHours = 2;
  const estimatedHours = adjustedHours || parseFloat(task.estimatedHours) || 0;
  
  if (estimatedHours <= 0) {
    return [{
      ...task,
      microId: `${task.id}-m1`,
      parentId: task.id,
      plannedHours: 1,
      title: task.name,
      aiAdjusted: !!adjustedHours,
    }];
  }

  if (estimatedHours <= maxHours) {
    return [{
      ...task,
      microId: `${task.id}-m1`,
      parentId: task.id,
      plannedHours: estimatedHours,
      title: task.name,
      aiAdjusted: !!adjustedHours,
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
      isPartial: true,
      aiAdjusted: !!adjustedHours,
    });
    remainingHours -= chunk;
    count++;
  }

  return microTasks;
};

/**
 * Generates a complete AI-driven day-wise schedule for all tasks.
 * 
 * This is the MAIN scheduling function. It:
 * 1. Takes AI plan (adjusted daily hours + per-task adjustments)
 * 2. Breaks tasks into micro-tasks using AI-adjusted hours
 * 3. Sorts by AI-enhanced priority scores (considers proficiency)
 * 4. Allocates to days respecting the AI-recommended daily capacity (max 15h)
 *
 * @param {Array} tasks - Array of all task objects
 * @param {number} dailyHours - User's base daily hours (used as fallback)
 * @param {Object|null} aiPlan - Full AI plan with adjustedDailyHours and taskAllocations
 * @returns {Array} - Array of day objects { dayIndex, date, tasks, totalHours }
 */
export const generateSchedule = (tasks = [], dailyHours = 4, aiPlan = null) => {
  if (!tasks.length) return [];

  // USE AI-adjusted daily hours if available, otherwise use user setting
  // Always cap at MAX_DAILY_HOURS (15h)
  const effectiveDailyHours = Math.min(
    aiPlan?.adjustedDailyHours || dailyHours,
    MAX_DAILY_HOURS
  );

  // Build a lookup map for AI-adjusted hours per task
  const aiHoursMap = {};
  if (aiPlan?.taskAllocations) {
    aiPlan.taskAllocations.forEach(alloc => {
      // Match by task name (AI may not have task IDs)
      const matchingTask = tasks.find(t => t.name === alloc.taskName);
      if (matchingTask && alloc.adjustedHours) {
        aiHoursMap[matchingTask.id] = alloc.adjustedHours;
      }
    });
  }

  // 1. Filter active tasks, break into micro-tasks with AI-adjusted hours
  const allMicroTasks = tasks
    .filter(t => t.status !== 'completed')
    .flatMap(t => {
      const adjustedH = aiHoursMap[t.id] || null;
      const micros = breakdownTask(t, adjustedH);
      const score = calculatePriorityScore(t);
      return micros.map(m => ({ ...m, score }));
    });

  // 2. Sort by priority score (highest first — urgent + hard + low proficiency tasks first)
  allMicroTasks.sort((a, b) => b.score - a.score);

  // 3. Allocate to days using AI-adjusted daily capacity
  const schedule = [];
  let dayIndex = 0;
  let remainingMicroTasks = [...allMicroTasks];

  // Get completed hours for today to prevent refill effect
  const todayIso = new Date().toLocaleDateString('en-CA');
  const hoursCompletedToday = parseFloat(localStorage.getItem(`completedToday_${todayIso}`)) || 0;

  while (remainingMicroTasks.length > 0 && dayIndex < 30) {
    const dayTasks = [];
    let dayAllocatedHours = 0;
    const nextDayMicroTasks = [];
    const scheduledParentsToday = new Set();

    const date = new Date();
    date.setDate(date.getDate() + dayIndex);

    // Strictly enforce daily limit. If it's today, we deduct hours we already completed.
    const currentDayCapacity = dayIndex === 0 
      ? Math.max(0, effectiveDailyHours - hoursCompletedToday) 
      : effectiveDailyHours;

    for (const m of remainingMicroTasks) {
      // Check if we already scheduled a part of this task today
      if (scheduledParentsToday.has(m.parentId)) {
        nextDayMicroTasks.push(m);
      } else if (dayAllocatedHours + m.plannedHours <= currentDayCapacity) {
        dayTasks.push(m);
        dayAllocatedHours += m.plannedHours;
        scheduledParentsToday.add(m.parentId);
      } else {
        nextDayMicroTasks.push(m);
      }
    }

    if (dayTasks.length > 0) {
      schedule.push({
        dayIndex,
        date: date.toISOString(),
        tasks: dayTasks,
        totalHours: dayAllocatedHours,
        aiDailyCapacity: effectiveDailyHours,
      });
    }

    remainingMicroTasks = nextDayMicroTasks;
    dayIndex++;
  }

  // Handle leftovers
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
 * Uses AI-adjusted hours when available for accurate risk assessment.
 * @param {Object} task - The task object
 * @param {number} dailyCapacity - The daily study hour capacity
 * @param {number} [aiAdjustedHours] - AI-adjusted hours for this task
 * @returns {string} - 'low' | 'warning' | 'danger'
 */
export const calculateRiskFactor = (task, dailyCapacity, aiAdjustedHours = null) => {
  if (task.status === 'completed') return 'low';

  // Use AI-adjusted hours if available, otherwise use original estimate
  const totalHours = aiAdjustedHours || task.estimatedHours || 1;
  const completedHours = task.completedHours || 0;
  const hoursRemaining = Math.max(0, totalHours - completedHours);

  const deadline = new Date(task.deadline + 'T23:59:59');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = deadline - today;
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Cap dailyCapacity at 15h for risk calc
  const cappedCapacity = Math.min(dailyCapacity, MAX_DAILY_HOURS);

  const dailyNeeded = hoursRemaining / diffDays;
  const riskScore = dailyNeeded / cappedCapacity;

  if (riskScore > 0.8) return 'danger';
  if (riskScore > 0.5) return 'warning';
  return 'low';
};
