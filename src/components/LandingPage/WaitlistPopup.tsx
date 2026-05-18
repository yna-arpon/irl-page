import { useState } from "react";
import { AIRTABLE_WAITLIST_BASE_ID, postToAirtable } from "../../utils/airtable";

interface WaitlistPopupProps {
  onClose: () => void;
}

export function WaitlistPopup({ onClose }: WaitlistPopupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);

    const success = await postToAirtable({
      Name: name || "(not provided)",
      Email: email,
    }, AIRTABLE_WAITLIST_BASE_ID);

    setLoading(false);
    if (success) setSubmitted(true);
    else setError("Something went wrong. Please try again.");
  };

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {submitted ? (
          <div className="modal-success">
            <div className="modal-success-icon">✓</div>
            <h3 className="modal-success-title">You're in.</h3>
            <p className="modal-success-sub">
              We'll reach out when the beta opens. Talk soon.
            </p>
            <button className="modal-done-btn" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <h3 className="modal-title">Be the first to know.</h3>
            <p className="modal-sub">
              We'll let you know the moment beta opens — nothing else.
            </p>

            <div className="modal-fields">
              <input
                className="modal-input"
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
              <input
                className="modal-input"
                type="email"
                placeholder="Your email address*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              {error && <p className="modal-error">{error}</p>}
            </div>

            <button
              className="modal-submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Join the waitlist →"}
            </button>

            <p className="modal-fine">No spam. Unsubscribe any time.</p>
          </>
        )}
      </div>
    </div>
  );
}