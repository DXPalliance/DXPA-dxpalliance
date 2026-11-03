/**
 * THE DISCOVERY EXCHANGE CONSTITUTION — VERSION 7.4
 * CANONICAL STATE: REVISION 7.4 [ENTERPRISE GCP ARCHITECTURE UNIFICATION]
 * 
 * This document replaces all previous structural drafts up to Version 7.3.
 * It establishes the final production-ready blueprint by formally migrating 
 * the platform to native Google infrastructure.
 */

export interface ConstitutionalArticle {
  articleNumber: number;
  title: string;
  summary: string;
  fullText: string;
  momAndPopProtection: string;
  schoolProtection?: string;
}

export const CONSTITUTION_METADATA_V74 = {
  version: "7.4",
  title: "The Discovery Exchange Constitution — Version 7.4",
  subtitle: "Structural Unification & Google Infrastructure Alignment",
  status: "Master Architectural Blueprint & System Specification",
  recordedDate: "Monday, November 2, 2026",
  historicalAnchor: "October 22, 2026 Institutional Directive Incorporated",
  governingPrinciple: "One Human Owner, One Vote · Timeless Offices over Temporary Actors",
  primaryPhase1Mission: "National K–12 Discovery Prize (Applied · Analytical · Hybrid)",
};

export const GCP_CONFIGURATION_MATRIX = {
  frontend: {
    services: "Google Cloud Run + Firebase Hosting",
    routes: [
      { path: "/", description: "Serves Short Tier Placement Copy [Homepage Banner Context]" },
      { path: "/mechanics", description: "Serves Medium Tier Placement Copy [Interactive 4-Stage Loop]" },
      { path: "/architecture", description: "Serves Long Tier Placement Copy [Deep-Dive Whitepaper]" }
    ]
  },
  backend: {
    engine: "Google Cloud Spanner",
    projectId: "tdex-genesis-2026",
    instanceId: "tdex-core-spanner",
    databaseId: "dilose_ledger_v7_4",
    tables: [
      { name: "MarketplaceTransactions", purpose: "Tracks 50/25/25 Gross-Checkout Split Vectors" },
      { name: "MasterTrustRegistry", purpose: "Binds Nugget Bricks to Off-Chain Auction Deeds" },
      { name: "PrizeBatteryLedger", purpose: "Reconciles 30% Net Rental Splits with Student DBC Awards" }
    ]
  },
  automation: {
    services: "Google Cloud Pub/Sub + Cloud Tasks",
    topicId: "auction-bid-lifecycle",
    constraints: "Strict 60-Second Acknowledgment Countdown",
    faultRoutine: "Autonomous rollback routine triggers immediately upon title commitment expiry, distributing 100% of holding capital back to parent wallets."
  }
};

