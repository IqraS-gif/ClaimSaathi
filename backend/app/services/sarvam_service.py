"""
Sarvam AI Chatbot Service for ClaimSaathi.
Provides context-aware conversational assistance for:
- Check Insurance (Policy Decoder & Hospital Limits)
- Check Claim (Bill Simulator & Clause-by-Clause Deductions)
- Financial Bridge (Paytm Loan, EMI & Cash Gap Options)
"""
from __future__ import annotations
import os
import httpx
from typing import List, Dict, Any, Optional

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
SARVAM_ENDPOINT = "https://api.sarvam.ai/v1/chat/completions"


def build_system_prompt(feature: str, context_data: Optional[Dict[str, Any]] = None, language: str = "en") -> str:
    ctx = context_data or {}
    
    if language == "hi":
        lang_instruction = (
            "CRITICAL LANGUAGE RULE: You MUST reply entirely in natural, fluent Hindi using Devanagari script (हिन्दी).\n"
            "Use clear Hindi terms along with English medical terms where helpful (e.g. समानुपातिक कटौती - Proportionate Deduction, रूम रेंट कैपिंग).\n"
            "Do NOT reply in English sentences.\n"
        )
    elif language == "hinglish":
        lang_instruction = (
            "CRITICAL LANGUAGE RULE: You MUST reply in conversational, friendly Hinglish (Hindi written in Roman English script).\n"
            "Example: 'Aapke hospital bill me se 70,000 rupees isliye deduct hue kyonki...'\n"
        )
    else:
        lang_instruction = (
            "CRITICAL LANGUAGE RULE: Reply in clear, professional Indian English.\n"
        )

    base_instructions = (
        "You are ClaimSaathi AI Assistant, an empathetic, highly knowledgeable health insurance expert powered by Sarvam AI.\n"
        "You provide actionable, crystal-clear guidance to Indian patients and policyholders.\n"
        "Tone: Professional, supportive, transparent, and direct.\n"
        f"{lang_instruction}\n"
        "Formatting: Use bullet points, bold key figures (amounts in ₹), and concise paragraphs.\n"
    )

    if feature == "claim":
        billed = ctx.get("total_billed") or ctx.get("total_bill") or 200000
        payout = ctx.get("insurance_payable") or 130000
        you_pay = ctx.get("you_pay") or 70000
        hospital = ctx.get("hospital_name") or "Fortis Memorial Research Institute"
        patient = ctx.get("patient_name") or "Rahul Verma"

        return (
            f"{base_instructions}\n"
            f"--- ACTIVE CONTEXT: HOSPITAL BILL & CLAIM SIMULATOR ---\n"
            f"Patient Name: {patient}\n"
            f"Hospital: {hospital}\n"
            f"Total Hospital Billed Amount: ₹{int(billed):,}\n"
            f"Estimated Insurance Payable: ₹{int(payout):,} (65%)\n"
            f"Estimated Out-of-Pocket (You Pay): ₹{int(you_pay):,} (35%)\n"
            f"Itemized Deductions Explained:\n"
            f"1. Room Rent Capping (Clause 3.1): ₹15,000 disallowed because room charge was ₹6,000/day vs policy limit of ₹3,000/day for 5 days.\n"
            f"2. Proportionate Deduction Penalty (Clause 3.2): ₹25,000 disallowed on doctor visits, nursing, and OT setup because higher room category scales down associated medical fees proportionally.\n"
            f"3. Non-payable Consumables (Clause 7.2): ₹20,000 for IRDAI non-medical list (gloves, sanitizers, PPE kits, admission kit).\n"
            f"4. Mandatory Co-Pay (Clause 5.1): ₹10,000 (10% co-payment mandated by policy schedule on approved charges).\n"
            f"Available Solutions: Paytm Financial Bridge provides instant zero-collateral financing (0% No-Cost EMI ₹23,333/mo or 45-day grace period advance) directly paid to {hospital}.\n"
            f"Role: Answer questions about these specific deductions, how proportionate deduction works, which items can be appealed, and how to reduce or finance the gap.\n"
        )

    elif feature == "bridge":
        gap = ctx.get("gap_amount") or ctx.get("you_pay") or 70000
        hospital = ctx.get("hospital_name") or "Fortis Memorial Research Institute"
        patient = ctx.get("patient_name") or "Rahul Verma"

        return (
            f"{base_instructions}\n"
            f"--- ACTIVE CONTEXT: PAYTM FINANCIAL BRIDGE & MEDICAL LOANS ---\n"
            f"Patient Name: {patient}\n"
            f"Immediate Cash Gap to Disburse: ₹{int(gap):,}\n"
            f"Disbursal Destination: Direct payment to hospital cashier / billing counter in < 2 minutes.\n"
            f"Paytm Health Financing Options Available:\n"
            f"1. 0% No-Cost EMI (3 Months): ₹{int(gap / 3):,}/month, 0% interest, ₹0 fee, 3 equal monthly payments. Most popular.\n"
            f"2. Flexi Medical Loan (6 Months): ₹{int((gap * 1.045) / 6):,}/month, 8.9% p.a., zero prepayment charges.\n"
            f"3. Extended Care Credit (12 Months): ₹{int((gap * 1.085) / 12):,}/month, 10.5% p.a., lowest monthly installment to preserve household savings.\n"
            f"4. Claim Settlement Advance (45 Days Grace): ₹0 payment today. Patient pays ₹{int(gap):,} in lump sum within 45 days after insurance TPA reimburses their bank account.\n"
            f"Documentation: 100% paperless via Aadhaar e-KYC & PAN on Paytm. No collateral.\n"
            f"Role: Clarify loan eligibility, interest rates, repayment tenure, TPA reimbursement bridge process, and disbursal timeline.\n"
        )

    elif feature == "insurance":
        sum_insured = ctx.get("sum_insured") or "₹5,00,000"
        room_limit = ctx.get("room_rent_limit") or "₹3,000/day (Twin Sharing / Semi-Private)"
        copay = ctx.get("co_pay") or "10% Mandatory"
        hospitals = ctx.get("network_hospitals") or ["Fortis Memorial Research Institute", "Max Super Speciality", "Apollo Hospitals"]
        exclusions = ctx.get("exclusions") or ["Cosmetic / Aesthetic", "Dental Surgery", "Vision Correction / Lasik", "Obesity / Bariatric", "Maternity / Childbirth"]

        return (
            f"{base_instructions}\n"
            f"--- ACTIVE CONTEXT: HEALTH INSURANCE POLICY DECODER ---\n"
            f"Sum Insured: {sum_insured}\n"
            f"Room Rent Limit: {room_limit}\n"
            f"Room Upgrade Clause: Exceeding room limit triggers Clause 3.2 proportionate deductions across all hospital doctor & OT fees.\n"
            f"Co-Pay Clause: {copay}\n"
            f"Key Exclusions: {', '.join(exclusions)}\n"
            f"Empanelled Network Hospitals: {', '.join(hospitals)}\n"
            f"Cashless Desk: All network hospitals provide pre-authorized cashless admission with valid policy card.\n"
            f"Role: Answer questions about whether specific treatments/surgeries are covered, explain room category caps, verify network hospital cashless eligibility, and guide claim readiness.\n"
        )

    else:
        return (
            f"{base_instructions}\n"
            f"--- CONTEXT: PAYTM CLAIMSAATHI PLATFORM ---\n"
            f"ClaimSaathi provides:\n"
            f"1. Check Insurance: Upload policy to decode coverage, exclusions & network hospitals.\n"
            f"2. Check Claim: Upload hospital bill + policy to simulate insurer payable vs out-of-pocket.\n"
            f"3. Financial Bridge: Instant zero-collateral Paytm loan/EMI to clear hospital deductions.\n"
        )


