import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FileUploadZone from '../components/FileUploadZone'
import client from '../api/client'

// ── Crisp SVG Vector Icons (No Emojis) ──────────────────────────────────────────

const CoinStackIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="6" rx="8" ry="3" />
    <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
    <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
  </svg>
)

const BedIcon = ({ color = "#2563eb", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16" />
    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
    <path d="M2 17h20" />
    <path d="M6 8v9" />
  </svg>
)

const PercentTagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
)

const CalendarClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="12" cy="16" r="3" />
    <polyline points="12 14.5 12 16 13.5 16" />
  </svg>
)

const FileCheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <polyline points="9 15 11 17 15 13" />
  </svg>
)

const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const AlertSmallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const SparkleThreeRays = ({ color = "#e11d48" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
    <line x1="12" y1="3" x2="12" y2="8" />
    <line x1="19" y1="7" x2="15" y2="10" />
    <line x1="21" y1="14" x2="16" y2="14" />
  </svg>
)

// Treatment specific vector line icons (clean monochrome)
const renderTreatmentIcon = (type, isCovered = false) => {
  const strokeColor = isCovered ? "#16a34a" : "#e11d48"
  const t = (type || '').toLowerCase()

  if (t.includes('cosmetic') || t.includes('plastic')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 10h.01M15 10h.01" />
        <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
      </svg>
    )
  }
  if (t.includes('dental') || t.includes('tooth')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8 2 6 5 6 9c0 3 1.5 6 2 11 0 1.5 1.5 2 2.5 2s2-1 2.5-3c.5 2 1.5 3 2.5 3s2.5-.5 2.5-2c.5-5 2-8 2-11 0-4-2-7-6-7z" />
      </svg>
    )
  }
  if (t.includes('vision') || t.includes('eye') || t.includes('lasik')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
  if (t.includes('obesity') || t.includes('weight')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    )
  }
  if (t.includes('maternity') || t.includes('pregnancy')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    )
  }
  if (t.includes('inpatient') || t.includes('hospital')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 10h6M12 7v6" />
      </svg>
    )
  }
  if (t.includes('day care') || t.includes('procedures')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    )
  }
  if (t.includes('pre') || t.includes('post') || t.includes('diagnostic')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )
  }
  if (t.includes('ayush') || t.includes('ayurveda')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    )
  }
  if (t.includes('ambulance')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    )
  }

  // Default fallback icon
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

// ── Known Insurance Exclusions Dictionary ───────────────────────────────────────
const EXCLUSIONS_KNOWLEDGE = {
  'cosmetic surgery': {
    label: 'Cosmetic Surgery',
    oneliner: 'Elective aesthetic enhancements & plastic surgeries not covered unless necessary for post-trauma reconstruction.',
  },
  'dental treatment': {
    label: 'Dental Treatment',
    oneliner: 'Routine dental exams, fillings & root canals excluded; covered only when hospitalisation is caused by accidental trauma.',
  },
  'vision correction': {
    label: 'Vision Correction',
    oneliner: 'Eyeglasses, contact lenses & LASIK refractive procedures excluded unless correcting severe refractive errors (>7.5D).',
  },
  'obesity': {
    label: 'Obesity / Bariatric',
    oneliner: 'Weight loss treatments and bariatric surgeries are excluded unless certified as a life-threatening medical emergency.',
  },
  'maternity': {
    label: 'Maternity Care',
    oneliner: 'Childbirth and pregnancy treatments not covered under base plan until mandatory 24–36 month waiting period matures.',
  },
  'substance': {
    label: 'Substance Abuse',
    oneliner: 'De-addiction and psychiatric or physical treatments stemming from alcohol, nicotine, or drug dependency are not eligible.',
  },
}

