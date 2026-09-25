import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import client from '../api/client'
import './Chatbot.css'

// ─────────────────────────────────────────────────────────────────────────────
// CRISP SVG VECTOR ICONS
// ─────────────────────────────────────────────────────────────────────────────
const SparkleIcon = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/>
  </svg>
)

const SendIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
)

const MicIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
  </svg>
)

const SpeakerIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>
)

const SpeakerMuteIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>
)

const CloseIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const MinimizeIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const MaximizeIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"/>
    <polyline points="9 21 3 21 3 15"/>
    <line x1="21" y1="3" x2="14" y2="10"/>
    <line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
)

const BotIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="4"/>
    <circle cx="12" cy="5" r="2"/>
    <path d="M12 7v4"/>
    <line x1="8" y1="16" x2="8" y2="16.01"/>
    <line x1="16" y1="16" x2="16" y2="16.01"/>
  </svg>
)

const RefreshIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
  </svg>
)

const CopyIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)

const CheckIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const ShieldCheckIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
)

// ─────────────────────────────────────────────────────────────────────────────
// MULTILINGUAL CONTEXT CONFIGURATION (EN | HINGLISH | HI)
// ─────────────────────────────────────────────────────────────────────────────
const FEATURE_DATA = {
  claim: {
    en: {
      title: 'Claim & Bill Simulator',
      badge: 'Bill Deductions Loaded',
      subtitle: 'Context: ₹2,00,000 Bill • ₹70,000 Deductions (Clauses 3.1, 3.2, 7.2)',
      initialGreeting: "Namaste! I'm your ClaimSaathi Assistant powered by **Sarvam AI**.\n\nI have loaded your **₹2,00,000 Fortis hospital bill simulation**:\n• Estimated Insurer Payout: **₹1,30,000** (65%)\n• Out-of-Pocket Deduction: **₹70,000** (35%)\n\nAsk me why any specific item was cut, how to dispute consumables, or speak using the mic!",
      quickPrompts: [
        'Why was ₹70,000 deducted from my bill?',
        'Explain Clause 3.2 proportionate deduction',
        'Can I dispute the ₹20k consumables?',
        'How to bridge ₹70k with Paytm 0% EMI?',
      ],
      placeholder: 'Ask about this bill breakdown or speak...',
    },
    hi: {
      title: 'क्लेम व बिल सिमुलेटर',
      badge: 'बिल कटौतियां लोड हैं',
      subtitle: 'संदर्भ: ₹2,00,000 बिल • ₹70,000 कटौतियां (क्लॉज 3.1, 3.2, 7.2)',
      initialGreeting: "नमस्ते! मैं सरवम AI द्वारा संचालित आपका **क्लेम साथी सहायक** हूँ।\n\nमैंने आपके **₹2,00,000 अस्पताल बिल** का सिमुलेशन लोड कर लिया है:\n• बीमा कंपनी द्वारा देय: **₹1,30,000** (65%)\n• मरीज को देय (कटौती): **₹70,000** (35%)\n\nमुझसे पूछें कि बिल में से पैसे क्यों कटे, कंज्यूमबल्स पर अपील कैसे करें, या माइक से बोलें!",
      quickPrompts: [
        'मेरे बिल से ₹70,000 क्यों काटे गए?',
        'क्लॉज 3.2 समानुपातिक कटौती समझाएं',
        'क्या ₹20,000 कंज्यूमबल्स पर अपील कर सकते हैं?',
        'Paytm 0% EMI से ₹70,000 कैसे भरें?',
      ],
      placeholder: 'बिल और क्लेम के बारे में हिंदी में पूछें...',
    },
    hinglish: {
      title: 'Claim & Bill Simulator',
      badge: 'Bill Deductions Loaded',
      subtitle: 'Context: ₹2 Lakh Bill • ₹70k Deductions',
      initialGreeting: "Namaste! Main Sarvam AI powered aapka **ClaimSaathi assistant** hoon.\n\nAapka **₹2,00,000 Fortis hospital bill** breakdown ready hai:\n• Insurer Payout: **₹1,30,000** (65%)\n• You Pay (Deduction): **₹70,000** (35%)\n\nKoi bhi doubt ho jaise ₹70k kyu deduct hua ya consumables appeal kaise karein, neeche puchein ya mic dabakar bolein!",
      quickPrompts: [
        '₹70,000 kyu deduct hue mere bill se?',
        'Clause 3.2 proportionate penalty samjhao',
        'Kya 20k consumables claim ho sakte hain?',
        'Paytm 0% EMI se bill kaise bharein?',
      ],
      placeholder: 'Ask in Hinglish or speak with mic...',
    },
  },
  insurance: {
    en: {
      title: 'Insurance Policy Decoder',
      badge: 'Policy Limits Loaded',
      subtitle: 'Context: ₹5,00,000 Cover • ₹3k Room Cap • Exclusions & Network',
      initialGreeting: "Namaste! I'm your ClaimSaathi Assistant powered by **Sarvam AI**.\n\nI have the complete breakdown of your **Health Insurance Policy**:\n• Sum Insured: **₹5,00,000**\n• Room Rent Cap: **₹3,000/day** (Twin Sharing)\n• Co-Pay: **10%**\n• Empanelled: Fortis, Max, Apollo\n\nAsk me about treatment coverage, cashless admission, or room upgrade penalties!",
      quickPrompts: [
        'Is single deluxe room covered in my policy?',
        'What are the major exclusions in my policy?',
        'Is Fortis Hospital cashless under my policy?',
        'Explain the 10% co-payment rule',
      ],
      placeholder: 'Ask about this policy or speak...',
    },
    hi: {
      title: 'स्वास्थ्य बीमा पॉलिसी डिकोडर',
      badge: 'पॉलिसी शर्तें लोड हैं',
      subtitle: 'संदर्भ: ₹5,00,000 कवर • ₹3,000 रूम सीमा • अपवाद व अस्पताल',
      initialGreeting: "नमस्ते! मैं सरवम AI द्वारा संचालित आपका **क्लेम साथी सहायक** हूँ।\n\nआपकी स्वास्थ्य बीमा पॉलिसी का विवरण लोड है:\n• सम इंश्योर्ड (बीमा राशि): **₹5,00,000**\n• रूम रेंट सीमा: **₹3,000/दिन** (ट्विन शेयरिंग)\n• को-पेमेंट: **10%**\n• कैशलेस अस्पताल: फोर्टिस, मैक्स, अपोलो\n\nउपचार कवरेज, कमरे के किराए के नियम या कैशलेस भर्ती के बारे में हिंदी में पूछें!",
      quickPrompts: [
        'क्या सिंगल डीलक्स रूम मेरी पॉलिसी में कवर है?',
        'मेरी पॉलिसी में क्या-क्या चीजें कवर नहीं हैं?',
        'क्या फोर्टिस अस्पताल में कैशलेस इलाज मिलेगा?',
        '10% को-पेमेंट नियम क्या है?',
      ],
      placeholder: 'पॉलिसी के बारे में हिंदी में पूछें...',
    },
    hinglish: {
      title: 'Insurance Policy Decoder',
      badge: 'Policy Limits Loaded',
      subtitle: 'Context: ₹5 Lakh Cover • ₹3k Room Cap',
      initialGreeting: "Namaste! Main Sarvam AI powered aapka **ClaimSaathi assistant** hoon.\n\nAapki policy ka data loaded hai:\n• Sum Insured: **₹5,00,000**\n• Room Rent Limit: **₹3,000/day**\n• Co-Pay: **10%**\n• Cashless Hospitals: Fortis, Max, Apollo\n\nKoi bhi sawal puchein jaise room upgrade rules ya surgery coverage!",
      quickPrompts: [
        'Kya single deluxe room covered hai?',
        'Policy me major exclusions kya hain?',
        'Kya Fortis hospital cashless hai?',
        '10% co-payment rule explain karo',
      ],
      placeholder: 'Ask in Hinglish or speak with mic...',
    },
  },
  bridge: {
    en: {
      title: 'Paytm Financial Bridge',
      badge: 'Paytm Loans Loaded',
      subtitle: 'Context: ₹70,000 Cash Gap • 0% EMI • 45-day TPA Grace',
      initialGreeting: "Namaste! I'm your ClaimSaathi Assistant powered by **Sarvam AI**.\n\nI'm ready with your **Paytm Financial Bridge** details to cover the **₹70,000** hospital deduction:\n• **0% No-Cost EMI:** ₹23,333/month (3 mos)\n• **45-Day Advance:** ₹0 today; repay after TPA reimbursement\n• Direct disbursal to hospital billing counter in < 2 mins\n\nHow can I help you discharge with peace of mind?",
      quickPrompts: [
        'How does 0% No-Cost EMI work for hospital bills?',
        'How does 45-day TPA reimbursement bridge work?',
        'What documents are needed for approval?',
        'Can Paytm pay the hospital cashier directly?',
      ],
      placeholder: 'Ask about Paytm 0% EMI or medical credit...',
    },
    hi: {
      title: 'Paytm मेडिकल लोन व EMI',
      badge: 'Paytm लोन लोड है',
      subtitle: 'संदर्भ: ₹70,000 कैश गैप • 0% ईएमआई • 45 दिन ग्रेस',
      initialGreeting: "नमस्ते! मैं सरवम AI द्वारा संचालित आपका **क्लेम साथी सहायक** हूँ।\n\nअस्पताल के **₹70,000** के अंतर को भरने के लिए Paytm मेडिकल लोन उपलब्ध है:\n• **0% नो-कॉस्ट EMI:** ₹23,333/माह (3 महीने)\n• **45-दिन ग्रेस एडवांस:** आज ₹0 दें; TPA क्लेम मिलने पर चुकाएं\n• 2 मिनट में सीधे अस्पताल के कैशियर काउंटर पर भुगतान\n\nलोन पात्रता या डिस्चार्ज प्रक्रिया के बारे में कुछ भी पूछें!",
      quickPrompts: [
        '0% नो-कॉस्ट EMI कैसे काम करती है?',
        '45 दिन की TPA ग्रेस छूट कैसे मिलती है?',
        'लोन के लिए कौन से दस्तावेज चाहिए?',
        'क्या Paytm सीधे अस्पताल को पैसे देता है?',
      ],
      placeholder: 'Paytm 0% ईएमआई के बारे में पूछें...',
    },
    hinglish: {
      title: 'Paytm Financial Bridge',
      badge: 'Paytm Loans Loaded',
      subtitle: 'Context: ₹70k Cash Gap • 0% EMI',
      initialGreeting: "Namaste! Main Sarvam AI powered aapka **ClaimSaathi assistant** hoon.\n\nHospital gap ka **₹70,000** clear karne ke liye Paytm Health Bridge available hai:\n• **0% No-Cost EMI:** ₹23,333/month (3 months)\n• **45-Day Advance:** Aaj ₹0 pay karein, TPA se paisa aane par repay karein\n• Instant hospital disbursal in 2 mins\n\nKaise help kar sakta hoon aapki?",
      quickPrompts: [
        '0% No-Cost EMI kaise kaam karti hai?',
        '45-day TPA grace advance kaise milega?',
        'Loan ke liye kaunse documents chahiye?',
        'Kya Paytm hospital ko direct pay karega?',
      ],
      placeholder: 'Ask in Hinglish or speak with mic...',
    },
  },
  general: {
    en: {
      title: 'ClaimSaathi AI Assistant',
      badge: 'AI Assistant Active',
      subtitle: 'Health Insurance & Hospital Bill Specialist',
      initialGreeting: "Namaste! I'm your ClaimSaathi Assistant powered by **Sarvam AI**.\n\nI can help you:\n1. Decode your health insurance policy & hidden clauses\n2. Simulate hospital bill out-of-pocket deductions\n3. Access instant zero-collateral Paytm EMI to bridge any cash gap\n\nWhat would you like to know today?",
      quickPrompts: [
        'What is proportionate room rent deduction?',
        'How does ClaimSaathi simulate hospital bills?',
        'Explain 0% No-Cost EMI for hospital bills',
        'What are non-payable consumables in claims?',
      ],
      placeholder: 'Ask anything about policy, bills, or EMI...',
    },
    hi: {
      title: 'क्लेम साथी AI सहायक',
      badge: 'AI सहायक सक्रिय है',
      subtitle: 'स्वास्थ्य बीमा व अस्पताल बिल विशेषज्ञ',
      initialGreeting: "नमस्ते! मैं सरवम AI द्वारा संचालित आपका **क्लेम साथी सहायक** हूँ।\n\nमैं आपकी सहायता कर सकता हूँ:\n1. स्वास्थ्य बीमा पॉलिसी और छुपे हुए क्लॉज समझने में\n2. अस्पताल बिल में होने वाली कटौतियों का सिमुलेशन देखने में\n3. अस्पताल में बिना ब्याज 0% No-Cost EMI से तुरंत भुगतान करने में\n\nआप मुझसे हिंदी में कुछ भी पूछ सकते हैं!",
      quickPrompts: [
        'समानुपातिक रूम रेंट कटौती क्या होती है?',
        'ClaimSaathi अस्पताल बिल सिमुलेट कैसे करता है?',
        'अस्पताल बिल के लिए 0% EMI कैसे मिलती है?',
        'क्लेम में नॉन-पेयेबल कंज्यूमबल्स क्या होते हैं?',
      ],
      placeholder: 'बीमा या बिल के बारे में हिंदी में पूछें...',
    },
    hinglish: {
      title: 'ClaimSaathi AI Assistant',
      badge: 'AI Assistant Active',
      subtitle: 'Health Insurance & Bill Expert',
      initialGreeting: "Namaste! Main Sarvam AI powered aapka **ClaimSaathi assistant** hoon.\n\nMain aapki help kar sakta hoon:\n1. Health policy ke clauses aur room rent rules samajhne me\n2. Hospital bill me kitna cut hoga simulate karne me\n3. Paytm 0% No-Cost EMI se instant hospital payment karne me\n\nAap kya jaanna chahte hain?",
      quickPrompts: [
        'Proportionate room rent deduction kya hota hai?',
        'ClaimSaathi hospital bill kaise simulate karta hai?',
        '0% No-Cost EMI hospital bills ke liye kaise milti hai?',
        'Non-payable consumables kya hote hain?',
      ],
      placeholder: 'Ask in Hinglish or speak with mic...',
    },
  },
}

