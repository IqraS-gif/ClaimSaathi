import { useNavigate } from 'react-router-dom'

const CheckIcon = ({ color = '#16a34a', size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const CrossIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const ChevronRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingTop: '72px' }}>

      {/* ── HERO ── */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 32px 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: '48px',
          alignItems: 'center',
        }}>

          {/* LEFT: Text */}
          <div>
            {/* Brand pill badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#E8F7FE',
              border: '1.5px solid #BAE6FD',
              borderRadius: '9999px',
              padding: '5px 14px 5px 6px',
              marginBottom: '28px',
            }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: '#fff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,186,242,0.2)',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#00BAF2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#002970' }}>ClaimSaathi</span>
              <span style={{ color: '#93c5fd', fontSize: '12px' }}>|</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Powered by Paytm Insurance</span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(40px, 5vw, 62px)',
              fontWeight: 900,
              lineHeight: 1.04,
              letterSpacing: '-1.5px',
              color: '#0A1628',
              textTransform: 'uppercase',
              margin: '0 0 22px',
            }}>
              YOUR HEALTH<br />
              INSURANCE,<br />
              <span style={{ color: '#00BAF2' }}>SIMPLIFIED.</span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '15.5px',
              lineHeight: 1.65,
              color: '#475569',
              maxWidth: '460px',
              margin: '0 0 36px',
            }}>
              Upload your policy, check your hospital bill, know what insurance will pay and what you may have to pay — all in one place with ClaimSaathi.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/upload')}
                style={{
                  background: '#00BAF2', color: '#fff', border: 'none',
                  fontSize: '15px', fontWeight: 700, padding: '13px 28px',
                  borderRadius: '9999px', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 6px 20px -2px rgba(0,186,242,0.4)',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#009ad0'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#00BAF2'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Check Insurance <span>→</span>
              </button>

              <button
                onClick={() => navigate('/claim')}
                style={{
                  background: '#fff', color: '#00BAF2',
                  border: '2px solid #00BAF2',
                  fontSize: '15px', fontWeight: 700, padding: '11px 26px',
                  borderRadius: '9999px', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f0f9ff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Check Claim (Bill) <span>→</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Visual */}
          <div style={{ position: 'relative', width: '100%', paddingLeft: '56px' }}>
            {/* Photo backdrop card */}
            <div style={{
              borderRadius: '32px',
              padding: '40px 24px',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '520px',
              overflow: 'hidden',
              backgroundImage: 'url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=60)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
              {/* Photo tint + blur overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                backdropFilter: 'blur(18px)',
                background: 'linear-gradient(140deg, rgba(220,238,255,0.82) 0%, rgba(200,228,252,0.88) 100%)',
                borderRadius: '32px',
                zIndex: 0,
              }} />

              {/* Left floating badges — overhang the card edge */}
              <div style={{
                position: 'absolute', top: '195px', left: '-52px',
                background: '#fff', border: '1px solid #E2E8F0',
                borderRadius: '9999px', padding: '9px 18px 9px 8px',
                display: 'flex', alignItems: 'center', gap: '9px',
                boxShadow: '0 10px 28px -4px rgba(0,41,112,0.18)',
                fontSize: '13px', fontWeight: 700, color: '#0F172A', zIndex: 6,
                whiteSpace: 'nowrap',
              }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#00BAF2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                </div>
                Faster Claims
              </div>

              <div style={{
                position: 'absolute', top: '295px', left: '-52px',
                background: '#fff', border: '1px solid #E2E8F0',
                borderRadius: '9999px', padding: '9px 18px 9px 8px',
                display: 'flex', alignItems: 'center', gap: '9px',
                boxShadow: '0 10px 28px -4px rgba(0,41,112,0.18)',
                fontSize: '13px', fontWeight: 700, color: '#0F172A', zIndex: 6,
                whiteSpace: 'nowrap',
              }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#E0F4FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00BAF2" strokeWidth="2.3">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                Clearer Coverage
              </div>

              {/* iPhone Mockup */}
              <div style={{
                width: '240px', height: '480px',
                background: '#fff',
                borderRadius: '38px',
                border: '8px solid #1E293B',
                boxShadow: '0 24px 56px -10px rgba(0,41,112,0.22), 0 8px 20px -4px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                zIndex: 2, position: 'relative',
              }}>
                {/* Notch */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px 4px', background: '#fff' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#1E293B' }}>9:41</span>
                  <div style={{ width: '50px', height: '14px', background: '#0F172A', borderRadius: '12px' }} />
                  <svg width="14" height="10" viewBox="0 0 24 18" fill="#1e293b">
                    <rect x="1" y="2" width="4" height="14" rx="1" />
                    <rect x="7" y="5" width="4" height="11" rx="1" />
                    <rect x="13" y="8" width="4" height="8" rx="1" />
                    <rect x="19" y="11" width="4" height="5" rx="1" />
                  </svg>
                </div>

                {/* Screen */}
                <div style={{ padding: '8px 14px 14px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  {/* App Header */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 900, marginBottom: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <span><span style={{ color: '#002970' }}>pay</span><span style={{ color: '#00BAF2' }}>tm</span></span>
                      <svg width="13" height="11" viewBox="0 0 14 12" fill="none">
                        <path d="M7 11s-6-3.5-6-7a4 4 0 0 1 6-3.46A4 4 0 0 1 13 4c0 3.5-6 7-6 7z" fill="#E11D48"/>
                      </svg>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: '#002970', letterSpacing: '0.2px' }}>UPI</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '2px' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="#00BAF2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#002970' }}>ClaimSaathi</span>
                    </div>
                    <p style={{ fontSize: '8.5px', color: '#64748B', margin: '0 auto 10px', maxWidth: '160px', lineHeight: 1.3 }}>
                      Your personal guide for health insurance claims
                    </p>
                  </div>

                  {/* Tile Rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[
                      { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00BAF2" strokeWidth="2.3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, label: 'Upload Insurance Policy', page: '/upload' },
                      { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#002970" strokeWidth="2.3"><path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><line x1="9" y1="9" x2="15" y2="9"/></svg>, label: 'Upload Hospital Bill', page: '/claim' },
                      { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: 'View Claim Summary', page: '/claim' },
                      { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2.3"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>, label: 'Explore Financial Support', page: '/bridge' },
                    ].map(({ icon, label, page }) => (
                      <div key={label} onClick={() => navigate(page)} style={{
                        background: '#F8FAFC', border: '1px solid #E2E8F0',
                        borderRadius: '9px', padding: '7px 9px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '5px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                          {icon}
                        </div>
                        <span style={{ fontSize: '9px', fontWeight: 700, color: '#1E293B', marginLeft: '5px', flex: 1 }}>{label}</span>
                        <ChevronRight />
                      </div>
                    ))}
                  </div>

                  {/* Bottom pill */}
                  <div onClick={() => navigate('/bridge')} style={{
                    background: '#fff', border: '1px solid #E2E8F0',
                    borderRadius: '9px', padding: '6px 8px',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#EDE9FE', color: '#7C3AED', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>₹</div>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#0F172A' }}>Financial Support</span>
                    <span style={{ fontSize: '8px', color: '#64748B' }}>with Paytm EMI</span>
                  </div>
                </div>
              </div>

              {/* Floating Card 1: Policy Analysis */}
              <div style={{
                position: 'absolute', top: '28px', right: '-20px',
                background: '#fff', borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '14px 16px',
                boxShadow: '0 14px 32px -6px rgba(0,41,112,0.16), 0 4px 12px rgba(0,0,0,0.05)',
                width: '222px', zIndex: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00BAF2" strokeWidth="2.4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>Policy Analysis</span>
                  </div>
                  <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px' }}>COMPLETED</span>
                </div>
                {[
                  { label: 'Room Rent Limit', ok: true },
                  { label: 'ICU Charges', ok: true },
                  { label: 'Pre-Post Hospitalisation', ok: true },
                  { label: 'Non-Payable Items', ok: false, badge: '2 found' },
                ].map(({ label, ok, badge }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#334155', fontWeight: 600 }}>
                      {ok ? <CheckIcon /> : <CrossIcon />}
                      {label}
                    </div>
                    {ok
                      ? <span style={{ color: '#15803D', fontWeight: 700 }}>Covered</span>
                      : <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: '9.5px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px' }}>{badge}</span>
                    }
                  </div>
                ))}
              </div>

              {/* Floating Card 2: Hospital Bill Analysis */}
              <div style={{
                position: 'absolute', bottom: '32px', right: '-20px',
                background: '#fff', borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '14px 16px',
                boxShadow: '0 14px 32px -6px rgba(0,41,112,0.16), 0 4px 12px rgba(0,0,0,0.05)',
                width: '222px', zIndex: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>Hospital Bill Analysis</span>
                  </div>
                  <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px' }}>COMPLETED</span>
                </div>
                {[
                  { sign: '+', signColor: '#0284C7', label: 'Total Bill Amount', val: '₹2,00,000', valColor: '#0F172A' },
                  { sign: '+', signColor: '#16A34A', label: 'Expected Insurance Payout', val: '₹1,30,000', valColor: '#16A34A' },
                  { sign: '+', signColor: '#E11D48', label: 'Your Out-of-Pocket', val: '₹70,000', valColor: '#E11D48' },
                ].map(({ sign, signColor, label, val, valColor }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#334155', fontWeight: 600 }}>
                      <span style={{ fontWeight: 800, fontSize: '13px', color: signColor }}>{sign}</span>
                      {label}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: valColor }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS SECTION ── */}
      <section style={{ background: '#F8FAFC', padding: '64px 32px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-block', background: '#E0F2FE', color: '#0369A1', fontSize: '11px', fontWeight: 800, letterSpacing: '1px', padding: '4px 14px', borderRadius: '9999px', marginBottom: '14px' }}>THREE EASY STEPS</div>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 900, color: '#0F172A', margin: '0 0 12px' }}>Everything you need, before &amp; during hospitalisation</h2>
            <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '560px', margin: '0 auto' }}>From decoding fine-print room rent limits to bridging out-of-pocket gaps at the cashier counter.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              {
                step: 'STEP 01', label: 'Check Insurance', color: '#EFF6FF', iconColor: '#2563EB',
                icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
                desc: 'Upload your policy document to decode sum insured, room rent limits, co-pay, and nearby network hospitals.',
                chips: ['Policy Decoder', 'Room Capping', 'Cashless Network'], page: '/upload', linkText: 'Check Policy',
              },
              {
                step: 'STEP 02', label: 'Check Claim (Bill Simulator)', color: '#F5F3FF', iconColor: '#7C3AED',
                icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
                desc: 'Upload your hospital bill and policy to see the exact financial split — ₹2,00,000 bill → ₹1,30,000 insurance → ₹70,000 you pay.',
                chips: ['Bill Split', 'Clause Audit', 'Proportionate Penalty'], page: '/claim', linkText: 'Simulate Bill',
              },
              {
                step: 'STEP 03', label: 'Paytm Financial Bridge', color: '#ECFDF5', iconColor: '#059669',
                icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
                desc: 'Cover any out-of-pocket gap immediately at the hospital cashier with 0% No-Cost EMI financing.',
                chips: ['0% No-Cost EMI', '45-Day Grace', 'Direct Disbursal'], page: '/bridge', linkText: 'Explore Loans',
              },
            ].map(({ step, label, color, iconColor, icon, desc, chips, page, linkText }) => (
              <div
                key={step}
                onClick={() => navigate(page)}
                style={{
                  background: '#fff', borderRadius: '20px', padding: '28px',
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 4px 16px rgba(0,41,112,0.04)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,41,112,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,41,112,0.04)' }}
              >
                <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '1px', color: '#94A3B8', marginBottom: '14px' }}>{step}</div>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: color, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px' }}>{label}</h3>
                <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6, margin: '0 0 16px' }}>{desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {chips.map(c => (
                    <span key={c} style={{ fontSize: '11px', fontWeight: 600, background: '#F1F5F9', color: '#475569', padding: '3px 10px', borderRadius: '9999px' }}>{c}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00BAF2', fontWeight: 700, fontSize: '13.5px' }}>
                  <span>{linkText}</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ background: 'linear-gradient(135deg, #002970 0%, #00BAF2 100%)', padding: '64px 32px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 900, color: '#fff', margin: '0 0 14px' }}>
            Ready to decode your policy and hospital bill?
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', margin: '0 0 32px' }}>
            100% paperless, secure, and powered by Paytm's trusted financial infrastructure.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/upload')} style={{ background: '#fff', color: '#002970', border: 'none', fontWeight: 800, fontSize: '15px', padding: '13px 28px', borderRadius: '9999px', cursor: 'pointer', fontFamily: 'inherit' }}>
              Check Insurance Now →
            </button>
            <button onClick={() => navigate('/claim')} style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.6)', fontWeight: 700, fontSize: '15px', padding: '11px 26px', borderRadius: '9999px', cursor: 'pointer', fontFamily: 'inherit' }}>
              Simulate Hospital Bill →
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
