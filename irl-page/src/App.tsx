import { useState, useCallback } from 'react'
import './App.css'

// ── TYPES ──────────────────────────────────────────────────────
type QuestionType = 'scale' | 'yn' | 'multi'

interface Conditional {
  parent: string
  value: string
}

interface Question {
  id: string
  text: string
  sub: string | null
  type: QuestionType
  low?: string
  high?: string
  conditional?: Conditional
  options?: string[]
  weight: string | null
}

type Answers = Record<string, number | string | number[]>

interface TierResult {
  tier: string
  emoji: string
  badge: string
  badgeColor: string
  desc: string
}

interface ScoreResult {
  immersionScore: number
  willingScore: number
}

// ── AIRTABLE CONFIG (reads from .env) ──────────────────────────
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const AIRTABLE_TABLE   = 'Leads'

// ── QUESTION DEFINITIONS ───────────────────────────────────────
const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'How motivated are you to reduce your daily screen time?',
    sub: '1 = you have 14 apps to check before you can even answer this.',
    type: 'scale',
    low: 'Not at all', high: 'Fully committed',
    weight: 'willing',
  },
  {
    id: 'q2',
    text: 'You see a notification appear. How long can you genuinely wait before checking it?',
    sub: '1 = you already opened it while reading this question.',
    type: 'scale',
    low: 'Immediately', high: 'Hours later',
    weight: 'control',
  },
  {
    id: 'q3',
    text: 'How willing are you to spend 60 uninterrupted minutes with zero screens of any kind?',
    sub: 'Phone, laptop, TV, watch — all of it. Gone. For one hour.',
    type: 'scale',
    low: 'That sounds awful', high: 'Done it today',
    weight: 'willing',
  },
  {
    id: 'q4',
    text: 'There\'s a pause in a conversation. Someone stops talking. What do you do?',
    sub: '1 = your hand is already moving toward your pocket. 5 = you hold the silence.',
    type: 'scale',
    low: 'Reach for phone', high: 'Stay present',
    weight: 'control',
  },
  {
    id: 'q5',
    text: 'Have you tried to cut back on your phone use before?',
    sub: null,
    type: 'yn',
    weight: null,
  },
  {
    id: 'q5a',
    text: 'What happened when you tried?',
    sub: 'Select all that apply.',
    type: 'multi',
    conditional: { parent: 'q5', value: 'yes' },
    options: [
      'Gave up after a few days',
      'It worked short-term but didn\'t stick',
      'App blockers didn\'t help',
      'Found myself on a different app instead',
      'Still going — but it\'s a struggle',
    ],
    weight: 'relapse',
  },
  {
    id: 'q6',
    text: 'How committed are you to keeping your phone out of your bedroom entirely?',
    sub: 'Doomscrolling to 2am while \'winding down\' is still a 1.',
    type: 'scale',
    low: 'Never happening', high: 'Already doing it',
    weight: 'willing',
  },
  {
    id: 'q7',
    text: 'Your FYP / algorithm knows your emotional state better than your closest friends. How okay are you with that?',
    sub: 'FYP = \'For You Page.\' If you needed that note, this question may not be about you.',
    type: 'scale',
    low: 'Honestly fine', high: 'That\'s a real problem',
    weight: 'awareness',
  },
  {
    id: 'q8',
    text: 'What typically triggers you to reach for your phone?',
    sub: 'Select all that apply.',
    type: 'multi',
    options: [
      'Boredom',
      'Anxiety or stress',
      'Loneliness',
      'Avoiding something',
      'Pure habit — no reason',
      'FOMO / checking in',
    ],
    weight: 'trigger',
  },
  {
    id: 'q9',
    text: 'On a scale of 1–5, how genuinely ready are you to change your relationship with technology — starting this week?',
    sub: 'Not someday. Not when things calm down. This week.',
    type: 'scale',
    low: 'Not ready at all', high: 'Starting today',
    weight: 'willing',
  },
]

// ── SCORING ───────────────────────────────────────────────────
function calcScore(answers: Answers): ScoreResult {
  const willingQs  = ['q1','q3','q6','q9']
  const controlQs  = ['q2','q4']
  const willingAvg = willingQs.reduce((s, id) => s + ((answers[id] as number) || 3), 0) / willingQs.length
  const controlAvg = controlQs.reduce((s, id) => s + ((answers[id] as number) || 3), 0) / controlQs.length
  const immersion  = Math.round(((6 - controlAvg) / 4) * 100)
  const willing    = Math.round(((willingAvg - 1) / 4) * 100)
  const trigBonus  = Math.min(((answers['q8'] as number[] || []).length) * 8, 30)
  const relapse    = answers['q5'] === 'yes' ? 10 : 0
  return { immersionScore: Math.min(100, immersion + trigBonus + relapse), willingScore: willing }
}