function getLocalizedConfig(feature, lang) {
  const f = FEATURE_DATA[feature] || FEATURE_DATA.general
  return f[lang] || f.en
}

export default function Chatbot({ customFeature, customContext }) {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState('en') // 'en' | 'hinglish' | 'hi'

  // Voice State
  const [isListening, setIsListening] = useState(false)
  const [speakingMessageId, setSpeakingMessageId] = useState(null)
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [speechError, setSpeechError] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  // Determine current feature context from route or prop
  const currentPath = location.pathname.toLowerCase()
  let detectedFeature = 'general'
  if (customFeature) {
    detectedFeature = customFeature
  } else if (currentPath.includes('/claim') || currentPath.includes('/check-claim')) {
    detectedFeature = 'claim'
  } else if (currentPath.includes('/upload') || currentPath.includes('/check-insurance')) {
    detectedFeature = 'insurance'
  } else if (currentPath.includes('/bridge')) {
    detectedFeature = 'bridge'
  }

  const localized = getLocalizedConfig(detectedFeature, lang)

  // Initialize or reset greeting when feature or language changes
  useEffect(() => {
    setMessages([
      {
        id: `init-${detectedFeature}-${lang}`,
        role: 'assistant',
        content: localized.initialGreeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'sarvam-ai',
      },
    ])
  }, [detectedFeature, lang])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isMinimized, loading])

  // Listen for global open/close events from any page
  useEffect(() => {
    const handleGlobalOpen = (e) => {
      setIsOpen(true)
      setIsMinimized(false)
      if (e.detail?.prompt) {
        setTimeout(() => {
          handleSend(e.detail.prompt)
        }, 120)
      }
    }
    const handleGlobalClose = () => {
      setIsOpen(false)
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
    window.addEventListener('open-saathi-chat', handleGlobalOpen)
    window.addEventListener('close-saathi-chat', handleGlobalClose)
    return () => {
      window.removeEventListener('open-saathi-chat', handleGlobalOpen)
      window.removeEventListener('close-saathi-chat', handleGlobalClose)
    }
  }, [detectedFeature, lang, messages])

  // Stop speech synthesis when closing or unmounting
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {}
      }
    }
  }, [])

  // ─────────────────────────────────────────────────────────────────────────────
  // TEXT-TO-SPEECH (VOICE OUTPUT)
  // ─────────────────────────────────────────────────────────────────────────────
  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setSpeakingMessageId(null)
  }

  const speakText = (text, messageId) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.')
      return
    }

    if (speakingMessageId === messageId) {
      stopSpeaking()
      return
    }

    stopSpeaking()

    let cleanSpeech = text
      .replace(/[*_#`]/g, '')
      .replace(/[•\-]\s*/g, '. ')
      .replace(/\s+/g, ' ')
      .trim()

    if (lang === 'hi') {
      cleanSpeech = cleanSpeech.replace(/₹\s*([0-9,]+)/g, '$1 रुपये').replace(/₹/g, 'रुपये ')
    } else {
      cleanSpeech = cleanSpeech.replace(/₹\s*([0-9,]+)/g, '$1 rupees').replace(/₹/g, 'rupees ')
    }

    const utterance = new SpeechSynthesisUtterance(cleanSpeech)
    const voices = window.speechSynthesis.getVoices() || []

    if (lang === 'hi') {
      utterance.lang = 'hi-IN'
      const hiVoice = voices.find((v) => v.lang && v.lang.startsWith('hi'))
      if (hiVoice) utterance.voice = hiVoice
    } else {
      utterance.lang = 'en-IN'
      const inVoice = voices.find(
        (v) => (v.lang && v.lang.includes('IN')) || (v.name && v.name.toLowerCase().includes('india'))
      )
      if (inVoice) utterance.voice = inVoice
    }

    utterance.rate = 1.0
    utterance.pitch = 1.0

    utterance.onstart = () => {
      setSpeakingMessageId(messageId)
    }
    utterance.onend = () => {
      setSpeakingMessageId(null)
    }
    utterance.onerror = () => {
      setSpeakingMessageId(null)
    }

    window.speechSynthesis.speak(utterance)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SPEECH-TO-TEXT (VOICE INPUT)
  // ─────────────────────────────────────────────────────────────────────────────
  const toggleListening = () => {
    setSpeechError(null)

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {}
      }
      setIsListening(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSpeechError('Voice recognition is not supported in this browser. Please use Chrome or Edge.')
      setTimeout(() => setSpeechError(null), 4000)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      recognition.continuous = false
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      if (lang === 'hi') {
        recognition.lang = 'hi-IN'
      } else {
        recognition.lang = 'en-IN'
      }

      recognition.onstart = () => {
        setIsListening(true)
        setSpeechError(null)
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        if (transcript && transcript.trim()) {
          setInput(transcript)
          setIsListening(false)
          handleSend(transcript)
        }
      }

      recognition.onerror = (e) => {
        console.warn('[SpeechRecognition Error]', e.error)
        setIsListening(false)
        if (e.error === 'not-allowed') {
          setSpeechError('Microphone permission blocked. Please allow mic access in your browser.')
        } else if (e.error !== 'no-speech') {
          setSpeechError(`Voice error: ${e.error}`)
        }
        setTimeout(() => setSpeechError(null), 4500)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch (err) {
      console.error('[SpeechRecognition Init Error]', err)
      setIsListening(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MESSAGE SENDING & SARVAM AI BACKEND CALL
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim()
    if (!query || loading) return

    const newMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, newMsg])
    setInput('')
    setLoading(true)

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await client.post('/chat/', {
        message: query,
        feature: detectedFeature,
        language: lang,
        context_data: customContext || {
          total_billed: 200000,
          insurance_payable: 130000,
          you_pay: 70000,
          gap_amount: 70000,
          hospital_name: 'Fortis Memorial Research Institute',
          patient_name: 'Rahul Verma',
          sum_insured: '₹5,00,000',
          room_rent_limit: '₹3,000/day',
        },
        history: historyPayload,
      })

      const botReplyId = `b-${Date.now()}`
      const botReply = {
        id: botReplyId,
        role: 'assistant',
        content: res.data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: res.data.provider,
        model: res.data.model,
      }
      setMessages((prev) => [...prev, botReply])

      if (autoSpeak) {
        speakText(res.data.reply, botReplyId)
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            lang === 'hi'
              ? 'क्षमा करें, बीमा इंजन से जुड़ने में समस्या हुई। कृपया दोबारा प्रयास करें या नीचे दिए गए किसी प्रश्न पर क्लिक करें।'
              : 'I apologize, but I could not connect to the insurance engine right now. Please try again or click any suggested question below.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const resetChat = () => {
    stopSpeaking()
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: localized.initialGreeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'sarvam-ai',
      },
    ])
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  // Format markdown: bold, list items, paragraphs
  const renderMessageContent = (text) => {
    if (!text) return ''
    const lines = text.split('\n')
    return lines.map((line, idx) => {
      const trimmed = line.trim()
      const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ')
      const cleaned = isBullet ? trimmed.replace(/^[•\-]\s*/, '') : trimmed

      const parts = cleaned.split(/(\*\*.*?\*\*)/g)
      const parsedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const inner = part.slice(2, -2)
          return (
            <strong key={pIdx} className="saathi-bubble-strong">
              {inner}
            </strong>
          )
        }
        return part
      })

      if (isBullet) {
        return (
          <div key={idx} className="saathi-bubble-bullet">
            <span className="saathi-bullet-dot" />
            <span className="saathi-bullet-text">{parsedParts}</span>
          </div>
        )
      }

      if (trimmed === '') {
        return <div key={idx} className="saathi-bubble-space" />
      }

      return (
        <div key={idx} className="saathi-bubble-p">
          {parsedParts}
        </div>
      )
    })
  }

  return (
    <>
      {/* ── EXPANDED CHAT WINDOW ── */}
      {isOpen && (
        <div className={`saathi-chat-window${isMinimized ? ' minimized' : ''}`}>
          {/* Header */}
          <div className="saathi-header">
            {/* Left: Bot Identity */}
            <div className="saathi-header-info">
              <div className="saathi-bot-avatar">
                <BotIcon size={20} />
                <span className="saathi-avatar-dot" />
              </div>
              <div className="saathi-header-meta">
                <span className="saathi-header-name">ClaimSaathi AI</span>
                <div className="saathi-header-status-row">
                  <span className="saathi-status-pulse" />
                  <span className="saathi-status-text">{localized.badge}</span>
                </div>
              </div>
            </div>

            {/* Right: Controls (Language + Audio Icon + Minimize + Close) */}
            <div className="saathi-header-controls">
              {/* Language Switcher */}
              <div className="saathi-lang-switcher" role="group" aria-label="Language selection">
                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking()
                    setLang('en')
                  }}
                  className={`saathi-lang-btn${lang === 'en' ? ' active' : ''}`}
                  title="English mode"
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking()
                    setLang('hinglish')
                  }}
                  className={`saathi-lang-btn${lang === 'hinglish' ? ' active' : ''}`}
                  title="Hinglish mode"
                >
                  Hin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking()
                    setLang('hi')
                  }}
                  className={`saathi-lang-btn${lang === 'hi' ? ' active' : ''}`}
                  title="हिंदी में बात करें"
                >
                  हिंदी
                </button>
              </div>

              {/* Voice Output Icon Button (No Text Overflow) */}
              <button
                type="button"
                onClick={() => {
                  if (autoSpeak) stopSpeaking()
                  setAutoSpeak(!autoSpeak)
                }}
                className={`saathi-icon-action-btn${autoSpeak ? ' active' : ''}`}
                title={autoSpeak ? 'Voice Audio: ON (Click to mute)' : 'Voice Audio: OFF (Click to auto-read)'}
                aria-label="Toggle voice readout"
              >
                {autoSpeak ? <SpeakerIcon size={14} /> : <SpeakerMuteIcon size={14} />}
              </button>

              {/* Minimize / Maximize Button */}
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="saathi-window-btn"
                title={isMinimized ? 'Expand chat' : 'Minimize chat'}
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
              >
                {isMinimized ? <MaximizeIcon size={13} /> : <MinimizeIcon size={13} />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  stopSpeaking()
                  setIsOpen(false)
                }}
                className="saathi-window-btn close"
                title="Close chat"
                aria-label="Close chat"
              >
                <CloseIcon size={13} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Context Ribbon Banner */}
              <div className="saathi-context-ribbon">
                <div className="saathi-context-left">
                  <span className="saathi-sparkle-dot">
                    <SparkleIcon size={12} color="#00BAF2" />
                  </span>
                  <span className="saathi-context-subtitle">{localized.subtitle}</span>
                </div>
                <button
                  type="button"
                  onClick={resetChat}
                  className="saathi-reset-btn"
                  title="Start fresh conversation"
                >
                  <RefreshIcon size={11} />
                  <span>{lang === 'hi' ? 'रीसेट' : 'Reset'}</span>
                </button>
              </div>

              {/* Message History Area */}
              <div className="saathi-messages-box">
                {messages.map((m) => (
                  <div key={m.id} className={`saathi-message-row ${m.role}`}>
                    {m.role === 'assistant' && (
                      <div className="saathi-bot-label">
                        <div className="saathi-bot-avatar-mini">
                          <BotIcon size={11} />
                        </div>
                        <span className="saathi-bot-name">ClaimSaathi</span>
                      </div>
                    )}

                    <div className="saathi-bubble">
                      {renderMessageContent(m.content)}
                    </div>

                    <div className="saathi-message-meta">
                      <span className="saathi-meta-time">{m.time}</span>
                      {m.role === 'assistant' && (
                        <div className="saathi-bubble-actions">
                          {/* Copy button */}
                          <button
                            type="button"
                            onClick={() => copyToClipboard(m.content, m.id)}
                            className="saathi-action-icon-btn"
                            title="Copy response"
                          >
                            {copiedId === m.id ? <CheckIcon size={11} /> : <CopyIcon size={11} />}
                            <span className="saathi-action-label">{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                          </button>

                          {/* Voice Read Aloud Button */}
                          <button
                            type="button"
                            onClick={() => speakText(m.content, m.id)}
                            className={`saathi-action-icon-btn${speakingMessageId === m.id ? ' speaking' : ''}`}
                            title={speakingMessageId === m.id ? 'Stop audio' : 'Read aloud'}
                          >
                            <SpeakerIcon size={11} />
                            <span className="saathi-action-label">
                              {speakingMessageId === m.id ? 'Stop' : 'Listen'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="saathi-message-row assistant">
                    <div className="saathi-bot-label">
                      <div className="saathi-bot-avatar-mini">
                        <BotIcon size={11} />
                      </div>
                      <span className="saathi-bot-name">ClaimSaathi</span>
                    </div>
                    <div className="saathi-typing-card">
                      <div className="saathi-typing-dots">
                        <span className="saathi-dot" />
                        <span className="saathi-dot" />
                        <span className="saathi-dot" />
                      </div>
                      <span className="saathi-typing-text">
                        {lang === 'hi' ? 'विश्लेषण कर रहा है...' : 'Analyzing insurance data...'}
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Suggestion Pills */}
              <div className="saathi-quick-prompts-bar">
                {localized.quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="saathi-chip-btn"
                  >
                    <span className="saathi-chip-icon">⚡</span>
                    <span className="saathi-chip-text">{q}</span>
                  </button>
                ))}
              </div>

              {/* Input Area with Voice Support */}
              <div className="saathi-input-bar">
                {/* Active Listening Equalizer Banner */}
                {isListening && (
                  <div className="saathi-voice-listening-bar">
                    <div className="saathi-voice-listening-left">
                      <div className="saathi-voice-wave">
                        <span className="saathi-wave-bar" />
                        <span className="saathi-wave-bar" />
                        <span className="saathi-wave-bar" />
                        <span className="saathi-wave-bar" />
                        <span className="saathi-wave-bar" />
                      </div>
                      <span className="saathi-voice-label">
                        {lang === 'hi'
                          ? 'सुन रहे हैं... कृपया बोलें'
                          : 'Listening... Speak now'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleListening}
                      className="saathi-voice-cancel-btn"
                    >
                      {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                    </button>
                  </div>
                )}

                {/* Speech Error Notice */}
                {speechError && (
                  <div className="saathi-speech-error-box">
                    <span>{speechError}</span>
                  </div>
                )}

                <div className="saathi-input-box">
                  <input
                    type="text"
                    placeholder={
                      isListening
                        ? lang === 'hi' ? 'आपकी आवाज़ रिकॉर्ड हो रही है...' : 'Listening to voice...'
                        : localized.placeholder
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="saathi-input-field"
                  />

                  {/* Microphone Voice Input */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`saathi-mic-btn${isListening ? ' listening' : ''}`}
                    title={
                      isListening
                        ? 'Stop Recording'
                        : lang === 'hi'
                        ? 'माइक से बोलें'
                        : 'Voice Input (Click to speak)'
                    }
                    aria-label="Voice input"
                  >
                    <MicIcon size={16} />
                  </button>

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="saathi-send-btn"
                    title={lang === 'hi' ? 'भेजें' : 'Send message'}
                    aria-label="Send message"
                  >
                    <SendIcon size={15} />
                  </button>
                </div>

                <div className="saathi-input-footer">
                  <div className="saathi-footer-security">
                    <ShieldCheckIcon size={12} />
                    <span>256-Bit Encrypted • Powered by Sarvam AI</span>
                  </div>
                  <span className="saathi-footer-tag">100% Private</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── FLOATING LAUNCHER BUTTON (WHEN CLOSED) ── */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true)
            setIsMinimized(false)
          }}
          className="saathi-chat-launcher"
          aria-label="Open ClaimSaathi AI Assistant"
        >
          <div className="saathi-launcher-avatar">
            <BotIcon size={20} />
            <span className="saathi-launcher-online-dot" />
          </div>
          <div className="saathi-launcher-texts">
            <div className="saathi-launcher-title-row">
              <span className="saathi-launcher-title">Ask Saathi AI</span>
              <span className="saathi-launcher-tag">Multilingual</span>
            </div>
            <div className="saathi-launcher-desc">
              {localized.badge}
            </div>
          </div>
          <div className="saathi-launcher-sparkle">
            <SparkleIcon size={14} color="#00BAF2" />
          </div>
        </button>
      )}
    </>
  )
}
