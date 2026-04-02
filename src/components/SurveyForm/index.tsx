import { useState, useCallback } from "react";
import type { Answers, Question } from "../../types";
import { SECTIONS } from "../../data/questions";
import { QuestionCard } from "../QuestionCard";

interface SurveyFormProps {
  onComplete: (answers: Answers) => void;
}

export function SurveyForm({ onComplete }: SurveyFormProps) {
  const [answers, setAnswers] = useState<Answers>({});
  const [pageIndex, setPageIndex] = useState(0);

  const totalPages = SECTIONS.length;
  const section = SECTIONS[pageIndex];

  const handleChange = useCallback(
    (qId: string, val: number | string | number[]) => {
      setAnswers((prev) => {
        const next = { ...prev, [qId]: val };
        // Clear child answers when a conditional parent changes
        if (qId === "q5" && val !== "yes") delete next["q5a"];
        if (qId === "q8" && typeof val === "number" && val < 5)
          delete next["q8a"];
        return next;
      });
    },
    []
  );

  // A question is "visible" if it has no conditional, or its condition is met
  const isVisible = (q: Question): boolean => {
    if (!q.conditional) return true;
    const parentVal = answers[q.conditional.parent];
    if (q.conditional.minValue !== undefined) {
      return (
        typeof parentVal === "number" && parentVal >= q.conditional.minValue
      );
    }
    return parentVal === q.conditional.value;
  };

  // All non-text, visible questions on this page must be answered to proceed
  const visibleQs = section.questions.filter(isVisible);
  const requiredQs = visibleQs.filter((q) => q.type !== "text");
  const pageComplete = requiredQs.every((q) => {
    if (q.type === "multi")
      return (
        Array.isArray(answers[q.id]) && (answers[q.id] as number[]).length > 0
      );
    return answers[q.id] !== undefined;
  });

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPageIndex((i) => i + 1);
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPageIndex((i) => i - 1);
  };

  // Question numbering: count across all sections up to current page
  let globalQuestionOffset = 0;
  for (let i = 0; i < pageIndex; i++) {
    globalQuestionOffset += SECTIONS[i].questions.filter(
      (q) => !q.conditional
    ).length;
  }

  let nonConditionalCount = 0;

  return (
    <div>
      {/* Step indicator */}
      <div className="step-indicator">
        {SECTIONS.map((_s, i) => (
          <div
            key={i}
            className={`step-dot ${
              i < pageIndex ? "done" : i === pageIndex ? "active" : ""
            }`}
          />
        ))}
      </div>
      <div className="step-label">
        Section {pageIndex + 1} of {totalPages} —{" "}
        <strong>{section.title}</strong>
      </div>

      {/* Section header */}
      <div className="section-header">
        <h2 className="section-title">{section.title}</h2>
        {section.subtitle && (
          <p className="section-subtitle">{section.subtitle}</p>
        )}
      </div>

      {/* Questions */}
      {section.questions.map((q) => {
        if (!q.conditional) nonConditionalCount++;
        const displayIndex = globalQuestionOffset + nonConditionalCount;
        return (
          <QuestionCard
            key={q.id}
            q={q}
            answers={answers}
            onChange={handleChange}
            index={displayIndex}
          />
        );
      })}

      {/* Navigation */}
      <div className="nav-row">
        {pageIndex > 0 && (
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
        )}

        {pageIndex < totalPages - 1 ? (
          <button
            className="next-btn"
            disabled={!pageComplete}
            onClick={handleNext}
          >
            Next →
          </button>
        ) : (
          <button
            className="submit-btn"
            disabled={!pageComplete}
            onClick={() => onComplete(answers)}
          >
            Finish →
          </button>
        )}
      </div>

      {!pageComplete && (
        <p className="submit-hint">
          Answer all questions on this page to continue
        </p>
      )}
    </div>
  );
}
