import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Planning Service — Gemini-powered automatic study hour adjustment.
 *
 * Core Logic:
 * 1. Study hours are CAPPED at 15 hours/day maximum.
 * 2. AI analyzes student performance (poor student → more hours, strong → less).
 * 3. AI analyzes subject proficiency (low command → more hours, high command → fewer).
 * 4. Automatically distributes study hours across tasks intelligently.
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const MAX_STUDY_HOURS = 15;
const MIN_STUDY_HOURS = 1;

/**
 * Proficiency multiplier (inverse: lower proficiency → more hours needed)
 * proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
 */
const PROFICIENCY_MULTIPLIERS = {
  beginner: 1.8,      // Needs 80% more time
  intermediate: 1.2,  // Needs 20% more time
  advanced: 0.9,      // Needs 10% less time
  expert: 0.7,        // Needs 30% less time
};

/**
 * Difficulty multiplier for study intensity
 */
const DIFFICULTY_MULTIPLIERS = {
  hard: 1.5,
  medium: 1.0,
  easy: 0.7,
};

/**
 * Calculate overall student strength from their task history.
 * Returns a score from 0 (poor) to 1 (strong).
 * @param {Array} tasks - All user tasks (active + completed)
 * @returns {{ score: number, label: string }}
 */
export function calculateStudentStrength(tasks) {
  if (!tasks || tasks.length === 0) {
    return { score: 0.5, label: 'average' };
  }

  const completedTasks = tasks.filter(t => t.status === 'completed');
  const totalTasks = tasks.length;

  // Factor 1: Completion rate
  const completionRate = totalTasks > 0 ? completedTasks.length / totalTasks : 0;

  // Factor 2: On-time completion (completed before or on deadline)
  let onTimeCount = 0;
  completedTasks.forEach(task => {
    if (task.completedAt && task.deadline) {
      const completedDate = task.completedAt?.toDate ? task.completedAt.toDate() : new Date(task.completedAt);
      const deadlineDate = new Date(task.deadline + 'T23:59:59');
      if (completedDate <= deadlineDate) onTimeCount++;
    } else {
      // Assume on time if we can't verify
      onTimeCount += 0.5;
    }
  });
  const onTimeRate = completedTasks.length > 0 ? onTimeCount / completedTasks.length : 0.5;

  // Factor 3: Efficiency (completed hours vs estimated hours)
  let efficiencyScore = 0.5;
  const tasksWithHours = completedTasks.filter(t => t.estimatedHours && t.completedHours);
  if (tasksWithHours.length > 0) {
    const avgEfficiency = tasksWithHours.reduce((sum, t) => {
      const ratio = t.completedHours / t.estimatedHours;
      return sum + Math.min(1, 1 / Math.max(0.5, ratio)); // Lower ratio = better
    }, 0) / tasksWithHours.length;
    efficiencyScore = avgEfficiency;
  }

  // Weighted score
  const score = Math.min(1, Math.max(0, (
    completionRate * 0.4 +
    onTimeRate * 0.35 +
    efficiencyScore * 0.25
  )));

  let label;
  if (score >= 0.8) label = 'strong';
  else if (score >= 0.6) label = 'above_average';
  else if (score >= 0.4) label = 'average';
  else if (score >= 0.2) label = 'below_average';
  else label = 'needs_improvement';

  return { score, label };
}

/**
 * Rule-based fallback: Calculate AI-adjusted study hours for each task.
 * Uses student strength and subject proficiency.
 * @param {Array} tasks - Active tasks
 * @param {number} baseDailyHours - User's base daily study capacity
 * @param {{ score: number, label: string }} studentStrength - Student's strength profile
 * @returns {{ adjustedDailyHours: number, taskAllocations: Array }}
 */