function getTier(immersionScore: number, willingScore: number): TierResult {
  if (immersionScore >= 70 && willingScore >= 60)
    return { tier:'Aware & Ready', emoji:'🟠', badge:'HIGH IMMERSION · HIGH MOTIVATION', badgeColor:'#E67E22',
      desc:"You're deeply in it — and you know it. That combination of clear-eyed awareness and genuine motivation to change is actually the most useful place to start from. Most people pick one or the other. You're holding both. That gap between where you are and where you want to be isn't a problem. It's the opening." }
  if (immersionScore >= 70)
    return { tier:'Deep In It', emoji:'🔴', badge:'HIGH DEPENDENCY DETECTED', badgeColor:'#C0392B',
      desc:"Your responses suggest technology has significant grip on your attention — and the willingness to examine that is still forming. The behavioral patterns here are real: the reflex to reach, the algorithm intimacy, the failed attempts to cut back. None of this is a character flaw. It was designed this way. The first move is noticing it." }
  if (immersionScore >= 40 && willingScore >= 55)
    return { tier:'In the Middle', emoji:'🟡', badge:'MODERATE USAGE · MOTIVATED TO SHIFT', badgeColor:'#D4AC0D',
      desc:"You're in a common and honest place: technology has more grip on your attention than you'd like, but you're not in denial about it. The patterns are there — they just haven't fully overwritten your default state. Your motivation is real. Converting it into one small, consistent behaviour is the only remaining variable." }
  return { tier:'Relatively Present', emoji:'🟢', badge:'LOW DEPENDENCY · STRONG AWARENESS', badgeColor:'#2E7D5E',
    desc:"Your responses suggest a fairly intentional relationship with technology. You use it — but it doesn't appear to be using you back in any significant way. The behavioural markers of deep immersion were largely absent or caught by you. Keep the habits that got you here." }
}

// ── AIRTABLE ──────────────────────────────────────────────────
async function postToAirtable(fields: Record<string, unknown>): Promise<boolean> {
  if (!AIRTABLE_API_KEY || AIRTABLE_API_KEY === 'YOUR_AIRTABLE_API_KEY') {
    console.log('[IRL] Airtable not configured — would have submitted:', fields)
    return true
  }
  try {
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    })
    return res.ok
  } catch (e) {
    console.error('[IRL] Airtable error:', e)
    return false
  }
}

// ── SUBCOMPONENTS ─────────────────────────────────────────────

interface ScaleInputProps {
  qId: string
  value: number | undefined
  low: string
  high: string
  onChange: (qId: string, val: number) => void
}

function ScaleInput({ qId, value, low, high, onChange }: ScaleInputProps) {
  return (
    <div>
      <div className="scale-wrap">
        {[1,2,3,4,5].map(v => (
          <button
            key={v}
            className={`scale-btn ${value === v ? 'selected' : ''}`}
            onClick={() => onChange(qId, v)}
            aria-label={`${v}`}
          >{v}</button>
        ))}
      </div>
      <div className="scale-labels"><span>{low}</span><span>{high}</span></div>
    </div>
  )
}

interface YNInputProps {
  qId: string
  value: string | undefined
  onChange: (qId: string, val: string) => void
}

function YNInput({ qId, value, onChange }: YNInputProps) {
  return (
    <div className="yn-wrap">
      {['yes','no'].map(opt => (
        <button
          key={opt}
          className={`yn-btn ${value === opt ? 'selected' : ''}`}
          onClick={() => onChange(qId, opt)}
        >{opt === 'yes' ? 'Yes' : 'No'}</button>
      ))}
    </div>
  )
}

interface MultiInputProps {
  qId: string
  options: string[]
  value: number[]
  onChange: (qId: string, val: number[]) => void
}

