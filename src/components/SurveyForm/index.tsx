import { useState, useCallback } from "react";
import type { Answers, Question } from "../../types";
import { BONUS_SECTION, SECTIONS } from "../../data/questions";
import { QuestionCard } from "../QuestionCard";
import { postToAirtable } from "../../utils/airtable";
import { calculateTotalScore } from "../../utils/scoring";

interface SurveyFormProps {
  onComplete: (score: number) => void;
}

export function SurveyForm({ onComplete }: SurveyFormProps) {
  const [answers, setAnswers] = useState<Answers>({});
  const [pageIndex, setPageIndex] = useState(0);

  // Contact opt-in state (shown on last page)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wantsContact, setWantsContact] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalPages = SECTIONS.length;
  const section = SECTIONS[pageIndex];
  const isLastPage = pageIndex === totalPages - 1;

  const handleChange = useCallback(
    (qId: string, val: number | string | number[]) => {
      setAnswers((prev) => {
        const next = { ...prev, [qId]: val };
        if (qId === "q5" && val !== "yes") delete next["q5a"];
        if (qId === "q8" && typeof val === "number" && val < 5)
          delete next["q8a"];
        return next;
      });
    },
    []
  );

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

  const [isHighScorer, setIsHighScorer] = useState(false);
  const [showingBonus, setShowingBonus] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const handleSubmit = async () => {
    
    const score = calculateTotalScore(answers); 
    setFinalScore(score); 

    if (!showingBonus) {
      if (score > 15) setIsHighScorer(true);
      setShowingBonus(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // VALIDATION: Only check email if they want to be contacted
    if (wantsContact && (!email || !email.includes("@"))) {
      setEmailError("Please enter a valid email so we can reach you.");
      return;
    }

    setLoading(true);

    // Prep data for Airtable
    const allQuestions = [...SECTIONS.flatMap((s) => s.questions), ...BONUS_SECTION[0].questions];
    const answersSummary = allQuestions
      .filter((q) => answers[q.id] !== undefined)
      .map((q) => {
        let val = answers[q.id];
        if (Array.isArray(val))
          val = (val as number[]).map((i) => q.options![i]).join(", ");
        return `${q.id}: ${val}`;
      })
      .join(" | ");

    const success = await postToAirtable({
      Name: name || "(not provided)",
      Email: wantsContact ? email : "(opted out)",
      WantsContact: wantsContact,
      Answers: answersSummary,
      Score: score,
    });

    setLoading(false);

    if (success) {
      onComplete(score);
    } else {
      alert("Something went wrong submitting your responses. Please try again.");
    }
  };

  // Global question numbering across pages
  let globalQuestionOffset = 0;
  for (let i = 0; i < pageIndex; i++) {
    globalQuestionOffset += SECTIONS[i].questions.filter(
      (q) => !q.conditional
    ).length;
  }

  const bonus = BONUS_SECTION[0];
  const currentQuestions = showingBonus 
  ? (finalScore !== null && finalScore > 15 ? bonus.questions : []) 
  : section.questions;

  const isHigh = finalScore !== null && finalScore > 25;
  const isMed  = finalScore !== null && finalScore > 15 && finalScore <= 25;
  const scoreColor = isHigh ? "#C0392B" : isMed ? "#D4AC0D" : "#2E7D5E";
  const label = isHigh ? "HIGH" : isMed ? "MODERATE" : "LOW";

  return (
    <div>
      {/* Step indicator */}
      <div className="step-indicator">
        {[...SECTIONS, ...(isHighScorer ? [BONUS_SECTION[0]] : [])].map((_, i) => {
          // Logic for the dots:
          // 1. A dot is "done" if we've passed that pageIndex AND we aren't in bonus mode
          // 2. A dot is "active" if it's the current pageIndex OR if it's the bonus dot and we are showing bonus
          const isBonusDot = i === SECTIONS.length;
          const isActive = showingBonus ? isBonusDot : (i === pageIndex);
          const isDone = showingBonus ? i < SECTIONS.length : (i < pageIndex);

          return (
            <div
              key={i}
              className={`step-dot ${isDone ? "done" : isActive ? "active" : ""}`}
            />
          );
        })}
      {/* {SECTIONS.map((_, i) => (
        <div
          key={i}
          className={`step-dot ${
            i < pageIndex ? "done" : i === pageIndex ? "active" : ""
          }`}
        />
      ))} */}
    </div>
    <div className="step-label">
      {showingBonus 
        ? `Bonus Section` 
        : `Section ${pageIndex + 1} of ${totalPages}`
      } — <strong>{showingBonus ? BONUS_SECTION[0].title : section.title}</strong>
    </div>

    {/* Score display */}
    {showingBonus && finalScore !== null && (
      <div className="score-summary-card" style={{ 
        textAlign: 'center', 
        padding: '40px 20px', 
        background: 'var(--white)', 
        border: '1px solid rgba(27,78,107,0.1)',
        marginBottom: '32px',
        animation: 'fadeUp 0.5s ease'
      }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase' }}>
          Your Dependency Score
        </div>
        <div style={{ 
          fontSize: '72px', 
          fontFamily: 'var(--font-display)', 
          fontWeight: 'bold',
          color: finalScore > 15 ? "#C0392B" : finalScore > 8 ? "#D4AC0D" : "#2E7D5E",
          margin: '10px 0' 
        }}>
          {finalScore}
        </div>
        <div style={{ 
          display: 'inline-block',
          padding: '6px 16px',
          background: finalScore > 15 ? "#C0392B" : finalScore > 8 ? "#D4AC0D" : "#2E7D5E",
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold',
          letterSpacing: '0.1em',
          borderRadius: '4px'
        }}>
          {finalScore > 25 ? "HIGH" : finalScore > 15 ? "MODERATE" : "LOW"} ADDICTION
        </div>
      </div>
    )}

    {/* Questions (Regular or Bonus) */}
    {currentQuestions.map((q, idx) => (
      <QuestionCard
        key={q.id}
        q={q}
        answers={answers}
        onChange={handleChange}
        index={idx + 1} // Simplified index for bonus
      />
    ))}
      {/* {section.questions.map((q) => {
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
      })} */}

      {/* Contact opt-in — only on last page */}
      {(isLastPage || showingBonus) && (
        <div className="contact-box">
          <label className="contact-checkbox-row">
            <input
              type="checkbox"
              className="lead-checkbox"
              checked={wantsContact}
              onChange={(e) => {
                setWantsContact(e.target.checked);
                setEmailError("");
              }}
            />
            <span className="contact-checkbox-label">
              <strong>I'm open to being contacted.</strong> I'd like to help
              tackle phone addiction — whether that's a quick follow-up
              conversation, early access, or sharing more about my experience.
            </span>
          </label>

          {wantsContact && (
            <div className="contact-fields">
              <input
                className="lead-input"
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
              <input
                className="lead-input"
                type="email"
                placeholder="Your email address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              {emailError && <p className="form-error">{emailError}</p>}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="nav-row">
        {pageIndex > 0 && (
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
        )}

        {/* {!isLastPage ? ( */}
        {!isLastPage && !showingBonus ? (
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
            disabled={loading}
            // disabled={!pageComplete || loading}
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Submit →"}
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
