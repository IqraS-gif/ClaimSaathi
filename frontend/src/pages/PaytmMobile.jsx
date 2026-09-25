import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './PaytmMobile.css'

/* ─── SVG Icon Helpers ───────────────────────────────── */
const Icon = ({ d, size = 18, stroke = 'currentColor', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
)
const CircleIcon = ({ cx, cy, r, size = 18, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx={cx} cy={cy} r={r} />
  </svg>
)

/* Common icon paths */
const ICONS = {
  home:       ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
  scan:       ['M3 3h5v5H3z', 'M16 3h5v5h-5z', 'M3 16h5v5H3z', 'M16 16h2v2h-2z', 'M20 18h2', 'M18 20v2', 'M20 20v.01'],
  shield:     ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  credit:     ['M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z', 'M2 10h20'],
  sparkle:    ['m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z'],
  search:     ['m21 21-4.34-4.34', 'M11 11m-8 0a8 8 0 1 0 16 0 8 8 0 0 0-16 0'],
  bell:       ['M10.268 21a2 2 0 0 0 3.464 0', 'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326'],
  chevronR:   ['m9 18 6-6-6-6'],
  chevronL:   ['m15 18-6-6 6-6'],
  arrowR:     ['M5 12h14', 'm12 5 7 7-7 7'],
  bot:        ['M12 8V4H8', 'M4 8h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z', 'M2 14h2', 'M20 14h2', 'M15 13v2', 'M9 13v2'],
  upload:     ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12'],
  file:       ['M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z', 'M13 2v7h7'],
  trending:   ['M16 7h6v6', 'm22 7-8.5 8.5-5-5L2 17'],
  gauge:      ['m12 14 4-4', 'M3.34 19a10 10 0 1 1 17.32 0'],
  landmark:   ['M10 18v-7', 'M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z', 'M14 18v-7', 'M18 18v-7', 'M3 22h18', 'M6 18v-7'],
  plane:      ['M2 22h20', 'M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z'],
  bridge:     ['M16 8h6', 'M2 8h6', 'M12 2v6', 'M3 16c0-4 4-7 9-7s9 3 9 7', 'M3 16v4h18v-4'],
  predict:    ['M3 3v16a2 2 0 0 0 2 2h16', 'm19 9-5 5-4-4-3 3'],
  qr:         ['M3 3h5v5H3z', 'M16 3h5v5h-5z', 'M3 16h5v5H3z', 'M21 16h-3a2 2 0 0 0-2 2v3', 'M21 21v.01', 'M12 7v3a2 2 0 0 1-2 2H7', 'M3 12h.01', 'M12 3h.01', 'M12 16v.01', 'M16 12h1', 'M21 12v.01', 'M12 21v-1'],
}

/* ─── Paytm Wordmark ─────────────────────────────────── */
const PaytmWordmark = () => (
  <div className="ptm-wordmark">
    <span className="ptm-wordmark-pay">pay</span>
    <span className="ptm-wordmark-tm">tm</span>
  </div>
)

/* ─── Live Clock ─────────────────────────────────────── */
function useLiveClock() {
  const [time, setTime] = useState(() => {
    const n = new Date()
    return `${n.getHours().toString().padStart(2, '0')}:${n.getMinutes().toString().padStart(2, '0')}`
  })
  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date()
      setTime(`${n.getHours().toString().padStart(2, '0')}:${n.getMinutes().toString().padStart(2, '0')}`)
    }, 10000)
    return () => clearInterval(id)
  }, [])
  return time
}

/* ─── Battery SVG ────────────────────────────────────── */
const BatterySvg = () => (
  <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
    <rect x="0.5" y="0.5" width="18" height="11" rx="3.5" stroke="white" strokeOpacity="0.5"/>
    <rect x="2" y="2" width="14" height="8" rx="2" fill="white"/>
    <path d="M19.5 4.5v3a1.5 1.5 0 0 0 0-3z" fill="white" fillOpacity="0.5"/>
  </svg>
)
const SignalSvg = () => (
  <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
    <rect x="0" y="6" width="3" height="6" rx="1"/>
    <rect x="4" y="4" width="3" height="8" rx="1"/>
    <rect x="8" y="2" width="3" height="10" rx="1"/>
    <rect x="12" y="0" width="3" height="12" rx="1" fillOpacity="0.3"/>
  </svg>
)