function MultiInput({ qId, options, value = [], onChange }: MultiInputProps) {
  const toggle = (idx) => {
    const next = value.includes(idx) ? value.filter(i => i !== idx) : [...value, idx]
    onChange(qId, next)
  }
  return (
    <div>
      <div className="multi-wrap">
        {options.map((opt, idx) => (
          <button
            key={idx}
            className={`multi-btn ${value.includes(idx) ? 'selected' : ''}`}
            onClick={() => toggle(idx)}
          >
            <span className="check">{value.includes(idx) ? '✓' : ''}</span>
            {opt}
          </button>
        ))}
      </div>
      <div style={{fontSize:'11px', color:'var(--muted)', marginTop:'10px'}}>Select one or more, then continue scrolling</div>
    </div>
  )
}

interface QuestionCardProps {
  q: Question
  answers: Answers
  onChange: (qId: string, val: number | string | number[]) => void
  visibleIndex: number
}

function QuestionCard({ q, answers, onChange, visibleIndex }: QuestionCardProps) {
  const isConditional = !!q.conditional
  const isVisible = !isConditional || answers[q.conditional.parent] === q.conditional.value
  if (!isVisible) return null

  return (
    <div className="q-card">
      <div className="q-num">Question {isConditional ? '↳' : visibleIndex}</div>
      <div className="q-text">{q.text}</div>
      {q.sub && <div className="q-sub">{q.sub}</div>}
      {q.type === 'scale' && (
        <ScaleInput qId={q.id} value={answers[q.id]} low={q.low} high={q.high} onChange={onChange} />
      )}
      {q.type === 'yn' && (
        <YNInput qId={q.id} value={answers[q.id]} onChange={onChange} />
      )}
      {q.type === 'multi' && (
        <MultiInput qId={q.id} options={q.options} value={answers[q.id]} onChange={onChange} />
      )}
    </div>
  )
}

interface ScoreRingProps { value: number; color: string; label: string }
function ScoreRing({ value, color, label }: ScoreRingProps) {
  return (
    <div className="ring-item">
      <div className="ring" style={{background:`conic-gradient(${color} ${value * 3.6}deg, var(--powder) 0deg)`}}>
        <span style={{color}}>{value}%</span>
      </div>
      <div className="ring-label">{label}</div>
    </div>
  )
}

// ── HIGH INTENT LEAD CAPTURE ──────────────────────────────────
interface HighIntentBoxProps { immersionScore: number; tier: string; answers: Answers }
function HighIntentBox({ immersionScore, tier, answers }: HighIntentBoxProps) {
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [wantsCall, setWantsCall] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]         = useState('')

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) { setError('Please enter a valid email address.'); return }
    setLoading(true); setError('')
    const answersSummary = QUESTIONS
      .filter(q => answers[q.id] !== undefined)
      .map(q => {
        let val = answers[q.id]
        if (Array.isArray(val)) val = (val as number[]).map(i => q.options![i]).join(', ')
        return `${q.id}: ${val}`
      }).join(' | ')

    const ok = await postToAirtable({ Name: name || '(not provided)', Email: email, Score: immersionScore, Tier: tier, WantsCall: wantsCall, Answers: answersSummary })
    setLoading(false)
    if (ok) setSubmitted(true)
    else setError('Something went wrong — please try again or email us directly.')
  }

  if (submitted) return (
    <div className="lead-box">
      <div className="lead-success">
        <div className="lead-success-icon">✓</div>
        <div className="lead-success-title">You're on the list.</div>
        <p className="lead-success-sub">We'll be in touch soon. If you checked the call box, expect a message from us within a week.</p>
      </div>
    </div>
  )

  return (
    <div className="lead-box">
      <div className="lead-box-title">You're exactly who irl is built for.</div>
      <p className="lead-box-sub">We're recruiting 10 early testers for closed beta. No commitment — just a conversation, and early access before public launch.</p>
      <div className="lead-form">
        <input className="lead-input" type="text" placeholder="Your name (optional)" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
        <input className="lead-input" type="email" placeholder="Your email address *" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
        <label className="lead-checkbox-row">
          <input type="checkbox" className="lead-checkbox" checked={wantsCall} onChange={e => setWantsCall(e.target.checked)} />
          <span className="lead-checkbox-label">I'm open to a 15-minute call with the irl team — I want to share my experience and hear more about early access.</span>
        </label>
        {error && <p style={{fontSize:'12px', color:'#C0392B'}}>{error}</p>}
        <button className="lead-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Join the waitlist →'}
        </button>
      </div>
    </div>
  )
}

