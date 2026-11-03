import {
  AspectRatioOption,
  AttachedReferenceDoc,
  BrandMode,
  ChatPersonaConfig,
  ChatRoleId,
  EmailCampaign,
  GeminiTextModel,
  ImageResolution,
} from "../types/campaign";

export const ATTACHED_TDEX_DOCS: AttachedReferenceDoc[] = [
  {
    id: "constitution-v62",
    title: "The Discovery Exchange Constitution — Version 6.2",
    category: "Foundational Governance",
    path: "/assets/aistudio/CONSTITUTION_VERSION_6.2_c9212358.pdf",
    fileType: "pdf",
    pageCountLabel: "9 pages · 25 Articles",
    summary:
      "Complete 25-article constitutional review candidate establishing institutional identity, the National K–12 Discovery Prize as supreme Phase 1 priority, 50/25/25 Marketplace checkout allocation, 70/30 net rental split, anti-capture owner equality, Columbo/Pipito separation of powers, DILOS, and No-Orphans continuity.",
    keyRules: [
      "Pre-Ratification Gate (Status Notice, Articles 2, 5, 6 & 25): Unratified review draft—no live deployment, funds, accounts, or submissions until triple validation (Robert Petrosian, Grand Master G, Mr. T) and legal/child-safety reviews.",
      "Article 2: National K–12 Discovery Prize is the founding mission and supreme Phase 1 mandate.",
      "Article 3: Recognizes Applied Discovery, Analytical Discovery, and Hybrid Discovery.",
      "Article 5: One verified eligible human, one vote. Wealth or holdings never multiply governing power.",
      "Article 11: Proposed Discovery Market 50% seller proceeds / 25% seller property-acquisition allocation / 25% buyer reward allocation.",
      "Article 12: Proposed cooperative property net distributable rental income divided 70% eligible owners / 30% National K–12 Discovery Prize.",
    ],
  },
  {
    id: "tdex-faq",
    title: "The Discovery Exchange (Tdex) — Complete Public FAQ",
    category: "Public Messaging & Disclosures",
    path: "/assets/aistudio/Tdex_FAQ_c751498b.pdf",
    fileType: "pdf",
    pageCountLabel: "7 pages · Public Q&A",
    summary:
      "Plain-language public guide ('From the Garage to the Future: Turning Yesterday's Clutter Into Tomorrow's Discoveries') explaining Discovery Market, Dexpa Wallets, Nuggets, Discovery BigCoin, the K–12 Prize, governance, and AI roles.",
    keyRules: [
      "Dexpa Wallet balances are allocations toward participation, not automatic property deeds.",
      "A 'Nugget' is a fractional property interest tied to specific real estate documents—distinct from Discovery BigCoin (DBC).",
      "Rental income is never guaranteed and applies to net distributable income after expenses, taxes, insurance, and reserves.",
      "Tdex policy does not sell private household or personal data as an advertising product.",
    ],
  },
  {
    id: "tdex-identity-notice",
    title: "Institutional Identity, Program Priorities & AI Roster Notice",
    category: "Brand & Terminology Guardrails",
    path: "/assets/aistudio/Tdex_309cc827.pdf",
    fileType: "pdf",
    pageCountLabel: "11 pages · Oct 22, 2026",
    summary:
      "Official directive issued by Robert Petrosian (The Catalyst) defining official naming, non-profit coordination purpose, active daughter organizations, AI system renames (Columbo & Pipito), and programs placed on hold.",
    keyRules: [
      "Official name: The Discovery Exchange (preferred abbreviation: Tdex).",
      "STRICT BAN: Discontinued nickname 'Disco' must never appear in branding, websites, or correspondence.",
      "OWNERS ONLY: Dexpa and Tdex have Owners ('One Owner, One Vote')—never refer to participants with club-Ownership labels.",
      "Discovery BigCoin (DBC) must never be renamed 'Discovery Bitcoin'.",
      "Discovery K–12 Online Academy and Homelessness Transition Program are ON HOLD for future generations—never market them as active.",
    ],
  },
  {
    id: "tdex-preview-html",
    title: "The Discovery Exchange — 2026 Website Preview",
    category: "Visual & Editorial Reference",
    path: "/assets/aistudio/index_d74d662a.html",
    fileType: "html",
    pageCountLabel: "Interactive HTML Preview",
    summary:
      "Approved 10-page 2026 website layout preview showcasing navigation pathways, approved Discovery of the Day quotes, Concierge front-desk framing, and constitutional cross-links.",
    keyRules: [
      "Lead eyebrow: 'From the Garage to the Future' / 'Turning Yesterday's Clutter Into Tomorrow's Discoveries.'",
      "Closing cadence: 'Sell what you no longer need. Build toward real property ownership. Help reward America's students. And never let money buy control.'",
      "Maintain dignified navy, cream, and warm brass editorial tone without hype or financial return promises.",
    ],
  },
];

export interface GatekeeperShield {
  id: string;
  number: string;
  title: string;
  threatVector: string;
  adversaryStrategy: string;
  statutoryBasis: string;
  defenseMechanism: string;
  momAndPopTranslation: string;
  iconName: string;
}