/* ─── Home Screen ────────────────────────────────────── */
function HomeScreen({ onNavigate }) {
  const [activeChip, setActiveChip] = useState(null)

  const upiTiles = [
    { icon: ICONS.qr, label: 'Scan QR', badge: 'AI' },
    { icon: ICONS.home, label: 'Pay Anyone', badge: 'AI' },
    { icon: ICONS.landmark, label: 'Bank A/c' },
    { icon: ICONS.credit, label: 'Balance' },
  ]
  const financialTiles = [
    { icon: ICONS.shield, label: 'Check Insurance', color: '#00BAF2', onClick: () => onNavigate('claimsaathi') },
    { icon: ICONS.file, label: 'Check Claim', color: '#818cf8', onClick: () => onNavigate('claimsaathi') },
    { icon: ICONS.bridge, label: 'Bridge Gap', color: '#4ade80', onClick: () => onNavigate('claimsaathi') },
    { icon: ICONS.predict, label: 'Predict Plan', color: '#fbbf24', onClick: () => onNavigate('claimsaathi') },
    { icon: ICONS.trending, label: 'Loan', color: '#94a3b8' },
    { icon: ICONS.gauge, label: 'Credit Score', color: '#94a3b8' },
    { icon: ICONS.plane, label: 'Car Insurance', color: '#94a3b8' },
    { icon: ICONS.credit, label: 'Postpaid', color: '#94a3b8' },
  ]

  return (
    <>
      {/* ── Balance Hero ── */}
      <div className="ptm-hero-card">
        <p className="ptm-hero-label">Wallet Balance</p>
        <div className="ptm-hero-amount">
          <span className="ptm-hero-currency">₹</span>
          <span className="ptm-hero-value">24,50,000</span>
        </div>
        <div className="ptm-hero-split">
          <div className="ptm-hero-split-item">
            <span className="ptm-hero-split-label">Bank</span>
            <span className="ptm-hero-split-value">₹12.5L</span>
          </div>
          <div className="ptm-hero-divider" />
          <div className="ptm-hero-split-item">
            <span className="ptm-hero-split-label">Investments</span>
            <span className="ptm-hero-split-value">₹12.0L</span>
          </div>
          <div className="ptm-hero-divider" />
          <div className="ptm-hero-split-item">
            <span className="ptm-hero-split-label">Insurance</span>
            <span className="ptm-hero-split-value">Active ✓</span>
          </div>
        </div>
      </div>

      {/* ── ClaimSaathi Feature Banner ── */}
      <div className="ptm-feature-card" onClick={() => onNavigate('claimsaathi')}>
        <div className="ptm-feature-card-top">
          <div className="ptm-feature-icon-wrap">
            <Icon d={ICONS.shield} size={18} stroke="#fff" />
          </div>
          <div className="ptm-feature-body">
            <p className="ptm-feature-eyebrow">New · ClaimSaathi by Paytm</p>
            <p className="ptm-feature-title">AI Health Insurance Assistant</p>
          </div>
          <span className="ptm-feature-badge">AI</span>
        </div>
        <div className="ptm-feature-chips">
          {['Check Policy', 'Claim Bill', 'Bridge Gap', 'Predict & Plan'].map(c => (
            <span key={c} className={`ptm-chip${activeChip === c ? ' active' : ''}`}
              onClick={e => { e.stopPropagation(); setActiveChip(c === activeChip ? null : c) }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="ptm-stat-row">
        <div className="ptm-stat-card">
          <div className="ptm-stat-value">820</div>
          <div className="ptm-stat-label">Credit Score</div>
          <div className="ptm-stat-sub">Free, 1-tap check</div>
        </div>
        <div className="ptm-stat-card">
          <div className="ptm-stat-value">₹200</div>
          <div className="ptm-stat-label">Refer & Win</div>
          <div className="ptm-stat-sub">Assured reward</div>
        </div>
      </div>

      {/* ── UPI Section ── */}
      <div className="ptm-section">
        <div className="ptm-section-head">
          <span className="ptm-section-title">UPI Money Transfer</span>
        </div>
        <div className="ptm-grid-4">
          {upiTiles.map(t => (
            <button key={t.label} className="ptm-tile">
              <span className="ptm-tile-icon">
                <Icon d={t.icon} size={16} />
                {t.badge && <span className="ptm-tile-badge">{t.badge}</span>}
              </span>
              <span className="ptm-tile-label">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Promo Banner ── */}
      <div className="ptm-promo">
        <div className="ptm-promo-left">
          <p className="ptm-promo-eyebrow">Insurance on Paytm</p>
          <p className="ptm-promo-title">Protect your family today</p>
        </div>
        <button className="ptm-promo-cta" onClick={() => onNavigate('claimsaathi')}>Explore →</button>
      </div>

      {/* ── Financial Services ── */}
      <div className="ptm-section">
        <div className="ptm-section-head">
          <span className="ptm-section-title">Financial Services</span>
          <button className="ptm-view-all">View All <Icon d={ICONS.chevronR} size={12} /></button>
        </div>
        <div className="ptm-grid-4">
          {financialTiles.map(t => (
            <button key={t.label} className="ptm-tile" onClick={t.onClick}>
              <span className="ptm-tile-icon" style={t.onClick ? { borderColor: `${t.color}40` } : {}}>
                <Icon d={t.icon} size={16} stroke={t.color || 'currentColor'} />
              </span>
              <span className="ptm-tile-label" style={t.onClick ? { color: '#e2e8f0' } : {}}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ptm-screen-bottom-pad" />
    </>
  )
}

/* ─── ClaimSaathi Inner Screen ───────────────────────── */
function ClaimSaathiScreen({ onBack, onOpenChat }) {
  const navigate = useNavigate()

  const actions = [
    {
      color: 'cyan',
      icon: ICONS.shield,
      name: 'Check Insurance',
      desc: 'Verify your policy coverage & terms',
      onClick: () => navigate('/upload'),
    },
    {
      color: 'purple',
      icon: ICONS.file,
      name: 'Check Claim Bill',
      desc: 'Validate hospital bills for claims',
      onClick: () => navigate('/claim'),
    },
    {
      color: 'green',
      icon: ICONS.bridge,
      name: 'Bridge Gap (EMI)',
      desc: 'Finance uncovered hospital costs',
      onClick: () => navigate('/bridge'),
    },
    {
      color: 'amber',
      icon: ICONS.predict,
      name: 'Predict & Plan',
      desc: 'AI premium & coverage forecast',
      onClick: () => navigate('/predict'),
    },
  ]

  return (
    <div className="ptm-cs-screen ptm-screen-slide-enter">
      {/* Header */}
      <div className="ptm-cs-header">
        <button className="ptm-cs-back" onClick={onBack}>
          <Icon d={ICONS.chevronL} size={14} />
        </button>
        <div>
          <div className="ptm-cs-header-title">ClaimSaathi</div>
        </div>
      </div>

      {/* Active Insurance Status */}
      <div className="ptm-cs-status-card">
        <div className="ptm-cs-status-dot" />
        <div>
          <div className="ptm-cs-status-text">Health Insurance Active</div>
          <div className="ptm-cs-status-sub">Star Health · ₹5L cover · Renews Apr 2025</div>
        </div>
      </div>

      {/* Feature Actions */}
      <div className="ptm-cs-actions">
        {actions.map(a => (
          <button key={a.name} className={`ptm-cs-action-tile ${a.color}`} onClick={a.onClick}>
            <div className={`ptm-cs-tile-icon ${a.color}`}>
              <Icon d={a.icon} size={16} />
            </div>
            <div className="ptm-cs-tile-name">{a.name}</div>
            <div className="ptm-cs-tile-desc">{a.desc}</div>
          </button>
        ))}
      </div>

      {/* Saathi AI Quick Access */}
      <div className="ptm-cs-ai-card" onClick={onOpenChat}>
        <div className="ptm-cs-ai-icon">
          <Icon d={ICONS.sparkle} size={18} />
        </div>
        <div className="ptm-cs-ai-body">
          <div className="ptm-cs-ai-title">Saathi AI</div>
          <div className="ptm-cs-ai-sub">Ask anything about your insurance in Hindi, English & 10+ languages</div>
        </div>
        <div className="ptm-cs-ai-arrow">
          <Icon d={ICONS.chevronR} size={16} />
        </div>
      </div>

      <div className="ptm-screen-bottom-pad" />
    </div>
  )
}

/* ─── Phone Shell ────────────────────────────────────── */
function PhoneShell({ children, activeTab, onTabChange }) {
  const time = useLiveClock()

  return (
    <div className="ptm-phone-wrap">
      <div className="ptm-phone-glow" />
      <div className="ptm-phone">
        {/* Dynamic Island Notch */}
        <div className="ptm-notch">
          <div className="ptm-notch-sensor" />
          <div className="ptm-notch-cam" />
        </div>

        {/* Status Bar */}
        <div className="ptm-status-bar">
          <span className="ptm-status-time ptm-live-time">{time}</span>
          <div className="ptm-status-right">
            <SignalSvg />
            <span>5G</span>
            <BatterySvg />
          </div>
        </div>

        {/* App Header */}
        <div className="ptm-app-bar">
          <div className="ptm-app-bar-identity">
            <div className="ptm-avatar">SS</div>
            <PaytmWordmark />
          </div>
          <div className="ptm-app-bar-actions">
            <button className="ptm-icon-btn" aria-label="Search">
              <Icon d={ICONS.search} size={16} />
            </button>
            <button className="ptm-icon-btn" aria-label="Notifications">
              <Icon d={ICONS.bell} size={16} />
              <span className="ptm-notif-dot" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="ptm-screen">
          {children}
        </div>

        {/* Bottom Nav */}
        <div className="ptm-bottom-nav">
          <button
            className={`ptm-nav-tab${activeTab === 'home' ? ' active' : ''}`}
            onClick={() => onTabChange('home')}
          >
            <span className="ptm-tab-icon"><Icon d={ICONS.home} size={20} /></span>
            <span className="ptm-tab-label">Home</span>
          </button>

          <button
            className={`ptm-nav-tab${activeTab === 'insurance' ? ' active' : ''}`}
            onClick={() => onTabChange('claimsaathi')}
          >
            <span className="ptm-tab-icon"><Icon d={ICONS.shield} size={20} /></span>
            <span className="ptm-tab-label">Insurance</span>
          </button>

          {/* Central QR Scan button */}
          <button className="ptm-tab-scan" aria-label="Scan QR">
            <Icon d={ICONS.qr} size={22} stroke="#fff" />
          </button>

          <button
            className={`ptm-nav-tab${activeTab === 'credit' ? ' active' : ''}`}
            onClick={() => onTabChange('credit')}
          >
            <span className="ptm-tab-icon"><Icon d={ICONS.credit} size={20} /></span>
            <span className="ptm-tab-label">Finance</span>
          </button>

          <button
            className={`ptm-nav-tab ptm-nav-tab-saathi${activeTab === 'saathi' ? ' active' : ''}`}
            onClick={() => onTabChange('saathi')}
          >
            <span className="ptm-tab-icon"><Icon d={ICONS.sparkle} size={20} /></span>
            <span className="ptm-tab-label">Saathi AI</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page Component ────────────────────────────── */
export default function PaytmMobile() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState('home') // 'home' | 'claimsaathi'
  const [activeTab, setActiveTab] = useState('home')

  const handleTabChange = useCallback((tab) => {
    if (tab === 'claimsaathi') {
      setScreen('claimsaathi')
      setActiveTab('insurance')
    } else if (tab === 'saathi') {
      setScreen('home')
      setActiveTab('saathi')
      // Open the Saathi chatbot on main site
      window.dispatchEvent(new CustomEvent('open-saathi-chat', { detail: {} }))
      navigate('/')
    } else {
      setScreen('home')
      setActiveTab(tab)
    }
  }, [navigate])

  const handleOpenChat = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-saathi-chat', { detail: {} }))
    navigate('/')
  }, [navigate])

  return (
    <div className="ptm-page">
      {/* Top bar with back link */}
      <div className="ptm-topbar">
        <button className="ptm-back-btn" onClick={() => navigate('/')}>
          <Icon d={ICONS.chevronL} size={14} />
          Back to Website
        </button>
        <span className="ptm-topbar-label">📱 Paytm Mobile Experience</span>
      </div>

      {/* Phone */}
      <PhoneShell activeTab={activeTab} onTabChange={handleTabChange}>
        {screen === 'home' && (
          <HomeScreen onNavigate={handleTabChange} />
        )}
        {screen === 'claimsaathi' && (
          <ClaimSaathiScreen
            onBack={() => { setScreen('home'); setActiveTab('home') }}
            onOpenChat={handleOpenChat}
          />
        )}
      </PhoneShell>

      {/* Hint text */}
      <div className="ptm-hint-row">
        <div className="ptm-hint-dot" />
        <span className="ptm-hint-text">Interactive Paytm mobile simulation · Tap tabs & cards to navigate</span>
        <div className="ptm-hint-dot" />
      </div>
    </div>
  )
}
