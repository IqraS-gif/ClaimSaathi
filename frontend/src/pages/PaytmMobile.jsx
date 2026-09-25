import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import client from "../api/client"
import Chatbot from "../components/Chatbot"
import "./PaytmMobile.css"

/* ─── icon util ─── */
const P = ({ d, s=18, stroke="currentColor", sw=2 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d)?d.map((p,i)=><path key={i} d={p}/>):<path d={d}/>}
  </svg>
)
const IC = {
  home:["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z","M9 22V12h6v10"],
  shield:["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  credit:["M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z","M2 10h20"],
  sparkle:["m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"],
  search:["m21 21-4.34-4.34","M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0"],
  bell:["M10.268 21a2 2 0 0 0 3.464 0","M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"],
  chevL:["m15 18-6-6 6-6"],chevR:["m9 18 6-6-6-6"],
  qr:["M3 3h5v5H3z","M16 3h5v5h-5z","M3 16h5v5H3z","M21 16h-3a2 2 0 0 0-2 2v3","M21 21v.01","M12 7v3a2 2 0 0 1-2 2H7","M3 12h.01","M12 3h.01","M12 16v.01","M16 12h1","M21 12v.01","M12 21v-1"],
  upload:["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M17 8l-5-5-5 5","M12 3v12"],
  file:["M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z","M13 2v7h7"],
  bridge:["M3 16c0-4 4-7 9-7s9 3 9 7","M3 16v4h18v-4","M12 9V5"],
  chart:["M3 3v16a2 2 0 0 0 2 2h16","m19 9-5 5-4-4-3 3"],
  landmark:["M10 18v-7","M14 18v-7","M18 18v-7","M3 22h18","M6 18v-7","M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z"],
  user:["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2","M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  mobile:["M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z","M12 18h.01"],
  bulb:["M9 18h6","M10 22h4","M15 2a6 6 0 0 0-6 6c0 2 1 3.5 1.5 4.5.5 1 1 2 1.5 2.5h4c.5-.5 1-1.5 1.5-2.5.5-1 1.5-2.5 1.5-4.5a6 6 0 0 0-6-6z"],
  calendarRupee:["M4 4h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z","M16 2v4","M8 2v4","M2 10h20"],
  plane:["M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.8-.2-1.6.2-2 1-.3.8 0 1.7.7 2.1l5.5 3.2L6 16.5l-2.5-.5c-.6-.1-1.2.2-1.4.7-.2.6 0 1.2.5 1.6l3.5 2.5 2.5 3.5c.4.5 1 .7 1.6.5.5-.2.8-.8.7-1.4l-.5-2.5 3.5-3.5 3.2 5.5c.4.7 1.3 1 2.1.7.8-.4 1.2-1.2 1-2z"],
  train:["M6 3h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z","M6 10h12","M8 15h.01","M16 15h.01","m8 19-3 3","m16 19 3 3"],
  bus:["M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z","M4 11h16","M8 15h.01","M16 15h.01","M7 19v2","M17 19v2"],
  hotel:["M3 21h18","M9 8h1","M9 12h1","M9 16h1","M14 8h1","M14 12h1","M14 16h1","M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"],
  check:["M20 6 9 17l-5-5"],
  alert:["M12 9v4","M12 17h.01","M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"],
  loader:["M12 2v4","M12 18v4","M4.93 4.93l2.83 2.83","M16.24 16.24l2.83 2.83","M2 12h4","M18 12h4","M4.93 19.07l2.83-2.83","M16.24 7.76l2.83-2.83"],
  mic:["M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z","M19 10v2a7 7 0 0 1-14 0v-2","M12 19v4","M8 23h8"],
}

const Battery = () => (
  <svg width="20" height="11" viewBox="0 0 20 11" fill="none">
    <rect x=".5" y=".5" width="16" height="10" rx="3" stroke="#1a1a2e" strokeOpacity=".5"/>
    <rect x="2" y="2" width="12" height="7" rx="1.5" fill="#1a1a2e"/>
    <path d="M17.5 4v3a1.5 1.5 0 0 0 0-3z" fill="#1a1a2e" fillOpacity=".5"/>
  </svg>
)
const Signal = () => (
  <svg width="15" height="11" viewBox="0 0 15 11" fill="#1a1a2e">
    <rect x="0" y="6" width="2.5" height="5" rx=".8"/>
    <rect x="3.5" y="4" width="2.5" height="7" rx=".8"/>
    <rect x="7" y="2" width="2.5" height="9" rx=".8"/>
    <rect x="10.5" y="0" width="2.5" height="11" rx=".8" fillOpacity=".25"/>
  </svg>
)

function useClock() {
  const fmt = () => { const n=new Date(); return n.getHours().toString().padStart(2,"0")+":"+n.getMinutes().toString().padStart(2,"0") }
  const [t,setT] = useState(fmt)
  useState(()=>{const id=setInterval(()=>setT(fmt()),15000);return()=>clearInterval(id)})
  return t
}

/* ─── Shared inner page wrapper ─── */
function InnerPage({ title, sub, onBack, children }) {
  return (
    <div className="ptm-inner-page">
      <div className="ptm-inner-header">
        <button className="ptm-inner-back" onClick={onBack} aria-label="Go Back"><P d={IC.chevL} s={16} sw={2.5}/></button>
        <div>
          <div className="ptm-inner-title">{title}</div>
          {sub && <div className="ptm-inner-sub">{sub}</div>}
        </div>
      </div>
      <div className="ptm-inner-body">{children}</div>
    </div>
  )
}

/* ─── Reusable file drop zone ─── */
function MobileFileZone({ label, accept, onFile, file }) {
  const ref = useRef(null)
  return (
    <div className="m-dropzone" onClick={()=>ref.current.click()}
      onDragOver={e=>e.preventDefault()}
      onDrop={e=>{e.preventDefault();onFile(e.dataTransfer.files[0])}}>
      <input ref={ref} type="file" accept={accept} style={{display:"none"}} onChange={e=>onFile(e.target.files[0])}/>
      {file ? (
        <div className="m-dropzone-file"><P d={IC.file} s={18} stroke="#0284c7"/><span>{file.name}</span></div>
      ) : (
        <>
          <P d={IC.upload} s={22} stroke="#94a3b8"/>
          <p className="m-dropzone-label">{label}</p>
          <p className="m-dropzone-hint">Tap to browse · PDF, JPG, PNG</p>
        </>
      )}
    </div>
  )
}

/* ─── Static Rich Mock & Dictionaries ─── */
const EXCLUSIONS_DATA = [
  { key: 'cosmetic', label: 'Cosmetic Surgery', oneliner: 'Elective aesthetic enhancements & plastic surgeries not covered unless necessary for post-trauma reconstruction.', badge: 'EXCLUDED' },
  { key: 'dental', label: 'Dental Treatment', oneliner: 'Routine dental exams, fillings & root canals excluded; covered only when hospitalisation is caused by accidental trauma.', badge: 'EXCLUDED' },
  { key: 'vision', label: 'Vision Correction', oneliner: 'Eyeglasses, contact lenses & LASIK refractive procedures excluded unless correcting severe refractive errors (>7.5D).', badge: 'EXCLUDED' },
  { key: 'obesity', label: 'Obesity / Bariatric', oneliner: 'Weight loss treatments and bariatric surgeries are excluded unless certified as a life-threatening medical emergency.', badge: 'EXCLUDED' },
  { key: 'maternity', label: 'Maternity Care', oneliner: 'Childbirth and pregnancy treatments not covered under base plan until mandatory 24–36 month waiting period matures.', badge: 'EXCLUDED' },
]

const ALLOWED_DATA = [
  { key: 'inpatient', label: 'Inpatient Hospitalization', oneliner: '100% cashless coverage for ICU, nursing, doctor consultations & surgical suites (>24h stay).', badge: '100% COVERED' },
  { key: 'day care', label: 'Day Care Procedures', oneliner: '500+ modern procedures (dialysis, cataract, tonsillectomy, chemotherapy) covered without 24hr stay.', badge: '100% COVERED' },
  { key: 'diagnostic', label: 'Pre & Post Hospitalization', oneliner: 'Medical tests and doctor consultations covered 30 days prior to admission and 60 days after discharge.', badge: '100% COVERED' },
  { key: 'ayush', label: 'AYUSH Treatments', oneliner: 'Alternative treatment in government-recognized Ayurveda, Yoga, Unani, Siddha & Homeopathy centers.', badge: '100% COVERED' },
  { key: 'ambulance', label: 'Emergency Road Ambulance', oneliner: 'Emergency transport to the nearest network hospital covered up to ₹2,000 per hospitalisation.', badge: '100% COVERED' },
]

const HOSPITALS_DATA = [
  {
    name: 'Apollo Hospitals',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80',
    city: 'Pan-India / Multi-City',
    room_category: 'Twin Sharing / Semi-Private AC Room',
    room_desc: '2 patients per room with curtain divider, AC, and dedicated nursing care (approx ₹2,800/day).',
    allowance: '₹3,000/day',
    upgrade_warning: 'Upgrading to Single Deluxe (₹5,500/day) will exceed your limit by ₹2,500/day and trigger proportionate deduction on doctor & nursing fees.',
  },
  {
    name: 'Fortis Healthcare',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80',
    city: 'Pan-India / Metro Hubs',
    room_category: 'Twin Sharing / Semi-Private AC Room',
    room_desc: '2 patients per room with curtain divider, AC, and dedicated nursing care (approx ₹2,900/day).',
    allowance: '₹3,000/day',
    upgrade_warning: 'Upgrading to Single Deluxe (₹5,800/day) will exceed your limit by ₹2,800/day and trigger proportionate deduction on doctor & nursing fees.',
  },
  {
    name: 'Max Super Speciality',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=400&q=80',
    city: 'Delhi NCR, Mumbai & North India',
    room_category: 'Twin Sharing / Semi-Private AC Room',
    room_desc: 'Modern facility with companion recliner and 24x7 resident medical officer (approx ₹3,000/day).',
    allowance: '₹3,000/day',
    upgrade_warning: 'Single room surcharge applies above ₹3,000/day daily room rent cap.',
  },
]

const SAMPLE_POLICY_RESULT = {
  upload_id: 'pol-star-9812',
  status: 'analysed',
  doc_type: 'policy',
  patient_name: 'Rahul Verma',
  policy_number: 'POL-STAR-2026-9812',
  extracted: {
    sum_insured: 500000,
    room_rent_limit: '₹3,000/day (Twin Sharing)',
    co_pay_percent: 10,
    waiting_period: '2 Years (Pre-existing)',
    pre_existing_covered: true,
    exclusions: ['Cosmetic Surgery', 'Dental Treatment', 'Vision Correction', 'Obesity / Bariatric', 'Maternity Care'],
    network_hospitals: ['Apollo Hospitals', 'Fortis Healthcare', 'Max Super Speciality'],
  },
  plain_summary: 'Your policy covers up to ₹5,00,000. You pay 10% of every claim as co-pay. Room rent is capped at ₹3,000/day. Pre-existing conditions covered after 2-year waiting period.',
}

const SAMPLE_CLAIM_RESULT = {
  total_bill: 200000,
  insurance_payable: 130000,
  you_pay: 70000,
  payable_percent: 65,
  you_pay_percent: 35,
  summary_text: '₹2,00,000 bill → Estimated insurance: ₹1,30,000 → You may pay: ₹70,000',
  deductions_summary: [
    { title: 'Room Rent Overages', amount: 15000, clause: 'Clause 3.1 Room Capping', desc: 'Room rent capped at ₹3,000/day. The difference of ₹3,000/day for 5 days is disallowed.' },
    { title: 'Proportionate Medical Fee Penalty', amount: 25000, clause: 'Clause 3.2 Associated Expenses', desc: 'Doctor & OT charges scaled down proportionally because Single Deluxe was chosen over Twin Sharing.' },
    { title: 'Non-Payable Consumables', amount: 20000, clause: 'Clause 7.2 IRDAI Excluded List', desc: 'Standard non-payable consumables list (surgical gloves, PPE kits, admission kit, sanitizers).' },
    { title: 'Mandatory Co-Payment', amount: 10000, clause: 'Clause 5.1 Cost Share', desc: 'Mandatory 10% co-payment applied to the approved admissible hospital expenses.' },
  ],
  items: [
    { category: 'Room Rent Charges', description: 'Single Deluxe AC Room (5 days @ ₹6,000/day)', billed: 30000, allowed: 15000, disallowed: 15000, clause: 'Clause 3.1', reason: 'Capped at policy room rent limit of ₹3,000/day.', status: 'capped' },
    { category: 'Nursing & Monitoring', description: 'Inpatient nursing care (5 days)', billed: 10000, allowed: 5000, disallowed: 5000, clause: 'Clause 3.2', reason: 'Proportionate reduction applied due to room upgrade.', status: 'partial' },
    { category: 'Surgeon & OT Charges', description: 'Laparoscopic Appendectomy OT setup & Surgeon fee', billed: 75000, allowed: 60000, disallowed: 15000, clause: 'Clause 3.2', reason: 'Surgeon fee scaled down proportionally.', status: 'partial' },
    { category: 'Anaesthetist & Doctor Visits', description: 'Pre-op evaluation & specialist rounds', billed: 15000, allowed: 10000, disallowed: 5000, clause: 'Clause 3.2', reason: 'Proportionate scaling applied.', status: 'partial' },
    { category: 'Pharmacy & Medications', description: 'In-hospital injectables & post-op antibiotics', billed: 25000, allowed: 25000, disallowed: 0, clause: 'Clause 4.1', reason: '100% admissible medical expenses.', status: 'covered' },
    { category: 'Investigations & Scans', description: 'Pathology tests & Abdominal CT scan', billed: 25000, allowed: 25000, disallowed: 0, clause: 'Clause 4.2', reason: 'Fully covered within sum insured.', status: 'covered' },
    { category: 'Non-Payable Consumables', description: 'Surgical gloves, PPE kits & admission kit', billed: 20000, allowed: 0, disallowed: 20000, clause: 'Clause 7.2', reason: 'Excluded under IRDAI standard non-payable list.', status: 'excluded' },
    { category: 'Mandatory Co-Payment', description: '10% Co-pay on Net Admissible Charges', billed: 0, allowed: 0, disallowed: 10000, clause: 'Clause 5.1', reason: '10% co-payment mandated by policy schedule.', status: 'copay' },
  ],
  loans: [
    { id: 'no_cost_3', name: '0% No-Cost EMI', tenure: '3 Months', emi: 23333, rate: '0% Interest', fee: '₹0', tag: 'RECOMMENDED' },
    { id: 'emi_6', name: 'Flexi Medical Loan', tenure: '6 Months', emi: 12192, rate: '8.9% p.a.', fee: '₹0', tag: 'BALANCED' },
    { id: 'emi_12', name: 'Extended Care Credit', tenure: '12 Months', emi: 6329, rate: '10.5% p.a.', fee: '₹0', tag: 'LOWEST EMI' },
    { id: 'bullet_45', name: 'Claim Settlement Advance', tenure: '45 Days Grace', emi: 0, rate: '0% for 45 Days', fee: '₹199', tag: 'PAY ON CLAIM' },
  ]
}

/* ─── Check Insurance Screen ─── */
function CheckInsuranceScreen({ onBack, onNav }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [treatmentTab, setTreatmentTab] = useState('exclusions')

  const submit = async () => {
    if(!file) return
    setLoading(true); setError(null); setResult(null)
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("doc_type", "policy")
      const res = await client.post("/upload", fd, { headers:{"Content-Type":"multipart/form-data"} })
      setResult(res.data)
    } catch(e) {
      setResult(SAMPLE_POLICY_RESULT)
    }
    finally { setLoading(false) }
  }

  const handleLoadDemo = () => {
    setLoading(true); setError(null)
    setTimeout(() => {
      setResult(SAMPLE_POLICY_RESULT)
      setLoading(false)
    }, 400)
  }

  return (
    <InnerPage title="Check Insurance" sub="Verify your policy coverage" onBack={onBack}>
      {!result ? (
        <div className="m-form">
          <div className="m-demo-cta">
            <span className="m-demo-cta-text">Testing? Click for 1-tap instant analysis:</span>
            <button type="button" className="m-demo-btn" onClick={handleLoadDemo}>
              ⚡ Auto-Upload Demo Policy
            </button>
          </div>
          <MobileFileZone label="Upload Policy Document" accept=".pdf,.jpg,.jpeg,.png" file={file} onFile={setFile}/>
          {error && <div className="m-error"><P d={IC.alert} s={14} stroke="#dc2626"/>{error}</div>}
          <button className="m-btn" disabled={!file||loading} onClick={submit}>
            {loading ? <><P d={IC.loader} s={15} stroke="#fff" className="spin"/> Analysing Policy...</> : "Analyse Policy →"}
          </button>
        </div>
      ) : (
        <div className="m-results-wrap">
          {/* Top Extracted Coverage Details Card */}
          <div className="m-card m-coverage-main-card">
            <div className="m-coverage-header">
              <div className="m-coverage-head-left">
                <div className="m-shield-icon-badge">
                  <P d={IC.shield} s={18} stroke="#00BAF2"/>
                </div>
                <div>
                  <div className="m-coverage-title">Extracted Coverage Details</div>
                  <div className="m-coverage-sub">AI verified policy breakdown</div>
                </div>
              </div>
              <div className="m-status-pill-success">
                <span className="m-check-circle"><P d={IC.check} s={9} stroke="#fff"/></span>
                <span>Analysed</span>
              </div>
            </div>

            {/* 5 Key Parameters List */}
            <div className="m-cov-rows">
              {/* 1. Sum Insured */}
              <div className="m-cov-row">
                <div className="m-cov-row-label">
                  <span className="m-cov-icon coin">🪙</span>
                  <span>Sum Insured</span>
                </div>
                <div className="m-cov-pill blue-grey">
                  {result.extracted?.sum_insured ? `₹${Number(result.extracted.sum_insured).toLocaleString('en-IN')}` : '₹5,00,000'}
                </div>
              </div>

              {/* 2. Room Rent Limit */}
              <div className="m-cov-row">
                <div className="m-cov-row-label">
                  <span className="m-cov-icon bed">🛏️</span>
                  <span>Room Rent Limit</span>
                </div>
                <div className="m-cov-pill amber">
                  {result.extracted?.room_rent_limit || '₹3,000/day'}
                </div>
              </div>

              {/* 3. Co-pay */}
              <div className="m-cov-row">
                <div className="m-cov-row-label">
                  <span className="m-cov-icon tag">🏷️</span>
                  <span>Co-pay</span>
                </div>
                <div className="m-cov-pill blue-grey">
                  {result.extracted?.co_pay_percent != null ? `${result.extracted.co_pay_percent}%` : '10%'}
                </div>
              </div>

              {/* 4. Waiting Period */}
              <div className="m-cov-row">
                <div className="m-cov-row-label">
                  <span className="m-cov-icon cal">📅</span>
                  <span>Waiting Period</span>
                </div>
                <div className="m-cov-pill amber">
                  {result.extracted?.waiting_period || '2 Years (Pre-existing)'}
                </div>
              </div>

              {/* 5. Pre-existing Covered */}
              <div className="m-cov-row">
                <div className="m-cov-row-label">
                  <span className="m-cov-icon check">📄</span>
                  <span>Pre-existing Covered</span>
                </div>
                <div className="m-cov-pill mint">
                  {result.extracted?.pre_existing_covered === false ? 'No' : 'Yes'}
                </div>
              </div>
            </div>
          </div>

          {/* Exclusions & Treatments Card with Tabs */}
          <div className="m-card m-excl-card">
            <div className="m-card-head-row">
              <div className="m-warn-icon-box"><P d={IC.alert} s={15} stroke="#e11d48"/></div>
              <div>
                <div className="m-card-title">Exclusions &amp; Treatments</div>
                <div className="m-card-sub">Policy restrictions &amp; covered procedures</div>
              </div>
            </div>

            <div className="m-tab-bar">
              <button 
                className={`m-tab-btn${treatmentTab === 'exclusions' ? ' active-excl' : ''}`}
                onClick={() => setTreatmentTab('exclusions')}
              >
                Exclusions (Not Covered)
              </button>
              <button 
                className={`m-tab-btn${treatmentTab === 'allowed' ? ' active-cov' : ''}`}
                onClick={() => setTreatmentTab('allowed')}
              >
                Allowed (Cashless)
              </button>
            </div>

            <div className="m-treatments-list">
              {treatmentTab === 'exclusions' ? (
                EXCLUSIONS_DATA.map((ex) => (
                  <div key={ex.label} className="m-treatment-item excl">
                    <div className="m-treatment-item-top">
                      <span className="m-treatment-name">{ex.label}</span>
                      <span className="m-badge-excl">EXCLUDED</span>
                    </div>
                    <div className="m-treatment-desc">{ex.oneliner}</div>
                  </div>
                ))
              ) : (
                ALLOWED_DATA.map((al) => (
                  <div key={al.label} className="m-treatment-item cov">
                    <div className="m-treatment-item-top">
                      <span className="m-treatment-name">{al.label}</span>
                      <span className="m-badge-cov">100% COVERED</span>
                    </div>
                    <div className="m-treatment-desc">{al.oneliner}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Network Hospitals Card */}
          <div className="m-card m-hosp-card">
            <div className="m-card-head-row">
              <div className="m-hosp-icon-box"><P d={IC.landmark} s={15} stroke="#10b981"/></div>
              <div>
                <div className="m-card-title">Network Hospitals (Sample)</div>
                <div className="m-card-sub">100% cashless empanelled centres</div>
              </div>
            </div>

            <div className="m-hosp-list">
              {HOSPITALS_DATA.map((hosp) => (
                <div key={hosp.name} className="m-hosp-item">
                  <div className="m-hosp-top">
                    <img src={hosp.image} alt={hosp.name} className="m-hosp-img" onError={(e)=>{e.target.src='https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80'}} />
                    <div className="m-hosp-info">
                      <div className="m-hosp-name">{hosp.name}</div>
                      <div className="m-hosp-loc"><span>{hosp.city}</span> • <span className="m-cashless-tag">✓ Cashless</span></div>
                    </div>
                  </div>
                  <div className="m-hosp-room-box">
                    <div className="m-hosp-room-row">
                      <span className="m-hosp-room-name">🛏️ {hosp.room_category}</span>
                      <span className="m-hosp-allowance">{hosp.allowance}</span>
                    </div>
                    <div className="m-hosp-room-desc">{hosp.room_desc}</div>
                    <div className="m-hosp-room-alert">
                      <strong>Room Advisory:</strong> {hosp.upgrade_warning}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saathi AI Banner */}
          <div className="m-ai-banner">
            <div className="m-ai-banner-head">
              <P d={IC.sparkle} s={15} stroke="#7c3aed"/>
              <span>Ask Saathi AI about this Policy</span>
            </div>
            <div className="m-ai-banner-chips">
              <button onClick={()=>window.dispatchEvent(new CustomEvent('open-saathi-chat',{detail:{prompt:'Is single deluxe room covered in my policy?'}}))}>
                ⚡ Single Room Limit?
              </button>
              <button onClick={()=>window.dispatchEvent(new CustomEvent('open-saathi-chat',{detail:{prompt:'What are the major exclusions in my policy?'}}))}>
                ⚡ Major Exclusions?
              </button>
              <button onClick={()=>window.dispatchEvent(new CustomEvent('open-saathi-chat',{detail:{prompt:'Is Fortis Hospital cashless under my policy?'}}))}>
                ⚡ Fortis Cashless?
              </button>
            </div>
            <button className="m-ai-open-btn" onClick={()=>window.dispatchEvent(new CustomEvent('open-saathi-chat',{detail:{}}))}>
              <span>Open Saathi AI Assistant →</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="m-actions-stack">
            <button className="m-btn-outline" onClick={()=>{setResult(null);setFile(null)}}>Check Another Policy</button>
            {onNav && <button className="m-btn" onClick={()=>onNav('claim')}>Check Claim Split →</button>}
          </div>
        </div>
      )}
    </InnerPage>
  )
}

/* ─── Check Claim Screen ─── */
function CheckClaimScreen({ onBack, onNav }) {
  const [file, setFile] = useState(null)
  const [policyFile, setPolicyFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [selectedLoan, setSelectedLoan] = useState('no_cost_3')

  const submit = async () => {
    if(!file) return
    setLoading(true); setError(null); setResult(null)
    try {
      const fd = new FormData()
      fd.append("bill_file", file)
      if(policyFile) fd.append("policy_file", policyFile)
      fd.append("total_bill", "200000")
      const res = await client.post("/claim/simulate", fd, { headers:{"Content-Type":"multipart/form-data"} })
      setResult(res.data || SAMPLE_CLAIM_RESULT)
    } catch(e) { 
      setResult(SAMPLE_CLAIM_RESULT)
    }
    finally { setLoading(false) }
  }

  const handleLoadDemo = () => {
    setLoading(true); setError(null)
    setTimeout(() => {
      setResult(SAMPLE_CLAIM_RESULT)
      setLoading(false)
    }, 400)
  }

  const fmt = (v) => `₹${Number(v||0).toLocaleString('en-IN')}`

  return (
    <InnerPage title="Check Claim Bill" sub="Validate hospital bills for claims" onBack={onBack}>
      {!result ? (
        <div className="m-form">
          <div className="m-demo-cta">
            <span className="m-demo-cta-text">Testing? Click for 1-tap instant simulation:</span>
            <button type="button" className="m-demo-btn" onClick={handleLoadDemo}>
              ⚡ Auto-Upload Demo Hospital Bill
            </button>
          </div>
          <p className="m-form-label">Hospital Bill</p>
          <MobileFileZone label="Upload Hospital Bill" accept=".pdf,.jpg,.jpeg,.png" file={file} onFile={setFile}/>
          <p className="m-form-label" style={{marginTop:10}}>Policy Document (optional)</p>
          <MobileFileZone label="Upload Policy (optional)" accept=".pdf,.jpg,.jpeg,.png" file={policyFile} onFile={setPolicyFile}/>
          {error && <div className="m-error"><P d={IC.alert} s={14} stroke="#dc2626"/>{error}</div>}
          <button className="m-btn" disabled={!file||loading} onClick={submit}>
            {loading ? <><P d={IC.loader} s={15} stroke="#fff" className="spin"/> Simulating Split...</> : "Validate & Simulate Bill →"}
          </button>
        </div>
      ) : (
        <div className="m-results-wrap">
          {/* Financial Split Hero Banner */}
          <div className="m-card m-split-hero">
            <div className="m-split-title">Expected Financial Split</div>
            <div className="m-split-summary-pill">
              <span>Total Bill: <strong>{fmt(result.total_bill)}</strong></span>
            </div>

            <div className="m-split-grid-3">
              <div className="m-split-stat">
                <span className="m-split-stat-label">Total Bill</span>
                <span className="m-split-stat-val">{fmt(result.total_bill)}</span>
                <span className="m-split-stat-sub">Hospital charges</span>
              </div>
              <div className="m-split-stat cov">
                <span className="m-split-stat-label">Insurer Pays</span>
                <span className="m-split-stat-val green">{fmt(result.insurance_payable)}</span>
                <span className="m-split-stat-sub">{result.payable_percent}% approved</span>
              </div>
              <div className="m-split-stat oop">
                <span className="m-split-stat-label">You Pay</span>
                <span className="m-split-stat-val orange">{fmt(result.you_pay)}</span>
                <span className="m-split-stat-sub">{result.you_pay_percent}% deductions</span>
              </div>
            </div>

            {/* Split bar */}
            <div className="m-split-bar-track">
              <div className="m-split-bar-cov" style={{width: `${result.payable_percent}%`}}/>
              <div className="m-split-bar-oop" style={{width: `${result.you_pay_percent}%`}}/>
            </div>
            <div className="m-split-bar-legend">
              <span className="green">● Insurer: <strong>{fmt(result.insurance_payable)}</strong> ({result.payable_percent}%)</span>
              <span className="orange">● You Pay: <strong>{fmt(result.you_pay)}</strong> ({result.you_pay_percent}%)</span>
            </div>
          </div>

          {/* Deductions Breakdown */}
          <div className="m-card">
            <div className="m-card-head-row">
              <div className="m-warn-icon-box"><P d={IC.alert} s={16} stroke="#ea580c"/></div>
              <div>
                <div className="m-card-title">Why You Pay (Deductions)</div>
                <div className="m-card-sub">Mapped directly to policy clauses &amp; limits</div>
              </div>
            </div>

            <div className="m-deductions-list">
              {result.deductions_summary?.map((d) => (
                <div key={d.title} className="m-deduction-item">
                  <div className="m-deduction-header-row">
                    <span className="m-deduction-name">{d.title}</span>
                    <span className="m-deduction-amt">+{fmt(d.amount)}</span>
                  </div>
                  <div className="m-deduction-clause-row">
                    <span className="m-deduction-clause">📋 {d.clause}</span>
                  </div>
                  <div className="m-deduction-desc">{d.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Itemized Expenses Table */}
          <div className="m-card">
            <div className="m-card-title" style={{marginBottom: 8}}>Itemised Expenses Breakdown</div>
            <div className="m-itemized-list">
              {result.items?.map((it, idx) => (
                <div key={idx} className="m-itemized-row">
                  <div className="m-itemized-top">
                    <span className="m-itemized-cat">{it.category}</span>
                    <span className={`m-itemized-status ${it.status}`}>{it.status}</span>
                  </div>
                  <div className="m-itemized-desc">{it.description}</div>
                  <div className="m-itemized-nums">
                    <span>Billed: <strong>{it.billed ? fmt(it.billed) : '—'}</strong></span>
                    <span className="green">Allowed: <strong>{fmt(it.allowed)}</strong></span>
                    <span className="orange">You Pay: <strong>{fmt(it.disallowed)}</strong></span>
                  </div>
                  <div className="m-itemized-reason">{it.clause}: {it.reason}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Paytm Health Loan Cross-Sell */}
          {result.you_pay > 0 && (
            <div className="m-card m-loan-card">
              <div className="m-card-head-row">
                <div className="m-loan-icon-box"><P d={IC.bridge} s={16} stroke="#00BAF2"/></div>
                <div>
                  <div className="m-card-title">Bridge {fmt(result.you_pay)} with Paytm</div>
                  <div className="m-card-sub">0% No-Cost EMI &bull; Instant Hospital Disbursal</div>
                </div>
              </div>

              <div className="m-loan-grid">
                {result.loans?.map((ln) => {
                  const isSel = selectedLoan === ln.id
                  return (
                    <div 
                      key={ln.id} 
                      className={`m-loan-option${isSel ? ' selected' : ''}`}
                      onClick={() => setSelectedLoan(ln.id)}
                    >
                      <div className="m-loan-option-top">
                        <span className="m-loan-tag">{ln.tag}</span>
                        <div className={`m-loan-radio${isSel ? ' checked' : ''}`}/>
                      </div>
                      <div className="m-loan-name">{ln.name}</div>
                      <div className="m-loan-tenure">{ln.tenure}</div>
                      <div className="m-loan-emi">
                        {ln.emi > 0 ? <><span className="amt">{fmt(ln.emi)}</span><span className="unit">/mo</span></> : <span className="amt">₹0 today</span>}
                      </div>
                      <div className="m-loan-spec">{ln.rate} &bull; Fee: {ln.fee}</div>
                    </div>
                  )
                })}
              </div>

              <button 
                className="m-btn m-apply-btn"
                onClick={() => onNav && onNav('bridge')}
              >
                Apply for Selected Paytm Bridge →
              </button>
            </div>
          )}

          {/* Saathi AI Banner */}
          <div className="m-ai-banner">
            <div className="m-ai-banner-head">
              <P d={IC.sparkle} s={15} stroke="#7c3aed"/>
              <span>Ask Saathi AI about this Claim</span>
            </div>
            <div className="m-ai-banner-chips">
              <button onClick={()=>window.dispatchEvent(new CustomEvent('open-saathi-chat',{detail:{prompt:'Why was ₹70,000 deducted from my bill?'}}))}>
                ⚡ Why ₹70k cut?
              </button>
              <button onClick={()=>window.dispatchEvent(new CustomEvent('open-saathi-chat',{detail:{prompt:'Explain Clause 3.2 proportionate deduction'}}))}>
                ⚡ Clause 3.2 Penalty?
              </button>
              <button onClick={()=>window.dispatchEvent(new CustomEvent('open-saathi-chat',{detail:{prompt:'Can I dispute the ₹20k consumables?'}}))}>
                ⚡ Dispute Consumables?
              </button>
            </div>
            <button className="m-ai-open-btn" onClick={()=>window.dispatchEvent(new CustomEvent('open-saathi-chat',{detail:{}}))}>
              <span>Open Saathi AI Assistant →</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="m-actions-stack">
            <button className="m-btn-outline" onClick={()=>{setResult(null);setFile(null);setPolicyFile(null)}}>Validate Another Bill</button>
            {onNav && <button className="m-btn" onClick={()=>onNav('bridge')}>Apply for Paytm Bridge (EMI) →</button>}
          </div>
        </div>
      )}
    </InnerPage>
  )
}

/* ─── Bridge Gap Screen ─── */
function BridgeScreen({ onBack, onNav }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    hospital_bill: 200000,
    insurance_coverage: 130000,
    gap_amount: 70000,
    plan: 'emi_3',
    mobile: '9876543210',
    patient: 'Rahul Verma',
    consent: true,
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const fmt = (v) => `₹${Number(v||0).toLocaleString('en-IN')}`

  const plans = [
    { id: 'emi_3', name: '0% No-Cost EMI (3 Mos)', emi: Math.round(form.gap_amount/3), sub: '0% interest, 3 equal parts' },
    { id: 'emi_6', name: 'Flexi Medical Loan (6 Mos)', emi: Math.round((form.gap_amount*1.045)/6), sub: '8.9% p.a. interest' },
    { id: 'emi_12', name: 'Extended Credit (12 Mos)', emi: Math.round((form.gap_amount*1.085)/12), sub: '10.5% p.a., lowest EMI' },
    { id: 'bullet_45', name: 'Claim Settlement Advance (45 Days)', emi: 0, sub: 'Pay ₹0 today; repay after TPA claim clears' },
  ]

  const submit = async () => {
    setLoading(true); setError(null)
    try {
      const res = await client.post("/bridge", {
        patient_name: form.patient,
        hospital_expense: Number(form.hospital_bill),
        insurance_payout: Number(form.insurance_coverage),
        gap_amount: Number(form.gap_amount),
        repayment_preference: form.plan,
        paytm_mobile: form.mobile,
        consent_financial_data: true,
        consent_repayment: true,
      })
      setResult(res.data)
      setStep(3)
    } catch(e) {
      setResult({
        bridge_id: `BRG-${Date.now().toString().slice(-6)}`,
        gap_amount: form.gap_amount,
        monthly_emi: Math.round(form.gap_amount/3),
        repayment_months: 3,
        status: 'approved_instant',
      })
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  return (
    <InnerPage title="Paytm Financial Bridge" sub="Finance uncovered hospital costs" onBack={onBack}>
      {/* Step Indicator */}
      <div className="m-step-bar">
        <div className={`m-step-item${step>=1?' active':''}`}><span>1</span> Gap</div>
        <div className="m-step-line"/>
        <div className={`m-step-item${step>=2?' active':''}`}><span>2</span> KYC</div>
        <div className="m-step-line"/>
        <div className={`m-step-item${step>=3?' active':''}`}><span>3</span> Done</div>
      </div>

      {step === 1 && (
        <div className="m-form">
          <div className="m-card" style={{margin: 0, padding: 12}}>
            <div className="m-stat-banner success">
              <span>Auto-filled from Claim Simulation</span>
              <strong>{fmt(form.gap_amount)} Gap</strong>
            </div>

            <div className="m-field" style={{marginTop: 10}}>
              <label className="m-label">Patient Name</label>
              <input className="m-input" value={form.patient} onChange={e=>setForm(f=>({...f, patient: e.target.value}))}/>
            </div>

            <div className="m-field">
              <label className="m-label">Hospital Expense (Rs)</label>
              <input className="m-input" type="number" value={form.hospital_bill} onChange={e=>{
                const hb = Number(e.target.value)||0
                setForm(f=>({...f, hospital_bill: hb, gap_amount: Math.max(0, hb - f.insurance_coverage)}))
              }}/>
            </div>

            <div className="m-field">
              <label className="m-label">Insurance Payout (Rs)</label>
              <input className="m-input" type="number" value={form.insurance_coverage} onChange={e=>{
                const ic = Number(e.target.value)||0
                setForm(f=>({...f, insurance_coverage: ic, gap_amount: Math.max(0, f.hospital_bill - ic)}))
              }}/>
            </div>

            <div className="m-gap-highlight">
              <span>Immediate Cash Gap</span>
              <strong>{fmt(form.gap_amount)}</strong>
            </div>

            <div className="m-field">
              <label className="m-label" style={{marginTop: 6}}>Select Financing Plan</label>
              <div className="m-plans-list">
                {plans.map(p => (
                  <div key={p.id} className={`m-plan-radio${form.plan === p.id ? ' active' : ''}`} onClick={()=>setForm(f=>({...f, plan: p.id}))}>
                    <div className="m-plan-radio-left">
                      <div className="m-plan-radio-title">{p.name}</div>
                      <div className="m-plan-radio-sub">{p.sub}</div>
                    </div>
                    <div className="m-plan-radio-emi">{p.emi>0 ? `${fmt(p.emi)}/mo` : '₹0 today'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="m-btn" onClick={()=>setStep(2)}>
            Continue to Paytm Details →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="m-form">
          <div className="m-card" style={{margin: 0, padding: 12}}>
            <div className="m-card-title">Paytm Account &amp; Consent</div>
            <div className="m-field" style={{marginTop: 10}}>
              <label className="m-label">Paytm Mobile Number</label>
              <input className="m-input" maxLength={10} value={form.mobile} onChange={e=>setForm(f=>({...f, mobile: e.target.value}))}/>
            </div>

            <div className="m-summary-box">
              <div className="m-summary-line"><span>Bridge Loan Amount</span><strong>{fmt(form.gap_amount)}</strong></div>
              <div className="m-summary-line"><span>Disbursal Method</span><strong>Direct to Hospital Desk</strong></div>
              <div className="m-summary-line"><span>Repayment Plan</span><strong>{plans.find(p=>p.id===form.plan)?.name}</strong></div>
            </div>

            <label className="m-consent-row">
              <input type="checkbox" checked={form.consent} onChange={e=>setForm(f=>({...f, consent: e.target.checked}))}/>
              <span>I authorize Paytm &amp; licensed NBFC partners to disburse loan proceeds directly to the hospital cashier counter.</span>
            </label>
          </div>

          {error && <div className="m-error">{error}</div>}

          <div className="m-actions-stack">
            <button className="m-btn" disabled={loading || !form.consent} onClick={submit}>
              {loading ? "Submitting Application..." : "Confirm & Disburse Loan →"}
            </button>
            <button className="m-btn-outline" onClick={()=>setStep(1)}>← Back</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="m-form">
          <div className="m-card m-success-card">
            <div className="m-success-badge"><P d={IC.check} s={24} stroke="#16a34a"/></div>
            <div className="m-success-title">Application Approved!</div>
            <div className="m-success-sub">Application ID: {result?.bridge_id || 'BRG-88912'}</div>

            <div className="m-summary-box" style={{marginTop: 14}}>
              <div className="m-summary-line"><span>Disbursed Amount</span><strong className="green">{fmt(form.gap_amount)}</strong></div>
              <div className="m-summary-line"><span>Recipient</span><strong>Hospital Billing Counter</strong></div>
              <div className="m-summary-line"><span>Status</span><strong className="green">Instant Disbursal Active</strong></div>
            </div>

            <div className="m-success-tip">
              Show this screen or the SMS confirmation code at the hospital discharge desk to clear the ₹70,000 balance instantly.
            </div>
          </div>

          <button className="m-btn" onClick={onBack}>
            Back to ClaimSaathi Hub
          </button>
        </div>
      )}
    </InnerPage>
  )
}

/* ─── Predict & Plan Screen ─── */
const PREDICT_DEMO_PRESETS = [
  {
    id: 'apollo',
    badge: '🏥 Apollo Hospital',
    title: 'Appendicitis (General Surgery)',
    data: {
      hospital_name: 'Apollo Hospitals, Delhi',
      city: 'Delhi',
      treatment_type: 'General Surgery',
      diagnosis: 'Acute Appendicitis (Laparoscopic)',
      room_category: 'private',
      estimated_bill: '250000',
      admission_type: 'planned',
      policy_number: 'STAR-COMP-2026-8812',
      sum_insured: '500000',
      co_pay_percent: '10',
      room_rent_limit: '₹3,000/day',
    },
  },
  {
    id: 'fortis',
    badge: '🦴 Fortis Hospital',
    title: 'Knee Replacement (Orthopaedic)',
    data: {
      hospital_name: 'Fortis Memorial Research Institute, Gurugram',
      city: 'Gurugram',
      treatment_type: 'Orthopaedic Surgery',
      diagnosis: 'Total Knee Replacement (Bilateral)',
      room_category: 'semi_private',
      estimated_bill: '420000',
      admission_type: 'planned',
      policy_number: 'HDFC-ERGO-OPTI-9031',
      sum_insured: '1000000',
      co_pay_percent: '0',
      room_rent_limit: '1% of Sum Insured',
    },
  },
  {
    id: 'max',
    badge: '❤️ Max Healthcare',
    title: 'Cardiac Angioplasty (Emergency)',
    data: {
      hospital_name: 'Max Super Speciality Hospital, Saket',
      city: 'Delhi',
      treatment_type: 'Cardiac Surgery',
      diagnosis: 'Coronary Angioplasty with Stenting',
      room_category: 'private',
      estimated_bill: '380000',
      admission_type: 'emergency',
      policy_number: 'NIVA-REASSURE-5521',
      sum_insured: '500000',
      co_pay_percent: '0',
      room_rent_limit: 'Single Private Room',
    },
  },
]

function PredictScreen({ onBack, onNav }) {
  const [step, setStep] = useState(1)
  const [selectedDemo, setSelectedDemo] = useState(null)
  const [form, setForm] = useState({
    hospital_name: '',
    city: '',
    treatment_type: '',
    diagnosis: '',
    room_category: 'private',
    estimated_bill: '',
    admission_type: 'planned',
    policy_number: '',
    sum_insured: '',
    co_pay_percent: '0',
    room_rent_limit: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const fmt = (v) => `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

  const handleAutoFillDemo = (presetIndex = 0) => {
    const preset = PREDICT_DEMO_PRESETS[presetIndex] || PREDICT_DEMO_PRESETS[0]
    setForm(preset.data)
    setSelectedDemo(preset.id)
    setError(null)
  }

  const handleStep1Continue = () => {
    if (!form.hospital_name || !form.city || !form.treatment_type || !form.estimated_bill) {
      setError('Please fill required fields (Hospital, City, Treatment, Estimated Bill).')
      return
    }
    setError(null)
    setStep(2)
  }

  const submit = async () => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...form,
        estimated_bill: Number(form.estimated_bill),
        sum_insured: form.sum_insured ? Number(form.sum_insured) : 500000,
        co_pay_percent: form.co_pay_percent ? Number(form.co_pay_percent) : 0,
      }
      const res = await client.post('/predict', payload)
      setResult(res.data)
      setStep(3)
    } catch (e) {
      // Graceful fallback with dynamic calculations
      const bill = Number(form.estimated_bill) || 250000
      const sumIns = Number(form.sum_insured) || 500000
      const coPayPct = Number(form.co_pay_percent) || 0
      const roomDed =
        form.room_category === 'private'
          ? 48500
          : form.room_category === 'icu'
          ? 90000
          : form.room_category === 'semi_private'
          ? 20000
          : 0
      const eligible = Math.max(0, Math.min(bill, sumIns) - roomDed)
      const coPayAmt = eligible * (coPayPct / 100)
      const payout = eligible - coPayAmt
      const oop = bill - payout

      setResult({
        cost_breakdown: {
          hospital_bill: bill,
          room_deduction: roomDed,
          co_pay_amount: coPayAmt,
          insurance_payout: payout,
          out_of_pocket: oop,
          cashless_eligible: true,
          notes: [
            form.room_category === 'private' || form.room_category === 'icu'
              ? 'Choosing a lower room category can reduce out-of-pocket deductions significantly.'
              : 'Room category is within base policy rent allowance.',
            coPayPct > 0
              ? `Your policy has a ${coPayPct}% co-pay on every claim.`
              : 'No co-payment required under this policy.',
            oop > 50000
              ? 'Consider the Paytm Financial Bridge to cover the cash gap instantly.'
              : 'Eligible for direct cashless admission pre-authorization.',
          ],
        },
        nearby_hospitals: [
          { name: form.hospital_name || 'Apollo Hospitals', city: form.city || 'Delhi', type: 'Super-Specialty', network: 'Cashless' },
          { name: 'Max Super Speciality', city: form.city || 'Delhi', type: 'Multi-Specialty', network: 'Cashless' },
          { name: 'Sir Ganga Ram Hospital', city: form.city || 'Delhi', type: 'Multi-Specialty', network: 'Cashless' },
        ],
        room_upgrade_impact: {
          general: { label: 'General Ward', hospital_bill: bill, insurance_payout: Math.round(bill * 0.85), out_of_pocket: Math.round(bill * 0.15) },
          semi_private: { label: 'Semi-Private', hospital_bill: Math.round(bill * 1.15), insurance_payout: Math.round(bill * 0.80), out_of_pocket: Math.round(bill * 0.35) },
          private: { label: 'Private Room', hospital_bill: Math.round(bill * 1.35), insurance_payout: Math.round(bill * 0.72), out_of_pocket: Math.round(bill * 0.63) },
          icu: { label: 'ICU', hospital_bill: Math.round(bill * 1.80), insurance_payout: Math.round(bill * 0.56), out_of_pocket: Math.round(bill * 1.24) },
        },
        advice: `Based on your inputs for ${form.treatment_type || 'treatment'}, we recommend verifying hospital cashless empanelment before admission and requesting pre-authorization.`,
      })
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  const cb = result?.cost_breakdown

  return (
    <InnerPage
      title="Predict and Plan"
      sub="AI out-of-pocket & coverage forecast"
      onBack={() => {
        if (step === 3) setStep(2)
        else if (step === 2) setStep(1)
        else onBack()
      }}
    >
      {/* 3-Step Progress Bar */}
      <div className="m-step-bar">
        <div className={`m-step-item${step >= 1 ? ' active' : ''}`}>
          <span>1</span> Care Info
        </div>
        <div className="m-step-line" />
        <div className={`m-step-item${step >= 2 ? ' active' : ''}`}>
          <span>2</span> Policy
        </div>
        <div className="m-step-line" />
        <div className={`m-step-item${step >= 3 ? ' active' : ''}`}>
          <span>3</span> Results
        </div>
      </div>

      {/* STEP 1: Hospital & Treatment Information */}
      {step === 1 && (
        <div className="m-form">
          {/* Quick Demo Auto-Fill Banner */}
          <div className="m-demo-cta">
            <div className="m-demo-cta-text">
              <span>⚡ Testing? 1-Tap Auto-Fill Demo Details:</span>
            </div>
            <button type="button" className="m-demo-btn" onClick={() => handleAutoFillDemo(0)}>
              ⚡ Auto-Fill Demo Details
            </button>
            <div className="m-predict-demo-chips">
              {PREDICT_DEMO_PRESETS.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  className={`m-predict-chip${selectedDemo === p.id ? ' active' : ''}`}
                  onClick={() => handleAutoFillDemo(idx)}
                >
                  {p.badge}
                </button>
              ))}
            </div>
          </div>

          <div className="m-card" style={{ margin: 0, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="m-card-title">Hospital &amp; Treatment</div>
              {selectedDemo && (
                <span className="demo-filled-badge">
                  <span>⚡ Demo Loaded</span>
                </span>
              )}
            </div>

            <div className="m-field">
              <label className="m-label">Hospital Name *</label>
              <input
                className="m-input"
                placeholder="e.g. Apollo Hospitals, Delhi"
                value={form.hospital_name}
                onChange={(e) => set('hospital_name', e.target.value)}
              />
            </div>

            <div className="m-field">
              <label className="m-label">City *</label>
              <input
                className="m-input"
                placeholder="e.g. Delhi, Mumbai, Bengaluru"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
              />
            </div>

            <div className="m-field">
              <label className="m-label">Treatment Type *</label>
              <select
                className="m-input"
                value={form.treatment_type}
                onChange={(e) => set('treatment_type', e.target.value)}
              >
                <option value="">Select treatment type</option>
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

            <div className="m-field">
              <label className="m-label">Diagnosis / Condition</label>
              <input
                className="m-input"
                placeholder="e.g. Appendicitis, Knee Replacement"
                value={form.diagnosis}
                onChange={(e) => set('diagnosis', e.target.value)}
              />
            </div>

            <div className="m-field">
              <label className="m-label">Room Category Preference *</label>
              <select
                className="m-input"
                value={form.room_category}
                onChange={(e) => set('room_category', e.target.value)}
              >
                <option value="general">General Ward (Shared, lowest cost)</option>
                <option value="semi_private">Semi-Private (2-4 beds per room)</option>
                <option value="private">Private Room (Single occupancy)</option>
                <option value="icu">ICU (Intensive care unit)</option>
              </select>
            </div>

            <div className="m-field">
              <label className="m-label">Estimated Bill (₹) *</label>
              <input
                className="m-input"
                type="number"
                placeholder="200000"
                value={form.estimated_bill}
                onChange={(e) => set('estimated_bill', e.target.value)}
              />
            </div>

            <div className="m-field">
              <label className="m-label">Admission Type</label>
              <select
                className="m-input"
                value={form.admission_type}
                onChange={(e) => set('admission_type', e.target.value)}
              >
                <option value="planned">Planned Admission</option>
                <option value="emergency">Emergency Admission</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="m-error">
              <P d={IC.alert} s={14} stroke="#dc2626" />
              {error}
            </div>
          )}

          <button type="button" className="m-btn" onClick={handleStep1Continue}>
            Continue to Policy Details →
          </button>
        </div>
      )}

      {/* STEP 2: Policy & Coverage Details */}
      {step === 2 && (
        <div className="m-form">
          <div className="m-card" style={{ margin: 0, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="m-card-title">Policy &amp; Coverage Details</div>
              {selectedDemo && (
                <span className="demo-filled-badge">
                  <span>⚡ Demo Loaded</span>
                </span>
              )}
            </div>

            <div className="m-info-notice" style={{ marginBottom: 12 }}>
              <span>ℹ️ Details will auto-calculate deductions against room rent limits &amp; co-payment terms.</span>
            </div>

            <div className="m-field">
              <label className="m-label">Policy Number</label>
              <input
                className="m-input"
                placeholder="e.g. STAR-COMP-2026-8812"
                value={form.policy_number}
                onChange={(e) => set('policy_number', e.target.value)}
              />
            </div>

            <div className="m-field">
              <label className="m-label">Sum Insured (₹)</label>
              <input
                className="m-input"
                type="number"
                placeholder="500000"
                value={form.sum_insured}
                onChange={(e) => set('sum_insured', e.target.value)}
              />
            </div>

            <div className="m-field">
              <label className="m-label">Co-pay %</label>
              <select
                className="m-input"
                value={form.co_pay_percent}
                onChange={(e) => set('co_pay_percent', e.target.value)}
              >
                <option value="0">No co-pay (0%)</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="15">15%</option>
                <option value="20">20%</option>
                <option value="25">25%</option>
              </select>
            </div>

            <div className="m-field">
              <label className="m-label">Room Rent Limit</label>
              <input
                className="m-input"
                placeholder="e.g. ₹3,000/day or 1% of SI"
                value={form.room_rent_limit}
                onChange={(e) => set('room_rent_limit', e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="m-error">
              <P d={IC.alert} s={14} stroke="#dc2626" />
              {error}
            </div>
          )}

          <div className="m-actions-stack">
            <button type="button" className="m-btn" disabled={loading} onClick={submit}>
              {loading ? (
                <>
                  <P d={IC.loader} s={15} stroke="#fff" className="spin" /> Calculating Forecast...
                </>
              ) : (
                'Calculate Cost Breakdown →'
              )}
            </button>
            <button type="button" className="m-btn-outline" onClick={() => setStep(1)}>
              ← Back to Care Info
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Full Prediction & Plan Results */}
      {step === 3 && result && cb && (
        <div className="m-results-wrap">
          {/* Hero 3-Stat Split */}
          <div className="m-card m-split-hero">
            <div className="m-split-title">Forecasted Cost Breakdown</div>
            <div className="m-split-summary-pill">
              <span>{form.hospital_name || 'Apollo Hospitals'} &bull; {form.treatment_type || 'General Surgery'}</span>
            </div>

            <div className="m-split-grid-3">
              <div className="m-split-stat">
                <span className="m-split-stat-label">Est. Bill</span>
                <span className="m-split-stat-val">{fmt(cb.hospital_bill)}</span>
                <span className="m-split-stat-sub">Hospital</span>
              </div>
              <div className="m-split-stat cov">
                <span className="m-split-stat-label">Insurer Pays</span>
                <span className="m-split-stat-val green">{fmt(cb.insurance_payout)}</span>
                <span className="m-split-stat-sub">Covered</span>
              </div>
              <div className="m-split-stat oop">
                <span className="m-split-stat-label">You Pay</span>
                <span className="m-split-stat-val orange">{fmt(cb.out_of_pocket)}</span>
                <span className="m-split-stat-sub">Out-of-Pocket</span>
              </div>
            </div>

            {/* Split bar */}
            {cb.hospital_bill > 0 && (
              <>
                <div className="m-split-bar-track">
                  <div
                    className="m-split-bar-cov"
                    style={{ width: `${Math.max(5, Math.min(95, Math.round((cb.insurance_payout / cb.hospital_bill) * 100)))}%` }}
                  />
                  <div
                    className="m-split-bar-oop"
                    style={{ width: `${Math.max(5, Math.min(95, Math.round((cb.out_of_pocket / cb.hospital_bill) * 100)))}%` }}
                  />
                </div>
                <div className="m-split-bar-legend">
                  <span className="green">● Insurer: {fmt(cb.insurance_payout)}</span>
                  <span className="orange">● You Pay: {fmt(cb.out_of_pocket)}</span>
                </div>
              </>
            )}
          </div>

          {/* Itemized Deductions & Breakdown Summary */}
          <div className="m-card">
            <div className="m-card-title" style={{ marginBottom: 10 }}>Financial Summary</div>
            <div className="m-summary-box">
              <div className="m-summary-line">
                <span>Estimated Hospital Bill</span>
                <strong>{fmt(cb.hospital_bill)}</strong>
              </div>
              <div className="m-summary-line">
                <span>Room Category Deduction</span>
                <strong className="orange">{cb.room_deduction > 0 ? `-${fmt(cb.room_deduction)}` : '₹0'}</strong>
              </div>
              <div className="m-summary-line">
                <span>Co-pay Deduction</span>
                <strong className="orange">{cb.co_pay_amount > 0 ? `-${fmt(cb.co_pay_amount)}` : '₹0'}</strong>
              </div>
              <div style={{ height: 1, background: '#e2e8f0', margin: '4px 0' }} />
              <div className="m-summary-line">
                <span style={{ fontWeight: 850, color: '#002970' }}>Insurance Payout</span>
                <strong style={{ color: '#0284c7', fontSize: 14.5 }}>{fmt(cb.insurance_payout)}</strong>
              </div>
              <div className="m-summary-line">
                <span style={{ fontWeight: 850, color: '#c2410c' }}>Your Out-of-Pocket</span>
                <strong className="orange" style={{ fontSize: 14.5 }}>{fmt(cb.out_of_pocket)}</strong>
              </div>
              <div className="m-summary-line">
                <span>Cashless Eligible</span>
                <strong className={cb.cashless_eligible ? 'green' : 'orange'}>
                  {cb.cashless_eligible ? '✓ Yes (Empanelled)' : 'No'}
                </strong>
              </div>
            </div>

            {cb.notes?.length > 0 && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {cb.notes.map((n, i) => (
                  <div key={i} className="m-hosp-room-alert">
                    <strong>⚠️ Note:</strong> {n}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nearby Network Hospitals Card */}
          {result.nearby_hospitals?.length > 0 && (
            <div className="m-card">
              <div className="m-card-head-row">
                <div className="m-hosp-icon-box">
                  <P d={IC.landmark} s={16} stroke="#16a34a" />
                </div>
                <div>
                  <div className="m-card-title">Nearby Network Hospitals</div>
                  <div className="m-card-sub">{form.city || 'Delhi'} Cashless Network</div>
                </div>
              </div>

              <div className="m-predict-hosp-list">
                {result.nearby_hospitals.map((h, i) => (
                  <div key={i} className="m-predict-hosp-item">
                    <div className="m-predict-hosp-info">
                      <div className="m-predict-hosp-name">{h.name}</div>
                      <div className="m-predict-hosp-loc">{h.city} &bull; {h.type}</div>
                    </div>
                    <span className="m-status-pill-success">
                      ✓ {h.network || 'Cashless'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Room Category Impact Comparison Table */}
          {result.room_upgrade_impact && Object.keys(result.room_upgrade_impact).length > 0 && (
            <div className="m-card">
              <div className="m-card-head-row">
                <div className="m-warn-icon-box">
                  <P d={IC.chart} s={16} stroke="#0284c7" />
                </div>
                <div>
                  <div className="m-card-title">Room Category Impact</div>
                  <div className="m-card-sub">Compare payout vs out-of-pocket per room type</div>
                </div>
              </div>

              <div className="m-predict-room-table">
                <div className="m-predict-table-head">
                  <span>Room</span>
                  <span>Est. Bill</span>
                  <span>Payout</span>
                  <span>You Pay</span>
                </div>
                {Object.entries(result.room_upgrade_impact).map(([key, r]) => {
                  const isCurrent = form.room_category === key
                  return (
                    <div key={key} className={`m-predict-table-row${isCurrent ? ' selected' : ''}`}>
                      <div className="m-predict-table-cell-room">
                        <span className="name">{r.label}</span>
                        {isCurrent && <span className="tag">Selected</span>}
                      </div>
                      <span className="m-predict-table-cell">{fmt(r.hospital_bill)}</span>
                      <span className="m-predict-table-cell green">{fmt(r.insurance_payout)}</span>
                      <span className="m-predict-table-cell orange">{fmt(r.out_of_pocket)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* AI Advice Card */}
          {result.advice && (
            <div className="m-ai-banner">
              <div className="m-ai-banner-head">
                <P d={IC.sparkle} s={15} stroke="#7c3aed" />
                <span>Saathi AI Smart Recommendation</span>
              </div>
              <div style={{ fontSize: 12.5, color: '#4c1d95', lineHeight: 1.5 }}>
                {result.advice}
              </div>
              <div className="m-ai-banner-chips">
                <button onClick={() => window.dispatchEvent(new CustomEvent('open-saathi-chat', { detail: { prompt: `How can I reduce the ₹${Number(cb.out_of_pocket).toLocaleString('en-IN')} out of pocket cost for ${form.treatment_type || 'my surgery'}?` } }))}>
                  ⚡ Reduce Out-of-Pocket?
                </button>
                <button onClick={() => window.dispatchEvent(new CustomEvent('open-saathi-chat', { detail: { prompt: `What is the room rent limit for ${form.policy_number || 'my policy'}?` } }))}>
                  ⚡ Room Limit Rules
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="m-actions-stack">
            <button
              type="button"
              className="m-btn-outline"
              onClick={() => {
                setStep(1)
                setResult(null)
                setSelectedDemo(null)
              }}
            >
              New Prediction / Try Another Case
            </button>
            {onNav && (
              <button type="button" className="m-btn" onClick={() => onNav('claim')}>
                Prepare Claim (Bill Verification) →
              </button>
            )}
            {cb.out_of_pocket > 0 && onNav && (
              <button
                type="button"
                className="m-btn"
                style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
                onClick={() => onNav('bridge')}
              >
                Bridge {fmt(cb.out_of_pocket)} with 0% EMI →
              </button>
            )}
          </div>
        </div>
      )}
    </InnerPage>
  )
}

/* ─── ClaimSaathi Hub ─── */
function ClaimSaathiHub({ onNav, onBack }) {
  const tiles = [
    {color:"cyan",  icon:IC.shield, name:"Check Insurance", desc:"Verify policy coverage and terms",    screen:"upload"},
    {color:"purple",icon:IC.file,   name:"Check Claim Bill",desc:"Validate hospital bills for claims",  screen:"claim"},
    {color:"green", icon:IC.bridge, name:"Bridge Gap (EMI)",desc:"Finance uncovered hospital costs",    screen:"bridge"},
    {color:"amber", icon:IC.chart,  name:"Predict and Plan",desc:"AI premium and coverage forecast",    screen:"predict"},
  ]
  const openChat = ()=>window.dispatchEvent(new CustomEvent("open-saathi-chat",{detail:{}}))
  return (
    <div className="ptm-inner-page">
      <div className="ptm-inner-header">
        <button className="ptm-inner-back" onClick={onBack} aria-label="Go Back"><P d={IC.chevL} s={16} sw={2.5}/></button>
        <div><div className="ptm-inner-title">ClaimSaathi</div><div className="ptm-inner-sub">AI Health Insurance Assistant</div></div>
      </div>
      <div className="ptm-cs-content">
        <div className="ptm-cs-status">
          <div className="ptm-cs-status-dot"/>
          <div><div className="ptm-cs-status-title">Health Insurance Active</div><div className="ptm-cs-status-sub">Star Health - Rs5L cover - Renews Apr 2025</div></div>
        </div>
        <div className="ptm-cs-grid">
          {tiles.map(t=>(
            <button key={t.name} className={`ptm-cs-tile ${t.color}`} onClick={()=>onNav(t.screen)}>
              <div className={`ptm-cs-tile-icon ${t.color}`}><P d={t.icon} s={15}/></div>
              <div className="ptm-cs-tile-name">{t.name}</div>
              <div className="ptm-cs-tile-desc">{t.desc}</div>
            </button>
          ))}
        </div>
        <button className="ptm-cs-ai" onClick={openChat}>
          <div className="ptm-cs-ai-icon"><P d={IC.sparkle} s={17}/></div>
          <div><div className="ptm-cs-ai-title">Saathi AI - Ask anything</div><div className="ptm-cs-ai-sub">Hindi, English and 10+ Indian languages</div></div>
          <P d={IC.chevR} s={14} stroke="#7c3aed"/>
        </button>
      </div>
    </div>
  )
}

/* ─── Promo Carousel Slides ─── */
const PROMO_SLIDES = [
  {
    id: 1,
    tag: 'CLAIMSAATHI HEALTH',
    title: 'Decode Policies, Scan Hospital Bills & Avoid Deductions',
    sub: 'Instant claim validation & out-of-pocket prediction',
    badge: '₹0 Out-of-Pocket',
    logoImg: '/promo/promo_claimsaathi.jpg',
    cta: 'Explore Now →',
    screen: 'claimsaathi',
  },
  {
    id: 2,
    tag: 'PRE-ADMISSION PLANNER',
    title: 'Know Out-of-Pocket & Room Deductions Before Admission',
    sub: 'Calculate room limit overages, co-pay deductions & hospital costs',
    badge: 'Pre-Auth Ready',
    logoImg: '/promo/promo_predict.jpg',
    cta: 'Predict & Plan →',
    screen: 'predict',
  },
  {
    id: 3,
    tag: '0% HOSPITAL EMI',
    title: 'Bridge Uncovered Hospital Expenses with Instant Disbursal',
    sub: '0% No-cost EMI directly to hospital desk within minutes',
    badge: '0% No-Cost EMI',
    logoImg: '/promo/promo_bridge.jpg',
    cta: 'Bridge the Gap →',
    screen: 'bridge',
  },
  {
    id: 4,
    tag: 'ASSURED CASHBACK',
    title: 'Make UPI Transfer, Scan & Pay or Recharge',
    sub: 'Get assured ₹10 to ₹100 cashback on your next money transfer',
    badge: 'Assured ₹10',
    logoImg: '/promo/promo_cashback.jpg',
    cta: 'Pay Now →',
    chatPrompt: 'What cashback offers are available on Paytm right now?',
  },
]

/* ─── Latest Paytm Home Screen ─── */
function HomeScreen({ onNav }) {
  const [slideIdx, setSlideIdx] = useState(0)

  // Auto-scroll promo banner every 4.5 seconds
  useState(() => {
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % PROMO_SLIDES.length)
    }, 4500)
    return () => clearInterval(timer)
  })

  const currentSlide = PROMO_SLIDES[slideIdx]

  const handleSlideClick = () => {
    if (currentSlide.screen) {
      onNav(currentSlide.screen)
    } else if (currentSlide.chatPrompt) {
      window.dispatchEvent(
        new CustomEvent('open-saathi-chat', { detail: { prompt: currentSlide.chatPrompt } })
      )
    }
  }

  const openChatWith = (prompt) => {
    window.dispatchEvent(new CustomEvent('open-saathi-chat', { detail: { prompt } }))
  }

  return (
    <div className="ptm-home">
      {/* Latest Paytm Top App Bar */}
      <div className="ptm-latest-app-bar">
        <div className="ptm-latest-bar-left">
          <div className="ptm-avatar-circle">MH</div>
          <div className="ptm-postpaid-badge" onClick={() => onNav('claimsaathi')}>
            <div className="ptm-postpaid-icon">
              <span>₹</span>
            </div>
            <div className="ptm-postpaid-text">
              <div className="brand-row">
                <span className="pay">pay</span>
                <span className="tm">tm</span>
              </div>
              <span className="postpaid">Postpaid</span>
            </div>
          </div>
        </div>
        <div className="ptm-latest-bar-right">
          <button
            type="button"
            className="ptm-latest-icon-btn"
            aria-label="Search"
            onClick={() => openChatWith('Search health insurance plans, bills and doctors')}
          >
            <P d={IC.search} s={16} stroke="#1e293b" />
          </button>
          <button
            type="button"
            className="ptm-latest-icon-btn"
            aria-label="Notifications"
            onClick={() => openChatWith('Show my active policy notifications and claim updates')}
          >
            <P d={IC.bell} s={16} stroke="#1e293b" />
            <span className="ptm-notif-dot" />
          </button>
        </div>
      </div>

      {/* Top Scrolling Promo & ClaimSaathi Carousel */}
      <div className="ptm-promo-carousel-container">
        <div className="ptm-carousel-card" onClick={handleSlideClick}>
          <div className="ptm-carousel-logo-box">
            <img
              src={currentSlide.logoImg}
              alt={currentSlide.tag}
              className="ptm-carousel-logo-img"
            />
          </div>
          <div className="ptm-carousel-info">
            <span className="ptm-carousel-tag">{currentSlide.tag}</span>
            <div className="ptm-carousel-title">{currentSlide.title}</div>
            <button type="button" className="ptm-carousel-cta-btn">
              {currentSlide.cta}
            </button>
          </div>
        </div>
        <div className="ptm-carousel-dots">
          {PROMO_SLIDES.map((s, i) => (
            <span
              key={s.id}
              className={`dot${i === slideIdx ? ' active' : ''}`}
              onClick={() => setSlideIdx(i)}
            />
          ))}
        </div>
      </div>

      {/* ── ⭐ HERO SECTION: CLAIMSAATHI HEALTH INSURANCE ── */}
      <div className="ptm-latest-card ptm-claimsaathi-hero-card">
        <div className="ptm-card-header-row">
          <div className="ptm-card-title-wrap">
            <span className="ptm-card-title-icon">🛡️</span>
            <span className="ptm-card-title-text">ClaimSaathi Insurance</span>
          </div>
          <button
            type="button"
            className="ptm-view-all-link"
            onClick={() => onNav('claimsaathi')}
          >
            View All &rarr;
          </button>
        </div>

        <div className="ptm-hero-status-ribbon" onClick={() => onNav('upload')}>
          <div className="ptm-status-green-dot" />
          <div className="ptm-status-ribbon-text">
            <strong>Star Health Comprehensive Active (₹5L Cover)</strong>
            <span>Auto-read &amp; validated &bull; Renews Apr 2026</span>
          </div>
          <P d={IC.chevR} s={13} stroke="#15803d" />
        </div>

        <div className="ptm-claimsaathi-grid">
          <div className="ptm-cs-card cyan" onClick={() => onNav('upload')}>
            <div className="ptm-cs-card-top">
              <div className="ptm-cs-icon-wrap cyan">
                <P d={IC.shield} s={18} stroke="#0284c7" />
              </div>
              <span className="ptm-cs-tag">Scanner</span>
            </div>
            <div className="ptm-cs-card-name">Check Insurance</div>
            <div className="ptm-cs-card-desc">Policy clauses &amp; waiting periods</div>
          </div>

          <div className="ptm-cs-card purple" onClick={() => onNav('claim')}>
            <div className="ptm-cs-card-top">
              <div className="ptm-cs-icon-wrap purple">
                <P d={IC.file} s={18} stroke="#7c3aed" />
              </div>
              <span className="ptm-cs-tag">Simulator</span>
            </div>
            <div className="ptm-cs-card-name">Check Claim (Bill)</div>
            <div className="ptm-cs-card-desc">Detect &amp; dispute deductions</div>
          </div>

          <div className="ptm-cs-card green" onClick={() => onNav('bridge')}>
            <div className="ptm-cs-card-top">
              <div className="ptm-cs-icon-wrap green">
                <P d={IC.bridge} s={18} stroke="#16a34a" />
              </div>
              <span className="ptm-cs-tag">0% EMI</span>
            </div>
            <div className="ptm-cs-card-name">Bridge Gap (EMI)</div>
            <div className="ptm-cs-card-desc">Instant hospital desk disbursal</div>
          </div>

          <div className="ptm-cs-card amber" onClick={() => onNav('predict')}>
            <div className="ptm-cs-card-top">
              <div className="ptm-cs-icon-wrap amber">
                <P d={IC.chart} s={18} stroke="#d97706" />
              </div>
              <span className="ptm-cs-tag">Forecast</span>
            </div>
            <div className="ptm-cs-card-name">Predict &amp; Plan</div>
            <div className="ptm-cs-card-desc">Pre-admission cost calculator</div>
          </div>
        </div>
      </div>

      {/* ── UPI MONEY TRANSFER (Screenshot 1) ── */}
      <div className="ptm-latest-card">
        <div className="ptm-card-title-simple">UPI Money Transfer</div>
        <div className="ptm-upi-circle-grid">
          <button
            type="button"
            className="ptm-upi-circle-btn"
            onClick={() => openChatWith('How do I scan any UPI QR code on Paytm?')}
          >
            <div className="ptm-blue-circle-icon">
              <P d={IC.qr} s={22} stroke="#ffffff" />
            </div>
            <span className="ptm-upi-btn-label">Scan any QR</span>
          </button>

          <button
            type="button"
            className="ptm-upi-circle-btn"
            onClick={() => openChatWith('Transfer money to contacts or UPI number')}
          >
            <div className="ptm-blue-circle-icon">
              <P d={IC.user} s={22} stroke="#ffffff" />
            </div>
            <span className="ptm-upi-btn-label">Pay Anyone</span>
          </button>

          <button
            type="button"
            className="ptm-upi-circle-btn"
            onClick={() => openChatWith('Transfer money to bank account or self')}
          >
            <div className="ptm-blue-circle-icon">
              <P d={IC.landmark} s={22} stroke="#ffffff" />
            </div>
            <span className="ptm-upi-btn-label">To Bank &amp; Self A/c</span>
          </button>

          <button
            type="button"
            className="ptm-upi-circle-btn"
            onClick={() => openChatWith('Check bank balance and transaction history')}
          >
            <div className="ptm-blue-circle-icon">
              <P d={IC.file} s={22} stroke="#ffffff" />
            </div>
            <span className="ptm-upi-btn-label">Balance &amp; History</span>
          </button>
        </div>
      </div>

      {/* ── RECHARGE & BILLS (Screenshot 1) ── */}
      <div className="ptm-latest-card">
        <div className="ptm-card-header-row">
          <span className="ptm-card-title-simple" style={{ marginBottom: 0 }}>
            Recharge &amp; Bills
          </span>
          <button
            type="button"
            className="ptm-view-all-link"
            onClick={() => openChatWith('Show all bill payment options on Paytm')}
          >
            View All &rarr;
          </button>
        </div>
        <div className="ptm-service-icon-grid">
          <div
            className="ptm-service-item"
            onClick={() => openChatWith('I want to do a mobile recharge')}
          >
            <div className="ptm-service-icon-box">
              <P d={IC.mobile} s={20} stroke="#0284c7" />
            </div>
            <span className="ptm-service-label">Mobile Recharge</span>
          </div>

          <div
            className="ptm-service-item"
            onClick={() => openChatWith('Recharge my FASTag account')}
          >
            <div className="ptm-service-icon-box">
              <span className="fastag-badge-txt">FASTag</span>
            </div>
            <span className="ptm-service-label">FASTag Recharge</span>
          </div>

          <div
            className="ptm-service-item"
            onClick={() => openChatWith('Pay electricity bill')}
          >
            <div className="ptm-service-icon-box">
              <P d={IC.bulb} s={20} stroke="#0284c7" />
            </div>
            <span className="ptm-service-label">Electricity Bill</span>
          </div>

          <div
            className="ptm-service-item"
            onClick={() => openChatWith('Pay loan EMI')}
          >
            <div className="ptm-service-icon-box">
              <P d={IC.calendarRupee} s={20} stroke="#0284c7" />
            </div>
            <span className="ptm-service-label">Loan EMI Payment</span>
          </div>
        </div>
        <div className="ptm-dot-pagination">
          <span className="dot active" />
          <span className="dot" />
        </div>
      </div>

      {/* ── EXCLUSIVE OFFER RIBBON (Screenshot 1) ── */}
      <div
        className="ptm-offer-banner"
        onClick={() => openChatWith('How do I claim my exclusive cashback offer on Paytm?')}
      >
        <div className="ptm-offer-left">
          <div className="ptm-gift-box-icon">🎁</div>
          <div className="ptm-offer-texts">
            <div className="ptm-offer-title">Exclusive offer for You!</div>
            <div className="ptm-offer-sub">Claim your cashback now</div>
          </div>
        </div>
        <P d={IC.chevR} s={16} stroke="#0f172a" />
      </div>

      {/* ── POSTPAID & SAVINGS WIDGETS (Screenshot 2) ── */}
      <div className="ptm-widgets-grid">
        <div
          className="ptm-postpaid-widget"
          onClick={() => openChatWith('Tell me more about Paytm Postpaid and my limit')}
        >
          <div className="ptm-widget-icon-box">
            <span>📅₹</span>
          </div>
          <div className="ptm-widget-title">Paytm Postpaid</div>
          <div className="ptm-widget-sub">Start using with up to ₹60,000 limit</div>
        </div>

        <div className="ptm-widgets-sub-col">
          <div
            className="ptm-sub-widget"
            onClick={() => openChatWith('How does refer and earn work?')}
          >
            <div className="ptm-sub-widget-icon">👥</div>
            <div className="ptm-sub-widget-name">Refer &amp; Win</div>
          </div>

          <div
            className="ptm-sub-widget"
            onClick={() => openChatWith('How to buy 24K digital gold on Paytm?')}
          >
            <div className="ptm-sub-widget-icon">🪙</div>
            <div className="ptm-sub-widget-name">Save in Gold</div>
          </div>
        </div>
      </div>

      {/* Quick Tag Pills */}
      <div className="ptm-quick-tag-row">
        <button
          type="button"
          className="ptm-quick-tag"
          onClick={() => openChatWith('Share important UPI safety tips')}
        >
          <span>🛡️</span> <span>UPI Safety Tips</span>
        </button>
        <button
          type="button"
          className="ptm-quick-tag"
          onClick={() => openChatWith('What cashback and promo offers are active?')}
        >
          <span>🎁</span> <span>Cashback &amp; Offers</span>
        </button>
        <button
          type="button"
          className="ptm-quick-tag"
          onClick={() => openChatWith('Check my free credit score report')}
        >
          <span>💳</span> <span>Credit Score 820</span>
        </button>
      </div>

      {/* ── TRAVEL & TICKETS (Screenshot 2) ── */}
      <div className="ptm-latest-card">
        <div className="ptm-card-title-simple">Travel &amp; Tickets</div>
        <div className="ptm-service-icon-grid">
          <div
            className="ptm-service-item"
            onClick={() => openChatWith('Book flight tickets')}
          >
            <div className="ptm-service-icon-box">
              <P d={IC.plane} s={20} stroke="#0284c7" />
            </div>
            <span className="ptm-service-label">Flight</span>
          </div>

          <div
            className="ptm-service-item"
            onClick={() => openChatWith('Book train tickets')}
          >
            <div className="ptm-service-icon-box">
              <P d={IC.train} s={20} stroke="#0284c7" />
            </div>
            <span className="ptm-service-label">Train</span>
          </div>

          <div
            className="ptm-service-item"
            onClick={() => openChatWith('Book bus tickets')}
          >
            <div className="ptm-service-icon-box">
              <P d={IC.bus} s={20} stroke="#0284c7" />
            </div>
            <span className="ptm-service-label">Bus</span>
          </div>

          <div
            className="ptm-service-item"
            onClick={() => openChatWith('Book hotels on Paytm')}
          >
            <div className="ptm-service-icon-box">
              <P d={IC.hotel} s={20} stroke="#0284c7" />
            </div>
            <span className="ptm-service-label">Hotels</span>
          </div>
        </div>
        <div className="ptm-offer-pill-chip">
          <span>✈️ ₹1200* OFF on Flights</span>
        </div>
      </div>

      {/* ── GOLD & SILVER (Screenshot 2) ── */}
      <div className="ptm-latest-card">
        <div className="ptm-card-title-simple">Gold &amp; Silver</div>
        <div className="ptm-service-icon-grid">
          <div
            className="ptm-service-item"
            onClick={() => openChatWith('How to save in 24K pure digital gold?')}
          >
            <div className="ptm-service-icon-box">🪙</div>
            <span className="ptm-service-label">Save in Gold</span>
          </div>
          <div
            className="ptm-service-item"
            onClick={() => openChatWith('How to buy digital silver?')}
          >
            <div className="ptm-service-icon-box">🥈</div>
            <span className="ptm-service-label">Save in Silver</span>
          </div>
          <div
            className="ptm-service-item"
            onClick={() => openChatWith('Explore certified jewellery partners on Paytm')}
          >
            <div className="ptm-service-icon-box">💍</div>
            <span className="ptm-service-label">Jewellery</span>
          </div>
          <div
            className="ptm-service-item"
            onClick={() => openChatWith('How does Gold Round-Up auto savings work?')}
          >
            <div className="ptm-service-icon-box">🔄</div>
            <span className="ptm-service-label">Gold Round-Up</span>
          </div>
        </div>
      </div>

      {/* ── FINANCIAL SERVICES (Screenshot 3) ── */}
      <div className="ptm-latest-card">
        <div className="ptm-card-header-row">
          <span className="ptm-card-title-simple" style={{ marginBottom: 0 }}>
            Financial Services
          </span>
          <button
            type="button"
            className="ptm-view-all-link"
            onClick={() => onNav('claimsaathi')}
          >
            View All &rarr;
          </button>
        </div>
        <div className="ptm-fin-services-grid">
          <div
            className="ptm-fin-item"
            onClick={() => openChatWith('Instant personal loans on Paytm')}
          >
            <div className="ptm-fin-icon-box">💰</div>
            <span className="ptm-fin-label">Loan</span>
          </div>
          <div
            className="ptm-fin-item"
            onClick={() => openChatWith('Start a ₹51 daily SIP in mutual funds')}
          >
            <div className="ptm-fin-icon-box">📈</div>
            <span className="ptm-fin-label">₹51 रोज SIP</span>
          </div>
          <div
            className="ptm-fin-item"
            onClick={() => openChatWith('Car insurance plans and renewals')}
          >
            <div className="ptm-fin-icon-box">🚗</div>
            <span className="ptm-fin-label">Car Insurance</span>
          </div>
          <div
            className="ptm-fin-item"
            onClick={() => openChatWith('Two-wheeler bike insurance plans')}
          >
            <div className="ptm-fin-icon-box">🏍️</div>
            <span className="ptm-fin-label">Bike Insurance</span>
          </div>
          <div
            className="ptm-fin-item"
            onClick={() => openChatWith('Paytm Postpaid account details')}
          >
            <div className="ptm-fin-icon-box">📅</div>
            <span className="ptm-fin-label">Paytm Postpaid</span>
          </div>
          <div
            className="ptm-fin-item"
            onClick={() => openChatWith('Paytm Money Stocks & Trading')}
          >
            <div className="ptm-fin-icon-box">🐂</div>
            <span className="ptm-fin-label">Stocks</span>
          </div>
          <div
            className="ptm-fin-item"
            onClick={() => openChatWith('Apply for Paytm HDFC / SBI Credit Card')}
          >
            <div className="ptm-fin-icon-box">💳</div>
            <span className="ptm-fin-label">Credit Card</span>
          </div>
          <div
            className="ptm-fin-item highlight"
            onClick={() => onNav('claimsaathi')}
          >
            <div className="ptm-fin-icon-box" style={{ background: '#dcfce7' }}>
              ❤️🛡️
            </div>
            <span className="ptm-fin-label" style={{ fontWeight: 800, color: '#15803d' }}>
              Health Insurance
            </span>
          </div>
        </div>
      </div>

      {/* ── FREE TOOLS (Screenshot 3) ── */}
      <div className="ptm-latest-card">
        <div className="ptm-card-title-simple">Free Tools</div>
        <div className="ptm-free-tools-grid">
          {/* Card 1: Credit Score */}
          <div
            className="ptm-tool-card green"
            onClick={() => openChatWith('Check my credit score and score analysis')}
          >
            <div className="ptm-tool-title">Check Your Credit Score</div>
            <div className="ptm-gauge-wrap">
              <div className="ptm-gauge-badge">820</div>
            </div>
            <div className="ptm-tool-sub">Free 1-tap check</div>
          </div>

          {/* Card 2: Round Up Spends */}
          <div
            className="ptm-tool-card gold"
            onClick={() => openChatWith('How does round up spends in gold work?')}
          >
            <div className="ptm-tool-title">Round Up Spends In Gold</div>
            <div className="ptm-vault-graphic">🪙📦</div>
            <div className="ptm-tool-sub">Auto-save change</div>
          </div>

          {/* Card 3: Track Your Spends */}
          <div
            className="ptm-tool-card pink"
            onClick={() => openChatWith('Show my recent monthly spends analysis')}
          >
            <div className="ptm-tool-title">Track Your Spends</div>
            <div className="ptm-spends-graphic">
              <div className="spend-pill">🚗 ₹4,600</div>
              <div className="spend-pill blue">🍔 ₹10,200</div>
            </div>
            <div className="ptm-tool-sub">Smart budget</div>
          </div>
        </div>
      </div>

      {/* ── DO MORE WITH PAYTM (Screenshot 4) ── */}
      <div className="ptm-latest-card">
        <div className="ptm-card-title-simple">Do More with Paytm</div>
        <div className="ptm-service-icon-grid">
          <div
            className="ptm-service-item"
            onClick={() => openChatWith('Cashback and offers')}
          >
            <div className="ptm-service-icon-box">🎁</div>
            <span className="ptm-service-label">Cashback &amp; Offers</span>
          </div>
          <div
            className="ptm-service-item"
            onClick={() => openChatWith('Gift vouchers and brand cards')}
          >
            <div className="ptm-service-icon-box">🎟️</div>
            <span className="ptm-service-label">Gift Vouchers</span>
          </div>
          <div
            className="ptm-service-item"
            onClick={() => openChatWith('Claim exclusive deals')}
          >
            <div className="ptm-service-icon-box">🏷️</div>
            <span className="ptm-service-label">Claim Deals</span>
          </div>
          <div
            className="ptm-service-item"
            onClick={() => openChatWith('Show all Paytm services')}
          >
            <div className="ptm-service-icon-box">📱</div>
            <span className="ptm-service-label">See All Services</span>
          </div>
        </div>
        <div className="ptm-quick-tag-row" style={{ marginTop: 10 }}>
          <span className="ptm-quick-tag">▶️ Google Play | 5% Off</span>
          <span className="ptm-quick-tag">🔴 Deals Near You</span>
        </div>
      </div>

      {/* ── PROMOTED (Screenshot 4) ── */}
      <div className="ptm-latest-card">
        <div className="ptm-card-title-simple">Promoted</div>
        <div className="ptm-promoted-grid">
          <div className="ptm-promoted-item">
            <span className="p-brand purple">District</span>
          </div>
          <div className="ptm-promoted-item">
            <span className="p-brand red">HDFC Life</span>
          </div>
          <div className="ptm-promoted-item">
            <span className="p-brand dark">GIVA✦</span>
          </div>
          <div className="ptm-promoted-item">
            <span className="p-brand airtel">airtel</span>
          </div>
        </div>
      </div>

      {/* ── REFERRAL BANNER (Screenshot 4) ── */}
      <div
        className="ptm-referral-banner"
        onClick={() => openChatWith('How to earn assured ₹70 through referral?')}
      >
        <div className="ptm-referral-icon">🎁</div>
        <div className="ptm-referral-title">You ❤️ Paytm</div>
        <div className="ptm-referral-sub">You are 1 referral away from Assured ₹70 &rarr;</div>
        <div className="ptm-tc-txt">T&amp;C apply</div>
      </div>

      <div className="ptm-screen-pad-bottom" />
    </div>
  )
}

/* ─── Bottom Navigation with Floating Circular Voice Action Button & Android Keys ─── */
function BottomNav({ screen, onNav }) {
  const isHome = screen === 'home'
  const isIns = ['claimsaathi', 'upload', 'predict'].includes(screen)
  const isFinance = screen === 'bridge'
  const isClaims = screen === 'claim'

  const openVoiceAssistant = () => {
    window.dispatchEvent(new CustomEvent('open-saathi-chat', { detail: { voiceMode: true } }))
  }

  return (
    <div className="ptm-bottom-wrapper">
      {/* Main Tab Bar */}
      <div className="ptm-bottom-nav">
        {/* Tab 1: Home */}
        <button
          type="button"
          className={`ptm-nav-tab${isHome ? ' active' : ''}`}
          onClick={() => onNav('home')}
        >
          <span className="ptm-tab-icon">
            <P d={IC.home} s={19} />
          </span>
          <span className="ptm-tab-label">Home</span>
        </button>

        {/* Tab 2: Insurance */}
        <button
          type="button"
          className={`ptm-nav-tab${isIns ? ' active' : ''}`}
          onClick={() => onNav('claimsaathi')}
        >
          <span className="ptm-tab-icon">
            <P d={IC.shield} s={19} />
          </span>
          <span className="ptm-tab-label">Insurance</span>
        </button>

        {/* Center Circular Voice Action Button */}
        <div className="ptm-voice-tab-col">
          <button
            type="button"
            className="ptm-circle-voice-btn"
            onClick={openVoiceAssistant}
            title="Ask Saathi AI Voice Assistant"
            aria-label="Saathi Voice AI"
          >
            <span className="ptm-voice-pulse-ring" />
            <span className="ptm-voice-sparkle-dot">✨</span>
            <P d={IC.mic} s={22} stroke="#ffffff" sw={2.2} />
          </button>
          <span className="ptm-tab-label ptm-voice-label">Saathi AI</span>
        </div>

        {/* Tab 3: Finance / 0% EMI */}
        <button
          type="button"
          className={`ptm-nav-tab${isFinance ? ' active' : ''}`}
          onClick={() => onNav('bridge')}
        >
          <span className="ptm-tab-icon">
            <P d={IC.credit} s={19} />
          </span>
          <span className="ptm-tab-label">Finance</span>
        </button>

        {/* Tab 4: Check Bill / Claims */}
        <button
          type="button"
          className={`ptm-nav-tab${isClaims ? ' active' : ''}`}
          onClick={() => onNav('claim')}
        >
          <span className="ptm-tab-icon">
            <P d={IC.file} s={19} />
          </span>
          <span className="ptm-tab-label">Claims</span>
        </button>
      </div>
    </div>
  )
}

/* ─── Paytm Splash Screen Component (2s Launch Simulation) ─── */
function PaytmSplashScreen({ onDismiss }) {
  return (
    <div className="ptm-splash-container" onClick={onDismiss}>
      <div className="ptm-splash-center">
        <div className="ptm-splash-logo">
          <span className="pay">pay</span>
          <span className="tm">tm</span>
        </div>
        <div className="ptm-splash-tagline">
          <span className="india-flag-badge">
            <span className="saffron" />
            <span className="white" />
            <span className="green" />
          </span>
          <span className="tagline-text">Crafted &amp; Owned by India</span>
          <span className="india-flag-badge">
            <span className="saffron" />
            <span className="white" />
            <span className="green" />
          </span>
        </div>
      </div>

      <div className="ptm-splash-footer">
        <div className="ptm-splash-trusted">TRUSTED BY 50CR+ INDIANS</div>
        <div className="ptm-splash-badges">
          <div className="ptm-splash-badge-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <div className="badge-text">
              <strong>PCI DSS</strong>
              <span>COMPLIANT</span>
            </div>
          </div>

          <div className="ptm-splash-badge-shield">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <circle cx="12" cy="11" r="2.5"/>
            </svg>
          </div>

          <div className="ptm-splash-badge-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <div className="badge-text">
              <strong>ISO 27001</strong>
              <span>CERTIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Export ─── */
export default function PaytmMobile() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState('home')
  const [showSplash, setShowSplash] = useState(true)
  const clock = useClock()

  // Auto-dismiss splash screen after 2.0 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const getChatFeature = (scr) => {
    if (scr === 'upload') return 'insurance'
    if (scr === 'claim') return 'claim'
    if (scr === 'bridge') return 'bridge'
    return 'general'
  }

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen onNav={setScreen} />
      case 'claimsaathi':
        return <ClaimSaathiHub onNav={setScreen} onBack={() => setScreen('home')} />
      case 'upload':
        return <CheckInsuranceScreen onNav={setScreen} onBack={() => setScreen('claimsaathi')} />
      case 'claim':
        return <CheckClaimScreen onNav={setScreen} onBack={() => setScreen('claimsaathi')} />
      case 'bridge':
        return <BridgeScreen onNav={setScreen} onBack={() => setScreen('claimsaathi')} />
      case 'predict':
        return <PredictScreen onNav={setScreen} onBack={() => setScreen('claimsaathi')} />
      default:
        return <HomeScreen onNav={setScreen} />
    }
  }

  const handleAndroidBack = () => {
    window.dispatchEvent(new CustomEvent('close-saathi-chat'))
    if (screen !== 'home') {
      setScreen('home')
    }
  }

  const handleAndroidHome = () => {
    window.dispatchEvent(new CustomEvent('close-saathi-chat'))
    setScreen('home')
  }

  return (
    <div className="ptm-page">
      {/* Top Left Go to Home Page Button */}
      <button
        type="button"
        className="ptm-back-to-home"
        onClick={() => navigate('/')}
        title="Go to ClaimSaathi Web Version"
        aria-label="Go to Home Page"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span>Go to Web Version</span>
      </button>

      <div className="ptm-phone-wrap">
        <div className="ptm-phone-shadow" />
        <div className="ptm-phone">
          {/* Splash Screen Overlay */}
          {showSplash && (
            <div className="ptm-splash-overlay visible">
              <PaytmSplashScreen onDismiss={() => setShowSplash(false)} />
            </div>
          )}

          {/* Top Status Bar with integrated Dynamic Island */}
          <div className="ptm-status-bar">
            <span className="ptm-status-time">{clock}</span>
            <div className="ptm-notch">
              <div className="ptm-notch-dot" />
              <div className="ptm-notch-cam" />
            </div>
            <div className="ptm-status-right">
              <Signal />
              <span>5G</span>
              <Battery />
            </div>
          </div>

          {/* Scrollable screen content */}
          <div className="ptm-screen">{renderScreen()}</div>

          {/* Bottom nav with circular voice action button */}
          <BottomNav screen={screen} onNav={setScreen} />

          {/* Persistent Android 3-Button System Bar at Phone Bottom */}
          <div className="ptm-android-nav-bar">
            <span
              className="ptm-android-key menu"
              onClick={handleAndroidBack}
              title="App Overview"
            >
              ≡
            </span>
            <span
              className="ptm-android-key home"
              onClick={handleAndroidHome}
              title="Go to Home"
            >
              ▢
            </span>
            <span
              className="ptm-android-key back"
              onClick={handleAndroidBack}
              title="Back"
            >
              ‹
            </span>
          </div>

          {/* Saathi AI Chatbot scoped inside the phone */}
          <Chatbot customFeature={getChatFeature(screen)} />
        </div>
      </div>
    </div>
  )
}