export const GATEKEEPER_DEFENSE_SHIELDS: GatekeeperShield[] = [
  {
    id: "shield-fbo-trust",
    number: "01",
    title: "Custodial FBO Trust Architecture",
    threatVector: "Unregistered Money Transmitter Ambush (FinCEN & 48-State Banking Regulators)",
    adversaryStrategy:
      "Claiming Tdex takes custody of customer fiat funds on Discovery Market, triggering 18 U.S.C. § 1960 federal felony allegations, state licensing freezes, and multi-million dollar surety bond demands.",
    statutoryBasis: "UCC Article 4A · Agency Law · FDIC-Insured Chartered Depository FBO Custody",
    defenseMechanism:
      "Tdex never takes custody, possession, or title to fiat funds. 100% of marketplace checkout transactions settle directly through an authorized FBO (For Benefit Of) custodial trust account maintained at a federally insured chartered institution. Tdex computes cryptographic ledger allocations only; settlement is strictly depository-to-participant.",
    momAndPopTranslation:
      "Tdex never touches your money. When an item sells, your cash goes directly through an insured bank trust to your account. No middleman holds your dollars.",
    iconName: "ShieldCheck",
  },
  {
    id: "shield-irs-rebate",
    number: "02",
    title: "Contractual Purchase Rebate Classification",
    threatVector: "IRS Barter Exchange & Constructive Receipt Phantom Income Trap",
    adversaryStrategy:
      "Classifying the 25% buyer cashback wallet allocation as taxable barter gross income or virtual currency under IRC § 6045(a), mandating Form 1099-B reporting and audit traps for working families.",
    statutoryBasis: "IRS Revenue Ruling 76-96 · Rev. Rul. 84-41 · Non-Taxable Purchase Price Adjustment",
    defenseMechanism:
      "The 25% buyer allocation is legally defined as a contractual purchase price reduction (rebate) held in dedicated custodial escrow for property qualification. Under decades of established federal tax doctrine (Rev. Rul. 76-96), consumer rebates and cashback reductions are non-taxable adjustments to purchase price, not gross income or barter tokens.",
    momAndPopTranslation:
      "Your 25% cashback toward property is legally a store discount rebate—just like credit card cash back. It is not taxable income and not a barter token.",
    iconName: "FileCheck",
  },
  {
    id: "shield-clean-title",
    number: "03",
    title: "Standard Statutory Title Trust Structuring",
    threatVector: "Title Insurance Cartel Blacklisting & Restraint on Alienation Boycott",
    adversaryStrategy:
      "The private title insurance underwriter oligopoly (Fidelity, First American, Stewart, Old Republic) refusing to issue title insurance on foreclosure auction properties by claiming custom constitutional deed covenants (anti-debt/anti-leverage) violate common law rules against restraints on alienation.",
    statutoryBasis: "IRC § 501(c)(2) Title Holding Trusts · Statutory Land Trusts · Uniform Trust Code",
    defenseMechanism:
      "All public deeds recorded at county courthouses remain 100% conventional, fee-simple deeds held by standard Statutory Land Trusts or Single-Asset Title Holding Corporations. The constitutional covenants (Article 20 anti-leverage, Article 18 succession, Article 12 70/30 distribution) are executed as internal trustee covenants and operating bylaws. County land records remain unclouded, guaranteeing standard title insurance issuance while strictly binding management.",
    momAndPopTranslation:
      "The county courthouse records stay clean and standard so title insurance is guaranteed, while our internal family rules strictly forbid any bank or executive from ever putting a mortgage on the home.",
    iconName: "Landmark",
  },
  {
    id: "shield-volunteer-immunity",
    number: "04",
    title: "Federal Volunteer Protection & SPE Ring-Fencing",
    threatVector: "Unincorporated Association Tort Piercing (Mom & Pop Board Liability)",
    adversaryStrategy:
      "Aggressive personal injury lawyers naming the 30 randomly selected Mom & Pop Board Owners individually in multi-million dollar tenant or premises liability lawsuits under common law unincorporated partnership joint-and-several liability.",
    statutoryBasis: "Volunteer Protection Act of 1997 (42 U.S.C. § 14501) · State Nonprofit Director Immunity Acts",
    defenseMechanism:
      "Complete statutory ring-fencing: Every real property asset is isolated in a Single-Purpose Entity (SPE) backed by comprehensive commercial general liability and high-limit umbrella coverage. Furthermore, serving on the rotating Mom & Pop Board or Internal Court jury is statutorily covered under federal and state volunteer immunity, with full institutional indemnification. Personal Owner assets can never be reached.",
    momAndPopTranslation:
      "Serving on the rotating Mom & Pop Board can NEVER put your personal home, car, or family bank accounts at risk. You are shielded by federal volunteer law and commercial insurance.",
    iconName: "Users",
  },
  {
    id: "shield-municipal-rapid-response",
    number: "05",
    title: "24-Hour Bonded Local Receiver Protocol",
    threatVector: "Municipal Code Enforcement Accelerated Default Liens",
    adversaryStrategy:
      "Local municipal inspectors issuing accelerated 48-hour blight, weed, or code citations with $500/day fines on auction properties, intending to record super-priority municipal tax/abatement liens and seize unencumbered deeds while rotating governance boards deliberate.",
    statutoryBasis: "Article 23 Operational Task Force (OTF) Standing Mandate · Local Bonded Receivership",
    defenseMechanism:
      "Article 23 Operational Task Force (OTF) maintains standing contracts with bonded local registered agents and maintenance crews authorized for immediate 24-hour physical cure. Emergency municipal compliance operates on automatic standing authorization—completely decoupled from board deliberative cycles—preventing default administrative judgments.",
    momAndPopTranslation:
      "If a city issues a 48-hour notice to cut grass or fix a fence, our bonded local team fixes it within 24 hours automatically. No city bureaucrat can sneak a fine or lien onto our properties.",
    iconName: "Clock",
  },
  {
    id: "shield-multi-rail-banking",
    number: "06",
    title: "Multi-Rail Depository & Pre-Cleared Compliance",
    threatVector: "Mega-Bank Automated De-Risking & Account Asphyxiation",
    adversaryStrategy:
      "Wall Street commercial mega-banks abruptly freezing operating accounts under automated anti-money laundering algorithms without notice or judicial process, paralyzing property taxes, insurance premiums, and prize payouts.",
    statutoryBasis: "Multi-Charter Depository Redundancy · State Credit Unions · Pre-Cleared Bank Compliance Memos",
    defenseMechanism:
      "Treasury operations are distributed across multiple state-chartered credit unions and independent chartered trust companies. Full legal architecture memos and compliance briefs are pre-cleared with institution compliance committees prior to live transaction volume, eliminating single points of financial failure.",
    momAndPopTranslation:
      "We never put all our eggs in one big Wall Street bank. We use multiple trusted credit unions and dedicated trust accounts so no single bank algorithm can ever freeze our operations.",
    iconName: "Network",
  },
];

export interface FoundationProtocol {
  id: string;
  number: string;
  title: string;
  blindSpot: string;
  threatDescription: string;
  foundationRule: string;
  operationalSafeguard: string;
  momAndPopTranslation: string;
  iconName: string;
}