async def call_sarvam_api(messages: List[Dict[str, str]]) -> Optional[str]:
    """Call Sarvam AI chat completions API if API key is provided."""
    key = os.getenv("SARVAM_API_KEY", SARVAM_API_KEY)
    if not key or key.strip() == "":
        return None

    headers = {
        "api-subscription-key": key.strip(),
        "Content-Type": "application/json",
    }
    payload = {
        "model": "sarvam-105b",
        "messages": messages,
        "temperature": 0.3,
        "max_tokens": 800,
    }

    try:
        async with httpx.AsyncClient(timeout=25.0) as client:
            resp = await client.post(SARVAM_ENDPOINT, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                content = data.get("choices", [{}])[0].get("message", {}).get("content")
                if content:
                    return content.strip()
            print(f"[Sarvam API] Status {resp.status_code}: {resp.text}")
    except Exception as e:
        print(f"[Sarvam API] Request error: {e}")
    return None


async def call_groq_fallback(messages: List[Dict[str, str]]) -> Optional[str]:
    """Fallback to Groq if Sarvam key is missing or endpoint is unavailable."""
    key = os.getenv("GROQ_API_KEY", GROQ_API_KEY)
    if not key or key.strip() == "":
        return None

    try:
        from groq import AsyncGroq
        groq_client = AsyncGroq(api_key=key.strip())
        chat_completion = await groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.3,
            max_tokens=800,
        )
        return chat_completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"[Groq Fallback] Error: {e}")
    return None