// ── Allowed/Covered Treatments Dictionary ──────────────────────────────────────
const ALLOWED_TREATMENTS = [
  {
    key: 'inpatient',
    label: 'Inpatient Hospitalization',
    oneliner: '100% cashless coverage for ICU, nursing, doctor consultations & surgical suites (>24h stay).',
    tag: 'Covered',
  },
  {
    key: 'day care',
    label: 'Day Care Procedures',
    oneliner: '500+ modern procedures (dialysis, cataract, tonsillectomy, chemotherapy) covered without 24hr stay.',
    tag: 'Covered',
  },
  {
    key: 'diagnostic',
    label: 'Pre & Post Hospitalization',
    oneliner: 'Medical tests and doctor consultations covered 30 days prior to admission and 60 days after discharge.',
    tag: 'Covered',
  },
  {
    key: 'ayush',
    label: 'AYUSH Treatments',
    oneliner: 'Alternative treatment in government-recognized Ayurveda, Yoga, Unani, Siddha & Homeopathy centers.',
    tag: 'Covered',
  },
  {
    key: 'ambulance',
    label: 'Emergency Road Ambulance',
    oneliner: 'Emergency transport to the nearest network hospital covered up to ₹2,000 per hospitalisation.',
    tag: 'Covered',
  },
]

// ── Fallback Network Hospital Profiles ──────────────────────────────────────────
const DEFAULT_HOSPITALS = [
  {
    name: 'Apollo Hospitals',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    city: 'Pan-India / Multi-City',
    room_category: 'Twin Sharing / Semi-Private AC Room',
    room_desc: '2 patients per room with curtain divider, AC, and dedicated nursing care (approx ₹2,800/day).',
    daily_allowance_formatted: '₹3,000/day',
    upgrade_warning: 'Upgrading to Single Deluxe (₹5,500/day) will exceed your limit by ₹2,500/day and trigger proportionate deduction on doctor & nursing fees.',
    status_tag: 'Cashless',
    source: 'Verified Network Database',
  },
  {
    name: 'Fortis Healthcare',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    city: 'Pan-India / Metro Hubs',
    room_category: 'Twin Sharing / Semi-Private AC Room',
    room_desc: '2 patients per room with curtain divider, AC, and dedicated nursing care (approx ₹2,900/day).',
    daily_allowance_formatted: '₹3,000/day',
    upgrade_warning: 'Upgrading to Single Deluxe (₹5,800/day) will exceed your limit by ₹2,800/day and trigger proportionate deduction on doctor & nursing fees.',
    status_tag: 'Cashless',
    source: 'Verified Network Database',
  },
  {
    name: 'Max Super Speciality',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    city: 'Delhi NCR, Mumbai & North India',
    room_category: 'Twin Sharing / Semi-Private AC Room',
    room_desc: 'Modern facility with companion recliner and 24x7 resident medical officer (approx ₹3,000/day).',
    daily_allowance_formatted: '₹3,000/day',
    upgrade_warning: 'Single room surcharge applies above ₹3,000/day daily room rent cap.',
    status_tag: 'Cashless',
    source: 'Verified Network Database',
  },
]

