import { SECTIONS } from "../data/questions";
import type { Answers } from "../types";

export function calculateTotalScore(answers: Answers): number {
  let total = 0;
  const allQuestions = SECTIONS.flatMap(s => s.questions);

  allQuestions.forEach(q => {
    const val = answers[q.id];
    
    // Skip demographics and unanswered questions
    if (q.isDemographic || val === undefined || val === null) return;

    // Rule: Multi-select (More options = more points)
    if (q.type === 'multi' && Array.isArray(val)) {
      total += val.length;
    }

    // Rule: Yes/No
    else if (q.type === 'yn') {
      if (val === 'yes') total += 1;
    }

    // Rule: Ranking / Scale (The number picked IS the score)
    else if ((q.type === 'scale' || q.type === 'single') && typeof val === 'number') {
      total += val;
    }
    
    // Note: 'text' types currently add 0 points.
  });

  return total;
}