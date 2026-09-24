import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-claim">Claim</span>
          <span className="logo-saathi">Saathi</span>
          <span className="logo-by">by Paytm</span>
        </div>

        <ul className="nav-links">
          <li>
            <a className={isActive('/') ? 'active' : ''} onClick={() => navigate('/')}>
              Home
            </a>
          </li>
          <li>
            <a className={isActive('/upload') || isActive('/check-insurance') ? 'active' : ''} onClick={() => navigate('/upload')}>
              Check Insurance
            </a>
          </li>
          <li>
            <a className={isActive('/claim') || isActive('/check-claim') ? 'active' : ''} onClick={() => navigate('/claim')}>
              Check Claim
            </a>
          </li>
          <li>
            <a className={isActive('/bridge') ? 'active' : ''} onClick={() => navigate('/bridge')}>
              Bridge Gap
            </a>
          </li>
        </ul>

        <button className="btn btn-primary nav-cta" onClick={() => navigate('/claim')}>
          Check Claim →
        </button>
      </div>
    </nav>
  )
}