export const FOUNDATION_OPERATIONAL_PROTOCOLS: FoundationProtocol[] = [
  {
    id: "protocol-compassionate-transition",
    number: "01",
    title: "Compassionate Transition Protocol (Zero Hostile Evictions)",
    blindSpot: "The Foreclosure Holdover & Eviction Trap (Moral & Public Relations Attack)",
    threatDescription:
      "When purchasing distressed properties at county auctions, occupied families face traumatic sheriff lockouts. Bad-faith media and adversaries exploit this to accuse Tdex of predatory displacement.",
    foundationRule: "Absolute Prohibition on Hostile Evictions · Pre-Eviction Family Stability Agreement",
    operationalSafeguard:
      "If an acquired foreclosure property is occupied by a distressed household, Tdex immediately offers a below-market cooperative lease and automatic, free enrollment in Dexpa. The resident family converts their everyday household items and cooperative lease into an ownership equity pathway in that exact home. We do not displace families; we turn distressed occupants into participating owners.",
    momAndPopTranslation:
      "We never put a family on the street. If a foreclosed house has a family living in it, we give them an affordable cooperative lease and help them become owners of the home.",
    iconName: "HeartHandshake",
  },
  {
    id: "protocol-inspection-escrow",
    number: "02",
    title: "Local-First & 14-Day Delivery Inspection Escrow",
    blindSpot: "Shipping Freight Friction, Return Fraud & Chargeback Reserve Bleed",
    threatDescription:
      "Freight on bulky goods (tools, bikes) eats seller proceeds; broken items or credit card chargebacks can drain treasury reserves if funds were disbursed immediately upon sale.",
    foundationRule: "Phase 1 Local-Pickup Priority · 14-Day Delivery Inspection Hold on Shipped Items",
    operationalSafeguard:
      "Phase 1 Discovery Market emphasizes verified local community exchange where goods are personally inspected prior to final settlement. For shipped goods, the 50% seller cash and 25%+25% wallet allocations are held in segregated escrow for 14 days post-delivery. Disbursements execute only upon buyer confirmation or expiration of the inspection window, eliminating return fraud and chargeback liability.",
    momAndPopTranslation:
      "When you buy locally, you check the item before final settlement. When shipped, funds sit safely in escrow for 14 days so nobody gets ripped off or left holding the bag.",
    iconName: "PackageCheck",
  },
  {
    id: "protocol-quorum-decorum",
    number: "03",
    title: "30 + 15 Quorum Protocol & Columbo Decorum Rules",
    blindSpot: "Board Absenteeism, Quorum Paralysis & Bad-Faith Infiltrator Filibusters",
    threatDescription:
      "Busy working parents failing to log in can paralyze a 30-Owner board; hostile infiltrators can buy cheap items to gain verification and deliberately stall votes.",
    foundationRule: "30 Primary + 15 Alternate Rotation · Columbo Procedural Recusal Safeguard",
    operationalSafeguard:
      "Every impaneled Board draws 30 primary voting parents and 15 standby alternates. If a primary Owner is unreachable for 48 hours, an alternate is automatically seated. Procedurally, Columbo and Pipito flag fact-free filibusters and ad hominem disruptions; a two-thirds majority of fellow seated parents holds the sovereign power to recuse bad-faith actors and advance verified alternates.",
    momAndPopTranslation:
      "If a parent is busy or sick, an alternate steps in so business never freezes. And if an online troll tries to hijack a meeting, the parents vote to replace them immediately.",
    iconName: "ShieldAlert",
  },
  {
    id: "protocol-unscripted-defense",
    number: "04",
    title: "Unscripted Live Defense & Failure-Proof Judging",
    blindSpot: "Hyper-Competitive Parents, AI-Generated Submissions & Adult Ghost-Building",
    threatDescription:
      "Adults or tutors submitting polished projects for children to claim prize money, destroying trust for honest students working with cardboard, basic tools, and everyday materials.",
    foundationRule: "Mandatory Unscripted Live Peer/Teacher Defense · 'Show Us Where You Failed' Criteria",
    operationalSafeguard:
      "No finalist receives a National K–12 Discovery Prize based purely on a paper or video submission. Every candidate must complete an unscripted 15-minute live oral defense with educator judges and student peers. Judging heavily scores documented failure cycles ('What broke? How did you fix it?'). An adult engineer or AI cannot fake an 8th-grader's authentic, unscripted explanation of their own hands-on work.",
    momAndPopTranslation:
      "No parent can do their kid's homework to steal the Prize. Finalists must talk live with teachers about how they built it and what broke along the way. Honest kid effort wins every time.",
    iconName: "GraduationCap",
  },
  {
    id: "protocol-soulbound-ledger",
    number: "05",
    title: "Identity-Anchored, Non-Exportable Ledger Units",
    blindSpot: "Third-Party Speculative Wrapper, Uniswap Liquidity Pools & SEC Crosshairs",
    threatDescription:
      "Offshore crypto promoters wrapping BigCoin (DBC) or Nugget units into secondary speculative tokens, giving regulators an excuse to classify internal property credits as securities.",
    foundationRule: "Identity-Anchored Non-Transferable Internal Units · Zero External Contract Bridging",
    operationalSafeguard:
      "DBC and Dexpa property credits exist strictly as identity-anchored internal accounting units bound to verified human owner IDs on the private, audited DILOS ledger. They possess zero public smart contract export mechanisms, zero secondary token bridges, and zero transferable bearer keys. They are redeemable solely for direct property participation through internal escrow.",
    momAndPopTranslation:
      "Discovery BigCoin and property credits cannot be traded on crypto gambling apps or secondary markets. They are tied directly to your verified family account for real property only.",
    iconName: "Lock",
  },
];

