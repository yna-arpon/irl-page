import { useState } from "react";

export function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="body">
      {/* ── NAV ── */}
      <nav className="nav">
        <span className="nav-logo">irl</span>
        <div className="nav-links">
          <a href="#mission" className="nav-link">mission</a>
          <a href="#get-involved" className="nav-link">get involved</a>
        </div>
      </nav>
      
      {/* ── HERO ── */}
    </div>
  );
}
