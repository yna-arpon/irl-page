import { useState } from "react";
import { Link } from "react-router-dom";
import { postToAirtable } from "../utils/airtable";

const LEAVE_DURATION = 300;

interface SignupPageProps {
  baseId: string;
  blobPosition: "tr" | "bl";
  title: string;
  subtitle: string;
  buttonLabel: string;
  loadingLabel: string;
  finePrint: string;
  successTitle: string;
  successSubtitle: string;
}

export function SignupPage({
  baseId,
  blobPosition,
  title,
  subtitle,
  buttonLabel,
  loadingLabel,
  finePrint,
  successTitle,
  successSubtitle,
}: SignupPageProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"form" | "leaving" | "success">("form");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);

    const success = await postToAirtable(
      {
        Name: "(not provided)",
        Email: email,
      },
      baseId
    );

    setLoading(false);
    if (success) {
      setPhase("leaving");
      setTimeout(() => setPhase("success"), LEAVE_DURATION);
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className={`signup-blob signup-blob--${blobPosition}`} />
      <Link to="/" className="signup-back" aria-label="Back to home">
        ←
      </Link>

      <div className="signup-card">
        {phase === "success" ? (
          <div key="success" className="signup-content signup-content-enter">
            <div className="signup-success-icon">✓</div>
            <h1 className="signup-title">{successTitle}</h1>
            <p className="signup-sub">{successSubtitle}</p>
            <Link to="/" className="signup-btn signup-btn-standalone">
              Done
            </Link>
          </div>
        ) : (
          <div
            key="form"
            className={`signup-content${phase === "leaving" ? " signup-content-leave" : ""}`}
          >
            <h1 className="signup-title">{title}</h1>
            <p className="signup-sub">{subtitle}</p>

            <form className="signup-form" onSubmit={handleSubmit}>
              <input
                className="signup-input"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <button className="signup-btn" type="submit" disabled={loading}>
                {loading ? loadingLabel : buttonLabel}
              </button>
            </form>
            {error && <p className="signup-error">{error}</p>}

            <p className="signup-fine">{finePrint}</p>
          </div>
        )}
      </div>
    </div>
  );
}
