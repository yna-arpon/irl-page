import { useState } from "react";
import type { Answers } from "../../types";
import { SECTIONS } from "../../data/questions";
import { postToAirtable } from "../../utils/airtable";

interface ThankYouScreenProps {
  answers: Answers;
  onReset: () => void;
}

export function ThankYouScreen({ answers, onReset }: ThankYouScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wantsContact, setWantsContact] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (wantsContact && (!email || !email.includes("@"))) {
      setError("Please enter a valid email so we can reach you.");
      return;
    }
    setLoading(true);
    setError("");

    // Flatten answers to a readable string for Airtable
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

    const ok = await postToAirtable({
      Name: name || "(not provided)",
      Email: wantsContact ? email : "(opted out)",
      WantsContact: wantsContact,
      Answers: answersSummary,
    });

    setLoading(false);
    if (ok) setSubmitted(true);
    else setError("Something went wrong — please try again.");
  };

  if (submitted) {
    return (
      <div className="thankyou-screen">
        <div className="thankyou-icon">✓</div>
        <h2 className="thankyou-title">Thanks for sharing.</h2>
        <p className="thankyou-sub">
          {wantsContact
            ? "We'll be in touch — your perspective will directly shape what we build."
            : "Your responses help us understand the problem better. We appreciate it."}
        </p>
        <button className="retry-btn" onClick={onReset}>
          ↩ Start over
        </button>
      </div>
    );
  }

  return (
    <div className="thankyou-screen">
      <div className="thankyou-icon">🙌</div>
      <h2 className="thankyou-title">That's everything.</h2>
      <p className="thankyou-sub">
        Your answers help us understand what's really going on with phone use —
        and what kind of solution would actually work.
      </p>

      <div className="contact-box">
        <label className="contact-checkbox-row">
          <input
            type="checkbox"
            className="lead-checkbox"
            checked={wantsContact}
            onChange={(e) => setWantsContact(e.target.checked)}
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
          </div>
        )}

        {error && <p className="form-error">{error}</p>}
      </div>

      <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit responses →"}
      </button>

      <p className="submit-hint">
        {wantsContact
          ? "We'll only use your email to follow up about this research."
          : "No contact info needed — your answers are submitted anonymously."}
      </p>
    </div>
  );
}
