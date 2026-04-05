import { useState, useCallback } from "react";
import type { Answers, Question } from "../../types";
import { SECTIONS } from "../../data/questions";
import { QuestionCard } from "../QuestionCard";
import { postToAirtable } from "../../utils/airtable";

interface SurveyFormProps {
  onComplete: () => void;
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

  const handleSubmit = async () => {
    if (wantsContact && (!email || !email.includes("@"))) {
      setEmailError("Please enter a valid email so we can reach you.");
      return;
    }
    setEmailError("");
    setLoading(true);

    const allQuestions = SECTIONS.flatMap((s) => s.questions);
    const answersSummary = allQuestions
      .filter((q) => answers[q.id] !== undefined)
      .map((q) => {
        let val = answers[q.id];
        if (Array.isArray(val))
          val = (val as number[]).map((i) => q.options![i]).join(", ");
        return `${q.id}: ${val}`;
      })
      .join(" | ");

    await postToAirtable({
      Name: name || "(not provided)",
      Email: wantsContact ? email : "(opted out)",
      WantsContact: wantsContact,
      Answers: answersSummary,
    });

    setLoading(false);
    onComplete();
  };

  // Global question numbering across pages
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
        {SECTIONS.map((_, i) => (
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

      {/* Contact opt-in — only on last page */}
      {isLastPage && (
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

        {!isLastPage ? (
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
            disabled={!pageComplete || loading}
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
