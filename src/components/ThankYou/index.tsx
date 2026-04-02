interface ThankYouScreenProps {
  onReset: () => void;
}

export function ThankYouScreen({ onReset }: ThankYouScreenProps) {
  return (
    <div className="thankyou-screen">
      <div className="thankyou-icon">✓</div>
      <h2 className="thankyou-title">Thanks for sharing.</h2>
      <p className="thankyou-sub">
        Your answers will directly shape what we build. We appreciate the
        honesty.
      </p>
      <button className="retry-btn" onClick={onReset}>
        ↩ Start over
      </button>
    </div>
  );
}
