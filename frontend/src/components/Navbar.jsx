import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00BAF2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/>
  </svg>
)

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const currentPath = location.pathname.toLowerCase()
  const isUpload = currentPath.includes('/upload') || currentPath.includes('/check-insurance')
  const isClaim = currentPath.includes('/claim') || currentPath.includes('/check-claim')
  const isBridge = currentPath.includes('/bridge')
  const isPredict = currentPath.includes('/predict')
  const isHome = currentPath === '/'

  return (
    <nav className={`navbar paytm-portal-nav${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner" style={{ maxWidth: '1280px' }}>
        {/* Brand Logo: paytm ❤️ ClaimSaathi */}
        <div className="paytm-main-logo" onClick={() => navigate('/')} title="ClaimSaathi by Paytm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
            <span className="paytm-brand-dark">pay</span>
            <span className="paytm-brand-cyan">tm</span>
          </span>
          {/* Red heart */}
          <svg width="22" height="20" viewBox="0 0 16 14" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}>
            <path d="M8 13S1 8.5 1 4.5a4 4 0 0 1 7-2.65A4 4 0 0 1 15 4.5C15 8.5 8 13 8 13z" fill="#E11D48"/>
          </svg>
          {/* ClaimSaathi badge */}
          <span className="paytm-logo-badge">ClaimSaathi</span>
        </div>

        {/* Feature Navigation Links */}
        <ul className="paytm-nav-menu">
          <li
            className={`paytm-nav-item${isHome ? ' active-feature' : ''}`}
            onClick={() => navigate('/')}
          >
            <span>Home</span>
          </li>

          <li
            className={`paytm-nav-item${isUpload ? ' active-feature' : ''}`}
            onClick={() => navigate('/upload')}
          >
            <span>Check Insurance</span>
          </li>

          <li
            className={`paytm-nav-item${isClaim ? ' active-feature' : ''}`}
            onClick={() => navigate('/claim')}
          >
            <span>Check Claim (Bill)</span>
          </li>

          <li
            className={`paytm-nav-item${isBridge ? ' active-feature' : ''}`}
            onClick={() => navigate('/bridge')}
          >
            <span>Bridge Gap (EMI)</span>
          </li>

          <li
            className={`paytm-nav-item${isPredict ? ' active-feature' : ''}`}
            onClick={() => navigate('/predict')}
          >
            <span>Predict &amp; Plan</span>
          </li>

          <li
            className="paytm-nav-item mobile-demo-pill"
            onClick={() => navigate('/mobile')}
            title="Try Paytm Mobile Experience"
            style={{ background: 'linear-gradient(135deg, rgba(0,186,242,0.12), rgba(99,102,241,0.1))', border: '1.5px solid rgba(0,186,242,0.3)', borderRadius: '99px', padding: '5px 12px', gap: '5px' }}
          >
            <span style={{ fontSize: '13px' }}>📱</span>
            <span>Mobile View</span>
          </li>

          <li
            className="paytm-nav-item saathi-ai-pill"
            onClick={() => window.dispatchEvent(new CustomEvent('open-saathi-chat', { detail: {} }))}
            title="Chat with Sarvam AI"
          >
            <SparkleIcon />
            <span>Saathi AI</span>
          </li>
        </ul>

        {/* Right side controls */}
        <div className="paytm-nav-right">
        </div>
      </div>
    </nav>
  )
}
