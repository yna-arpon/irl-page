import { useState } from "react";
import { Link } from "react-router-dom";
import { AIRTABLE_WAITLIST_BASE_ID, postToAirtable } from "../utils/airtable";

const LEAVE_DURATION = 300;

export function Waitlist() {
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
      AIRTABLE_WAITLIST_BASE_ID
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
    <div className="waitlist-page">
      <div className="waitlist-blob" />
      <Link to="/" className="waitlist-back" aria-label="Back to home">
        ←
      </Link>

      <div className="waitlist-card">
        {phase === "success" ? (
          <div key="success" className="waitlist-content waitlist-content-enter">
            <div className="waitlist-success-icon">✓</div>
            <h1 className="waitlist-title">You're in.</h1>
            <p className="waitlist-sub">We'll reach out when the beta opens.</p>
            <Link to="/" className="waitlist-btn waitlist-btn-standalone">
              Done
            </Link>
          </div>
        ) : (
          <div
            key="form"
            className={`waitlist-content${phase === "leaving" ? " waitlist-content-leave" : ""}`}
          >
            <h1 className="waitlist-title">Be first to try irl.</h1>
            <p className="waitlist-sub">
              We'll let you know the moment beta opens — nothing else.
            </p>

            <form className="waitlist-form" onSubmit={handleSubmit}>
              <input
                className="waitlist-input"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <button className="waitlist-btn" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Join waitlist"}
              </button>
            </form>
            {error && <p className="waitlist-error">{error}</p>}

            <p className="waitlist-fine">
              30+ people already on the list. No spam, ever.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
