import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import StepProgress from '../components/StepProgress'
import client from '../api/client'

const STEPS = [{ label: 'Gap Details' }, { label: 'Paytm Details' }, { label: 'Application Sent' }]
const fmt = (n) => {
  const num = Number(n)
  if (isNaN(num) || num <= 0) return '₹0'
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

export default function Bridge() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const getInitialForm = () => {
    const pPatient = searchParams.get('patient')
    const pClaim = searchParams.get('claim_id')
    const pBilled = searchParams.get('billed')
    const pPayout = searchParams.get('payout')
    const pGap = searchParams.get('gap')
    const pPlan = searchParams.get('plan')

    let saved = null
    try {
      const raw = localStorage.getItem('latest_simulation')
      if (raw) saved = JSON.parse(raw)
    } catch {}

    const patient = (pPatient && pPatient !== 'undefined' && pPatient.trim())
      || saved?.patient_name
      || 'Rahul Verma'

    const claimId = (pClaim && pClaim !== 'undefined' && pClaim.trim())
      || saved?.claim_id
      || 'CLM-2026-88412'

    const billed = (pBilled && pBilled !== 'undefined' && !isNaN(Number(pBilled)) && Number(pBilled) > 0)
      ? String(pBilled)
      : (saved?.total_billed || saved?.total_bill ? String(saved.total_billed || saved.total_bill) : '200000')

    const payout = (pPayout && pPayout !== 'undefined' && !isNaN(Number(pPayout)) && Number(pPayout) > 0)
      ? String(pPayout)
      : (saved?.insurance_payable ? String(saved.insurance_payable) : '130000')

    const gap = (pGap && pGap !== 'undefined' && !isNaN(Number(pGap)) && Number(pGap) > 0)
      ? String(pGap)
      : (saved?.you_pay ? String(saved.you_pay) : String(Math.max(0, Number(billed) - Number(payout))))

    let plan = 'emi_3'
    if (pPlan === 'no_cost_3') plan = 'emi_3'
    else if (pPlan && ['emi_3', 'emi_6', 'emi_12', 'bullet_45', 'lump_sum'].includes(pPlan)) plan = pPlan

    return {
      patient_name: patient,
      claim_id: claimId,
      hospital_expense: billed,
      insurance_payout: payout,
      gap_amount: gap,
      repayment_preference: plan,
      paytm_mobile: '9876543210',
      consent_financial_data: true,
      consent_repayment: true,
    }
  }

  const [step, setStep] = useState(1)
  const [form, setForm] = useState(getInitialForm)
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    setForm(getInitialForm())
  }, [searchParams])

  const set     = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))
  const setCheck = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.checked }))

  const calcGap = () => {
    const exp = Number(form.hospital_expense) || 0
    const pay = Number(form.insurance_payout) || 0
    const gap = Math.max(0, exp - pay)
    setForm(p => ({ ...p, gap_amount: gap.toString() }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.consent_financial_data || !form.consent_repayment) {
      setError('Both consents are required to proceed.'); return
    }
    if (!form.paytm_mobile || form.paytm_mobile.length < 10) {
      setError('Enter a valid 10-digit Paytm mobile number.'); return
    }
    setError(null); setLoading(true)
    try {
      const payload = {
        ...form,
        hospital_expense: Number(form.hospital_expense),
        insurance_payout: Number(form.insurance_payout),
        gap_amount:       Number(form.gap_amount),
        consent_financial_data: form.consent_financial_data,
        consent_repayment:      form.consent_repayment,
      }
      const res = await client.post('/bridge', payload)
      setResult(res.data)
      setStep(3)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-header-inner">
          <div className="page-breadcrumb">
            <span onClick={() => navigate('/')}>Home</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--text-mid)' }}>Paytm Financial Bridge</span>
          </div>
          <div className="page-title">Paytm Financial Bridge</div>
          <div className="page-title-sub">Bridge the gap between your hospital bill and insurance payout — instantly.</div>
          <StepProgress steps={STEPS} currentStep={step} />
        </div>
      </div>

      <div className="form-page-body">
        <div className="form-main">

          {/* STEP 1 — Gap details */}
          {step === 1 && (
            <div className="card">
              <div className="card-title">Calculate Your Cash Gap</div>

              <div className="alert-box success" style={{ marginBottom: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <div>
                    <strong style={{ color: '#15803D', fontSize: '14px' }}>Auto-filled from Claim Simulation</strong>
                    <div style={{ fontSize: '12.5px', color: '#166534', marginTop: '2px' }}>
                      Patient: <strong>{form.patient_name || 'Rahul Verma'}</strong> &bull; Hospital Deduction Gap: <strong>{fmt(form.gap_amount || 70000)}</strong>
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, background: '#DCFCE7', color: '#15803D', padding: '3px 8px', border: '1px solid #BBF7D0', borderRadius: '6px', textTransform: 'uppercase' }}>
                  Auto-Populated
                </span>
              </div>

              <div className="form-group">
                <label>Patient Name</label>
                <input type="text" placeholder="e.g. Rahul Verma" value={form.patient_name} onChange={set('patient_name')} />
              </div>
              <div className="form-group">
                <label>Claim ID (if available)</label>
                <input type="text" placeholder="e.g. CLM-2026-88412" value={form.claim_id} onChange={set('claim_id')} />
              </div>

              <div className="form-section-label">Financial Gap Calculation</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="required">Total Hospital Expense (₹)</label>
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">₹</span>
                    <input type="number" placeholder="200000" value={form.hospital_expense} onChange={set('hospital_expense')} onBlur={calcGap} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="required">Expected Insurance Payout (₹)</label>
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">₹</span>
                    <input type="number" placeholder="130000" value={form.insurance_payout} onChange={set('insurance_payout')} onBlur={calcGap} />
                  </div>
                </div>
              </div>

              {form.gap_amount && Number(form.gap_amount) > 0 && (
                <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-md)', padding: '20px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-light)', fontWeight: 500 }}>Hospital Bill</span>
                    <span style={{ fontWeight: 700 }}>{fmt(form.hospital_expense)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-light)', fontWeight: 500 }}>Insurance Payout</span>
                    <span style={{ fontWeight: 700, color: 'var(--blue-mid)' }}>{fmt(form.insurance_payout)}</span>
                  </div>
                  <div style={{ height: '1.5px', background: 'var(--border)', margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-dark)' }}>Immediate Cash Gap</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--orange)' }}>{fmt(form.gap_amount)}</span>
                  </div>
                </div>
              )}

              <div className="form-section-label">Repayment Preference</div>
              <div className="option-group">
                {[
                  { v: 'emi_3',    l: '0% No-Cost EMI — 3 Months',       s: 'Split evenly in 3 parts with 0% interest' },
                  { v: 'emi_6',    l: 'Flexi Health Loan — 6 Months',    s: 'Spread repayment over 6 months at 8.9% p.a.' },
                  { v: 'emi_12',   l: 'Extended Health Credit — 12 Months', s: 'Lowest monthly installment burden over 12 months' },
                  { v: 'bullet_45',l: 'Claim Settlement Advance — 45 Days', s: 'Repay in full once your insurance TPA reimburses' },
                  { v: 'lump_sum', l: 'Lump Sum Settlement',              s: 'Repay in full upon hospital discharge' },
                ].map(r => (
                  <label key={r.v} className={`option-item${form.repayment_preference === r.v ? ' selected' : ''}`}>
                    <input type="radio" name="rp" value={r.v} checked={form.repayment_preference === r.v} onChange={() => setForm(p => ({ ...p, repayment_preference: r.v }))} />
                    <div>
                      <div className="option-item-label">{r.l}</div>
                      <div className="option-item-sub">{r.s}</div>
                    </div>
                    {form.gap_amount && Number(form.gap_amount) > 0 && (
                      <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--blue-mid)', fontSize: 14 }}>
                        {r.v.startsWith('emi_')
                          ? `${fmt(Number(form.gap_amount) / Number(r.v.split('_')[1]))}/mo`
                          : r.v === 'bullet_45'
                          ? '0% for 45d'
                          : 'Full'}
                      </span>
                    )}
                  </label>
                ))}
              </div>

              {error && <div className="alert-box error" style={{ marginTop: '12px' }}>{error}</div>}
              <div className="form-actions" style={{ marginTop: '24px' }}>
                <span />
                <button className="btn btn-primary" onClick={() => {
                  if (!form.hospital_expense || !form.insurance_payout) { setError('Enter both amounts to continue.'); return }
                  if (!form.gap_amount) calcGap()
                  setError(null); setStep(2)
                }}>Continue &#8594;</button>
              </div>
            </div>
          )}

          {/* STEP 2 — Paytm details + consent */}
          {step === 2 && (
            <div className="card">
              <div className="card-title">Paytm Account &amp; Consent</div>

              <div className="form-group">
                <label className="required">Paytm-Registered Mobile Number</label>
                <input type="tel" maxLength={10} placeholder="10-digit mobile number" value={form.paytm_mobile} onChange={set('paytm_mobile')} />
              </div>

              <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', padding: '20px', marginBottom: '20px' }}>
                <div className="form-section-label" style={{ marginBottom: '12px' }}>Loan Summary</div>
                <div className="summary-row"><span className="summary-label">Bridge Amount</span><span className="summary-val">{fmt(form.gap_amount || 0)}</span></div>
                <div className="summary-row">
                  <span className="summary-label">Repayment Plan</span>
                  <span className="summary-val">
                    {form.repayment_preference === 'lump_sum'
                      ? 'Lump sum at discharge'
                      : form.repayment_preference === 'bullet_45'
                      ? 'Pay after TPA claim settlement (45 days grace)'
                      : `EMI over ${form.repayment_preference.split('_')[1]} months`}
                  </span>
                </div>
                {form.repayment_preference.startsWith('emi_') ? (
                  <div className="summary-row">
                    <span className="summary-label">Monthly EMI</span>
                    <span className="summary-val blue">{fmt(Number(form.gap_amount) / Number(form.repayment_preference.split('_')[1]))}/month</span>
                  </div>
                ) : form.repayment_preference === 'bullet_45' ? (
                  <div className="summary-row">
                    <span className="summary-label">Due Today</span>
                    <span className="summary-val" style={{ color: '#15803d' }}>₹0 (Cleared upon TPA reimbursement)</span>
                  </div>
                ) : null}
              </div>

              <div className="form-section-label">Required Consents</div>
              <div className="option-group">
                <label className={`option-item${form.consent_financial_data ? ' selected' : ''}`}>
                  <input type="checkbox" checked={form.consent_financial_data} onChange={setCheck('consent_financial_data')} />
                  <div>
                    <div className="option-item-label">Consent to Financial Data Sharing</div>
                    <div className="option-item-sub">I consent to Paytm accessing my claim and insurance settlement data for credit evaluation.</div>
                  </div>
                </label>
                <label className={`option-item${form.consent_repayment ? ' selected' : ''}`}>
                  <input type="checkbox" checked={form.consent_repayment} onChange={setCheck('consent_repayment')} />
                  <div>
                    <div className="option-item-label">Consent to Repayment Terms</div>
                    <div className="option-item-sub">I agree that repayment will be deducted from my insurance settlement proceeds or scheduled EMIs.</div>
                  </div>
                </label>
              </div>

              {error && <div className="alert-box error" style={{ marginTop: '12px' }}>{error}</div>}

              <div className="form-actions" style={{ marginTop: '24px' }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>&#8592; Back</button>
                <button className="btn btn-primary" disabled={loading} onClick={handleSubmit}>
                  {loading ? 'Submitting...' : 'Apply for Financial Bridge'}
                </button>
              </div>

              <div className="alert-box warning" style={{ marginTop: '16px', fontSize: '12px' }}>
                <svg className="alert-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                Paytm Financial Bridge is subject to credit eligibility assessment. Approval is not guaranteed.
              </div>
            </div>
          )}

          {/* STEP 3 — Success */}
          {step === 3 && result && (
            <div className="result-panel">
              <div className="success-page" style={{ padding: '40px 0 24px' }}>
                <div className="success-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2>Application Submitted</h2>
                <p>Your Paytm Financial Bridge application is under review. You will receive an SMS and in-app update within 2 hours.</p>
                <div className="success-id">Bridge Application ID: {result.bridge_id}</div>
              </div>

              <div className="card">
                <div className="card-title">Bridge Summary</div>
                <div className="summary-row"><span className="summary-label">Gap Amount</span><span className="summary-val">{fmt(result.gap_amount)}</span></div>
                {result.monthly_emi && <div className="summary-row"><span className="summary-label">Monthly EMI</span><span className="summary-val blue">{fmt(result.monthly_emi)}</span></div>}
                {result.repayment_months && <div className="summary-row"><span className="summary-label">Repayment Period</span><span className="summary-val">{result.repayment_months} months</span></div>}
                <div className="summary-row"><span className="summary-label">Status</span><span className="badge badge-orange" style={{ textTransform: 'capitalize' }}>{result.status.replace('_', ' ')}</span></div>
              </div>

              <div className="card">
                <div className="card-title">Next Steps</div>
                <div className="checklist">
                  {result.next_steps?.map((s, i) => (
                    <div key={i} className="checklist-item">
                      <div className="check-icon optional" style={{ background: 'var(--blue-light)', color: 'var(--blue-mid)' }}>{i + 1}</div>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="alert-box info" style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                {result.disclaimer}
              </div>

              <div className="success-actions">
                <button className="btn btn-ghost" onClick={() => navigate('/')}>Back to Home</button>
                <button className="btn btn-primary" onClick={() => navigate('/claim')}>View My Claims</button>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="form-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-card-title">How the Bridge Works</div>
            <div className="info-list">
              {['Paytm verifies your claim and settlement letter','A credit line is activated on your Paytm account','Funds transfer to hospital or your account','Repayment deducted from settlement proceeds','Remaining balance on EMI if needed'].map(i => (
                <div key={i} className="info-item"><div className="info-dot" />{i}</div>
              ))}
            </div>
          </div>
          <div className="sidebar-card">
            <div className="sidebar-card-title">Eligibility Requirements</div>
            <div className="info-list">
              {['Active Paytm account (KYC complete)','Valid health insurance claim','Policy not lapsed','Clear repayment history'].map(i => (
                <div key={i} className="info-item"><div className="info-dot" />{i}</div>
              ))}
            </div>
          </div>
          <div className="alert-box success">
            <svg className="alert-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <div>Treatment should never stop because of a pending payment. Paytm bridges that gap.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
