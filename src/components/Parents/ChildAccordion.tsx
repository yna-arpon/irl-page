import { useState } from "react";
import { SliderInput, TextInput, MultiInput, SingleInput } from "../inputs";
import type { Question, Answers } from "../../types";

interface ChildAnswerAccordionProps {
  childIndex: number;
  childCount: number;
  question: Question;
  answers: Answers;
  onChange: (qId: string, val: number | string | number[]) => void;
  openIndex: number | null;
  onOpen: (index: number | null) => void;
  onAnswered: (childIndex: number) => void; // called when a definitive answer is made
}

export function ChildAnswerAccordion({
  childIndex,
  // childCount,
  question,
  answers,
  onChange,
  openIndex,
  onOpen,
  onAnswered,
}: ChildAnswerAccordionProps) {
  const isOpen = openIndex === childIndex;
  const pid = `${question.id}_child${childIndex}`;
  const val = answers[pid];

  const handleChange = (v: number | string | number[]) => {
    onChange(pid, v);
    // For single-select and scale, auto-advance after a short delay
    // For multi and text, the user signals completion themselves
    if (question.type === "single") {
      setTimeout(() => onAnswered(childIndex), 300);
    }
  };

  const handleSliderCommit = (v: number) => {
    onChange(pid, v);
    // Fire onAnswered when the user releases the slider (onMouseUp/onTouchEnd)
    setTimeout(() => onAnswered(childIndex), 400);
  };

  let isAnswered = false;
  if (question.type === "multi")
    isAnswered = Array.isArray(val) && (val as number[]).length > 0;
  else if (question.type === "text")
    isAnswered = typeof val === "string" && val.trim().length > 0;
  else isAnswered = val !== undefined;

  return (
    <div
      className={`accordion ${isOpen ? "accordion-open" : ""}`}
      style={{ marginBottom: "8px" }}
    >
      <button
        className="accordion-header"
        onClick={() => onOpen(isOpen ? null : childIndex)}
        type="button"
      >
        <div className="accordion-label">
          <span className="accordion-title">Child {childIndex + 1}</span>
          {isAnswered && <span className="accordion-badge">✓</span>}
        </div>
        <span className="accordion-chevron">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="accordion-body">
          {question.type === "single" && (
            <SingleInput
              qId={pid}
              options={question.options!}
              value={val as number | null}
              onChange={(_, v) => handleChange(v)}
            />
          )}
          {question.type === "scale" && (
            <SliderInput
              qId={pid}
              value={val as number | undefined}
              low={question.low!}
              high={question.high!}
              onChange={(_, v) => onChange(pid, v)}
              onCommit={(v) => handleSliderCommit(v)}
            />
          )}
          {question.type === "multi" && (
            <MultiInput
              qId={pid}
              options={question.options!}
              value={(val as number[]) || []}
              onChange={(_, v) => handleChange(v)}
            />
          )}
          {question.type === "text" && (
            <TextInput
              qId={pid}
              value={val as string | undefined}
              placeholder={question.placeholder}
              onChange={(_, v) => handleChange(v)}
            />
          )}
        </div>
      )}
    </div>
  );
}

interface MultiChildQuestionProps {
  question: Question;
  childCount: number;
  answers: Answers;
  onChange: (qId: string, val: number | string | number[]) => void;
  questionIndex: number;
}

export function MultiChildQuestion({
  question,
  childCount,
  answers,
  onChange,
  questionIndex,
}: MultiChildQuestionProps) {
  const [openChild, setOpenChild] = useState<number | null>(0);
  const isConditional = !!question.conditional;

  // When a child answers, open the next child's accordion (or close if last)
  const handleAnswered = (childIndex: number) => {
    if (childIndex < childCount - 1) {
      setOpenChild(childIndex + 1);
    } else {
      setOpenChild(null);
    }
  };

  const renderDirectInput = () => {
    const pid = question.id;
    const val = answers[pid];
    const handleChange = (_: string, v: number | string | number[]) =>
      onChange(pid, v);

    return (
      <>
        {question.type === "single" && (
          <SingleInput
            qId={pid}
            options={question.options!}
            value={val as number | null}
            onChange={handleChange}
          />
        )}
        {question.type === "scale" && (
          <SliderInput
            qId={pid}
            value={val as number | undefined}
            low={question.low!}
            high={question.high!}
            onChange={handleChange}
            onCommit={() => {}}
          />
        )}
        {question.type === "multi" && (
          <MultiInput
            qId={pid}
            options={question.options!}
            value={(val as number[]) || []}
            onChange={handleChange}
          />
        )}
        {question.type === "text" && (
          <TextInput
            qId={pid}
            value={val as string | undefined}
            placeholder={question.placeholder}
            onChange={handleChange}
          />
        )}
      </>
    );
  };

  return (
    <div className={`q-card ${isConditional ? "q-card-conditional" : ""}`}>
      <div className="q-num">
        {isConditional ? "↳ Follow-up" : `Question ${questionIndex}`}
      </div>
      <div className="q-text">{question.text}</div>
      {question.sub && <div className="q-sub">{question.sub}</div>}

      {childCount === 1 ? (
        renderDirectInput()
      ) : (
        <div style={{ marginTop: "12px" }}>
          {Array.from({ length: childCount }).map((_, ci) => (
            <ChildAnswerAccordion
              key={ci}
              childIndex={ci}
              childCount={childCount}
              question={question}
              answers={answers}
              onChange={onChange}
              openIndex={openChild}
              onOpen={setOpenChild}
              onAnswered={handleAnswered}
            />
          ))}
        </div>
      )}
    </div>
  );
}
