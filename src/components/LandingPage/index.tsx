import { useState } from "react";
import { AIRTABLE_WAITLIST_BASE_ID, postToAirtable } from "../../utils/airtable";
import { Link } from "react-router-dom";
import { WaitlistPopup } from "./WaitlistPopup";
import { appMockup } from "../../assets/app-mockup.svg";

export function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email) return;

  const success = await postToAirtable({
    Name: "(not provided)",
    Email: email,
  }, AIRTABLE_WAITLIST_BASE_ID);

  if (success) setSubmitted(true);
};

  return (
    <div className="body">
      {/* ── NAV ── */}
      <nav className="nav">
        <span className="nav-logo">irl</span>
        <div className="nav-links">
          <a href="#mission" className="nav-link">Mission</a>
          <a href="#get-involved" className="nav-link">Get Involved</a>
        </div>
      </nav>
      
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <h1 className="hero-heading">
            Help us define<br />
            a <em>healthier age</em><br />
            of phone use.
          </h1>
          <p className="hero-body">
            <strong>irl</strong> is a wellness companion that empowers you by understanding your digital patterns
            and redirects you toward what matters — to restore balance between technology and your life.
          </p>
          {/* TO DO: Implement Airtable integration */}
          <div className="hero-form-wrap">
            {submitted ? (
              <p className="hero-success">You're on the list! We'll be in touch.</p>
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
          {/* TO DO: Update list dynamically */}
          {/* <div className="hero-meta">
            <span className="hero-count">⬤ 30 already on the list</span>
            <span className="hero-sep">·</span>
            <span className="hero-tag">private beta · summer '26</span>
          </div> */}
        </div>

        <div className="hero-right">
          <img src={ appMockup } alt="App Mockup" className="hero-image" />
        </div>
    </section>

    {/* ── MISSION ── */}
    <section className="mission" id="mission">
      <div className="mission-inner">
        <p className="section-label">Our Mission</p>
        <h2 className="mission-heading">
          Your phone should work for you.<br />
          Not the other way around.
        </h2>
        <p className="mission-body">
          We all pick up our phones more than we mean to. It's not a willpower problem —
          the apps are just really, really good at pulling you back in. irl is trying to
          change that dynamic, quietly and without judgement.
        </p>
        <p className="mission-body">
          And with AI, we can finally make that personal. Not a generic screen time limit
          that treats everyone the same. Instead IRL actually understands your patterns,
          your triggers, and what a healthier day looks like <em>for you.</em>
        </p>
      </div>
    </section>

    {/* ── GET INVOLVED ── */}
    {showWaitlist && <WaitlistPopup onClose={() => setShowWaitlist(false)} />}
    <section className="involve" id="get-involved">
      <div className="involve-inner">
        <p className="section-label">Get Involved</p>
        <h2 className="involve-heading">
          Built <em>with</em> the community,<br /> <em>for</em> the community.
        </h2>
        <p className="involve-sub">Join us in redefining what it means to use technology mindfully.</p>

        <div className="involve-tiers">
          <div className="tier">
            <div className="tier-num">01 / Waitlist</div>
            <div className="tier-time">5 min</div>
            <h3 className="tier-title">Be early.</h3>
            <p className="tier-body">
              Drop your email and we'll notify you when we launch our private beta. No spam, ever.
            </p>
            <button
              className="tier-btn"
              onClick={() => setShowWaitlist(true)}
            >
              Reserve a seat
            </button>
          </div>

          <div className="tier">
            <div className="tier-num">02 / Contribute</div>
            <div className="tier-time">3 min</div>
            <h3 className="tier-title">Help shape it.</h3>
            <p className="tier-body">
              Take our survey whether you're worried for yourself or your children, and help shape what irl becomes. 
              Your feedback will directly influence our design and features.
            </p>
            <Link to="/parents" className="tier-btn">
              For Parents
            </Link>
            <Link to="/survey" className="tier-btn">
              For Individuals
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* ── FOOTER ── */}
    <footer className="footer">
      <span className="footer-logo">irl</span>
      {/* <span className="footer-made">made carefully · Canada </span> */}
      <div className="footer-links">
        <a href="#" className="footer-link">privacy</a>
        <a href="#" className="footer-link">contact</a>
      </div>
    </footer>
    </div>
  );
}