// ── LOW INTENT LEAD CAPTURE ───────────────────────────────────
interface LowIntentBoxProps { tier: string; immersionScore: number }
function LowIntentBox({ tier, immersionScore }: LowIntentBoxProps) {
  const [email, setEmail]       = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) return
    await postToAirtable({ Name: '(low intent)', Email: email, Score: immersionScore, Tier: tier, WantsCall: false, Answers: '' })
    setSubmitted(true)
  }

  return (
    <div className="low-box">
      <div className="low-box-title">Stay in the loop.</div>
      <p className="low-box-sub">irl is in development. We'll share updates, research, and early access news when the time comes.</p>
      {submitted
        ? <p style={{fontSize:'13px', color:'var(--navy)', fontWeight:'500', textAlign:'center'}}>✓ Got it — we'll be in touch.</p>
        : <div className="low-input-row">
            <input className="low-email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            <button className="low-submit" onClick={handleSubmit}>Notify me</button>
          </div>
      }
    </div>
  )
}

// ── RESULT SCREEN ─────────────────────────────────────────────
interface ResultScreenProps { answers: Answers; onReset: () => void }
function ResultScreen({ answers, onReset }: ResultScreenProps) {
  const { immersionScore, willingScore } = calcScore(answers)
  const isHighIntent = immersionScore >= 55 || willingScore >= 65
  const { tier, emoji, badge, badgeColor, desc } = getTier(immersionScore, willingScore)

  return (
    <div className="result-screen show">
      <div className="result-header">
        <span className="result-emoji">{emoji}</span>
        <div className="result-title">{tier}</div>
        <div className="result-badge" style={{borderColor: badgeColor, color: badgeColor}}>{badge}</div>
      </div>

      <div className="score-rings">
        <ScoreRing value={immersionScore} color={badgeColor} label="Immersion" />
        <ScoreRing value={willingScore} color="var(--navy)" label="Readiness" />
      </div>

      <div className="result-desc">{desc}</div>

      {isHighIntent
        ? <HighIntentBox immersionScore={immersionScore} tier={tier} answers={answers} />
        : <LowIntentBox tier={tier} immersionScore={immersionScore} />
      }

      <button className="retry-btn" onClick={onReset}>↩ Retake the survey</button>
    </div>
  )
}

