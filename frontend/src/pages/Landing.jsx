import { useNavigate } from 'react-router-dom'

// Crisp Vector SVG Icons
const ShieldCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#00BAF2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const CheckIcon = ({ color = '#16a34a', size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const CrossIcon = ({ color = '#dc2626', size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const BoltIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="#00BAF2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const DocIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00BAF2" strokeWidth="2.3">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-page-wrapper">
      {/* ── BREADCRUMB ── */}
      <div className="landing-breadcrumb-container">
        <span className="crumb-link" onClick={() => navigate('/')}>Home</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-link" onClick={() => navigate('/upload')}>Insurance</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-current">ClaimSaathi</span>
      </div>

      {/* ── HERO SECTION MATCHING EXACT SCREENSHOT ── */}
      <section className="landing-hero-section">
        <div className="landing-hero-container">
          {/* Left Column: Headline, subtext & CTA buttons */}
          <div className="landing-hero-left">
            {/* Pill Badge */}
            <div className="claimsaathi-hero-badge">
              <div className="badge-shield-circle">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#00BAF2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span className="badge-title">ClaimSaathi</span>
              <span className="badge-divider">|</span>
              <span className="badge-sub">Powered by Paytm Insurance</span>
            </div>

            {/* Main Headline */}
            <h1 className="landing-hero-heading">
              YOUR HEALTH<br />
              INSURANCE,<br />
              <span className="heading-highlight-cyan">SIMPLIFIED.</span>
            </h1>

            {/* Subtitle */}
            <p className="landing-hero-paragraph">
              Upload your policy, check your hospital bill, know what insurance will pay and what you may have to pay — all in one place with ClaimSaathi.
            </p>

            {/* Action Buttons */}
            <div className="landing-hero-buttons">
              <button
                type="button"
                className="hero-cyan-pill-btn"
                onClick={() => navigate('/upload')}
              >
                <span>Check Insurance</span>
                <span className="btn-arrow">&rarr;</span>
              </button>

              <button
                type="button"
                className="hero-outline-pill-btn"
                onClick={() => navigate('/claim')}
              >
                <span>Check Claim (Bill)</span>
                <span className="btn-arrow">&rarr;</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Mockup with iPhone & Floating Cards */}
          <div className="landing-hero-right">
            <div className="landing-visual-backdrop">
              {/* Left Floating Pill Badges */}
              <div className="floating-left-badge faster-claims">
                <div className="badge-icon-wrap cyan-bg">
                  <BoltIcon />
                </div>
                <span>Faster Claims</span>
              </div>

              <div className="floating-left-badge clearer-coverage">
                <div className="badge-icon-wrap cyan-bg">
                  <DocIcon />
                </div>
                <span>Clearer Coverage</span>
              </div>

              {/* iPhone Mockup Frame */}
              <div className="landing-iphone-mockup">
                {/* Notch / Dynamic Island */}
                <div className="iphone-notch-bar">
                  <span className="iphone-time">9:41</span>
                  <div className="iphone-island" />
                  <div className="iphone-status-icons">
                    <svg width="14" height="10" viewBox="0 0 24 18" fill="#1e293b">
                      <rect x="1" y="2" width="4" height="14" rx="1" />
                      <rect x="7" y="5" width="4" height="11" rx="1" />
                      <rect x="13" y="8" width="4" height="8" rx="1" />
                      <rect x="19" y="11" width="4" height="5" rx="1" />
                    </svg>
                  </div>
                </div>

                {/* Inner Screen Content */}
                <div className="iphone-screen-content">
                  {/* Phone Header */}
                  <div className="iphone-app-header">
                    <div className="iphone-paytm-brand">
                      <span className="paytm-dark">pay</span>
                      <span className="paytm-cyan">tm</span>
                    </div>

                    <div className="iphone-saathi-identity">
                      <ShieldCheckIcon />
                      <span className="iphone-saathi-name">ClaimSaathi</span>
                    </div>

                    <p className="iphone-saathi-tagline">
                      Your personal guide for health insurance claims
                    </p>
                  </div>

                  {/* 4 Feature Menu Tiles inside screen */}
                  <div className="iphone-tiles-group">
                    <div
                      className="iphone-tile-row"
                      onClick={() => navigate('/upload')}
                      title="Upload Insurance Policy"
                    >
                      <div className="tile-icon-box">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00BAF2" strokeWidth="2.3">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <span className="tile-label">Upload Insurance Policy</span>
                      <ChevronRight />
                    </div>

                    <div
                      className="iphone-tile-row"
                      onClick={() => navigate('/claim')}
                      title="Upload Hospital Bill"
                    >
                      <div className="tile-icon-box">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#002970" strokeWidth="2.3">
                          <path d="M3 21h18" />
                          <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                          <line x1="9" y1="9" x2="15" y2="9" />
                        </svg>
                      </div>
                      <span className="tile-label">Upload Hospital Bill</span>
                      <ChevronRight />
                    </div>

                    <div
                      className="iphone-tile-row"
                      onClick={() => navigate('/claim')}
                      title="View Claim Summary"
                    >
                      <div className="tile-icon-box">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.3">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <span className="tile-label">View Claim Summary</span>
                      <ChevronRight />
                    </div>

                    <div
                      className="iphone-tile-row"
                      onClick={() => navigate('/bridge')}
                      title="Explore Financial Support"
                    >
                      <div className="tile-icon-box">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2.3">
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                      </div>
                      <span className="tile-label">Explore Financial Support</span>
                      <ChevronRight />
                    </div>
                  </div>

                  {/* Bottom Pill inside phone */}
                  <div
                    className="iphone-bottom-support-pill"
                    onClick={() => navigate('/bridge')}
                  >
                    <div className="support-currency-icon">₹</div>
                    <div className="support-text-wrap">
                      <span className="support-title">Financial Support</span>
                      <span className="support-sub">with Paytm EMI</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── FLOATING CARD 1: Policy Analysis (Top Right) ── */}
              <div className="floating-card-mockup policy-analysis-card">
                <div className="floating-card-header">
                  <div className="card-head-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00BAF2" strokeWidth="2.4">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="card-head-title">Policy Analysis</span>
                  </div>
                  <span className="completed-tag green">COMPLETED</span>
                </div>

                <div className="floating-card-items-list">
                  <div className="analysis-row">
                    <div className="row-left">
                      <CheckIcon />
                      <span>Room Rent Limit</span>
                    </div>
                    <span className="row-status green">Covered</span>
                  </div>

                  <div className="analysis-row">
                    <div className="row-left">
                      <CheckIcon />
                      <span>ICU Charges</span>
                    </div>
                    <span className="row-status green">Covered</span>
                  </div>

                  <div className="analysis-row">
                    <div className="row-left">
                      <CheckIcon />
                      <span>Pre-Post Hospitalisation</span>
                    </div>
                    <span className="row-status green">Covered</span>
                  </div>

                  <div className="analysis-row">
                    <div className="row-left">
                      <CrossIcon />
                      <span>Non-Payable Items</span>
                    </div>
                    <span className="badge-found red">2 found</span>
                  </div>
                </div>
              </div>

              {/* ── FLOATING CARD 2: Hospital Bill Analysis (Bottom Right) ── */}
              <div className="floating-card-mockup bill-analysis-card">
                <div className="floating-card-header">
                  <div className="card-head-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.4">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                    <span className="card-head-title">Hospital Bill Analysis</span>
                  </div>
                  <span className="completed-tag green">COMPLETED</span>
                </div>

                <div className="floating-card-items-list">
                  <div className="bill-metric-row">
                    <div className="metric-left">
                      <span className="plus-sign blue">+</span>
                      <span>Total Bill Amount</span>
                    </div>
                    <span className="metric-amount dark">₹2,00,000</span>
                  </div>

                  <div className="bill-metric-row">
                    <div className="metric-left">
                      <span className="plus-sign green">+</span>
                      <span>Expected Insurance Payout</span>
                    </div>
                    <span className="metric-amount green">₹1,30,000</span>
                  </div>

                  <div className="bill-metric-row">
                    <div className="metric-left">
                      <span className="plus-sign coral">+</span>
                      <span>Your Out-of-Pocket</span>
                    </div>
                    <span className="metric-amount coral">₹70,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 CORE FEATURES OVERVIEW ── */}
      <section className="features-overview">
        <div className="container">
          <div className="section-tag">THREE EASY STEPS</div>
          <h2 className="section-title">Everything you need, before &amp; during hospitalisation</h2>
          <p className="section-sub">
            From decoding fine-print room rent limits to bridging out-of-pocket gaps at the cashier counter.
          </p>

          <div className="feature-cards">
            {/* Step 1 */}
            <div className="feature-card" onClick={() => navigate('/upload')}>
              <div className="fc-step">STEP 01</div>
              <div className="fc-icon-wrap blue">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <h3>Check Insurance</h3>
              <p>Upload your policy document to decode sum insured, room rent limits, co-pay, and nearby network hospitals.</p>
              <div className="fc-chips">
                <span className="chip">Policy Decoder</span>
                <span className="chip">Room Capping</span>
                <span className="chip">Cashless Network</span>
              </div>
              <div className="fc-link">
                <span>Check Policy</span>
                <span className="fc-arrow">&rarr;</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="feature-card" onClick={() => navigate('/claim')}>
              <div className="fc-step">STEP 02</div>
              <div className="fc-icon-wrap indigo">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <h3>Check Claim (Bill Simulator)</h3>
              <p>Upload your hospital bill and policy together to see the exact financial split (₹2,00,000 bill &rarr; ₹1,30,000 insurance &rarr; ₹70,000 you pay).</p>
              <div className="fc-chips">
                <span className="chip">Bill Split</span>
                <span className="chip">Clause Audit</span>
                <span className="chip">Proportionate Penalty</span>
              </div>
              <div className="fc-link">
                <span>Simulate Bill</span>
                <span className="fc-arrow">&rarr;</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="feature-card" onClick={() => navigate('/bridge')}>
              <div className="fc-step">STEP 03</div>
              <div className="fc-icon-wrap teal">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <h3>Paytm Financial Bridge</h3>
              <p>Cover any out-of-pocket cash gap immediately at the hospital cashier counter with 0% No-Cost EMI financing.</p>
              <div className="fc-chips">
                <span className="chip">0% No-Cost EMI</span>
                <span className="chip">45-Day Grace</span>
                <span className="chip">Direct Disbursal</span>
              </div>
              <div className="fc-link">
                <span>Explore Loans</span>
                <span className="fc-arrow">&rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to decode your policy and hospital bill?</h2>
            <p>100% paperless, secure, and powered by Paytm's trusted financial infrastructure.</p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                className="btn btn-white btn-lg"
                onClick={() => navigate('/upload')}
              >
                Check Insurance Now &rarr;
              </button>
              <button
                className="btn btn-outline btn-lg"
                style={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}
                onClick={() => navigate('/claim')}
              >
                Simulate Hospital Bill &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
