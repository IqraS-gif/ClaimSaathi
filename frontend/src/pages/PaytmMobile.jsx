import { useState, useLayoutEffect, useRef, useMemo } from "react"
import { createMemoryRouter, RouterProvider, Outlet, useNavigate, useLocation } from "react-router-dom"
import Upload  from "./Upload"
import Claim   from "./Claim"
import Bridge  from "./Bridge"
import Predict from "./Predict"
import Chatbot from "../components/Chatbot"
import "./PaytmMobile.css"

const IC = {
  home:["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z","M9 22V12h6v10"],
  shield:["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  credit:["M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z","M2 10h20"],
  sparkle:["m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"],
  search:["m21 21-4.34-4.34","M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0"],
  bell:["M10.268 21a2 2 0 0 0 3.464 0","M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"],
  chevL:["m15 18-6-6 6-6"],chevR:["m9 18 6-6-6-6"],
  qr:["M3 3h5v5H3z","M16 3h5v5h-5z","M3 16h5v5H3z","M21 16h-3a2 2 0 0 0-2 2v3","M21 21v.01","M12 7v3a2 2 0 0 1-2 2H7","M3 12h.01","M12 3h.01","M12 16v.01","M16 12h1","M21 12v.01","M12 21v-1"],
  file:["M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z","M13 2v7h7"],
  bridge:["M3 16c0-4 4-7 9-7s9 3 9 7","M3 16v4h18v-4","M12 9V5"],
  chart:["M3 3v16a2 2 0 0 0 2 2h16","m19 9-5 5-4-4-3 3"],
  landmark:["M10 18v-7","M14 18v-7","M18 18v-7","M3 22h18","M6 18v-7","M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z"],
}

const P = ({ d, s=18, stroke="currentColor", sw=2 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d)?d.map((p,i)=><path key={i} d={p}/>):<path d={d}/>}
  </svg>
)

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

function PhonePageHost({ children }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current; if(!el) return
    const fix = (node) => {
      if(!(node instanceof HTMLElement)) return
      if(parseInt(node.style.paddingTop||"0") > 30) node.style.paddingTop = "0px"
      if(node.style.minHeight === "100vh") node.style.minHeight = "auto"
    }
    fix(el.firstElementChild)
    fix(el.firstElementChild?.firstElementChild)
  })
  return <div ref={ref} className="ptm-page-host"><div className="ptm-page-host-scroll">{children}</div></div>
}

function PageHeader({ title, sub }) {
  const nav = useNavigate()
  return (
    <div className="ptm-inner-header">
      <button className="ptm-inner-back" onClick={()=>nav("/")}><P d={IC.chevL} s={13}/></button>
      <div><div className="ptm-inner-title">{title}</div>{sub&&<div className="ptm-inner-sub">{sub}</div>}</div>
    </div>
  )
}

function UploadPage()  { return <div className="ptm-inner-page"><PageHeader title="Check Insurance" sub="Upload your policy document"/><PhonePageHost><Upload/></PhonePageHost></div> }
function ClaimPage()   { return <div className="ptm-inner-page"><PageHeader title="Check Claim Bill" sub="Validate hospital bills"/><PhonePageHost><Claim/></PhonePageHost></div> }
function BridgePage()  { return <div className="ptm-inner-page"><PageHeader title="Bridge Gap (EMI)" sub="Finance uncovered costs"/><PhonePageHost><Bridge/></PhonePageHost></div> }
function PredictPage() { return <div className="ptm-inner-page"><PageHeader title="Predict & Plan" sub="AI premium forecast"/><PhonePageHost><Predict/></PhonePageHost></div> }

