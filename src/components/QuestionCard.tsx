import type { Question, Answers } from "../types";
import {
  ScaleInput,
  TextInput,
  YNInput,
  MultiInput,
  SingleInput,
} from "./inputs";

interface QuestionCardProps {
  q: Question;
  answers: Answers;
  onChange: (qId: string, val: number | string | number[]) => void;
  index: number;
}

export function QuestionCard({
  q,
  answers,
  onChange,
  index,
}: QuestionCardProps) {
  // Evaluate conditional visibility
  if (q.conditional) {
    const parentVal = answers[q.conditional.parent];
    const targetVal = q.conditional.value;

    if (Array.isArray(parentVal)) {
      // Multi-select parent
      if (!parentVal.includes(targetVal as any)) return null;
    } else if (q.conditional.minValue !== undefined) {
      // Scale values
      if (typeof parentVal !== "number" || parentVal < q.conditional.minValue)
        return null;
    } else {
      // Single select / Y/N
      if (parentVal !== targetVal) return null;
    }
  }

  return (
    <div className={`q-card ${q.conditional ? "q-card-conditional" : ""}`}>
      <div className="q-num">
        {q.conditional ? "↳ Follow-up" : `Question ${index}`}
      </div>
      <div className="q-text">{q.text}</div>
      {q.sub && <div className="q-sub">{q.sub}</div>}

      {q.type === "scale" && (
        <ScaleInput
          qId={q.id}
          value={answers[q.id] as number | undefined}
          low={q.low!}
          high={q.high!}
          onChange={onChange}
        />
      )}
      {q.type === "yn" && (
        <YNInput
          qId={q.id}
          value={answers[q.id] as string | undefined}
          onChange={onChange}
        />
      )}
      {q.type === "multi" && (
        <MultiInput
          qId={q.id}
          options={q.options!}
          value={(answers[q.id] as number[]) || []}
          onChange={onChange}
        />
      )}
      {q.type === "single" && (
        <SingleInput
          qId={q.id}
          options={q.options!}
          value={answers[q.id] !== undefined ? (answers[q.id] as number) : null}
          onChange={onChange}
        />
      )}
      {q.type === "text" && (
        <TextInput
          qId={q.id}
          value={answers[q.id] as string | undefined}
          placeholder={q.placeholder}
          onChange={onChange}
        />
      )}
    </div>
  );
}
