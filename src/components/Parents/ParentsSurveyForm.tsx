import { useState, useCallback } from "react";
import type { Answers, Question } from "../../types";
import {
  PAGE_1_QUESTIONS,
  PER_CHILD_QUESTIONS,
  GENERAL_QUESTIONS,
} from "../../data/parentQuestions";
import { MultiChildQuestion } from "./ChildAccordion";
import { MultiInput, TextInput, SingleInput } from "../inputs";
import { postToAirtable, AIRTABLE_PARENTS_BASE_ID } from "../../utils/airtable";

const TOTAL_PAGES = 3;

interface ParentsSurveyFormProps {
  onComplete: () => void;
}

export function ParentsSurveyForm({ onComplete }: ParentsSurveyFormProps) {
  const [answers, setAnswers] = useState<Answers>({});
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Contact opt-in state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wantsContact, setWantsContact] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleChange = useCallback(
    (qId: string, val: number | string | number[]) => {
      setAnswers((prev) => ({ ...prev, [qId]: val }));
    },
    []
  );

  // Number of kids from page 0 answer (index into ['1','2','3','4','5+'])
  const numKidsIndex = answers["p_numKids"] as number | undefined;
  const numKids =
    numKidsIndex !== undefined
      ? numKidsIndex === 4
        ? 5
        : numKidsIndex + 1
      : 1;

  // ── Visibility helpers ────────────────────────────────────

  // Per-child: conditional checks against the child-prefixed parent answer
  const isPerChildVisible = (q: Question, childIndex: number): boolean => {
    if (!q.conditional) return true;
    const pid =
      numKids === 1
        ? q.conditional.parent
        : `${q.conditional.parent}_child${childIndex}`;
    const parentVal = answers[pid];
    return Array.isArray(parentVal)
      ? parentVal.includes(q.conditional.value as number)
      : parentVal === q.conditional.value;
  };

  // General: conditional checks against unprefixed answer
  const isGeneralVisible = (q: Question): boolean => {
    if (!q.conditional) return true;
    const parentVal = answers[q.conditional.parent];
    return Array.isArray(parentVal)
      ? parentVal.includes(q.conditional.value as number)
      : parentVal === q.conditional.value;
  };

  // ── Page completion ───────────────────────────────────────

  const page0Complete = answers["p_numKids"] !== undefined;

  const page1Complete = (() => {
    // Every required visible question must be answered for every child
    return PER_CHILD_QUESTIONS.every((q) => {
      if (q.type === "text") return true; // text is optional
      return Array.from({ length: numKids }).every((_, ci) => {
        if (!isPerChildVisible(q, ci)) return true;
        const pid = numKids === 1 ? q.id : `${q.id}_child${ci}`;
        const val = answers[pid];
        if (q.type === "multi")
          return Array.isArray(val) && (val as number[]).length > 0;
        return val !== undefined;
      });
    });
  })();

  const page2Complete = GENERAL_QUESTIONS.filter(
    (q) => q.type === "multi" && isGeneralVisible(q)
  ).every((q) => {
    const val = answers[q.id];
    return Array.isArray(val) && (val as number[]).length > 0;
  });

  const pageComplete = [page0Complete, page1Complete, page2Complete][pageIndex];

  // ── Navigation ────────────────────────────────────────────

  const scrollTop = (delay = 0) => {
    setTimeout(() => {
      document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
      document.body.scrollTo({ top: 0, behavior: "smooth" });
    }, delay);
  };

  const handleNext = () => {
    setPageIndex((i) => i + 1);
    scrollTop(pageIndex === 0 ? 50 : 0);
  };

  const handleBack = () => {
    setPageIndex((i) => i - 1);
    scrollTop();
  };

  const handleSubmit = async () => {
      if (wantsContact && (!email || !email.includes("@"))) {
        setEmailError("Please enter a valid email so we can reach you.");
        return;
      }
      setEmailError("");
      setLoading(true);
  
      const allQuestions = [
        ...PER_CHILD_QUESTIONS,
        ...GENERAL_QUESTIONS
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
      }, 
      AIRTABLE_PARENTS_BASE_ID);
  
      setLoading(false);
      if (success) onComplete();
      else
        alert(
          "Something went wrong submitting your responses. Please try again."
        );
    };

  const sectionTitles = [
    "About your family",
    "About your children",
    "Your experience",
  ];

  let questionCounter = 0;

  return (
    <div>
      {/* Step dots */}
      <div className="step-indicator">
        {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
          <div
            key={i}
            className={`step-dot ${
              i < pageIndex ? "done" : i === pageIndex ? "active" : ""
            }`}
          />
        ))}
      </div>
      <div className="step-label">
        Section {pageIndex + 1} of {TOTAL_PAGES} —{" "}
        <strong>{sectionTitles[pageIndex]}</strong>
      </div>

      {/* ── PAGE 0: how many kids ── */}
      {pageIndex === 0 && (
        <div className="q-card">
          <div className="q-num">Question 1</div>
          <div className="q-text">{PAGE_1_QUESTIONS[0].text}</div>
          <SingleInput
            qId="p_numKids"
            options={PAGE_1_QUESTIONS[0].options!}
            value={answers["p_numKids"] as number | null}
            onChange={handleChange}
          />
        </div>
      )}

      {/* ── PAGE 1: per-child questions, accordion inside each card ── */}
      {pageIndex === 1 &&
        PER_CHILD_QUESTIONS.map((q) => {
          // Check visibility: for multi-child, check child 0 as representative
          // Conditional follow-ups are still shown if any child triggered them
          const anyChildVisible = Array.from({ length: numKids }).some(
            (_, ci) => isPerChildVisible(q, ci)
          );
          if (!anyChildVisible) return null;

          if (!q.conditional) questionCounter++;

          return (
            <MultiChildQuestion
              key={q.id}
              question={q}
              childCount={numKids}
              answers={answers}
              onChange={handleChange}
              questionIndex={questionCounter}
            />
          );
        })}

      {/* ── PAGE 2: general questions ── */}
      {pageIndex === 2 &&
        (() => {
          let genCounter = 0;
          return GENERAL_QUESTIONS.map((q) => {
            if (!isGeneralVisible(q)) return null;
            if (!q.conditional) genCounter++;
            return (
              <div
                key={q.id}
                className={`q-card ${
                  q.conditional ? "q-card-conditional" : ""
                }`}
              >
                <div className="q-num">
                  {q.conditional ? "↳ Follow-up" : `Question ${genCounter}`}
                </div>
                <div className="q-text">{q.text}</div>
                {q.sub && <div className="q-sub">{q.sub}</div>}

                {q.type === "text" && (
                  <TextInput
                    qId={q.id}
                    value={answers[q.id] as string | undefined}
                    placeholder={q.placeholder}
                    onChange={handleChange}
                  />
                )}

                {q.type === "multi" && (
                  <MultiInput
                    qId={q.id}
                    options={q.options!}
                    value={(answers[q.id] as number[]) || []}
                    onChange={handleChange}
                  />
                )}
              </div>
            );
          });
        })()}
      
      {/* ── Contact opt-in (page 2 only) ── */}
      {pageIndex === 2 && (
        <div className="contact-box">
          <h3>Want to help us build this?</h3>
          <sub>
            Leave your details if you'd like to be involved — early access,
            a quick chat, or sharing your experience. No spam, ever.
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
              placeholder="Your email address"
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
              <strong>Optional:</strong> I'm open to follow-ups — early access,
              a quick chat, or helping shape the product.
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
        {pageIndex < TOTAL_PAGES - 1 ? (
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
            disabled={!page2Complete || loading}
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
