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
      <section className="hero">
        <div className="hero-left">
          <h1 className="hero-heading">
            Help us define<br />
            a healthier age<br />
            of <em>phone use.</em>
          </h1>
          <p className="hero-body">
            <strong>irl</strong> is a wellness companion that empowers you by understanding your digital patterns
            and redirects you toward what matters — to restore balance between technology and your life.
          </p>

          <div className="hero-form">
            {submitted ? (
              <p className="hero-success">You're on the list. We'll be in touch.</p>
            ) : (
              <form onSubmit={handleSubmit} className="hero-form">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="hero-form-input"
                  required
                />
                <button type="submit" className="hero-form-btn">Join the waitlist →</button>
              </form>
            )}
          </div>

          <div className="hero-meta">
            <span className="hero-count">⬤ 30 already on the list</span>
            <span className="hero-sep">·</span>
            <span className="hero-tag">private beta · summer '26</span>
          </div>
        </div>

        <div className="hero-right">
          
          
        </div>
    
    </section>

    </div>
  );
}