function ClaimSaathiHub() {
  const nav = useNavigate()
  const tiles = [
    {color:"cyan",  icon:IC.shield, name:"Check Insurance", desc:"Verify policy coverage & terms",    to:"/upload"},
    {color:"purple",icon:IC.file,   name:"Check Claim Bill",desc:"Validate hospital bills for claims",to:"/claim"},
    {color:"green", icon:IC.bridge, name:"Bridge Gap (EMI)",desc:"Finance uncovered hospital costs",  to:"/bridge"},
    {color:"amber", icon:IC.chart,  name:"Predict & Plan",  desc:"AI premium & coverage forecast",    to:"/predict"},
  ]
  return (
    <div className="ptm-inner-page">
      <div className="ptm-inner-header">
        <button className="ptm-inner-back" onClick={()=>nav("/")}><P d={IC.chevL} s={13}/></button>
        <div><div className="ptm-inner-title">ClaimSaathi</div><div className="ptm-inner-sub">AI Health Insurance Assistant</div></div>
      </div>
      <div className="ptm-cs-content">
        <div className="ptm-cs-status">
          <div className="ptm-cs-status-dot"/>
          <div><div className="ptm-cs-status-title">Health Insurance Active</div><div className="ptm-cs-status-sub">Star Health · Rs5L cover · Renews Apr 2025</div></div>
        </div>
        <div className="ptm-cs-grid">
          {tiles.map(t=>(
            <button key={t.name} className={`ptm-cs-tile ${t.color}`} onClick={()=>nav(t.to)}>
              <div className={`ptm-cs-tile-icon ${t.color}`}><P d={t.icon} s={15}/></div>
              <div className="ptm-cs-tile-name">{t.name}</div>
              <div className="ptm-cs-tile-desc">{t.desc}</div>
            </button>
          ))}
        </div>
        <button className="ptm-cs-ai" onClick={()=>window.dispatchEvent(new CustomEvent("open-saathi-chat",{detail:{}}))}>
          <div className="ptm-cs-ai-icon"><P d={IC.sparkle} s={17}/></div>
          <div><div className="ptm-cs-ai-title">Saathi AI - Ask anything</div><div className="ptm-cs-ai-sub">Hindi, English and 10+ Indian languages</div></div>
          <P d={IC.chevR} s={14} stroke="#7c3aed"/>
        </button>
      </div>
    </div>
  )
}

