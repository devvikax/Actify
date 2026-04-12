import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Service for academic coaching and planning insights.
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Get personalized coaching tips based on current tasks and risks.
 */
export const getPlanInsights = async (tasks, dailyHours) => {
  if (!genAI) {
    // Fallback rule-based insight if no API key
    const overLoaded = tasks.some(t => {
      const remaining = (t.estimatedHours - (t.completedHours || 0));
      const deadline = new Date(t.deadline);
      const diff = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
      return remaining / Math.max(1, diff) > dailyHours * 0.8;
    });

    // Check for proficiency-based insight
    const beginnerTasks = tasks.filter(t => t.proficiencyLevel === 'beginner' && t.status !== 'completed');
    if (beginnerTasks.length > 0) {
      return `🌱 Focus on "${beginnerTasks[0].name}" — you're still building command here. Dedicate extra time!`;
    }

    if (overLoaded) {
      return "⚠️ High workload detected! Prioritize your most urgent deadline and consider increasing your study capacity.";
    }
    return "✅ Your schedule looks balanced. Stick to the daily breakdown!";
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `
      You are an AI Academic Coach for PlanIt app. Here are the user's current tasks:
      ${JSON.stringify(tasks.map(t => ({
        name: t.name,
        subject: t.subject || t.name,
        deadline: t.deadline,
        hours: t.estimatedHours,
        done: t.completedHours,
        proficiency: t.proficiencyLevel || 'intermediate',
        difficulty: t.difficulty,
      })))}
      Daily study capacity: ${dailyHours} hours (max 15h allowed).
      
      Consider the student's proficiency level per subject:
      - Beginner: they need MORE study time and simpler explanations
      - Expert: they need LESS time and can handle advanced work
      
      Provide ONE short (max 25 words), actionable coaching tip. Be encouraging but direct about risks.
      Focus on which subject needs most attention based on proficiency and deadlines.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error('AI Insights failed:', err);
    return 'Keep up the good work! Focus on one task at a time.';
  }
};