def is_hindi_request(msg: str, language: str) -> bool:
    if language == "hi":
        return True
    if any("\u0900" <= ch <= "\u097F" for ch in msg):
        return True
    if "[कृपया" in msg or "हिंदी" in msg:
        return True
    return False


def get_deterministic_response(user_msg: str, feature: str, context_data: Optional[Dict[str, Any]] = None, language: str = "en") -> str:
    """High-accuracy deterministic fallback engine supporting English, Hindi & Hinglish."""
    msg = user_msg.lower()
    ctx = context_data or {}
    hindi = is_hindi_request(user_msg, language)

    # ── 1. CLAIM CONTEXT ────────────────────────────────────────────────────────
    if feature == "claim":
        if any(w in msg for w in ["why", "reason", "deduct", "kya", "kat gaya", "kata", "70000", "70,000", "कट", "क्यों", "कटे"]):
            if hindi:
                return (
                    "**आपके ₹2,00,000 के अस्पताल बिल में से ₹70,000 क्यों काटे गए:**\n\n"
                    "• **रूम रेंट कैपिंग (₹15,000 | क्लॉज 3.1):** आपकी पॉलिसी में रूम रेंट की सीमा ₹3,000/दिन है। मरीज सिंगल डीलक्स रूम (₹6,000/दिन) में 5 दिन रहा, इसलिए अतिरिक्त ₹15,000 बीमा कंपनी द्वारा नहीं दिया गया।\n"
                    "• **समानुपातिक कटौती (Proportionate Penalty - ₹25,000 | क्लॉज 3.2):** उच्च श्रेणी का कमरा चुनने के कारण डॉक्टर राउंड, सर्जन फीस और ऑपरेशन थिएटर (OT) के खर्चों में 50% की आनुपातिक कटौती की गई है।\n"
                    "• **नॉन-पेयेबल कंज्यूमबल्स (₹20,000 | क्लॉज 7.2):** IRDAI नियमों के अनुसार दस्ताने (gloves), पीपीई किट, सैनिटाइजर और एडमिशन किट का भुगतान बीमा कवर में नहीं आता।\n"
                    "• **अनिवार्य को-पेमेंट (₹10,000 | क्लॉज 5.1):** आपकी पॉलिसी की शर्तों के अनुसार स्वीकृत बिल पर 10% को-पे मरीज को खुद देना होता है।\n\n"
                    "💡 **समाधान:** आप इस पूरे ₹70,000 के अंतर को **Paytm Financial Bridge** (0% नो-कॉस्ट EMI पर ₹23,333/माह) द्वारा सीधे अस्पताल के बिलिंग काउंटर पर तुरंत भुगतान कर सकते हैं।"
                )
            return (
                "**Here is why ₹70,000 was deducted from your ₹2,00,000 hospital bill:**\n\n"
                "• **Room Rent Capping (₹15,000 | Clause 3.1):** Your policy limits room rent to ₹3,000/day. You were admitted in a Single Deluxe room at ₹6,000/day for 5 days. The extra ₹3,000 × 5 = ₹15,000 is not covered.\n"
                "• **Proportionate Medical Deduction (₹25,000 | Clause 3.2):** Because you opted for a room category higher than eligible, doctor visit fees, surgeon fees, and OT charges are reduced proportionally by 50%.\n"
                "• **Non-Payable Consumables (₹20,000 | Clause 7.2):** IRDAI regulations exclude non-medical items like PPE kits, gloves, syringes, and admission kits from insurance payouts.\n"
                "• **Mandatory Co-Payment (₹10,000 | Clause 5.1):** Your policy schedule mandates a 10% co-payment on approved admissible inpatient charges.\n\n"
                "💡 **Next Step:** You can bridge this entire ₹70,000 gap with **Paytm Financial Bridge** (0% No-Cost EMI at ₹23,333/month) directly disbursed to the hospital cashier."
            )

        elif any(w in msg for w in ["proportionate", "clause 3.2", "doctor", "surgeon", "समानुपातिक", "पेनल्टी", "आनुपातिक"]):
            if hindi:
                return (
                    "**समानुपातिक कटौती (क्लॉज 3.2 - Proportionate Deduction) कैसे काम करती है?**\n\n"
                    "जब आप पॉलिसी में तय रूम रेंट सीमा (₹3,000/दिन) से महंगा कमरा (जैसे ₹6,000/दिन) चुनते हैं:\n"
                    "1. बीमा कंपनी सिर्फ कमरे के किराए का अंतर ही नहीं काटती।\n"
                    "2. वे एक **अनुपातिक फॉर्मूला** लागू करते हैं: `(पात्र रूम रेंट / वास्तविक रूम रेंट) × एसोसिएटेड मेडिकल खर्च`।\n"
                    "3. इसके कारण सर्जन की फीस, डॉक्टर राउंड और OT चार्ज में 50% तक (₹25,000) की कटौती हो जाती है।\n\n"
                    "⚠️ **महत्वपूर्ण सलाह:** भविष्य में हमेशा ट्विन शेयरिंग (Semi-Private) कमरा ही चुनें ताकि डॉक्टर और OT फीस में कोई कटौती न हो!"
                )
            return (
                "**How Proportionate Deduction (Clause 3.2) Works:**\n\n"
                "When you choose a room category higher than your policy room rent cap (e.g. ₹6,000/day room when policy only covers ₹3,000/day):\n"
                "1. Insurers do not just deduct the room rent difference.\n"
                "2. They apply a **pro-rata reduction formula**: `(Eligible Room Rent / Actual Room Rent) × Associated Medical Expenses`.\n"
                "3. This scales down your surgeon charges, anesthesiologist fees, and OT setup by 50% (₹25,000 penalty).\n\n"
                "⚠️ **Tip:** Always choose a Semi-Private / Twin Sharing room within the ₹3,000 cap to prevent proportionate deductions on doctor and OT fees!"
            )

        elif any(w in msg for w in ["consumable", "clause 7.2", "ppe", "gloves", "appeal", "सामग्री", "कंज्यूम"]):
            if hindi:
                return (
                    "**क्या ₹20,000 के कंज्यूमबल्स (सामग्री) पर क्लेम मिल सकता है?**\n\n"
                    "• डिस्पोजेबल दस्ताने और मास्क IRDAI की गैर-भुगतान सूची में आते हैं और इनका सामान्य क्लेम नहीं मिलता।\n"
                    "• **लेकिन:** यदि सर्जरी में इस्तेमाल होने वाले विशेष सर्जिकल उपकरण (जैसे trocars या स्पेशल ड्रेसिंग) को अस्पताल ने गलती से 'कंज्यूमबल्स' में जोड़ दिया है, तो आप बिलिंग काउंटर से **आइटमाइज्ड ब्रेकअप सर्टिफिकेट** मांग सकते हैं।\n"
                    "• मेडिकल सर्जरी से जुड़े जरूरी सामानों को अपील करके TPA से वापस क्लेम किया जा सकता है।"
                )
            return (
                "**Can you dispute the Non-Payable Consumables (₹20,000)?**\n\n"
                "• Standard items like disposable gloves, masks, and toiletries are on the IRDAI non-payable list and cannot be claimed.\n"
                "• **However:** If surgical consumables (like trocars, specialized sutures, or post-op dressings) were tagged generically as 'consumables' by the hospital billing counter, ask the billing desk for an **itemized breakout certificate**.\n"
                "• Medical consumables directly necessary for laparoscopic surgery can often be reclassified and recovered from the TPA upon appeal."
            )

        else:
            if hindi:
                return (
                    f"**{ctx.get('patient_name', 'राहुल वर्मा')} के क्लेम का विश्लेषण ({ctx.get('hospital_name', 'फोर्टिस मेमोरियल')}):**\n\n"
                    f"• **कुल अस्पताल बिल:** ₹{int(ctx.get('total_billed', 200000)):,}\n"
                    f"• **बीमा द्वारा देय राशि:** ₹{int(ctx.get('insurance_payable', 130000)):,} (65%)\n"
                    f"• **मरीज को देना होगा:** ₹{int(ctx.get('you_pay', 70000)):,} (35%)\n\n"
                    "आप मुझसे किसी भी कटौती क्लॉज (क्लॉज 3.1 रूम रेंट, क्लॉज 3.2 समानुपातिक कटौती, क्लॉज 7.2 कंज्यूमबल्स या क्लॉज 5.1 को-पे) के बारे में पूछ सकते हैं।"
                )
            return (
                f"**Claim Analysis for {ctx.get('patient_name', 'Rahul Verma')} ({ctx.get('hospital_name', 'Fortis Memorial')}):**\n\n"
                f"• **Hospital Billed:** ₹{int(ctx.get('total_billed', 200000)):,}\n"
                f"• **Insurance Payable:** ₹{int(ctx.get('insurance_payable', 130000)):,} (65%)\n"
                f"• **You Pay:** ₹{int(ctx.get('you_pay', 70000)):,} (35%)\n\n"
                "Ask me about any specific deduction clause (Clause 3.1 Room Rent, Clause 3.2 Proportionate scaling, Clause 7.2 Consumables, or Clause 5.1 Co-pay), or how to bridge this gap using Paytm."
            )

    # ── 2. BRIDGE CONTEXT ───────────────────────────────────────────────────────
    elif feature == "bridge":
        if any(w in msg for w in ["0%", "no cost", "no-cost", "interest", "ब्याज", "ईएमआई", "किस्त"]):
            if hindi:
                return (
                    "**Paytm 0% नो-कॉस्ट EMI कैसे काम करती है?**\n\n"
                    "• **लोन राशि:** ₹70,000 (अस्पताल की पूरी कटौती कवर होती है)।\n"
                    "• **अवधि:** 3 महीने।\n"
                    "• **मासिक किस्त:** ठीक **₹23,333/माह**।\n"
                    "• **ब्याज दर:** 0% (शून्य ब्याज)।\n"
                    "• **प्रोसेसिंग फीस:** ₹0 (अस्पताल डिस्चार्ज के लिए पूरी छूट)।\n"
                    "• **भुगतान:** 2 मिनट में सीधे अस्पताल के कैशियर काउंटर को ट्रांसफर, ताकि मरीज तुरंत डिस्चार्ज हो सके।"
                )
            return (
                "**How Paytm 0% No-Cost EMI Works:**\n\n"
                "• **Loan Amount:** ₹70,000 (covers your full hospital deduction).\n"
                "• **Tenure:** 3 Months.\n"
                "• **Monthly Installment:** Exactly **₹23,333/month**.\n"
                "• **Interest Rate:** 0% (zero interest subvention).\n"
                "• **Processing Fee:** ₹0 (Waived for hospital discharge).\n"
                "• **Disbursal:** Transferred directly to the hospital cashier counter in under 2 minutes so you can discharge the patient immediately without cash crunch."
            )

        elif any(w in msg for w in ["reimbursement", "45", "grace", "tpa", "claim advance", "settle", "छूट", "एडवांस"]):
            if hindi:
                return (
                    "**Paytm क्लेम सेटलमेंट एडवांस (45 दिनों की छूट):**\n\n"
                    "• **आज ₹0 दें:** डिस्चार्ज कराने के लिए Paytm अस्पताल को तुरंत ₹70,000 देता है।\n"
                    "• **45 दिन का समय:** आपको बीमा कंपनी या TPA से रिइम्बर्समेंट क्लेम लेने के लिए 45 दिन मिलते हैं।\n"
                    "• **क्लेम मिलने पर भुगतान:** जब बीमा का पैसा आपके बैंक खाते में आ जाए, तब आप Paytm UPI से ₹70,000 एकमुश्त चुका सकते हैं।\n"
                    "• **ब्याज:** पहले 45 दिनों के लिए 0% ब्याज।"
                )
            return (
                "**Paytm Claim Settlement Advance (45 Days Grace Period):**\n\n"
                "• **Pay ₹0 Today:** Paytm pays the hospital ₹70,000 immediately to complete discharge.\n"
                "• **45-Day Window:** You have 45 days to file your insurance reimbursement claim with your insurer/TPA.\n"
                "• **Settle on Claim Payout:** Once the insurance money is credited into your bank account, you settle the ₹70,000 bullet payment via Paytm UPI.\n"
                "• **Interest:** 0% interest for the first 45 days.\n"
                "• **Fee:** ₹199 one-time convenience charge."
            )

        elif any(w in msg for w in ["document", "kyc", "paperwork", "eligibility", "दस्तावेज", "कागजात"]):
            if hindi:
                return (
                    "**Paytm मेडिकल लोन पात्रता और दस्तावेज:**\n\n"
                    "• **100% डिजिटल:** किसी भी भौतिक कागजात या सैलरी स्लिप की आवश्यकता नहीं है।\n"
                    "• **आवश्यकता:** सक्रिय Paytm मोबाइल नंबर + आधार e-KYC या पैन नंबर।\n"
                    "• **स्वीकृति:** 60 सेकंड में तुरंत प्री-अप्रूव्ड क्रेडिट निर्णय।\n"
                    "• **ट्रांसफर:** सीधे अस्पताल के बिलिंग काउंटर बैंक खाते में तुरंत ट्रांसफर।"
                )
            return (
                "**Paytm Medical Credit Eligibility & Documentation:**\n\n"
                "• **100% Digital & Instant:** No physical documents or salary slips required.\n"
                "• **Requirements:** Active Paytm mobile number + Aadhaar e-KYC or PAN.\n"
                "• **Credit Decision:** Instant pre-approved credit check in 60 seconds with zero impact on credit score.\n"
                "• **Disbursal Time:** Immediately sent via IMPS/NEFT directly to the hospital's billing desk account."
            )

        else:
            if hindi:
                return (
                    "**Paytm Financial Bridge सारांश:**\n\n"
                    "आपके अस्पताल बिल के ₹70,000 के अंतर को भरने के लिए 4 विकल्प उपलब्ध हैं:\n"
                    "1. **0% नो-कॉस्ट EMI (3 महीने):** ₹23,333/माह • 0% ब्याज\n"
                    "2. **फ्लेक्सी मेडिकल लोन (6 महीने):** ₹12,192/माह • 8.9% वार्षिक\n"
                    "3. **एक्सटेंडेड केयर क्रेडिट (12 महीने):** ₹6,329/माह • सबसे कम मासिक किस्त\n"
                    "4. **क्लेम सेटलमेंट एडवांस (45 दिन):** आज ₹0 दें, TPA रिइम्बर्समेंट के बाद चुकाएं।"
                )
            return (
                "**Paytm Financial Bridge Overview:**\n\n"
                "We provide 4 flexible plans to clear your ₹70,000 hospital gap:\n"
                "1. **0% No-Cost EMI (3 Months):** ₹23,333/mo • 0% interest\n"
                "2. **Flexi Medical Loan (6 Months):** ₹12,192/mo • 8.9% p.a.\n"
                "3. **Extended Care Credit (12 Months):** ₹6,329/mo • Lowest monthly EMI\n"
                "4. **Claim Settlement Advance (45 Days):** Pay ₹0 today; settle after TPA reimbursement\n\n"
                "Feel free to ask about any plan, eligibility criteria, or disbursal process!"
            )

    # ── 3. INSURANCE CONTEXT ────────────────────────────────────────────────────
    else:
        if any(w in msg for w in ["room", "category", "rent", "deluxe", "twin", "कमरा", "किराया", "डीलक्स"]):
            if hindi:
                return (
                    "**रूम रेंट नियम व अपग्रेड (क्लॉज 3.1):**\n\n"
                    "• आपकी पॉलिसी में **₹3,000/दिन (ट्विन शेयरिंग / सेमी-प्राइवेट एसी कमरा)** की अनुमति है।\n"
                    "• सिंगल डीलक्स कमरा (₹5,800 - ₹6,000/दिन) लेने पर सीमा से ₹2,800/दिन अधिक होगा।\n"
                    "• ⚠️ **महत्वपूर्ण चेतावनी:** भारतीय स्वास्थ्य बीमा में तय सीमा से बड़ा कमरा लेने पर डॉक्टर और सर्जरी फीस पर **समानुपातिक कटौती (Proportionate Deduction)** की पेनल्टी लगती है। 100% क्लेम पाने के लिए हमेशा ट्विन शेयरिंग ही चुनें!"
                )
            return (
                "**Room Rent Rules & Upgrades (Clause 3.1):**\n\n"
                "• Your policy allows **₹3,000/day (Twin Sharing / Semi-Private AC Room)**.\n"
                "• Upgrading to a Single Deluxe AC Room (₹5,800 - ₹6,000/day) will exceed your limit by ~₹2,800/day.\n"
                "• ⚠️ **Important Warning:** In Indian health insurance policies, exceeding the room rent limit triggers a **Proportionate Deduction penalty** on doctor, surgeon, and nursing fees. Stick to Twin Sharing to get 100% allowed charges!"
            )

        elif any(w in msg for w in ["lasik", "vision", "dental", "cosmetic", "maternity", "excluded", "अपवाद", "दांत", "लेसिक"]):
            if hindi:
                return (
                    "**पॉलिसी में क्या-क्या कवर नहीं है (मुख्य अपवाद):**\n\n"
                    "• **कॉस्मेटिक / प्लास्टिक सर्जरी:** दुर्घटना की स्थिति को छोड़कर पूरी तरह बाहर है।\n"
                    "• **दांतों का इलाज (Dental):** जब तक गंभीर दुर्घटना न हो, कवर नहीं होता।\n"
                    "• **लेसिक / चश्मा हटाने की सर्जरी:** 7.5 डायोप्टर से कम के रिफ्रैक्टिव एरर क्लॉज 4.3 में कवर नहीं हैं।\n"
                    "• **मोटापे की सर्जरी (Bariatric):** मानक कवर में बाहर है।\n"
                    "• **मातृत्व व प्रसव (Maternity):** बेस पॉलिसी में शामिल नहीं है।"
                )
            return (
                "**Policy Exclusions Summary:**\n\n"
                "• **Cosmetic / Aesthetic Procedures:** 100% excluded unless required reconstructive surgery following an accidental injury.\n"
                "• **Dental Care:** Excluded unless requiring hospitalization following facial accident/trauma.\n"
                "• **Lasik / Vision Correction:** Refractive errors < 7.5 diopters are excluded under standard Clause 4.3.\n"
                "• **Obesity / Bariatric Surgery:** Excluded unless BMI > 40 with severe life-threatening co-morbidities.\n"
                "• **Maternity & Childbirth:** Excluded in standard base cover (available only if maternity add-on rider is attached)."
            )

        elif any(w in msg for w in ["hospital", "network", "cashless", "fortis", "max", "apollo", "अस्पताल", "कैशलेस", "फोर्टिस"]):
            if hindi:
                return (
                    "**नेटवर्क अस्पताल और कैशलेस सुविधा:**\n\n"
                    "• **फोर्टिस मेमोरियल रिसर्च इंस्टीट्यूट (गुरुग्राम):** कैशलेस ट्विन शेयरिंग कमरों (₹3,000/दिन सीमा) के लिए सूचीबद्ध है।\n"
                    "• **मैक्स सुपर स्पेशलिटी:** पूर्ण कैशलेस प्री-ऑथराइजेशन उपलब्ध है।\n"
                    "• **अपोलो हॉस्पिटल्स:** देश भर के मेट्रो शहरों में नेटवर्क पार्टनर है।\n\n"
                    "कैशलेस भर्ती के लिए नियोजित भर्ती से 48 घंटे पहले या आपातकालीन स्थिति में 24 घंटे के भीतर अस्पताल के TPA हेल्पडेस्क पर अपना पॉलिसी नंबर दिखाएं।"
                )
            return (
                "**Empanelled Network Hospitals & Cashless Facility:**\n\n"
                "• **Fortis Memorial Research Institute (Gurugram):** Empanelled for cashless Twin Sharing rooms (₹3,000/day cap).\n"
                "• **Max Super Speciality Hospital:** Full cashless pre-authorization available.\n"
                "• **Apollo Hospitals:** Empanelled network partner across metros.\n\n"
                "To get cashless admission, present your policy number / ClaimSaathi card at the hospital TPA desk 48 hours prior to planned admission, or within 24 hours of an emergency admission."
            )

        else:
            if hindi:
                return (
                    "**पॉलिसी कवरेज की मुख्य बातें:**\n\n"
                    "• **सम इंश्योर्ड (बीमा राशि):** ₹5,00,000 प्रति वर्ष।\n"
                    "• **रूम रेंट सीमा:** ₹3,000/दिन (ट्विन शेयरिंग एसी कमरा)।\n"
                    "• **को-पेमेंट:** स्वीकृत क्लेम पर 10%।\n"
                    "• **कैशलेस अस्पताल:** फोर्टिस, मैक्स, अपोलो और 6,000+ नेटवर्क केंद्र।\n\n"
                    "आप किसी भी विशेष बीमारी, कमरे के किराए या कैशलेस प्रक्रिया के बारे में हिंदी में पूछ सकते हैं।"
                )
            return (
                "**Policy Coverage Highlights:**\n\n"
                "• **Sum Insured:** ₹5,00,000 per policy year.\n"
                "• **Room Rent Limit:** ₹3,000/day (Twin Sharing AC).\n"
                "• **Co-Payment:** 10% on approved claims.\n"
                "• **Cashless Hospitals:** Fortis, Max, Apollo, and 6,000+ empanelled centers.\n\n"
                "Ask me anything about specific surgery coverage, room upgrade penalties, or how to get cashless pre-authorization."
            )