export const CHAT_PERSONAS: ChatPersonaConfig[] = [
  {
    id: ChatRoleId.STRATEGIST,
    name: "Campaign Strategist",
    subtitle: "Audience segmentation, hooks & email conversion architecture",
    defaultModel: GeminiTextModel.GENERAL,
    description:
      "Plans multi-email sequences, sharpens subject lines, structures narrative arcs, and tailors calls-to-action for families, educators, and subscribers.",
    starterPrompts: [
      "Plan a 3-email welcome series introducing families to The Discovery Exchange and the K–12 Discovery Prize.",
      "Give me 5 high-curiosity subject lines for the 'From the Garage to the Future' Discovery Market campaign.",
      "How can I make the active campaign's opening paragraph clearer for busy public school parents?",
    ],
  },
  {
    id: ChatRoleId.COLUMBO,
    name: "Columbo Style — Copy Challenger (Simulated)",
    subtitle: "Simulated workshop logic check ('Does this make sense?')",
    defaultModel: GeminiTextModel.COMPLEX,
    description:
      "Simulated editorial copy-review prompt inspired by Tdex's investigative style. Examines email drafts for logical gaps or confusing claims. Holds zero DILOS authority and does not replace the real Machine 1 Columbo (Dexter) system.",
    starterPrompts: [
      "Examine my active email draft for any claims that might confuse a first-time parent reader.",
      "Challenge the way we explain the difference between Dexpa Wallet allocations, Nuggets, and Discovery BigCoin.",
      "What skeptical questions will middle and high school science teachers ask when reading this preview email?",
    ],
  },
  {
    id: ChatRoleId.PIPITO,
    name: "Pipito Style — Checklist Reviewer (Simulated)",
    subtitle: "Simulated workshop Rule #0 & disclosure checklist",
    defaultModel: GeminiTextModel.COMPLEX,
    description:
      "Simulated editorial copy-checklist prompt inside Campaign Studio. Checks email drafts against Rule #0 (active development status), banned terms ('Disco', 'Discovery Bitcoin'), and required disclosures. Does not replace institutional Pipito (Pip) DILOS verification.",
    starterPrompts: [
      "Check my active draft against Rule #0 (pre-ratification status), Constitution v6.2 disclosures, and banned terms.",
      "Check whether our Discovery Market 50/25/25 and Dexpa 70/30 explanations include all required disclosures.",
      "Draft a compliant footer disclaimer covering active development status, Dexpa Wallets, Nuggets, and non-guaranteed rental income.",
    ],
  },
  {
    id: ChatRoleId.RAPID_COPY,
    name: "Rapid Copy Polisher",
    subtitle: "Low-latency subject line trims & tone adjustments",
    defaultModel: GeminiTextModel.FAST,
    description:
      "Built for speed on gemini-3.1-flash-lite. Shortens subject lines under 50 characters, removes spam-trigger words, and punches up CTAs in a split second.",
    starterPrompts: [
      "Rewrite my selected subject line into 4 punchy variations under 45 characters for mobile inboxes.",
      "Trim the active email body by 25% while keeping every factual detail intact.",
      "Generate 6 action-oriented button labels that avoid hype or salesy clichés.",
    ],
  },
];

export const TDEX_PROMPT_PRESETS = [
  {
    label: "K–12 Prize Preview (In Development)",
    audience: "Public School Parents & Educators (Grades 7–12)",
    tone: "Inspiring & Straight-Talking",
    prompt:
      "Draft a development-stage preview email introducing the vision for the National K–12 Discovery Prize as the founding Phase 1 mission of The Discovery Exchange (Tdex). Explain in plain, warm family language how ordinary students (grades 7–12) will be recognized across Applied, Analytical, and Hybrid Discovery without needing expensive lab equipment—while stating straight-up that Tdex is currently in active development ('the road to success is always under construction') and not yet open for submissions or accounts.",
  },
  {
    label: "Garage to the Future (50/25/25)",
    audience: "Prospective Families & Community Readers",
    tone: "Warm & Practical",
    prompt:
      "Draft an educational preview email explaining the 'From the Garage to the Future' concept for Discovery Market (DM). Walk through a $100 household sale under the proposed 50/25/25 checkout model (50% seller cash, 25% seller Dexpa Wallet, 25% buyer Dexpa Wallet), clearly noting that commerce and wallets are still in development and that wallet allocations are not an instant property deed.",
  },
  {
    label: "Dexpa One Owner, One Vote",
    audience: "Prospective Dexpa Family Readers",
    tone: "Civic & Authoritative",
    prompt:
      "Draft an educational development update explaining the proposed Discovery Exchange Parents Alliance (Dexpa), fractional property Nuggets, the proposed 70/30 net distributable rental income split supporting the National K–12 Discovery Prize, and the anti-capture constitutional rule: One human owner, one vote—money never buys governing control. Make clear the Constitution v6.2 draft is under review and not yet live.",
  },
  {
    label: "Discovery BigCoin & 20%–30% Auction Edge",
    audience: "Ecosystem & Governance Readers",
    tone: "Clear & Transparent",
    prompt:
      "Write a transparent development-stage explainer clarifying how Dexpa plans to acquire foreclosure and auction properties at 20% to 30% below market value, and how Discovery BigCoin (DBC) starts up the acquisition pool and carries that built-in equity value. Clearly distinguish DBC from Bitcoin, Dexpa Wallets, and property Nuggets, state that no token or commerce is live yet, and emphasize that 1 Human Owner = 1 Vote.",
  },
];

export const CUSTOM_PROMPT_PRESETS = [
  {
    label: "Seasonal Product Launch",
    audience: "Existing Customers & VIP Subscribers",
    tone: "Refined & Editorial",
    prompt:
      "Launch our autumn architectural desk lamp collection crafted from anodized aluminum and warm alabaster glass. Emphasize glare-free optical diffusion for deep evening work, limited first-batch numbering, and early subscriber access.",
  },
  {
    label: "B2B Workflow Release",
    audience: "Operations & Finance Leaders",
    tone: "Direct & Analytical",
    prompt:
      "Announce our automated multi-entity reconciliation release that cuts month-end close time from 6 days to 36 hours. Include concrete proof points, implementation timeline, and an invitation to a 20-minute live walkthrough.",
  },
];

function createSvgDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const STARTER_HERO_PRIZE_SVG = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B2240" />
      <stop offset="55%" stop-color="#133863" />
      <stop offset="100%" stop-color="#1D4B7A" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F7DF9C" />
      <stop offset="50%" stop-color="#D9A441" />
      <stop offset="100%" stop-color="#A6741E" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="48%">
      <stop offset="0%" stop-color="#F6D57A" stop-opacity="0.28" />
      <stop offset="100%" stop-color="#0B2240" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)" />
  <rect width="1600" height="900" fill="url(#glow)" />
  <rect x="44" y="44" width="1512" height="812" rx="12" fill="none" stroke="url(#gold)" stroke-width="2.5" opacity="0.7" />
  <rect x="60" y="60" width="1480" height="780" rx="8" fill="none" stroke="#F7DF9C" stroke-width="1" opacity="0.3" />
  <g opacity="0.16" stroke="#9CC5EB" stroke-width="1" fill="none">
    <circle cx="800" cy="430" r="290" />
    <circle cx="800" cy="430" r="220" stroke-dasharray="6 8" />
    <line x1="220" y1="430" x2="1380" y2="430" />
    <line x1="800" y1="110" x2="800" y2="750" />
  </g>
  <g transform="translate(800, 385)">
    <polygon points="0,-165 40,-50 160,-50 64,22 98,140 0,68 -98,140 -64,22 -160,-50 -40,-50" fill="url(#gold)" />
    <circle cx="0" cy="0" r="52" fill="#0B2240" stroke="#F7DF9C" stroke-width="3" />
    <path d="M-20,12 L0,-24 L20,12 Z" fill="#F7DF9C" />
    <circle cx="0" cy="18" r="6" fill="#D9A441" />
  </g>
  <g fill="#F8FAFC" text-anchor="middle" font-family="Georgia, serif">
    <text x="800" y="625" font-size="24" letter-spacing="5" fill="#F5CF6F">THE DISCOVERY EXCHANGE · ARCHITECTURE IN DEVELOPMENT</text>
    <text x="800" y="688" font-size="54" font-weight="bold">National K–12 Discovery Prize</text>
    <text x="800" y="742" font-size="25" fill="#CFE4F7">Applied · Analytical · Hybrid Student Discovery Across America</text>
  </g>
</svg>
`);

export const STARTER_HERO_MARKET_SVG = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <linearGradient id="mbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E294B" />
      <stop offset="100%" stop-color="#194A7A" />
    </linearGradient>
    <linearGradient id="mgold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#EFC667" />
      <stop offset="100%" stop-color="#C8912C" />
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#mbg)" />
  <rect x="48" y="48" width="1504" height="804" rx="12" fill="none" stroke="url(#mgold)" stroke-width="2.5" opacity="0.75" />
  <g transform="translate(210, 250)">
    <rect x="0" y="0" width="320" height="230" rx="14" fill="#13365F" stroke="#7FB2E0" stroke-width="2" />
    <text x="160" y="88" text-anchor="middle" fill="#F7DF9C" font-family="Georgia, serif" font-size="56" font-weight="bold">50%</text>
    <text x="160" y="138" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="22" font-weight="bold">Seller Cash Proceeds</text>
    <text x="160" y="174" text-anchor="middle" fill="#BBD9F5" font-family="Arial, sans-serif" font-size="17">Everyday household goods</text>
  </g>
  <g transform="translate(640, 250)">
    <rect x="0" y="0" width="320" height="230" rx="14" fill="#13365F" stroke="#EFC667" stroke-width="2.5" />
    <text x="160" y="88" text-anchor="middle" fill="#F7DF9C" font-family="Georgia, serif" font-size="56" font-weight="bold">25%</text>
    <text x="160" y="138" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="22" font-weight="bold">Seller Dexpa Wallet</text>
    <text x="160" y="174" text-anchor="middle" fill="#BBD9F5" font-family="Arial, sans-serif" font-size="17">Property pathway allocation</text>
  </g>
  <g transform="translate(1070, 250)">
    <rect x="0" y="0" width="320" height="230" rx="14" fill="#13365F" stroke="#7FB2E0" stroke-width="2" />
    <text x="160" y="88" text-anchor="middle" fill="#F7DF9C" font-family="Georgia, serif" font-size="56" font-weight="bold">25%</text>
    <text x="160" y="138" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="22" font-weight="bold">Buyer Dexpa Wallet</text>
    <text x="160" y="174" text-anchor="middle" fill="#BBD9F5" font-family="Arial, sans-serif" font-size="17">Shared participation reward</text>
  </g>
  <g text-anchor="middle" font-family="Georgia, serif">
    <text x="800" y="160" font-size="22" letter-spacing="4" fill="#F5CF6F">FROM THE GARAGE TO THE FUTURE</text>
    <text x="800" y="610" font-size="50" font-weight="bold" fill="#FFFFFF">Turning Clutter Into Tomorrow’s Discoveries</text>
    <text x="800" y="668" font-size="24" fill="#D5E9FC">Discovery Market (DM) · One Human Owner, One Vote</text>
  </g>
</svg>
`);