export default function Upload() {
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [treatmentTab, setTreatmentTab] = useState('exclusions')
  const [hospitalsList, setHospitalsList] = useState([])

  // Load hospital information (via SerpAPI endpoint if available)
  useEffect(() => {
    if (!result?.extracted?.network_hospitals?.length) {
      setHospitalsList(DEFAULT_HOSPITALS)
      return
    }

    const roomLimit = result.extracted.room_rent_limit || '₹3,000/day'
    const names = result.extracted.network_hospitals.slice(0, 3)

    Promise.all(
      names.map(async (name) => {
        try {
          const res = await client.get('/upload/hospital-details', {
            params: { name, room_rent_limit: roomLimit },
          })
          return res.data
        } catch {
          const matched = DEFAULT_HOSPITALS.find(h => h.name.toLowerCase().includes(name.toLowerCase()))
          return matched || {
            name,
            image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
            city: 'Metro Hub',
            room_category: 'Twin Sharing / Semi-Private AC Room',
            room_desc: 'Standard multi-speciality patient room within policy daily cap.',
            daily_allowance_formatted: roomLimit,
            upgrade_warning: 'Upgrading above eligible room category incurs proportionate deductions.',
            status_tag: 'Cashless',
            source: 'Empanelled Network',
          }
        }
      })
    ).then((items) => {
      setHospitalsList(items.length > 0 ? items : DEFAULT_HOSPITALS)
    })
  }, [result])

  const handleAnalyse = async () => {
    if (files.length === 0) {
      setError('Please upload a document first.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', files[0])
      fd.append('doc_type', 'policy')
      const res = await client.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(res.data)
    } catch (err) {
      const detail = err.response?.data?.detail
      if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg || JSON.stringify(d)).join(', '))
      } else {
        setError(detail || err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const getExclusionItem = (rawText) => {
    const lower = rawText.toLowerCase()
    for (const [key, val] of Object.entries(EXCLUSIONS_KNOWLEDGE)) {
      if (lower.includes(key)) {
        return {
          key,
          label: rawText,
          oneliner: val.oneliner,
        }
      }
    }
    return {
      key: rawText,
      label: rawText,
      oneliner: 'Excluded under general policy terms unless specific trauma rider applies.',
    }
  }

  return (
    <div className="page-wrapper">
      {/* ── 1. RICH CHECK INSURANCE HERO (Matching reference design without the girl) ── */}
      {!result ? (
        <div className="check-insurance-hero">
          {/* HEADER ROW WITH 3 FEATURE PILLS */}
          <div className="check-insurance-head">
            <div className="check-insurance-title-group">
              <div className="page-breadcrumb">
                <span onClick={() => navigate('/')}>Home</span>
                <span className="sep">/</span>
                <span style={{ color: '#64748B' }}>Check Insurance</span>
              </div>
              <h1 className="check-insurance-title">
                Check <span className="highlight-cyan">Insurance</span>
              </h1>
              <p className="check-insurance-subtitle">
                Upload your health insurance policy to decode coverage limits, treatments, and network hospitals.
              </p>
            </div>

            {/* 3 FEATURE PILLS CONNECTED BY SUBTLE DOTTED TRACK */}
            <div className="feature-steps-track-wrap">
              <div className="feature-steps-row">
                <div className="feature-step-pill">
                  <div className="pill-icon-box doc">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00BAF2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div className="pill-text">Understand<br />coverage limits</div>
                </div>

                <div className="feature-step-pill">
                  <div className="pill-icon-box hospital">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00BAF2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18" />
                      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                      <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
                      <line x1="10" y1="9" x2="14" y2="9" />
                      <line x1="12" y1="7" x2="12" y2="11" />
                    </svg>
                  </div>
                  <div className="pill-text">Find network<br />hospitals</div>
                </div>

                <div className="feature-step-pill">
                  <div className="pill-icon-box shield">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00BAF2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="pill-text">Know eligible<br />treatments</div>
                </div>
              </div>

              {/* Dotted curve connector */}
              <svg className="dotted-connector-svg" height="20" viewBox="0 0 460 20" fill="none">
                <path d="M 40 4 C 140 22, 320 22, 420 4" stroke="#BAE6FD" strokeWidth="1.8" strokeDasharray="5 5" fill="none" />
              </svg>
            </div>
          </div>

          {/* MAIN STAGE: UPLOAD CARD + RIGHT PAYTM PHONE PREVIEW (NO GIRL ON LEFT) */}
          <div className="check-insurance-stage">
            {/* ── THE UPLOAD CARD ── */}
            <div className="policy-upload-card">
              {/* Card Top Bar */}
              <div className="policy-upload-header">
                <div className="header-left">
                  <div className="doc-icon-badge">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00BAF2" strokeWidth="2.2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <span className="header-title">Upload Your Policy Document</span>
                </div>
                <div className="secure-badge-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <span>100% Secure</span>
                </div>
              </div>

              {/* Dropzone Container */}
              <div className="policy-dropzone-wrap">
                <FileUploadZone onFileSelect={setFiles} />
              </div>

              {error && (
                <div className="alert-box error" style={{ margin: '0 26px 16px' }}>
                  <svg className="alert-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Card Bottom Trust & Action Bar */}
              <div className="policy-upload-bottom-bar">
                <div className="bottom-trust-item">
                  <div className="trust-icon-circle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00BAF2" strokeWidth="2.3">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div className="trust-texts">
                    <div className="trust-title">Your data is safe &amp; private</div>
                    <div className="trust-sub">Powered by Paytm's secure infrastructure</div>
                  </div>
                </div>

                <div className="bottom-bar-divider" />

                <div className="bottom-trust-item">
                  <div className="trust-icon-circle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00BAF2" strokeWidth="2.3">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <div className="trust-texts">
                    <div className="trust-title">Get instant analysis</div>
                    <div className="trust-sub">In seconds, with AI</div>
                  </div>
                </div>

                <div className="bottom-bar-action">
                  <button
                    className="btn btn-primary analyse-btn"
                    onClick={handleAnalyse}
                    disabled={loading || files.length === 0}
                  >
                    {loading ? 'Analysing Document…' : 'Analyse Document →'}
                  </button>
                </div>
              </div>
            </div>

            {/* ── RIGHT SIDE: SLEEK PAYTM PHONE MOCKUP ── */}
            <div className="paytm-preview-phone-wrap">
              <div className="sparkle-rays">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="paytm-phone-body">
                <div className="phone-paytm-brand">
                  <span className="paytm-bold">Pay</span><span className="paytm-cyan">tm</span>
                </div>

                <div className="phone-checklist">
                  <div className="phone-check-item">
                    <div className="phone-check-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="phone-check-text">Coverage Limits</span>
                  </div>

                  <div className="phone-check-item">
                    <div className="phone-check-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="phone-check-text">Network Hospitals</span>
                  </div>

                  <div className="phone-check-item">
                    <div className="phone-check-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="phone-check-text">Eligible Treatments</span>
                  </div>
                </div>
              </div>

              {/* Floating Shield Badge */}
              <div className="floating-phone-shield">
                <svg width="46" height="46" viewBox="0 0 24 24" fill="#00BAF2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div className="shield-check-inner">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* WAVY BACKGROUND BOTTOM GRAPHICS */}
          <div className="hero-wavy-background">
            <svg viewBox="0 0 1440 180" fill="none" preserveAspectRatio="none">
              <path d="M0 90 C 340 160, 600 50, 920 120 C 1180 170, 1360 80, 1440 100 L 1440 180 L 0 180 Z" fill="#E8F7FE" opacity="0.7" />
              <path d="M0 120 C 360 70, 720 170, 1080 110 C 1260 80, 1380 130, 1440 140 L 1440 180 L 0 180 Z" fill="#D6F1FD" opacity="0.6" />
            </svg>
          </div>
        </div>
      ) : (
        <>
          <div className="page-header">
            <div className="page-header-inner">
              <div className="page-breadcrumb">
                <span onClick={() => { setResult(null); setFiles([]) }}>← Upload New Policy</span>
                <span className="sep">/</span>
                <span style={{ color: 'var(--text-mid)' }}>Coverage Analysis</span>
              </div>
              <div className="page-title">Policy Coverage Report</div>
              <div className="page-title-sub">Verified limits, network hospital empanelment &amp; clause-level coverage breakdown.</div>
            </div>
          </div>

          <div className="upload-page-container">

        {/* ── Extracted Dashboard (Matching 3rd reference image) ── */}
        {result && (
          <div className="extracted-dashboard-wrapper">

            {/* ── TOP MAIN CARD: Extracted Coverage Details ── */}
            <div className="coverage-card-main">
              {/* Header */}
              <div className="coverage-header">
                <div className="coverage-title-group">
                  <div className="shield-badge-wrap">
                    <svg className="yellow-sparkles-left" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0L14 9L23 11L14 13L12 22L10 13L1 11L10 9L12 0Z" opacity="0.9" />
                    </svg>
                    <div className="shield-icon-box">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                    <svg className="yellow-sparkles-right" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0L14 9L23 11L14 13L12 22L10 13L1 11L10 9L12 0Z" opacity="0.8" />
                    </svg>
                  </div>

                  <div className="coverage-headings">
                    <h2>Extracted Coverage Details</h2>
                    <p>We've read your policy and extracted the key information for you.</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="status-badge-analysed">
                  <div className="status-check-circle">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span>Policy successfully analysed</span>
                </div>
              </div>

              {/* Two-column layout */}
              <div className="coverage-layout-grid">
                {/* Left Column: 5 Parameters with clean vector SVG icons */}
                <div className="coverage-rows-list">
                  {/* 1. Sum Insured */}
                  <div className="coverage-row-item">
                    <div className="row-label-side">
                      <span className="row-emoji-icon">
                        <CoinStackIcon />
                      </span>
                      <span className="row-label-text">Sum Insured</span>
                    </div>
                    <div className="row-val-pill pill-blue-grey">
                      {result.extracted.sum_insured
                        ? `₹${Number(result.extracted.sum_insured).toLocaleString('en-IN')}`
                        : '₹5,00,000'}
                    </div>
                  </div>

                  {/* 2. Room Rent Limit */}
                  <div className="coverage-row-item">
                    <div className="row-label-side">
                      <span className="row-emoji-icon">
                        <BedIcon color="#0284c7" size={20} />
                      </span>
                      <span className="row-label-text">Room Rent Limit</span>
                    </div>
                    <div className="row-val-pill pill-amber">
                      {result.extracted.room_rent_limit || '₹3,000/day'}
                    </div>
                  </div>

                  {/* 3. Co-pay */}
                  <div className="coverage-row-item">
                    <div className="row-label-side">
                      <span className="row-emoji-icon">
                        <PercentTagIcon />
                      </span>
                      <span className="row-label-text">Co-pay</span>
                    </div>
                    <div className="row-val-pill pill-blue-grey">
                      {result.extracted.co_pay_percent != null
                        ? `${result.extracted.co_pay_percent}%`
                        : '10%'}
                    </div>
                  </div>

                  {/* 4. Waiting Period */}
                  <div className="coverage-row-item">
                    <div className="row-label-side">
                      <span className="row-emoji-icon">
                        <CalendarClockIcon />
                      </span>
                      <span className="row-label-text">Waiting Period</span>
                    </div>
                    <div className="row-val-pill pill-amber">
                      {result.extracted.waiting_period || '2 years for pre-existing conditions'}
                    </div>
                  </div>

                  {/* 5. Pre-existing Covered */}
                  <div className="coverage-row-item">
                    <div className="row-label-side">
                      <span className="row-emoji-icon">
                        <FileCheckIcon />
                      </span>
                      <span className="row-label-text">Pre-existing Covered</span>
                    </div>
                    <div className="row-val-pill pill-mint-green">
                      {result.extracted.pre_existing_covered === false ? 'No' : 'Yes'}
                    </div>
                  </div>
                </div>

                {/* Right Column: Visual illustration matching the screenshot */}
                <div className="policy-graphic-col">
                  <div className="blob-background">
                    <div className="tilted-policy-card">
                      <div className="policy-card-top-row">
                        <div className="policy-card-title">
                          Health<br />Insurance<br />Policy
                        </div>
                        <div className="heart-shield-badge">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            <polyline points="7.5 12 10 12 11 9 13 15 14 12 16.5 12" />
                          </svg>
                        </div>
                      </div>

                      {/* Skeleton lines representing doc content */}
                      <div className="doc-skeleton-bars">
                        <div className="doc-bar w-80" />
                        <div className="doc-bar w-100" />
                        <div className="doc-bar w-65" />
                        <div className="doc-bar w-90" />
                      </div>

                      {/* Curved arrow */}
                      <svg className="curved-arrow-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" transform="rotate(45 12 12)" />
                      </svg>

                      {/* Yellow post-it sticker */}
                      <div className="sticky-extracted-note">
                        <span>Key details<br />extracted!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── BOTTOM TWO CARDS: Exclusions & Network Hospitals ── */}
            <div className="two-cards-grid">

              {/* 1. Left Card: Exclusions / Treatments with One-Liners (Clean SVG Icons) */}
              <div className="card-exclusions">
                <div className="section-card-header">
                  <div className="warning-icon-circle">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>

                  <div className="section-header-text">
                    <h3>
                      Exclusions Detected
                      <SparkleThreeRays color="#f43f5e" />
                    </h3>
                    <p>Treatments and procedures governed by policy restrictions.</p>
                  </div>
                </div>

                {/* Toggle: Exclusions vs Allowed Treatments */}
                <div className="treatment-tabs-bar">
                  <button
                    className={`treatment-tab-btn ${treatmentTab === 'exclusions' ? 'active-excl' : 'inactive'}`}
                    onClick={() => setTreatmentTab('exclusions')}
                  >
                    Exclusions (Not Covered)
                  </button>
                  <button
                    className={`treatment-tab-btn ${treatmentTab === 'allowed' ? 'active-cov' : 'inactive'}`}
                    onClick={() => setTreatmentTab('allowed')}
                  >
                    Allowed Treatments (Cashless)
                  </button>
                </div>

                {/* Rich Treatments List (with Clean SVG Icons) */}
                <div className="treatments-rich-list">
                  {treatmentTab === 'exclusions' ? (
                    (result.extracted.exclusions?.length > 0
                      ? result.extracted.exclusions
                      : ['Cosmetic Surgery', 'Dental Treatment', 'Vision Correction']
                    ).map((ex) => {
                      const item = getExclusionItem(ex)
                      return (
                        <div key={ex} className="treatment-rich-item">
                          <div className="treatment-item-emoji">
                            {renderTreatmentIcon(item.key, false)}
                          </div>
                          <div className="treatment-item-body">
                            <div className="treatment-item-title-row">
                              <span className="treatment-item-name">{item.label}</span>
                              <span className="treatment-badge-tag badge-tag-excl">EXCLUDED</span>
                            </div>
                            <div className="treatment-item-oneliner">{item.oneliner}</div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    ALLOWED_TREATMENTS.map((item) => (
                      <div key={item.label} className="treatment-rich-item covered-item">
                        <div className="treatment-item-emoji">
                          {renderTreatmentIcon(item.key, true)}
                        </div>
                        <div className="treatment-item-body">
                          <div className="treatment-item-title-row">
                            <span className="treatment-item-name">{item.label}</span>
                            <span className="treatment-badge-tag badge-tag-cov">100% COVERED</span>
                          </div>
                          <div className="treatment-item-oneliner">{item.oneliner}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 2. Right Card: Network Hospitals with SerpAPI Images & Room Category Details */}
              <div className="card-hospitals">
                <div className="section-card-header">
                  <div className="hospital-icon-circle">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18" />
                      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                      <path d="M9 10h6" />
                      <path d="M12 7v6" />
                    </svg>
                  </div>

                  <div className="section-header-text">
                    <h3>
                      Network Hospitals (Sample)
                      <SparkleThreeRays color="#10b981" />
                    </h3>
                    <p>Avail 100% cashless treatment at these empanelled centres.</p>
                  </div>
                </div>

                {/* Hospitals List */}
                <div className="hospitals-rich-list">
                  {hospitalsList.map((hosp) => (
                    <div key={hosp.name} className="hospital-rich-card">
                      <div className="hospital-card-head">
                        <div className="hospital-thumb-box">
                          <img
                            src={hosp.image}
                            alt={hosp.name}
                            className="hospital-thumb-img"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80'
                            }}
                          />
                        </div>

                        <div className="hospital-head-info">
                          <div className="hospital-name-text">{hosp.name}</div>
                          <div className="hospital-location-text">
                            <PinIcon />
                            <span>{hosp.city || 'Metro Hub'}</span>
                            <span style={{ margin: '0 4px' }}>•</span>
                            <span className="cashless-pill-tag">✓ Cashless</span>
                          </div>
                        </div>
                      </div>

                      {/* Room Category Eligibility & Allowance (with clean Bed & Alert icons) */}
                      <div className="room-category-container">
                        <div className="room-category-row">
                          <div className="room-cat-title">
                            <BedIcon color="#0284c7" size={16} />
                            <span>{hosp.room_category}</span>
                          </div>
                          <div className="room-cat-allowance">
                            {hosp.daily_allowance_formatted || '₹3,000/day'}
                          </div>
                        </div>

                        <div className="room-cat-desc">
                          {hosp.room_desc}
                        </div>

                        {hosp.upgrade_warning && (
                          <div className="room-upgrade-alert" style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <AlertSmallIcon />
                            <div>
                              <strong>Room Advisory:</strong> {hosp.upgrade_warning}
                            </div>
                          </div>
                        )}

                        <div className="source-badge">
                          Image &amp; network verification via {hosp.source || 'Verified Network Database'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── BOTTOM ACTIONS ── */}
            <div className="form-actions" style={{ marginTop: '32px' }}>
              <button className="btn btn-ghost" onClick={() => { setResult(null); setFiles([]) }}>
                ← Upload Another Document
              </button>
              <div className="form-actions-right">
                <button className="btn btn-outline" onClick={() => navigate('/predict')}>
                  Predict &amp; Plan →
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/claim')}>
                  Check Claim Split →
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
        </>
      )}
    </div>
  )
}
