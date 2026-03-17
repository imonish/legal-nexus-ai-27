type Mode = "simple" | "professional";

export const getMockResponse = (message: string, mode: Mode): string => {
  const msg = message.toLowerCase();

  if (msg.includes("fir") || msg.includes("fraud") || msg.includes("scam")) {
    return `## 1. 🧠 Case Understanding
You may have been a victim of **online fraud or cyber scam**. This involves unauthorized transactions, phishing, or deception through digital means.

## 2. ⚖️ Legal Classification
| Field | Detail |
|-------|--------|
| **Case Type** | Cyber Crime / Criminal |
| **Severity** | ${mode === "simple" ? "Medium to High" : "High — Financial fraud with digital evidence trail"} |

## 3. 📜 Applicable Laws
- **IT Act, 2000** — Section 66C (Identity Theft), Section 66D (Cheating by Personation)
- **IPC** — Section 420 (Cheating & Dishonesty)
- **Indian Evidence Act** — Section 65B (Electronic Evidence)

## 4. 📋 Step-by-Step Action Plan

**Step 1:** Immediately collect all evidence — screenshots, transaction IDs, bank statements, emails, chat logs

**Step 2:** File a complaint on the **National Cyber Crime Portal** → [cybercrime.gov.in](https://cybercrime.gov.in)

**Step 3:** Call the **Cyber Crime Helpline: 1930** to report financial fraud and request a transaction freeze

**Step 4:** Visit your nearest Police Station and file an **FIR** with printed evidence

**Step 5:** Inform your bank immediately — request reversal/freeze of the transaction

**Step 6:** Save a copy of the FIR and complaint acknowledgment for your records

## 5. 🏛️ Where to File Complaint
| Authority | Details |
|-----------|---------|
| **Primary** | Cyber Crime Cell / Police Station |
| **Online Portal** | [cybercrime.gov.in](https://cybercrime.gov.in) |
| **Helpline** | 1930 (Cyber Crime) |
| **Filing Method** | Online + Physical FIR |
| **Processing Time** | 24–72 hours for acknowledgment |

## 6. 📎 Required Evidence
- Screenshots of fraud communication
- Bank transaction statements
- UPI/Payment app transaction IDs
- Email/SMS records from the fraudster
- Any identity details of the accused
- Witness statements (if applicable)

## 7. 📝 Document Generation
You may need:
- **Cyber Crime Complaint Draft**
- **FIR Application Letter**
- **Bank Fraud Report Letter**

> 💡 *I can generate any of these documents for you. Just ask!*

## 8. ⚠️ Legal Risk Analysis
| Risk | Details |
|------|---------|
| **Evidence Risk** | Digital evidence can be lost — preserve immediately |
| **Time Risk** | Delay reduces chances of fund recovery |
| **Possible Outcomes** | Fund recovery (if reported within 24hrs), FIR registration, accused arrest |
| **Success Rate** | ~60-70% recovery if reported within golden hour |

## 9. 👨‍⚖️ Lawyer Recommendation
| Field | Recommendation |
|-------|---------------|
| **Type** | Cyber Crime Lawyer |
| **Experience** | 3–5 years minimum |
| **Consultation Cost** | ₹1,000 – ₹3,000 |

## 10. 🔍 Lawyer Match

### Adv. Priya Sharma
> **Senior Cyber Crime Lawyer | 8+ Years**
> ⭐ 4.8/5 · 340+ cases · 78% success rate
> 📍 Delhi NCR · ₹2,000 consultation
> ✅ Available Online

### Adv. Rajesh Kumar
> **Cyber & IT Law Specialist | 6 Years**
> ⭐ 4.6/5 · 210+ cases · 74% success rate
> 📍 Mumbai · ₹1,500 consultation
> ✅ Available Online & Offline

### Adv. Meena Iyer
> **Digital Fraud & Banking Law | 10+ Years**
> ⭐ 4.9/5 · 500+ cases · 82% success rate
> 📍 Bangalore · ₹2,500 consultation
> ✅ Available Online

## 11. 🚀 Next Action
**→ File your complaint NOW on [cybercrime.gov.in](https://cybercrime.gov.in)**
**→ Call 1930 immediately for fund freeze**
**→ Ask me to generate your FIR draft or complaint letter**

---
*⚠️ This is AI-generated legal guidance and not a substitute for professional legal advice.*`;
  }

  if (msg.includes("consumer") || msg.includes("product") || msg.includes("defective")) {
    return `## 1. 🧠 Case Understanding
You have a **consumer complaint** — likely involving a defective product, poor service, or unfair trade practice by a seller/company.

## 2. ⚖️ Legal Classification
| Field | Detail |
|-------|--------|
| **Case Type** | Consumer Protection |
| **Severity** | ${mode === "simple" ? "Medium" : "Medium — Product/service dispute with documented proof"} |

## 3. 📜 Applicable Laws
- **Consumer Protection Act, 2019** — Sections 2(6), 35, 69
- **E-Commerce Rules, 2020** (for online purchases)
- **Sale of Goods Act, 1930** — Section 16 (Implied Warranty)

## 4. 📋 Step-by-Step Action Plan

**Step 1:** Gather all proof — purchase receipt, warranty card, product photos, communication with seller

**Step 2:** Send a **written complaint/legal notice** to the seller/company (give 15–30 days to respond)

**Step 3:** File complaint on **Consumer Helpline** → [consumerhelpline.gov.in](https://consumerhelpline.gov.in) or call **1800-11-4000**

**Step 4:** If unresolved, file a formal complaint at the **District Consumer Commission**

**Step 5:** Track your complaint status online

## 5. 🏛️ Where to File Complaint
| Forum | Pecuniary Jurisdiction |
|-------|----------------------|
| **District Commission** | Up to ₹1 Crore |
| **State Commission** | ₹1 Cr – ₹10 Cr |
| **National Commission** | Above ₹10 Crore |
| **Online Portal** | [consumerhelpline.gov.in](https://consumerhelpline.gov.in) |
| **E-Filing** | [edaakhil.nic.in](https://edaakhil.nic.in) |

## 6. 📎 Required Evidence
- Purchase receipt / invoice
- Warranty card
- Product photos showing defect
- Communication with seller (emails, chats)
- Delivery records
- Expert opinion (if applicable)

## 7. 📝 Document Generation
You may need:
- **Consumer Complaint Draft**
- **Legal Notice to Seller**
- **Refund Demand Letter**

> 💡 *I can generate any of these for you!*

## 8. ⚠️ Legal Risk Analysis
| Risk | Details |
|------|---------|
| **Limitation** | Must file within 2 years of cause of action |
| **Evidence Risk** | Keep original receipts and product |
| **Possible Outcomes** | Refund, replacement, compensation + litigation costs |

## 9. 👨‍⚖️ Lawyer Recommendation
| Field | Recommendation |
|-------|---------------|
| **Type** | Consumer Rights Lawyer |
| **Experience** | 2–5 years |
| **Consultation Cost** | ₹500 – ₹2,000 |

## 10. 🔍 Lawyer Match

### Adv. Suresh Menon
> **Consumer Protection Specialist | 7+ Years**
> ⭐ 4.7/5 · 280+ cases · 80% success rate
> 📍 Chennai · ₹1,000 consultation
> ✅ Available Online

### Adv. Anita Desai
> **Consumer & E-Commerce Law | 5 Years**
> ⭐ 4.5/5 · 150+ cases · 76% success rate
> 📍 Pune · ₹800 consultation
> ✅ Available Online & Offline

## 11. 🚀 Next Action
**→ File complaint on [consumerhelpline.gov.in](https://consumerhelpline.gov.in)**
**→ Call 1800-11-4000 (toll-free)**
**→ Ask me to draft your consumer complaint or legal notice**

---
*⚠️ This is AI-generated legal guidance and not a substitute for professional legal advice.*`;
  }

  if (msg.includes("tenant") || msg.includes("rent") || msg.includes("landlord")) {
    return `## 1. 🧠 Case Understanding
You have a **tenant-landlord dispute** — this could involve unfair eviction, rent issues, security deposit, or harassment by landlord.

## 2. ⚖️ Legal Classification
| Field | Detail |
|-------|--------|
| **Case Type** | Civil / Property |
| **Severity** | ${mode === "simple" ? "Medium" : "Medium — Property rights and housing protection"} |

## 3. 📜 Applicable Laws
- **Model Tenancy Act, 2021** — Sections 4, 21, 27
- **State-specific Rent Control Acts**
- **IPC** — Sections 504, 506 (if criminal harassment)
- **Transfer of Property Act, 1882** — Section 108

## 4. 📋 Step-by-Step Action Plan

**Step 1:** Document everything — rent agreement, payment receipts, communication records

**Step 2:** Send a **written notice** to the landlord stating your grievance

**Step 3:** Approach the **Rent Authority / Rent Controller** in your district

**Step 4:** If harassment involved, file a **police complaint** under IPC 504/506

**Step 5:** For eviction disputes, apply for an **injunction** in Civil Court

## 5. 🏛️ Where to File Complaint
| Authority | Details |
|-----------|---------|
| **Primary** | Rent Authority / Rent Controller |
| **Police** | Local Police Station (for harassment) |
| **Court** | Civil Court for injunctive relief |
| **Legal Aid** | District Legal Services Authority |

## 6. 📎 Required Evidence
- Rent agreement / lease deed
- Rent payment receipts / bank transfers
- Communication records with landlord
- Photos/videos of property condition
- Witness statements
- Utility bill records

## 7. 📝 Document Generation
You may need:
- **Legal Notice to Landlord**
- **Complaint to Rent Authority**
- **Police Complaint (if harassment)**

> 💡 *I can generate any of these for you!*

## 8. ⚠️ Legal Risk Analysis
| Risk | Details |
|------|---------|
| **Eviction Risk** | Cannot be evicted without court order |
| **Deposit** | Landlord must refund within stipulated time |
| **Key Rights** | Right to essential services, privacy, fair rent |
| **Possible Outcomes** | Rent adjustment, eviction injunction, compensation |

## 9. 👨‍⚖️ Lawyer Recommendation
| Field | Recommendation |
|-------|---------------|
| **Type** | Property / Civil Lawyer |
| **Experience** | 3–7 years |
| **Consultation Cost** | ₹1,000 – ₹2,500 |

## 10. 🔍 Lawyer Match

### Adv. Vikram Singh
> **Property & Tenant Law Expert | 12+ Years**
> ⭐ 4.8/5 · 400+ cases · 81% success rate
> 📍 Delhi · ₹2,000 consultation
> ✅ Available Online & Offline

### Adv. Lakshmi Nair
> **Civil & Housing Disputes | 6 Years**
> ⭐ 4.6/5 · 180+ cases · 75% success rate
> 📍 Hyderabad · ₹1,200 consultation
> ✅ Available Online

## 11. 🚀 Next Action
**→ Send written notice to your landlord**
**→ Contact Rent Authority in your district**
**→ Ask me to draft a legal notice or complaint**

---
*⚠️ This is AI-generated legal guidance and not a substitute for professional legal advice.*`;
  }

  if (msg.includes("legal notice") || msg.includes("draft") || msg.includes("document")) {
    return `## 1. 🧠 Case Understanding
You need help **drafting a legal document** — this could be a legal notice, FIR application, complaint, or RTI request.

## 2. 📝 Available Document Types

| # | Document | Use Case |
|---|----------|----------|
| 1 | **Legal Notice** | Formal demand before legal action |
| 2 | **FIR Application** | Filing a police complaint |
| 3 | **Consumer Complaint** | Product/service dispute |
| 4 | **RTI Request** | Right to Information query |
| 5 | **Cyber Crime Complaint** | Online fraud/harassment |
| 6 | **Rent Dispute Notice** | Landlord-tenant issues |

## 3. 📋 What I Need From You

To generate your document, please provide:

**Required Information:**
- ✍️ Your full name and address
- 📬 Recipient's name and address
- 📌 Subject of the dispute
- 📝 Brief facts of the case
- ⚖️ Relief/action you're seeking
- ⏰ Time limit for response (usually 15–30 days)

## 4. 📤 Export Options
- 📄 **PDF** — Ready to print and send
- 📝 **Text** — Copy and customize

## 5. 💡 Tips
- Legal notices are typically sent via **Registered Post / Speed Post** for proof of delivery
- Keep a copy for your records
- Follow up if no response within the stipulated period
- A legal notice under **Section 80 CPC** is mandatory before suing the government

## 11. 🚀 Next Action
**→ Tell me which document you need**
**→ Share the details listed above**
**→ I'll generate a professional draft instantly**

---
*⚠️ This is AI-generated legal guidance and not a substitute for professional legal advice.*`;
  }

  // Default response
  return `## 1. 🧠 Case Understanding
I need a bit more information to understand your legal issue and provide the best guidance.

## 2. 📋 To Help You, Please Share:

| # | Information Needed | Why |
|---|-------------------|-----|
| 1 | **What happened?** | To identify the legal category |
| 2 | **When did it happen?** | To check limitation periods |
| 3 | **Where are you located?** | State-specific laws may apply |
| 4 | **Any evidence?** | To assess case strength |
| 5 | **What outcome do you want?** | To recommend the right action |

## 3. 💡 Common Issues I Can Help With

- 🔒 **Cyber Crime** — Online fraud, hacking, identity theft
- 🛒 **Consumer Rights** — Defective products, refund issues
- 🏠 **Property & Rent** — Tenant rights, property disputes
- 👨‍👩‍👧 **Family Law** — Divorce, custody, maintenance
- 💼 **Labour Law** — Workplace harassment, unpaid wages
- 📜 **RTI & Government** — Right to Information requests

## 4. 🛠️ What I Can Do

| Service | Description |
|---------|-------------|
| **Legal Analysis** | Identify case type, laws, and authority |
| **Action Plan** | Step-by-step procedure |
| **Document Draft** | FIR, legal notice, complaints |
| **Lawyer Match** | Find the right lawyer for your case |
| **Risk Analysis** | Potential risks and outcomes |

## 11. 🚀 Next Action
**→ Describe your legal issue in detail**
**→ Or try one of these: "I was scammed online", "I need to file a consumer complaint", "What are my rights as a tenant?"**

---
*⚠️ This is AI-generated legal guidance and not a substitute for professional legal advice.*`;
};