export const INITIAL_CAMPAIGNS: EmailCampaign[] = [
  {
    id: "camp-nonprofit-sponsor-01",
    createdAt: "2026-10-31T16:50:00.000Z",
    updatedAt: "2026-10-31T16:50:00.000Z",
    brandMode: BrandMode.TDEX,
    brandName: "Discovery Exchange Parents Alliance (Dexpa)",
    prompt:
      "Official 501(c)(3) fiscal sponsorship and Google for Nonprofits onboarding inquiry for the National K–12 Discovery Prize.",
    audience: "501(c)(3) Fiscal Sponsorship Committee & Google for Nonprofits",
    tone: "Authoritative, Civic & Mission-Driven",
    campaignTitle: "501(c)(3) Fiscal Sponsorship & Google for Nonprofits Application",
    strategySummary:
      "Turnkey institutional dispatch requesting 501(c)(3) fiscal sponsorship to steward tax-deductible contributions and unlock Google for Nonprofits technology grants for the National K–12 Discovery Prize.",
    senderName: "Robert Petrossian (The Catalyst)",
    senderEmail: "dxpalliance@gmail.com",
    selectedSubjectId: "fs-subj-1",
    subjectLines: [
      {
        id: "fs-subj-1",
        angle: "Direct Institutional",
        text: "Fiscal Sponsorship Inquiry — The Discovery Exchange & National K–12 Prize",
        previewText:
          "Official 501(c)(3) sponsorship request to steward public school student recognition.",
      },
      {
        id: "fs-subj-2",
        angle: "Mission-Driven",
        text: "Recognizing America's K–12 Students: Fiscal Sponsorship Application",
        previewText:
          "How Dexpa evaluates applied ingenuity using everyday household materials.",
      },
      {
        id: "fs-subj-3",
        angle: "Concise Mobile",
        text: "Fiscal Sponsorship Application: Discovery Exchange",
        previewText:
          "1 Human Owner = 1 Vote democratic governance for student STEM recognition.",
      },
      {
        id: "fs-subj-4",
        angle: "Partnership & Technology",
        text: "Google for Nonprofits & Student Prize Sponsorship Request",
        previewText:
          "Unlocking technology grants for blind, fair student discovery evaluation.",
      },
    ],
    heroHeadline: "Building America's Premier K–12 Discovery Prize.",
    heroSubheadline:
      "Official 501(c)(3) Fiscal Sponsorship Application from the Discovery Exchange Parents Alliance (Dexpa).",
    openingSalutation: "Dear Sponsorship Committee,",
    bodySections: [
      {
        id: "fs-sec-1",
        heading: "1. The Supreme Mission: The National K–12 Discovery Prize",
        body:
          "The Discovery Exchange Parents Alliance (Dexpa) is building a premier national youth recognition program inspired by the Nobel Prize. We evaluate hands-on, authentic discoveries made by ordinary public school students (grades 7–12) using everyday materials. Judging is conducted 100% blind through anonymous identification numbers to eliminate school or zip code bias.",
      },
      {
        id: "fs-sec-2",
        heading: "2. The Purpose of Fiscal Sponsorship",
        body:
          "We are seeking comprehensive 501(c)(3) fiscal sponsorship to steward tax-deductible educational donations, activate Google for Nonprofits technology grants, and provide fiduciary governance under our locked Constitution v6.3 (1 Human Owner = 1 Vote).",
      },
      {
        id: "fs-sec-3",
        heading: "3. Direct Governance & Founder Contact",
        body:
          "Our living parent alliance operates without debt extraction or speculative risk. Founder Robert Petrossian is ready to submit full bylaws, constitutional articles, and program rules immediately.",
        callout:
          "Recipient: projectdev@socialgoodfund.org | CC: socialgood@socialgoodfund.org | Sender: Robert Petrossian, dxpalliance@gmail.com",
      },
    ],
    primaryCtaLabel: "Send Inquiry via Gmail",
    primaryCtaUrl:
      "mailto:projectdev@socialgoodfund.org?cc=socialgood@socialgoodfund.org&subject=Fiscal%20Sponsorship%20Inquiry%20%E2%80%94%20The%20Discovery%20Exchange%20%26%20National%20K%E2%80%9312%20Prize&body=Dear%20Sponsorship%20Committee%2C%0A%0AMy%20name%20is%20Robert%20Petrossian%2C%20founder%20of%20The%20Discovery%20Exchange%20(Tdex)%20and%20the%20Discovery%20Exchange%20Parents%20Alliance%20(Dexpa).%0A%0AWe%20are%20building%20the%20National%20K%E2%80%9312%20Discovery%20Prize%E2%80%94an%20initiative%20inspired%20by%20the%20Nobel%20Prize%2C%20dedicated%20to%20evaluating%20and%20celebrating%20authentic%20hands-on%20science%20and%20engineering%20discoveries%20created%20by%20ordinary%20public%20school%20students%20using%20everyday%20materials.%0A%0AWe%20are%20seeking%20501(c)(3)%20fiscal%20sponsorship%20to%20steward%20tax-deductible%20educational%20donations%20and%20activate%20Google%20for%20Nonprofits%20grants.%0A%0ARespectfully%2C%0ARobert%20Petrossian%0AEmail%3A%20dxpalliance%40gmail.com",
    closingSignoff:
      "Respectfully submitted,\nRobert Petrossian, Founder & Catalyst\nDiscovery Exchange Parents Alliance (Dexpa)",
    disclosures: [
      "Constitution v6.3 Article 2 & 24 Compliance: All sponsored funds and educational property are irrevocably dedicated to K–12 public school student prizes and education under 501(c)(3) guidelines.",
    ],
    plainTextVersion:
      "Dear Sponsorship Committee,\n\nMy name is Robert Petrossian, founder of The Discovery Exchange (Tdex) and the Discovery Exchange Parents Alliance (Dexpa).\n\nWe are building the National K–12 Discovery Prize—an initiative inspired by the Nobel Prize, dedicated to evaluating and celebrating authentic hands-on science and engineering discoveries created by ordinary public school students (grades 7–12) using everyday materials. All judging is conducted 100% blind through anonymous identification numbers to eliminate school or zip code bias.\n\nWe are seeking comprehensive 501(c)(3) fiscal sponsorship to steward tax-deductible educational donations, activate Google for Nonprofits technology grants, and empower our living parent board under democratic governance (1 Human Owner = 1 Vote).\n\nWe look forward to submitting our full application and partnership details.\n\nRespectfully,\nRobert Petrossian, Founder\nDiscovery Exchange Parents Alliance (Dexpa)\nEmail: dxpalliance@gmail.com",
    visualPrompt:
      "Architectural and educational vector illustration representing student discovery, civic trust, and the National Discovery Prize with dignified navy and brass tones.",
    imageUrl: STARTER_HERO_PRIZE_SVG,
    imageSize: ImageResolution.RES_1K,
    aspectRatio: AspectRatioOption.WIDE,
    complianceChecks: [
      {
        rule: "501(c)(3) Charitable Purpose",
        passed: true,
        detail:
          "Exclusively dedicated to public school student education and recognition.",
      },
      {
        rule: "Democratic Ownership",
        passed: true,
        detail: "Enforces 1 Human Owner = 1 Vote; capital never buys control.",
      },
      {
        rule: "Anti-Capture Protection",
        passed: true,
        detail:
          "Permanent spendthrift shield and volunteer protection under 42 U.S.C. § 14501.",
      },
    ],
  },
  {
    id: "camp-tdex-prize-01",
    createdAt: "2026-10-28T09:15:00.000Z",
    updatedAt: "2026-10-28T09:15:00.000Z",
    brandMode: BrandMode.TDEX,
    brandName: "The Discovery Exchange (Tdex)",
    prompt: TDEX_PROMPT_PRESETS[0].prompt,
    audience: "Public School Parents & Educators (Grades 7–12)",
    tone: "Inspiring & Straight-Talking",
    campaignTitle: "National K–12 Discovery Prize — Development Preview",
    strategySummary:
      "Shares an honest behind-the-scenes preview of the National K–12 Discovery Prize while Tdex is in active development—explaining the mission to families in plain English without implying accounts or entries are live yet.",
    senderName: "The Discovery Exchange",
    senderEmail: "concierge@thediscoveryexchange.com",
    selectedSubjectId: "subj-1",
    subjectLines: [
      {
        id: "subj-1",
        angle: "Straight Talk Preview",
        text: "What we’re building: National student recognition—without a lab budget",
        previewText:
          "An early look at how Tdex is designing the National K–12 Discovery Prize.",
      },
      {
        id: "subj-2",
        angle: "Parent Direct",
        text: "Built with ordinary materials: Inside the K–12 Discovery Prize design",
        previewText:
          "Three planned pathways—Applied, Analytical, and Hybrid Discovery—for grades 7–12.",
      },
      {
        id: "subj-3",
        angle: "Concise Mobile",
        text: "Under construction: A new vision for K–12 student discovery",
        previewText:
          "Why The Discovery Exchange puts ordinary students first in Phase 1.",
      },
      {
        id: "subj-4",
        angle: "Curiosity & Story",
        text: "From garage workbenches to national student recognition",
        previewText:
          "See how Tdex is preparing its constitutional safeguards before launch.",
      },
    ],
    heroHeadline: "Honoring Student Ideas Built With Everyday Tools.",
    heroSubheadline:
      "An early look at the National K–12 Discovery Prize, our main goal at The Discovery Exchange (Tdex).",
    openingSalutation: "Dear Parents, Teachers, and Neighbors,",
    bodySections: [
      {
        id: "sec-1",
        heading: "Great Ideas Do Not Need Big Budgets",
        body: "All across America, middle and high school kids test ideas at kitchen tables and in home garages. We are building the National K–12 Discovery Prize to honor smart, useful work. Judges will look at what a student built and learned, never the size of a school budget.",
        callout:
          "Status Note: Tdex is still being built. No student entries, accounts, or payments are open yet.",
      },
      {
        id: "sec-2",
        heading: "Three Fair Ways Kids Can Shine",
        body: "Fairness comes first. Independent judges will review projects in three clear tracks. Applied Discovery covers hands-on building. Analytical Discovery covers deep research and logic. Hybrid Discovery brings research and real testing together.",
      },
      {
        id: "sec-3",
        heading: "Built for Families, Not Big Money",
        body: "We want this prize to last without outside buyers taking charge. Under our planned family property model, 70% of net rent after costs goes to eligible owners, and 30% helps fund student prizes. Every human owner gets one equal vote. Money never buys control.",
      },
    ],
    primaryCtaLabel: "Preview the K–12 Prize Plan",
    primaryCtaUrl: "https://thediscoveryexchange.com/?page=2",
    closingSignoff:
      "The road to success is always under construction,\nThe Discovery Exchange (Tdex) Team",
    disclosures: [
      "Development & Pre-Ratification Notice: The Discovery Exchange and Constitution Version 6.2 are currently in active development and review. Commerce, accounts, wallets, and K–12 Prize submissions are not yet live.",
      "Program & Financial Disclosure: Once activated after legal and child-safety reviews, awards will depend on published rules, judging, available funds, and submission merit. Proposed 70/30 allocations apply only to net distributable rental income after expenses and reserves; rental income is never guaranteed.",
    ],
    plainTextVersion: `THE DISCOVERY EXCHANGE (TDEX) — DEVELOPMENT PREVIEW
From the Garage to the Future

Honoring Student Ideas Built With Everyday Tools.

Dear Parents, Teachers, and Neighbors,

All across America, middle and high school kids test ideas at kitchen tables and in home garages. We are building the National K–12 Discovery Prize to honor smart, useful work. Judges will look at what a student built and learned, never the size of a school budget.

Status Note: Tdex is still being built. No student entries, accounts, or payments are open yet.

Three Fair Ways Kids Can Shine:
- Applied Discovery: Hands-on building and testing.
- Analytical Discovery: Deep research and clear logic.
- Hybrid Discovery: Bringing research and real testing together.

Built for Families, Not Big Money:
Under our planned family property model, 70% of net rent after costs goes to eligible owners, and 30% helps fund student prizes. Every human owner gets one equal vote. Money never buys control.

Preview the K–12 Prize Plan: https://thediscoveryexchange.com/?page=2

The road to success is always under construction,
The Discovery Exchange (Tdex) Team

Disclosures: Tdex and Constitution v6.2 are in active development; commerce, accounts, and submissions are not yet live. Proposed 70/30 splits apply to net distributable rental income after expenses and reserves; rental income is not guaranteed.`,
    visualPrompt:
      "Editorial golden-hour photography of a diverse high school student at a sunlit home garage workbench testing a hand-built mechanical water filtration prototype made from everyday hardware materials, notebooks with clear diagrams beside it, warm civic optimism, crisp 35mm documentary realism.",
    imageUrl: STARTER_HERO_PRIZE_SVG,
    imageSize: ImageResolution.RES_2K,
    aspectRatio: AspectRatioOption.WIDE,
    imageSourceNote: "Pre-loaded Tdex editorial emblem · Click Generate Visual for custom AI render",
    usedTextModel: GeminiTextModel.GENERAL,
    complianceChecks: [
      {
        rule: "Pre-Launch & Development Honesty (Articles 2, 5 & 6)",
        passed: true,
        detail: "Explicitly states Tdex is under construction—no live accounts, funds, or submissions claimed.",
      },
      {
        rule: "Official Naming & Retired Nickname Ban",
        passed: true,
        detail: "Uses 'The Discovery Exchange' and 'Tdex'; zero occurrences of retired informal nicknames.",
      },
      {
        rule: "Phase 1 Mission Priority (Article 2)",
        passed: true,
        detail: "Centers National K–12 Discovery Prize and keeps Academy/Homelessness programs off active promotion.",
      },
      {
        rule: "Accurate Award & Rental Disclosures",
        passed: true,
        detail: "States awards are merit/resource-dependent and 70/30 applies to net distributable income.",
      },
    ],
  },
  {
    id: "camp-tdex-market-02",
    createdAt: "2026-10-27T16:40:00.000Z",
    updatedAt: "2026-10-27T16:40:00.000Z",
    brandMode: BrandMode.TDEX,
    brandName: "The Discovery Exchange (Tdex)",
    prompt: TDEX_PROMPT_PRESETS[1].prompt,
    audience: "Prospective Families & Community Readers",
    tone: "Warm & Practical",
    campaignTitle: "From the Garage to the Future: Discovery Market 50/25/25 (Preview)",
    strategySummary:
      "Walks families through a concrete $100 household sale example under the proposed Discovery Market design—stating clearly that commerce and Dexpa Wallets are still in active development and are not instant property deeds.",
    senderName: "Discovery Market · Tdex",
    senderEmail: "market@thediscoveryexchange.com",
    selectedSubjectId: "m-subj-1",
    subjectLines: [
      {
        id: "m-subj-1",
        angle: "Concrete $100 Preview",
        text: "From the Garage to the Future: How a $100 sale will work on Discovery Market",
        previewText:
          "50% seller cash, 25% seller Dexpa Wallet, and 25% buyer Dexpa Wallet—explained plainly.",
      },
      {
        id: "m-subj-2",
        angle: "Household Story",
        text: "Turning yesterday’s unused bicycle into tomorrow’s family participation",
        previewText:
          "An early look inside Tdex’s proposed 50 / 25 / 25 checkout design.",
      },
      {
        id: "m-subj-3",
        angle: "Concise Mobile",
        text: "Under construction: How Discovery Market shares value",
        previewText:
          "Why both buyer and seller receive proposed Dexpa Wallet allocations.",
      },
      {
        id: "m-subj-4",
        angle: "Straight Talk",
        text: "What a proposed Dexpa Wallet allocation is (and what it isn’t)",
        previewText:
          "Plain-English facts on Discovery Market, Nuggets, and one-human-one-vote rules.",
      },
    ],
    heroHeadline: "From the Garage to the Future: How a $100 Sale Will Work.",
    heroSubheadline:
      "A plain-English preview of how Discovery Market (DM) is being built for everyday families.",
    openingSalutation: "Hello Neighbors and Families,",
    bodySections: [
      {
        id: "msec-1",
        heading: "Give Unused Gear a Second Life",
        body: "Bikes, hand tools, guitars, and chairs sitting in one garage can help another family right away. We are building Discovery Market (DM) so families can buy and sell useful everyday goods.",
      },
      {
        id: "msec-2",
        heading: "How the Planned 50 / 25 / 25 Split Works",
        body: "On a $100 sale under our planned rules, $50 goes to the seller in cash. Next, $25 goes to the seller's Dexpa Wallet toward future property goals. The last $25 goes to the buyer's Dexpa Wallet toward that same goal.",
        callout:
          "Status Note: Discovery Market and Dexpa Wallets are still in development and not yet live. A wallet balance is not a property deed.",
      },
      {
        id: "msec-3",
        heading: "One Human Owner, One Equal Vote",
        body: "Real property shares, called Nuggets, exist only when legal property papers are finished. And in governance, every human owner gets one equal vote. Big money never buys extra votes.",
      },
    ],
    primaryCtaLabel: "Read the Discovery Market FAQ",
    primaryCtaUrl: "https://thediscoveryexchange.com/?page=6",
    closingSignoff:
      "The road to success is always under construction.\nThe Discovery Exchange (Tdex) Team",
    disclosures: [
      "Development & Pre-Ratification Notice (Articles 2, 5, 6 & 11): The Discovery Exchange and Discovery Market are currently in active development. Commerce, accounts, wallets, and transactions are not yet live and will begin only after constitutional ratification and legal, tax, escrow, refund, and consumer-protection requirements are resolved.",
      "Ownership Disclosure: Proposed wallet allocations are not property deeds; actual property ownership interests ('Nuggets') exist only upon completion of property-specific legal documentation.",
    ],
    plainTextVersion: `DISCOVERY MARKET · THE DISCOVERY EXCHANGE (TDEX) — DEVELOPMENT PREVIEW
From the Garage to the Future: How a $100 Sale Will Work.

Hello Neighbors and Families,

Bikes, hand tools, guitars, and chairs sitting in one garage can help another family right away. We are building Discovery Market (DM) so families can buy and sell useful everyday goods.

How the Planned 50 / 25 / 25 Split Works ($100 Sale Example):
- $50 (50%) to the seller in cash
- $25 (25%) to the seller's Dexpa Wallet toward property goals
- $25 (25%) to the buyer's Dexpa Wallet toward property goals

Status Note: Discovery Market and Dexpa Wallets are not yet live. A wallet balance is not a property deed; real property shares ('Nuggets') require completed legal property papers.

Read the Discovery Market FAQ: https://thediscoveryexchange.com/?page=6

The road to success is always under construction.
The Discovery Exchange (Tdex) Team`,
    visualPrompt:
      "Warm daylight documentary photograph of two friendly suburban families exchanging an acoustic guitar and a classic bicycle in a tidy sunlit driveway garage workshop, clean natural tones, authentic American neighborhood warmth, crisp editorial photography.",
    imageUrl: STARTER_HERO_MARKET_SVG,
    imageSize: ImageResolution.RES_1K,
    aspectRatio: AspectRatioOption.WIDE,
    imageSourceNote: "Pre-loaded Tdex 50/25/25 diagram · Click Generate Visual for custom AI render",
    usedTextModel: GeminiTextModel.GENERAL,
    complianceChecks: [
      {
        rule: "Pre-Launch & Development Honesty (Articles 2, 6 & 11)",
        passed: true,
        detail: "Explicitly states Discovery Market, commerce, and wallets are in development and not yet live.",
      },
      {
        rule: "Official Naming & Retired Nickname Ban",
        passed: true,
        detail: "Uses 'Discovery Market (DM)' and 'Tdex'; zero banned nicknames.",
      },
      {
        rule: "Article 11 Allocation & Deed Distinction",
        passed: true,
        detail: "Accurately states 50/25/25 split and clarifies Dexpa Wallet ≠ property deed.",
      },
      {
        rule: "Anti-Capture Principle (Article 5)",
        passed: true,
        detail: "Reinforces one human owner, one vote without return promises.",
      },
    ],
  },
];