// ── SURVEY FORM ───────────────────────────────────────────────
interface SurveyFormProps { onComplete: (answers: Answers) => void }
function SurveyForm({ onComplete }: SurveyFormProps) {
  const [answers, setAnswers] = useState<Answers>({})

  const handleChange = useCallback((qId: string, val: number | string | number[]) => {
    setAnswers(prev => {
      const next = { ...prev, [qId]: val }
      // clear conditional child if parent changes away
      if (qId === 'q5' && val !== 'yes') { delete next['q5a'] }
      return next
    })
  }, [])

  const visibleQs = QUESTIONS.filter(q => {
    if (!q.conditional) return true
    return answers[q.conditional.parent] === q.conditional.value
  })

  const allAnswered = visibleQs.every(q => {
    if (q.type === 'multi') return answers[q.id] && answers[q.id].length > 0
    return answers[q.id] !== undefined
  })

  const answered = visibleQs.filter(q => {
    if (q.type === 'multi') return answers[q.id] && answers[q.id].length > 0
    return answers[q.id] !== undefined
  }).length

  const pct = Math.round((answered / visibleQs.length) * 100)

  let nonConditionalIdx = 0

  return (
    <div id="surveyForm">
      <div className="progress-row">
        <span className="progress-txt">{answered} / {visibleQs.length} answered</span>
        <span className="progress-txt">{pct}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{width: `${pct}%`}} />
      </div>

      {QUESTIONS.map(q => {
        if (!q.conditional) nonConditionalIdx++
        return (
          <QuestionCard
            key={q.id}
            q={q}
            answers={answers}
            onChange={handleChange}
            visibleIndex={nonConditionalIdx}
          />
        )
      })}

      <div className="submit-wrap">
        <button className="submit-btn" disabled={!allAnswered} onClick={() => onComplete(answers)}>
          See my results →
        </button>
        <p className="submit-hint">
          {allAnswered ? 'Ready — see your results below' : 'Answer all questions to continue'}
        </p>
      </div>
    </div>
  )
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase]             = useState<'survey' | 'result'>('survey')
  const [finalAnswers, setFinalAnswers] = useState<Answers>({})

  const handleComplete = (answers: Answers) => {
    setFinalAnswers(answers)
    setPhase('result')
    setTimeout(() => {
      document.getElementById('survey-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const handleReset = () => {
    setFinalAnswers({})
    setPhase('survey')
    document.getElementById('survey-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToSurvey = () => {
    document.getElementById('survey-anchor')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* NAV */}
      <nav>
        <div className="nav-logo">irl</div>
        <button className="nav-cta" onClick={scrollToSurvey}>Take the Survey</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-eyebrow">Digital Wellness · AI-Powered</div>
          <h1 className="hero-title">Reclaim Your Time.<br />Reframe Your Life.</h1>
          <p className="hero-sub">Blocking apps don't fix the root cause. irl learns why you scroll — and interrupts the loop before it starts.</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">10–16</span>
              <p className="stat-label">years of your remaining lifetime spent on your phone</p>
            </div>
            <div className="divider-dot" />
            <div className="stat">
              <span className="stat-num">57%</span>
              <p className="stat-label">of phone users show signs of addiction</p>
            </div>
            <div className="divider-dot" />
            <div className="stat">
              <span className="stat-num">$0</span>
              <p className="stat-label">invested by platforms in helping you put the phone down</p>
            </div>
          </div>
          <button className="hero-cta" onClick={scrollToSurvey}>Find out how addicted you are →</button>
          <p className="hero-hint">Takes 2 minutes · No sign-up required to start</p>
        </div>
        <div className="scroll-arrow">
          <span>Scroll</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem">
        <div className="problem-inner">
          <h2 className="problem-title">The tools you've tried weren't designed to help you.</h2>
          <p className="problem-body">App blockers create friction. They don't address <strong>why you open Instagram at 11pm</strong> when you're anxious, lonely, or avoiding something. irl is the first app that treats compulsive scrolling as a behavioral pattern — not a discipline problem.</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <div className="section-label">How it works</div>
        <div className="how-grid">
          {[
            { n:'01', title:'irl learns your patterns',       body:'The on-device AI observes when you scroll, for how long, and what preceded it — building a behavioral map unique to you.' },
            { n:'02', title:'Intervenes at the right moment', body:'At the moment you\'re about to open a distracting app, irl surfaces a personalized prompt — not a hard block, a gentle redirect.' },
            { n:'03', title:'Redirects you toward meaning',   body:'You told irl what actually matters to you. It steers you there — friends, hobbies, rest — instead of the infinite feed.' },
          ].map(s => (
            <div className="how-step" key={s.n}>
              <div className="how-num">{s.n}</div>
              <div className="how-title">{s.title}</div>
              <p className="how-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SURVEY */}
      <section className="survey-section" id="survey-anchor">
        <div className="survey-inner">
          <h2 className="survey-title">Are you even present?</h2>
          <p className="survey-sub">A short diagnostic on your relationship with technology.<br />Answer honestly. Your screen time stats already know.</p>
          {phase === 'survey'
            ? <SurveyForm onComplete={handleComplete} />
            : <ResultScreen answers={finalAnswers} onReset={handleReset} />
          }
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="section-label">Early feedback</div>
        <div className="testi-grid">
          {[
            { quote: '"Apple\'s features have no friction, and existing apps are too complex to set up."',       who: '23M, University Student', screen: '5.6 hrs/day' },
            { quote: '"I can\'t put my phone down, and it\'s hard to focus on my studies. I bought an app blocker for a lifetime but it just doesn\'t work for me."', who: '23M, University Student', screen: '13 hrs/day' },
            { quote: '"I go on my phone as a break, to decompress. I would like to learn new hobbies but I don\'t have the time."', who: '22F, University Student', screen: '4.5 hrs/day' },
          ].map((t, i) => (
            <div className="testi-card" key={i}>
              <p className="testi-quote">{t.quote}</p>
              <div className="testi-meta">
                <strong>{t.who}</strong>
                Avg. screen time: {t.screen}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">irl</div>
        <p className="footer-tagline">Reclaim Your Time. Reframe Your Life.</p>
        <div className="footer-links">
          <a href="mailto:hello@live-irl.com">hello@live-irl.com</a>
          <a href="#survey-anchor" onClick={e => { e.preventDefault(); scrollToSurvey() }}>Take the Survey</a>
        </div>
        <p className="footer-fine">Built in Canada 🍁 · NEXT Canada Program · © 2025 irl</p>
      </footer>
    </>
  )
}
