import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepProgress from '../components/StepProgress'
import client from '../api/client'

const STEPS = [{ label: 'Hospital Info' }, { label: 'Policy Details' }, { label: 'Results' }]

const ROOM_CATS = [
  { value: 'general',      label: 'General Ward',       sub: 'Shared ward, lowest cost' },
  { value: 'semi_private', label: 'Semi-Private',        sub: '2-4 beds per room' },
  { value: 'private',      label: 'Private Room',        sub: 'Single occupancy' },
  { value: 'icu',          label: 'ICU',                 sub: 'Intensive care unit' },
]

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

export default function Predict() {
  const navigate = useNavigate()
  const [step,   setStep]   = useState(1)
  const [form,   setForm]   = useState({
    hospital_name: '', city: '', treatment_type: '', diagnosis: '',
    room_category: 'private', estimated_bill: '', admission_type: 'planned',
    policy_number: '', sum_insured: '', co_pay_percent: '0', room_rent_limit: '',
  })
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState(null)

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.estimated_bill) { setError('Please enter estimated bill amount.'); return }
    setError(null)
    setLoading(true)
    try {
      const payload = {
        ...form,
        estimated_bill:  Number(form.estimated_bill),
        sum_insured:     form.sum_insured     ? Number(form.sum_insured)     : null,
        co_pay_percent:  form.co_pay_percent  ? Number(form.co_pay_percent)  : 0,
      }
      const res = await client.post('/predict', payload)
      setResult(res.data)
      setStep(3)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const cb = result?.cost_breakdown

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-header-inner">
          <div className="page-breadcrumb">
            <span onClick={() => navigate('/')}>Home</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--text-mid)' }}>Predict &amp; Plan</span>
          </div>
          <div className="page-title">Predict &amp; Plan</div>
          <div className="page-title-sub">Know your expected out-of-pocket cost before admission.</div>
          <StepProgress steps={STEPS} currentStep={step} />
        </div>
      </div>

      <div className="predict-page-container">
        <div className="predict-page-main">

          {/* STEP 1 — Hospital info */}
          {step === 1 && (
            <div className="card">
              <div className="card-title">Hospital &amp; Treatment Details</div>

              <div className="form-row">
                <div className="form-group">
                  <label className="required">Hospital Name</label>
                  <input type="text" placeholder="e.g. Apollo Hospitals, Delhi" value={form.hospital_name} onChange={set('hospital_name')} />
                </div>
                <div className="form-group">
                  <label className="required">City</label>
                  <input type="text" placeholder="e.g. Delhi, Mumbai, Bengaluru" value={form.city} onChange={set('city')} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="required">Treatment Type</label>
                  <select value={form.treatment_type} onChange={set('treatment_type')}>
                    <option value="">Select treatment</option>
                    <option>Cardiac Surgery</option>
                    <option>Orthopaedic Surgery</option>
                    <option>Cancer Treatment</option>
                    <option>Maternity</option>
                    <option>Kidney / Dialysis</option>
                    <option>Neurological</option>
                    <option>General Surgery</option>
                    <option>Accident / Emergency</option>
                    <option>Other Medical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Diagnosis / Condition</label>
                  <input type="text" placeholder="e.g. Appendicitis, Knee Replacement" value={form.diagnosis} onChange={set('diagnosis')} />
                </div>
              </div>

              <div className="form-section-label">Room Category</div>
              <div className="option-group" style={{ marginBottom: '20px' }}>
                {ROOM_CATS.map(r => (
                  <label key={r.value} className={`option-item${form.room_category === r.value ? ' selected' : ''}`}>
                    <input type="radio" name="room" value={r.value} checked={form.room_category === r.value} onChange={() => setForm(p => ({ ...p, room_category: r.value }))} />
                    <div>
                      <div className="option-item-label">{r.label}</div>
                      <div className="option-item-sub">{r.sub}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="required">Estimated Bill (₹)</label>
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">₹</span>
                    <input type="number" placeholder="200000" value={form.estimated_bill} onChange={set('estimated_bill')} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Admission Type</label>
                  <select value={form.admission_type} onChange={set('admission_type')}>
                    <option value="planned">Planned Admission</option>
                    <option value="emergency">Emergency Admission</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <span />
                <button className="btn btn-primary" onClick={() => {
                  if (!form.hospital_name || !form.city || !form.treatment_type || !form.estimated_bill) {
                    setError('Please fill required fields.'); return
                  }
                  setError(null); setStep(2)
                }}>
                  Continue to Policy Details &#8594;
                </button>
              </div>
              {error && <div className="alert-box error" style={{ marginTop: '12px' }}>{error}</div>}
            </div>
          )}

          {/* STEP 2 — Policy details */}
          {step === 2 && (
            <div className="card">
              <div className="card-title">Your Policy Details</div>

              <div className="alert-box info" style={{ marginBottom: '20px' }}>
                <svg className="alert-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <span>If you have already uploaded your policy, these details will be auto-read. You can also enter them manually.</span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Policy Number</label>
                    <input type="text" placeholder="e.g. POL-001234" value={form.policy_number} onChange={set('policy_number')} />
                  </div>
                  <div className="form-group">
                    <label>Sum Insured (₹)</label>
                    <div className="input-prefix-wrap">
                      <span className="input-prefix">₹</span>
                      <input type="number" placeholder="500000" value={form.sum_insured} onChange={set('sum_insured')} />
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Co-pay %</label>
                    <select value={form.co_pay_percent} onChange={set('co_pay_percent')}>
                      <option value="0">No co-pay (0%)</option>
                      <option value="5">5%</option>
                      <option value="10">10%</option>
                      <option value="15">15%</option>
                      <option value="20">20%</option>
                      <option value="25">25%</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Room Rent Limit</label>
                    <input type="text" placeholder="e.g. ₹3000/day or 1% of SI" value={form.room_rent_limit} onChange={set('room_rent_limit')} />
                  </div>
                </div>

                {error && <div className="alert-box error" style={{ marginBottom: '16px' }}>{error}</div>}

                <div className="form-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>&#8592; Back</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Calculating...' : 'Calculate Cost Breakdown'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3 — Results */}
          {step === 3 && result && cb && (
            <div className="result-panel">
              <div className="card">
                <div className="card-title">Cost Breakdown</div>
                <div className="summary-row"><span className="summary-label">Estimated Hospital Bill</span><span className="summary-val">{fmt(cb.hospital_bill)}</span></div>
                <div className="summary-row"><span className="summary-label">Room Category Deduction</span><span className="summary-val orange">{cb.room_deduction > 0 ? `-${fmt(cb.room_deduction)}` : '—'}</span></div>
                <div className="summary-row"><span className="summary-label">Co-pay Deduction</span><span className="summary-val orange">{cb.co_pay_amount > 0 ? `-${fmt(cb.co_pay_amount)}` : '—'}</span></div>
                <div className="divider" />
                <div className="summary-row"><span className="summary-label" style={{ fontWeight: 700 }}>Insurance Payout</span><span className="summary-val blue" style={{ fontSize: '18px' }}>{fmt(cb.insurance_payout)}</span></div>
                <div className="summary-row"><span className="summary-label" style={{ fontWeight: 700 }}>Your Out-of-Pocket</span><span className="summary-val orange" style={{ fontSize: '18px' }}>{fmt(cb.out_of_pocket)}</span></div>
                <div className="summary-row"><span className="summary-label">Cashless Eligible</span><span className={`badge ${cb.cashless_eligible ? 'badge-green' : 'badge-orange'}`}>{cb.cashless_eligible ? 'Yes' : 'No'}</span></div>

                {cb.notes?.length > 0 && (
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {cb.notes.map((n, i) => (
                      <div key={i} className="alert-box warning">
                        <svg className="alert-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        {n}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {result.nearby_hospitals?.length > 0 && (
                <div className="card">
                  <div className="card-title">Nearby Network Hospitals</div>
                  <table className="data-table">
                    <thead><tr><th>Hospital</th><th>City</th><th>Type</th><th>Network</th></tr></thead>
                    <tbody>
                      {result.nearby_hospitals.map((h, i) => (
                        <tr key={i}>
                          <td>{h.name}</td>
                          <td>{h.city}</td>
                          <td>{h.type}</td>
                          <td><span className="badge badge-green">{h.network}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="card">
                <div className="card-title">Room Category Impact</div>
                <table className="data-table">
                  <thead><tr><th>Room Type</th><th>Est. Bill</th><th>Payout</th><th>Out-of-Pocket</th></tr></thead>
                  <tbody>
                    {Object.values(result.room_upgrade_impact || {}).map((r, i) => (
                      <tr key={i}>
                        <td>{r.label}</td>
                        <td>{fmt(r.hospital_bill)}</td>
                        <td style={{ color: 'var(--blue-mid)' }}>{fmt(r.insurance_payout)}</td>
                        <td style={{ color: 'var(--orange)' }}>{fmt(r.out_of_pocket)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {result.advice && (
                <div className="alert-box info">
                  <svg className="alert-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  {result.advice}
                </div>
              )}

              <div className="form-actions">
                <button className="btn btn-ghost" onClick={() => { setStep(1); setResult(null) }}>New Prediction</button>
                <div className="form-actions-right">
                  <button className="btn btn-outline" onClick={() => navigate('/claim')}>Prepare Claim &#8594;</button>
                  {cb.out_of_pocket > 50000 && (
                    <button className="btn btn-primary" onClick={() => navigate('/bridge')}>Bridge the Gap &#8594;</button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
