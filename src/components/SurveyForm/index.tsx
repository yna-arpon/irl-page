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
  const [pageIndex, setPageIndex] = useState(0); // 0, 1, 2

  // Contact opt-in state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wantsContact, setWantsContact] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  // Score is computed once when leaving page 1, then used to decide page 2 route
  const [score, setScore] = useState<number | null>(null);
  const isHighScore = score !== null && score > 30;

  // Always 3 pages total. Page 2 content depends on score.
  const TOTAL_DOTS = 3;

  // The two core sections (demographics = 0, impact = 1)
  const coreSection = SECTIONS[pageIndex] ?? SECTIONS[1];

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

  // Page completion check — only applies to pages 0 and 1
  const currentQuestions = pageIndex < 2 ? coreSection.questions : [];
  const visibleQs = currentQuestions.filter(isVisible);
  const requiredQs = visibleQs.filter((q) => q.type !== "text");
  const pageComplete = requiredQs.every((q) => {
    if (q.type === "multi")
      return (
        Array.isArray(answers[q.id]) && (answers[q.id] as number[]).length > 0
      );
    return answers[q.id] !== undefined;
  });

  const handleNext = () => {
    if (pageIndex === 1) {
      const computed = calculateTotalScore(answers);
      setScore(computed);
      setTimeout(() => {
        document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
        document.body.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    } else {
      setTimeout(() => {
        document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
        document.body.scrollTo({ top: 0, behavior: "smooth" });
      }, 0);
    }
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

    const allQuestions = [
      ...SECTIONS.flatMap((s) => s.questions),
      ...BONUS_SECTION[0].questions,
    ];
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
    if (success) onComplete(score ?? 0);
    else
      alert(
        "Something went wrong submitting your responses. Please try again."
      );
  };

  // Global question offset for numbering
  let globalQuestionOffset = 0;
  for (let i = 0; i < Math.min(pageIndex, 2); i++) {
    globalQuestionOffset += SECTIONS[i].questions.filter(
      (q) => !q.conditional
    ).length;
  }
  let nonConditionalCount = 0;

  const sectionTitle =
    pageIndex === 0
      ? SECTIONS[0].title
      : pageIndex === 1
      ? SECTIONS[1].title
      : isHighScore
      ? BONUS_SECTION[0].title
      : "Almost done";

  return (
    <div>
      {/* Step indicator — always 3 dots */}
      <div className="step-indicator">
        {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
          <div
            key={i}
            className={`step-dot ${
              i < pageIndex ? "done" : i === pageIndex ? "active" : ""
            }`}
          />
        ))}
      </div>
      <div className="step-label">
        Section {pageIndex + 1} of {TOTAL_DOTS} —{" "}
        <strong>{sectionTitle}</strong>
      </div>

      {/* ── Page 0 & 1: core survey questions ── */}
      {pageIndex < 2 &&
        coreSection.questions.map((q) => {
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

      {/* ── Page 2 (high score): score card + bonus questions + contact ── */}
      {pageIndex === 2 && isHighScore && (
        <>
          {/* Score card */}
          <div
            className="score-summary-card"
            style={{
              textAlign: "center",
              padding: "40px 20px",
              background: "var(--white)",
              border: "1px solid rgba(27,78,107,0.1)",
              marginBottom: "32px",
              animation: "fadeUp 0.5s ease",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                color: "var(--muted)",
                textTransform: "uppercase",
              }}
            >
              Your Dependency Score
            </div>
            <div
              style={{
                fontSize: "72px",
                fontFamily: "var(--font-display)",
                fontWeight: "bold",
                color:
                  score > 25 ? "#C0392B" : score > 15 ? "#D4AC0D" : "#2E7D5E",
                margin: "10px 0",
              }}
            >
              {score}
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "6px 16px",
                background:
                  score > 25 ? "#C0392B" : score > 15 ? "#D4AC0D" : "#2E7D5E",
                color: "white",
                fontSize: "10px",
                fontWeight: "bold",
                letterSpacing: "0.1em",
                borderRadius: "4px",
              }}
            >
              {score > 25 ? "HIGH" : "MODERATE"} ADDICTION
            </div>
          </div>

          {/* Bonus questions */}
          {BONUS_SECTION[0].questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              q={q}
              answers={answers}
              onChange={handleChange}
              index={idx + 1}
            />
          ))}
        </>
      )}

      {/* ── Contact box — always shown on page 2 ── */}
      {pageIndex === 2 && (
        <div className="contact-box">
          <h3>Enter to win a $15 coffee card!</h3>
          <sub>
            Enter your name and email to join — we'll only be in touch if you
            win or opt in below.
          </sub>
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
              <strong>Optional:</strong> I'm open to follow-ups about tackling
              phone addiction (early access, quick chats, sharing my
              experience).
            </span>
          </label>
        </div>
      )}

      {/* Navigation */}
      <div className="nav-row">
        {pageIndex > 0 && (
          <button className="back-btn" onClick={handleBack}>
            Back
          </button>
        )}

        {pageIndex < 2 ? (
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
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Submit →"}
          </button>
        )}
      </div>
    </div>
  );
}
