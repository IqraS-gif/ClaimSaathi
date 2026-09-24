import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'

const UpIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)
const ChartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)
const DocIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const CardIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
)
const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const BankIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
)

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    {
      step: '01', color: 'blue', route: '/upload',
      icon: <UpIcon />, title: 'Check Insurance',
      desc: 'Upload your policy PDF to decode sum insured, room rent limits, co-pay, allowed treatments, and nearby network hospitals with room category details.',
      chips: ['Policy Analysis', 'Network Hospitals', 'Room Category Capping'],
    },
    {
      step: '02', color: 'indigo', route: '/claim',
      icon: <DocIcon />, title: 'Check Claim (Bill Simulator)',
      desc: 'Upload hospital bill & policy together to see the exact financial split (₹2,00,000 bill → ₹1,30,000 insurance → ₹70,000 you pay) with policy clauses.',
      chips: ['Hospital Bill + Policy', 'Financial Split', 'Clause-by-Clause Audit'],
    },
    {
      step: '03', color: 'teal', route: '/bridge',
      icon: <CardIcon />, title: 'Financial Bridge',
      desc: "Don't let high out-of-pocket hospital deductions delay treatment. Cover the cash gap with zero-collateral Paytm EMI financing.",
      chips: ['Instant Cash Gap', 'Paytm EMI', 'Hospital Direct Pay'],
    },
  ]

  const steps = [
    { num: 1, title: 'Check Your Insurance', desc: 'Upload your policy document. Decode coverage terms, room caps, and eligible network hospitals in seconds.' },
    { num: 2, title: 'Check Your Claim & Bill', desc: 'Upload the hospital bill with your policy. The deterministic engine calculates what the insurer pays vs what you owe.' },
    { num: 3, title: 'Bridge Any Cash Gap', desc: 'If there are hospital deductions or co-pay, Paytm steps in with flexible short-term financing.' },
  ]

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">Powered by Paytm Insurance</div>
          <h1 className="hero-title">Stop Guessing.<br />Start Claiming.</h1>
          <p className="hero-subtitle">
            ClaimSaathi decodes your health insurance policy, verifies hospital bill itemization against policy rules, and bridges your financial gap with Paytm.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/upload')}>
              Check Insurance →
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/claim')}>
              Check Claim Split →
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">2 min</span>
              <span className="stat-label">Policy Analysis</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">0 Jargon</span>
              <span className="stat-label">Plain Language</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">Claim Readiness</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '440px', flex: '0 0 440px', position: 'relative' }}>
          <Loader />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-overview" id="features">
        <div className="container">
          <div className="section-tag">What ClaimSaathi Does</div>
          <h2 className="section-title">Four Steps to a Settled Claim</h2>
          <p className="section-sub">From uploading a document to receiving money — we guide every step.</p>

          <div className="feature-cards">
            {features.map((f) => (
              <div key={f.step} className="feature-card" onClick={() => navigate(f.route)}>
                <div className="fc-step">{f.step}</div>
                <div className={`fc-icon-wrap ${f.color}`}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className="fc-chips">
                  {f.chips.map(c => <span key={c} className="chip">{c}</span>)}
                </div>
                <span className="fc-link">Get started <span className="fc-arrow">&#8594;</span></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-tag">Process</div>
          <h2 className="section-title">How ClaimSaathi Works</h2>
          <p className="section-sub">A streamlined journey from documents to settlement.</p>

          <div className="steps-timeline">
            {steps.map((s, i) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'flex-start', flex: i < steps.length - 1 ? 1 : 'none' }}>
                <div className="step-item">
                  <div className="step-num">{s.num}</div>
                  <div className="step-content">
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                </div>
                {i < steps.length - 1 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-items">
            <div className="trust-item"><span className="trust-icon"><ShieldIcon /></span> Bank-grade Data Security</div>
            <div className="trust-sep" />
            <div className="trust-item"><span className="trust-icon"><ClockIcon /></span> Results in Under 2 Minutes</div>
            <div className="trust-sep" />
            <div className="trust-item"><span className="trust-icon"><CheckIcon /></span> IRDAI Complaint Support</div>
            <div className="trust-sep" />
            <div className="trust-item"><span className="trust-icon"><BankIcon /></span> Paytm Financial Integration</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Your claim should not be a mystery.</h2>
            <p>Start with your policy document and let ClaimSaathi do the heavy lifting.</p>
            <button className="btn btn-white btn-lg" onClick={() => navigate('/upload')}>
              Upload &amp; Understand Now
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