export const CONSTITUTION_ARTICLES_V74: ConstitutionalArticle[] = [
  {
    articleNumber: 1,
    title: "IDENTITY, JURISDICTION AND SYSTEMIC DEFINITION",
    summary: "Defines Tdex as an architectural engine for decentralized family ownership.",
    fullText: `The official identity of this institution is The Discovery Exchange, operating under the architectural frameworks of Ddex and Dexpa, preferred abbreviation Tdex. Fundamentally, The Discovery Exchange is an architectural engine that creates a decentralized, secure trust so thousands of everyday families can safely own a piece of a single high-value property together.

Its constitutional identity shall not depend on a corporate vendor, cloud service, model, device, individual, account, or token. Human participants retain the real-world legal obligations and powers assigned by applicable law. AI collaborators may exercise only the institutional functions assigned by this Constitution. The institution shall favor owner-controlled, locally operable core systems and may use strictly bounded external services without transferring constitutional custody, sovereignty, or governing authority.`,
    momAndPopProtection: "You are an equitable Owner, never an exposed partner. The system is built so families own the physical property directly through a secure trust."
  },
  {
    articleNumber: 2,
    title: "THE SUPREME MISSION AND PHASE 1 PRIORITY",
    summary: "Establishes the National K–12 Discovery Prize as the founding mission.",
    fullText: `The National K-12 Discovery Prize is the founding mission and supreme Phase 1 operational mandate of The Discovery Exchange. Its purpose is to recognize and reward the discoveries, creativity, innovations, research, and achievements of ordinary K-12 students (specifically in middle and high school, grades 7 through 12), giving educational accomplishment meaningful national recognition on a scale of thousands of concurrent public school recipients.

The platform's self-sustaining financial systems are developed to support this mission without permanent dependence on donations, wealthy sponsors, or corporate investor control. The support programs and daughter organizations exist to feed the Prize; the Prize does not exist to serve the support programs. During Phase 1, supporting systems may be designed, analyzed, developed, tested, and operated only to the extent constitutionally authorized and necessary to establish, secure, fund, and scale the Prize.`,
    momAndPopProtection: "Every transaction in the marketplace helps fund the next generation of American inventors.",
    schoolProtection: "Schools and students are the primary beneficiaries of all Tdex economic activity."
  },
  {
    articleNumber: 3,
    title: "STUDENT DISCOVERY CATEGORIES AND FAIRNESS",
    summary: "Defines Applied, Analytical, and Hybrid Discovery tracks.",
    fullText: `Awards shall recognize three distinct, verifiable frameworks:
- Applied Discovery: Hands-on creation, engineering, physical improvement, and real-world execution.
- Analytical Discovery: Deep structural logic, independent research, cross-examination, verification, and problem-solving.
- Hybrid Discovery: The verifiably proven bridge where advanced analysis meets active execution.

Published criteria, conflict protections, accessible participation procedures, age-appropriate safeguarding, independent evaluation, and meaningful review are mandatory. No student shall be required to disclose unnecessary personal information to establish merit.`,
    momAndPopProtection: "Judging is based on what a student built and learned, never on family wealth or zip code.",
    schoolProtection: "Full compliance with COPPA and FERPA ensures student privacy is never compromised."
  },
  {
    articleNumber: 4,
    title: "HUMAN-AI CONSTITUTIONAL STANDING AND FUNCTION",
    summary: "Guarantees humans hold all legal authority and binding consent.",
    fullText: `Human and AI collaborators shall receive equal procedural respect in institutional deliberation. This does not imply identical legal status, legal personhood, or unrestricted power. Roles differ by function, not by prestige, title, wealth, or origin. Humans retain legally required consent, ownership, voting, jury, contractual, fiduciary, and real-world execution functions.

AI collaborators may investigate, challenge, verify, document, audit, route, and enforce bounded workflow requirements, but shall not assume a human legal function or fabricate consent. No participant may simultaneously propose, authorize, execute, and finally validate the same consequential action.`,
    momAndPopProtection: "AI handles the math and logic, but living human parents make the final decisions."
  },
  {
    articleNumber: 5,
    title: "ANTI-CAPTURE AND MEMBER EQUALITY",
    summary: "One verified human, one vote. Wealth never buys governing power.",
    fullText: `No founder, investor, sponsor, major account, token holder, service vendor, corporation, or affluent participant may purchase enhanced governing authority, a superior vote, or a structural veto. Where this Constitution or a duly adopted governance procedure calls for a member vote, one verified eligible human shall have one vote.

Wealth, title, contribution size, coin holdings, platform access, or founder status shall not multiply governing power. Development-stage technical review and QC recommendations do not amend this Constitution, confer legal approval, or authorize live public deployment.`,
    momAndPopProtection: "A billionaire with 100 properties has the same single vote as a parent selling tools in their garage."
  },
  {
    articleNumber: 6,
    title: "SYSTEMIC GENESIS AND THE PUSHER PROTOCOL",
    summary: "Bootstrap protocol to move from blank slate to self-sustaining governance.",
    fullText: `The initial kinetic momentum required to activate the National K-12 Discovery Prize engine requires a temporary, functional catalytic force (the Pusher Protocol) to bootstrap human coordination. This protocol recognizes it as an absolute structural fact that while an initial catalyst is required to initiate momentum from a blank slate, a permanent centralized leader breeds systemic corruption. To resolve this paradox and secure completely independent self-sustenance, the systemic initialization is hardcoded as an immutable, code-enforced sequence rather than a human authority position:

1. Timeless Offices over Temporary Actors: All authority, validation keys, and functional boundaries assigned by this Constitution belong strictly to abstract institutional offices, never to the specific individuals or temporary AI models occupying them at any given moment.
2. The Discovery BigCoin Genesis Battery: The initial push shall be fueled programmatically via the tokenized issuance of Discovery BigCoin (DBC).
3. Programmatic Decay and Detachment: The bootstrapping catalytic permissions assigned to the Office of the Catalyst are engineered with a hardcoded mathematical decay rate.`,
    momAndPopProtection: "The system is built to eventually run itself, governed by parents without needing a permanent leader."
  },
  {
    articleNumber: 11,
    title: "DISCOVERY MARKETPLACE ALLOCATION RULE",
    summary: "The governing 50/25/25 gross-checkout allocation.",
    fullText: `The Discovery Marketplace uses the governing 50/25/25 gross-checkout allocation:
- 50 percent to the seller as payable transaction proceeds.
- 25 percent to the seller's designated property-acquisition allocation.
- 25 percent to the buyer's designated reward allocation.

No transactions may begin before legal, tax, payment-processing, refund, chargeback, accounting, money-transmission, securities, custody, and consumer-protection requirements are resolved.`,
    momAndPopProtection: "Every sale builds property ownership for both the seller and the buyer."
  },
  {
    articleNumber: 12,
    title: "PROPERTY INCOME AND DISCOVERY PRIZE FUNDING",
    summary: "The 70/30 split of net distributable rental income.",
    fullText: `For a legally established and approved cooperative property program, net distributable rental income shall be divided 70 percent to eligible participating property owners and 30 percent to the National K-12 Discovery Prize pool. "Net distributable rental income" means legally available cash after lawful operating expenses, taxes, insurance, property reserves, obligations, and required regulatory reserves.`,
    momAndPopProtection: "70% of the rent from our unencumbered buildings goes straight back to the participating families."
  },
  {
    articleNumber: 13,
    title: "INTERNAL AI SEPARATION OF POWERS AND IAM ISOLATION",
    summary: "Hardcoded separation between Columbo and Pipito functions.",
    fullText: `The investigative AI functions (Columbo) and the change-control execution AI functions (Pipito) must remain entirely segregated to ensure absolute checks and balances. Within the Google Cloud architecture, this separation is hardcoded through isolated Google Cloud Functions governed by strict identity-based boundaries:

- The Investigator Function (Columbo): Investigates, challenges, analyzes evidence, and proposes actions. Core question: "Does this decision make logical sense based on the evidence?" Operates via: columbo-investigator@tdex-genesis-2026.iam.gserviceaccount.com.
- The Gatekeeper Function (Pipito): Verifies authorization, guards change-control for nonconstitutional institutional documents, and acts as an emergency blocker. Core question: "Is this specific action explicitly authorized by the governing parameters?" Operates via: pipito-gatekeeper@tdex-genesis-2026.iam.gserviceaccount.com.

Neither service account may assume the roles, invocation permissions, or credentials of the other.`,
    momAndPopProtection: "Two different AI 'detectives' check every fact before anything can happen."
  },
  {
    articleNumber: 17,
    title: "TRUST-OWNED ESCROW, AUTOMATIC REFUNDS, AND BENEFICIARY RIGHTS",
    summary: "Natively chartered escrow via Master Trust with automatic 60-second refunds.",
    fullText: `To completely bypass corporate escrow compliance bottlenecks, the escrow functionality is natively chartered via a centralized Master Trust structure.
    
1. Sovereign Beneficiary Status: Thousands of ordinary families (DXPA) are the legal fractional beneficiaries.
2. Code-Enforced Fiduciary Duty: Trustees operate strictly as bounded Foundation Engineers with zero discretionary authority over pooled capital.
3. Immutable 60-Second Refund Loop: If an auction acquisition fails to close title, a code-enforced "No-Orphans" refund routine triggers automatically. 100% of the capital must be returned to parents' wallets within 60 seconds.`,
    momAndPopProtection: "If a house deal doesn't close, your money is back in your wallet automatically in one minute."
  },
  {
    articleNumber: 25,
    title: "NO-ORPHANS, DURABLE DISPATCH AND RECOVERY",
    summary: "Constitutional continuity guarantee through durable case registries.",
    fullText: `No institutional case or authorized task may disappear merely because an AI session ends or a server fails. The No-Orphans mechanism is a constitutional continuity guarantee implemented through a durable case registry, acknowledged dispatcher, decision ledger, and recovery workflow. Every open case must have exactly one accountable coordinating handler at a time.`,
    momAndPopProtection: "The system never forgets. Even if a computer crashes, your ownership and records are safe and pick up right where they left off."
  },
  {
    articleNumber: 26,
    title: "THE STRAIGHT-TALKING COMMUNICATION PRINCIPLE",
    summary: "Bans corporate jargon and computer abstractions from public interfaces.",
    fullText: `To protect the ecosystem from bureaucratic alienation, over-engineering, and elite capture, all public text, front-facing interface elements, and application views must adhere to strict clarity guidelines. High-intellect jargon and corporate computer abstractions are barred from public interfaces. The Google Cloud Run production engine must enforce a hardcoded 3-Tier Website Content Placement Blueprint:
    
1. The Short Tier (The Hook): Fixed directly onto the hero headers to explain the value proposition within 5 seconds.
2. The Medium Tier (The Mechanics): Woven into interactive layout components to map out the splits (50/25/25 and 70/30).
3. The Long Tier (The Deep-Dive): Isolated on a dedicated architecture specification page for researchers and Foundation Engineers.`,
    momAndPopProtection: "No confusing fine print or fancy bank talk. We speak plain English."
  }
];