export function calculateAdjustedHoursRuleBased(tasks, baseDailyHours, studentStrength) {
  const activeTasks = tasks.filter(t => t.status !== 'completed');

  if (activeTasks.length === 0) {
    return {
      adjustedDailyHours: Math.min(baseDailyHours, MAX_STUDY_HOURS),
      taskAllocations: [],
      reasoning: 'No active tasks to plan for.'
    };
  }

  // Step 1: Adjust base daily hours based on student strength
  // Weaker students need more daily hours, stronger students need fewer
  let strengthMultiplier;
  if (studentStrength.score >= 0.8) {
    strengthMultiplier = 0.8;  // Strong students: reduce by 20%
  } else if (studentStrength.score >= 0.6) {
    strengthMultiplier = 0.9;
  } else if (studentStrength.score >= 0.4) {
    strengthMultiplier = 1.0;  // Average: no change
  } else if (studentStrength.score >= 0.2) {
    strengthMultiplier = 1.2;  // Below average: increase by 20%
  } else {
    strengthMultiplier = 1.4;  // Weak: increase by 40%
  }

  const adjustedDailyHours = Math.min(
    MAX_STUDY_HOURS,
    Math.max(MIN_STUDY_HOURS, Math.round(baseDailyHours * strengthMultiplier * 2) / 2)
  );

  // Step 2: Calculate per-task hour adjustments based on proficiency + difficulty
  const taskAllocations = activeTasks.map(task => {
    const proficiency = task.proficiencyLevel || 'intermediate';
    const difficulty = task.difficulty || 'medium';

    const proficiencyMul = PROFICIENCY_MULTIPLIERS[proficiency] || 1.0;
    const difficultyMul = DIFFICULTY_MULTIPLIERS[difficulty] || 1.0;

    // Adjusted estimated hours for this task
    const baseHours = parseFloat(task.estimatedHours) || 1;
    const adjustedHours = Math.round(baseHours * proficiencyMul * difficultyMul * 2) / 2;

    // Urgency factor (closer deadline → higher priority for time allocation)
    const deadline = new Date(task.deadline + 'T23:59:59');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysLeft = Math.max(1, Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)));
    const urgencyFactor = daysLeft <= 1 ? 2.0 : daysLeft <= 3 ? 1.5 : daysLeft <= 7 ? 1.2 : 1.0;

    return {
      taskId: task.id,
      taskName: task.name,
      subject: task.subject || task.name,
      originalHours: baseHours,
      adjustedHours: Math.round(adjustedHours * urgencyFactor * 2) / 2,
      proficiency,
      proficiencyMultiplier: proficiencyMul,
      dailyAllocation: Math.min(adjustedDailyHours, Math.round((adjustedHours / daysLeft) * 2) / 2),
      daysLeft,
      reasoning: `${proficiency} level → ${proficiencyMul}x, ${difficulty} difficulty → ${difficultyMul}x`
    };
  });

  return {
    adjustedDailyHours,
    taskAllocations,
    studentStrength,
    reasoning: `Student strength: ${studentStrength.label} (${(studentStrength.score * 100).toFixed(0)}%). ` +
      `Daily hours adjusted from ${baseDailyHours}h to ${adjustedDailyHours}h.`
  };
}

/**
 * Gemini AI-powered study hour planning.
 * Sends task data to Gemini and gets back intelligent hour adjustments.
 * Falls back to rule-based if API is unavailable.
 * @param {Array} tasks - All user tasks
 * @param {number} baseDailyHours - User's set daily study hours
 * @returns {Promise<Object>} - AI-adjusted plan
 */
export async function getAIAdjustedPlan(tasks, baseDailyHours) {
  const studentStrength = calculateStudentStrength(tasks);
  const activeTasks = tasks.filter(t => t.status !== 'completed');

  // Always enforce max 15 hours
  const cappedDailyHours = Math.min(baseDailyHours, MAX_STUDY_HOURS);

  // If no Gemini API key, use rule-based fallback
  if (!genAI) {
    return calculateAdjustedHoursRuleBased(tasks, cappedDailyHours, studentStrength);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const taskSummaries = activeTasks.map(t => ({
      name: t.name,
      subject: t.subject || t.name,
      type: t.type,
      deadline: t.deadline,
      estimatedHours: t.estimatedHours,
      completedHours: t.completedHours || 0,
      difficulty: t.difficulty,
      priority: t.priority,
      proficiency: t.proficiencyLevel || 'intermediate',
    }));

    const prompt = `You are an AI Academic Study Planner for a student app called PlanIt.

STUDENT PROFILE:
- Overall strength: ${studentStrength.label} (score: ${(studentStrength.score * 100).toFixed(0)}%)
- Base daily study capacity: ${cappedDailyHours} hours
- Maximum allowed daily study hours: ${MAX_STUDY_HOURS} hours

ACTIVE TASKS:
${JSON.stringify(taskSummaries, null, 2)}

RULES:
1. Daily study hours MUST NOT exceed ${MAX_STUDY_HOURS} hours.
2. For WEAK students (low strength score): recommend MORE daily study hours (closer to max).
3. For STRONG students (high strength score): recommend FEWER daily study hours (they're efficient).
4. For subjects where proficiency is "beginner" or "intermediate": allocate MORE study time for that task.
5. For subjects where proficiency is "advanced" or "expert": allocate LESS study time for that task.
6. Consider deadline urgency — closer deadlines need more daily allocation.
7. The adjusted hours per task should reflect the actual time this specific student needs based on their proficiency.

Respond with ONLY valid JSON, no markdown, no code fences:
{
  "adjustedDailyHours": <number between ${MIN_STUDY_HOURS} and ${MAX_STUDY_HOURS}>,
  "taskAllocations": [
    {
      "taskName": "<task name>",
      "originalHours": <original estimated hours>,
      "adjustedHours": <AI-adjusted total hours needed>,
      "dailyAllocation": <recommended hours per day for this task>,
      "reasoning": "<brief explanation>"
    }
  ],
  "overallTip": "<one sentence coaching tip for this student>"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Parse JSON response (strip markdown code fences if present)
    const cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const aiPlan = JSON.parse(cleanJson);

    // Enforce cap
    aiPlan.adjustedDailyHours = Math.min(aiPlan.adjustedDailyHours, MAX_STUDY_HOURS);
    aiPlan.studentStrength = studentStrength;
    aiPlan.source = 'gemini';

    return aiPlan;
  } catch (err) {
    console.error('Gemini AI planning failed, falling back to rule-based:', err);
    return calculateAdjustedHoursRuleBased(tasks, cappedDailyHours, studentStrength);
  }
}

/**
 * Get maximum allowed study hours.
 */
export const getMaxStudyHours = () => MAX_STUDY_HOURS;
export const getMinStudyHours = () => MIN_STUDY_HOURS;