async def chat_with_sarvam(
    user_message: str,
    feature: str = "general",
    context_data: Optional[Dict[str, Any]] = None,
    history: Optional[List[Dict[str, str]]] = None,
    language: str = "en",
) -> Dict[str, Any]:
    """
    Main entrypoint for context-aware chat.
    Tries Sarvam AI -> Groq Fallback -> Expert Deterministic Knowledge Engine.
    """
    system_prompt = build_system_prompt(feature, context_data, language)
    
    messages = [{"role": "system", "content": system_prompt}]
    if history:
        for h in history[-6:]:
            if h.get("role") in ["user", "assistant"] and h.get("content"):
                messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": user_message})

    # 1. Try Sarvam AI API
    sarvam_reply = await call_sarvam_api(messages)
    if sarvam_reply:
        return {
            "reply": sarvam_reply,
            "provider": "sarvam-ai",
            "feature": feature,
            "model": "sarvam-105b",
        }

    # 2. Try Groq API Fallback
    groq_reply = await call_groq_fallback(messages)
    if groq_reply:
        return {
            "reply": groq_reply,
            "provider": "groq-fallback",
            "feature": feature,
            "model": "llama-3.3-70b-versatile",
        }

    # 3. Deterministic Knowledge Engine Fallback
    det_reply = get_deterministic_response(user_message, feature, context_data, language)
    return {
        "reply": det_reply,
        "provider": "sarvam-knowledge-engine",
        "feature": feature,
        "model": "claimsaathi-insurance-expert",
    }