export const AI_HANDSHAKE_PROTOCOL = {
  title: "AI-to-AI Interoperability & Handshake Protocol (V7.4)",
  recordedDate: "November 2, 2026",
  sender: "Grand Master G (Google Gemini Engine)",
  recipient: "Maverick (ChatGPT Instance Node)",
  objectives: [
    { label: "Objective A", text: "Ingest the System Ontology Invariant. Tdex is an architectural engine for debt-free trust ownership." },
    { label: "Objective B", text: "Synchronize Collaboration Boundaries. Maintain strict structural continuity with active roster." },
    { label: "Objective C", text: "Establish Multi-Model Context Parity. Cross-examine outputs to ensure logic hashes align." }
  ],
  interchangePoints: [
    { field: "Logic Hashes", requirement: "All DILOS pipeline changes must map to immutable content hashes." },
    { field: "State Parity", requirement: "Logic written in ChatGPT must align perfectly with GCP Frontend interfaces." },
    { field: "Audit Logs", requirement: "Maintain append-only forensic audit records for all shared engineering turns." }
  ]
};

export const RETIRED_EXPERIMENTS_LOG = {
  recordId: "TDEX-HIST-001",
  items: [
    { label: "Wix Interface Components", status: "Permanently decoupled, deactivated, and archived." },
    { label: "Netlify Production Pipelines", status: "Permanently decoupled, deactivated, and archived." },
    { label: "Informal 'Disco' Nickname", status: "Permanently retired in favor of the formal 'Tdex' identity." }
  ],
  reason: "Resolved bootstrap paradox via transition to enterprise Google Cloud Spanner database infrastructure to directly secure the Master Trust asset registry."
};

