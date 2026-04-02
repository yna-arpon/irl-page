// ── ScaleInput ────────────────────────────────────────────────
interface ScaleInputProps {
  qId: string;
  value: number | undefined;
  low: string;
  high: string;
  onChange: (qId: string, val: number) => void;
}

export function ScaleInput({
  qId,
  value,
  low,
  high,
  onChange,
}: ScaleInputProps) {
  return (
    <div>
      <div className="scale-wrap">
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            className={`scale-btn ${value === v ? "selected" : ""}`}
            onClick={() => onChange(qId, v)}
            aria-label={`${v}`}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="scale-labels">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

// ── Scale10Input ──────────────────────────────────────────────
interface Scale10InputProps {
  qId: string;
  value: number | undefined;
  low: string;
  high: string;
  onChange: (qId: string, val: number) => void;
}

export function Scale10Input({
  qId,
  value,
  low,
  high,
  onChange,
}: Scale10InputProps) {
  return (
    <div>
      <div className="scale10-wrap">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
          <button
            key={v}
            className={`scale10-btn ${value === v ? "selected" : ""}`}
            onClick={() => onChange(qId, v)}
            aria-label={`${v}`}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="scale-labels">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

// ── TextInput ─────────────────────────────────────────────────
interface TextInputProps {
  qId: string;
  value: string | undefined;
  onChange: (qId: string, val: string) => void;
}

export function TextInput({ qId, value, onChange }: TextInputProps) {
  return (
    <textarea
      className="text-input"
      placeholder="e.g. time with family, focus at work, sleep, hobbies I used to love..."
      value={value || ""}
      onChange={(e) => onChange(qId, e.target.value)}
      rows={3}
    />
  );
}

// ── YNInput ───────────────────────────────────────────────────
interface YNInputProps {
  qId: string;
  value: string | undefined;
  onChange: (qId: string, val: string) => void;
}

export function YNInput({ qId, value, onChange }: YNInputProps) {
  return (
    <div className="yn-wrap">
      {["yes", "no"].map((opt) => (
        <button
          key={opt}
          className={`yn-btn ${value === opt ? "selected" : ""}`}
          onClick={() => onChange(qId, opt)}
        >
          {opt === "yes" ? "Yes" : "No"}
        </button>
      ))}
    </div>
  );
}

// ── MultiInput ────────────────────────────────────────────────
interface MultiInputProps {
  qId: string;
  options: string[];
  value: number[];
  onChange: (qId: string, val: number[]) => void;
}

export function MultiInput({
  qId,
  options,
  value = [],
  onChange,
}: MultiInputProps) {
  const toggle = (idx: number) => {
    const next = value.includes(idx)
      ? value.filter((i) => i !== idx)
      : [...value, idx];
    onChange(qId, next);
  };
  return (
    <div>
      <div className="multi-wrap">
        {options.map((opt, idx) => (
          <button
            key={idx}
            className={`multi-btn ${value.includes(idx) ? "selected" : ""}`}
            onClick={() => toggle(idx)}
          >
            <span className="check">{value.includes(idx) ? "✓" : ""}</span>
            {opt}
          </button>
        ))}
      </div>
      <div
        style={{ fontSize: "11px", color: "var(--muted)", marginTop: "10px" }}
      >
        Select one or more, then continue
      </div>
    </div>
  );
}
