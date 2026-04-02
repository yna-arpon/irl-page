import type { Question, Answers } from "../types";
import {
  ScaleInput,
  Scale10Input,
  TextInput,
  YNInput,
  MultiInput,
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
    if (q.conditional.minValue !== undefined) {
      if (typeof parentVal !== "number" || parentVal < q.conditional.minValue)
        return null;
    } else {
      if (parentVal !== q.conditional.value) return null;
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
      {q.type === "scale10" && (
        <Scale10Input
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
      {q.type === "text" && (
        <TextInput
          qId={q.id}
          value={answers[q.id] as string | undefined}
          onChange={onChange}
        />
      )}
    </div>
  );
}