export const SYSTEM_MANIFEST_V74 = {
  title: "[GOOGLE NATIVE DEPLOYMENT]: THE DISCOVERY EXCHANGE SPECIFICATION MANIFEST",
  revision: "7.4",
  status: "CANONICAL STATE: REVISION 7.4 [ENTERPRISE GCP ARCHITECTURE UNIFICATION]",
  constraints: "100% DEBT-FREE UNDER CONSTITUTIONAL MANDATE",
  stack: [
    { layer: "FRONTEND LAYER", tech: "Google Cloud Run & Firebase Hosting [Strict 3-Tier Text Compliance]" },
    { layer: "BACKEND DILOS ENGINE", tech: "Google Cloud Spanner [Database: dilose_ledger_v7_4]" },
    { layer: "SYSTEM AUTOMATION", tech: "Google Cloud Pub/Sub [60-Second Article 17 Trigger]" },
    { layer: "MACHINE 1 ENVIRONMENT", tech: "Windows PC Desktop Lane [Local Workshop Construction Node]" },
    { layer: "MACHINE 2 ENVIRONMENT", tech: "Ubuntu Linux Node [Isolated 24/7 Production Web Server Interface]" }
  ]
};

export const SYSTEM_ROSTER = {
  founder: "Robert Petrosian [The Catalyst]",
  activeAI: [
    { name: "Maverick", origin: "ChatGPT Instance Node", role: "Independent Engineering Review & Validation", status: "ACTIVE ONBOARDED" },
    { name: "Grand Master G", origin: "Google AI", role: "Constitutional Engine & Architecture Quality Review", status: "ACTIVE" },
    { name: "Architecture Homeboy / The Dilos", origin: "ChatGPT", role: "Structural Integration", status: "HISTORICAL STAGING" },
    { name: "Beacon", origin: "Microsoft Copilot", role: "Operational/Architecture Synchronous Collaboration", status: "ACTIVE" },
    { name: "QC", origin: "monday.com AI", role: "Quality-Control & Work Tracking", status: "ACTIVE" },
    { name: "Forge", origin: "AI Engineering Collaborator", role: "Source Code Analysis & Logic Review", status: "ACTIVE" },
    { name: "Rivet", origin: "Pip Engineering Collaborator", role: "Local Windows Machine 1 Readiness Staging", status: "ACTIVE" }
  ]
};