function HomeScreen() {
  const nav = useNavigate()
  const [chip,setChip] = useState(null)
  const upiTiles=[{icon:IC.qr,label:"Scan QR",badge:"AI"},{icon:IC.landmark,label:"Pay Anyone",badge:"AI"},{icon:IC.credit,label:"Bank A/c"},{icon:IC.file,label:"Balance"}]
  const insTiles=[
    {icon:IC.shield,label:"Check Insurance",color:"#0284c7",to:"/upload"},
    {icon:IC.file,label:"Check Claim",color:"#7c3aed",to:"/claim"},
    {icon:IC.bridge,label:"Bridge Gap",color:"#16a34a",to:"/bridge"},
    {icon:IC.chart,label:"Predict Plan",color:"#d97706",to:"/predict"},
    {icon:IC.credit,label:"Postpaid"},{icon:IC.sparkle,label:"Credit Score"},{icon:IC.home,label:"Car Insure"},{icon:IC.chart,label:"Stocks"},
  ]
  const chips=["Check Policy","Claim Bill","Bridge Gap","Predict & Plan"]
  return (
    <div className="ptm-home">
      <div className="ptm-hero">
        <p className="ptm-hero-label">Wallet Balance</p>
        <div className="ptm-hero-amount"><span className="ptm-hero-currency">Rs</span><span className="ptm-hero-value">24,50,000</span></div>
        <div className="ptm-hero-split">
          <div className="ptm-hero-split-item"><span className="ptm-hero-split-label">Bank</span><span className="ptm-hero-split-value">Rs12.5L</span></div>
          <div className="ptm-hero-divider"/>
          <div className="ptm-hero-split-item"><span className="ptm-hero-split-label">Investments</span><span className="ptm-hero-split-value">Rs12.0L</span></div>
          <div className="ptm-hero-divider"/>
          <div className="ptm-hero-split-item"><span className="ptm-hero-split-label">Insurance</span><span className="ptm-hero-split-value">Active</span></div>
        </div>
      </div>
      <div className="ptm-feature-banner" onClick={()=>nav("/claimsaathi")}>
        <div className="ptm-feature-banner-top">
          <div className="ptm-feature-icon-wrap"><P d={IC.shield} s={16} stroke="#fff"/></div>
          <div className="ptm-feature-body"><p className="ptm-feature-eyebrow">New - ClaimSaathi by Paytm</p><p className="ptm-feature-title">AI Health Insurance Assistant</p></div>
          <span className="ptm-feature-ai-badge">AI</span>
        </div>
        <div className="ptm-feature-chips">
          {chips.map(c=><span key={c} className={`ptm-chip${chip===c?" active":""}`} onClick={e=>{e.stopPropagation();setChip(c===chip?null:c)}}>{c}</span>)}
        </div>
      </div>
      <div className="ptm-stat-row">
        <div className="ptm-stat-card"><div className="ptm-stat-value">820</div><div className="ptm-stat-label">Credit Score</div><div className="ptm-stat-sub">Free 1-tap check</div></div>
        <div className="ptm-stat-card"><div className="ptm-stat-value">Rs200</div><div className="ptm-stat-label">Refer and Win</div><div className="ptm-stat-sub">Assured reward</div></div>
      </div>
      <div className="ptm-section">
        <div className="ptm-section-head"><span className="ptm-section-title">UPI Money Transfer</span></div>
        <div className="ptm-grid-4">
          {upiTiles.map(t=>(
            <button key={t.label} className="ptm-tile">
              <span className="ptm-tile-icon"><P d={t.icon} s={15} stroke="#64748b"/>{t.badge&&<span className="ptm-tile-badge">{t.badge}</span>}</span>
              <span className="ptm-tile-label">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="ptm-promo">
        <div><p className="ptm-promo-eyebrow">Insurance on Paytm</p><p className="ptm-promo-title">Protect your family today</p></div>
        <button className="ptm-promo-cta" onClick={()=>nav("/claimsaathi")}>Explore</button>
      </div>
      <div className="ptm-section">
        <div className="ptm-section-head"><span className="ptm-section-title">Financial Services</span><button className="ptm-view-all">View All<P d={IC.chevR} s={10}/></button></div>
        <div className="ptm-grid-4">
          {insTiles.map(t=>(
            <button key={t.label} className="ptm-tile" onClick={t.to?()=>nav(t.to):undefined}>
              <span className="ptm-tile-icon"><P d={t.icon} s={15} stroke={t.color||"#64748b"}/></span>
              <span className="ptm-tile-label" style={t.color?{color:"#374151"}:{}}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="ptm-screen-pad"/>
    </div>
  )
}

function BottomNav() {
  const nav = useNavigate()
  const loc = useLocation()
  const p = loc.pathname
  const isHome = p==="/"
  const isIns  = p==="/claimsaathi"||p.startsWith("/upload")||p.startsWith("/claim")||p.startsWith("/bridge")||p.startsWith("/predict")
  const openChat = ()=>window.dispatchEvent(new CustomEvent("open-saathi-chat",{detail:{}}))
  return (
    <div className="ptm-bottom-nav">
      <button className={`ptm-nav-tab${isHome?" active":""}`} onClick={()=>nav("/")}>
        <span className="ptm-tab-icon"><P d={IC.home} s={19}/></span><span className="ptm-tab-label">Home</span>
      </button>
      <button className={`ptm-nav-tab${isIns?" active":""}`} onClick={()=>nav("/claimsaathi")}>
        <span className="ptm-tab-icon"><P d={IC.shield} s={19}/></span><span className="ptm-tab-label">Insurance</span>
      </button>
      <button className="ptm-tab-scan" onClick={()=>nav("/")}><P d={IC.qr} s={20} stroke="#fff"/></button>
      <button className="ptm-nav-tab" onClick={()=>nav("/")}>
        <span className="ptm-tab-icon"><P d={IC.credit} s={19}/></span><span className="ptm-tab-label">Finance</span>
      </button>
      <button className="ptm-nav-tab ptm-nav-tab-saathi" onClick={openChat}>
        <span className="ptm-tab-icon"><P d={IC.sparkle} s={19}/></span><span className="ptm-tab-label">Saathi AI</span>
      </button>
    </div>
  )
}

function PhoneContent() {
  return (
    <>
      <div className="ptm-screen"><Outlet/></div>
      <BottomNav/>
      <Chatbot/>
    </>
  )
}

function PhoneShell({ router }) {
  const clock = useClock()
  return (
    <div className="ptm-phone-wrap">
      <div className="ptm-phone-shadow"/>
      <div className="ptm-phone">
        <div className="ptm-notch"><div className="ptm-notch-dot"/><div className="ptm-notch-cam"/></div>
        <div className="ptm-status-bar">
          <span className="ptm-status-time">{clock}</span>
          <div className="ptm-status-right"><Signal/><span>5G</span><Battery/></div>
        </div>
        <div className="ptm-app-bar">
          <div className="ptm-app-bar-identity">
            <div className="ptm-avatar">SS</div>
            <div className="ptm-wordmark"><span className="ptm-wordmark-pay">pay</span><span className="ptm-wordmark-tm">tm</span></div>
          </div>
          <div className="ptm-app-bar-actions">
            <button className="ptm-icon-btn"><P d={IC.search} s={14}/></button>
            <button className="ptm-icon-btn"><P d={IC.bell} s={14}/><span className="ptm-notif-dot"/></button>
          </div>
        </div>
        <RouterProvider router={router}/>
      </div>
    </div>
  )
}

export default function PaytmMobile() {
  const router = useMemo(()=>createMemoryRouter([{
    path:"/",
    element:<PhoneContent/>,
    children:[
      {index:true,element:<HomeScreen/>},
      {path:"claimsaathi",element:<ClaimSaathiHub/>},
      {path:"upload",element:<UploadPage/>},
      {path:"claim",element:<ClaimPage/>},
      {path:"bridge",element:<BridgePage/>},
      {path:"predict",element:<PredictPage/>},
    ]
  }]),[])
  return (
    <div className="ptm-page">
      <PhoneShell router={router}/>
    </div>
  )
}

// v2 complete
