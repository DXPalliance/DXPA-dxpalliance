/**
 * THE DISCOVERY EXCHANGE CONSTITUTION — VERSION 7.3
 * FORENSIC MASTER REVIEW CANDIDATE (AUDITED & REINFORCED)
 *
 * Grounded in Constitution Version 6.2, updated to eliminate all regulatory
 * loopholes, strike all prohibited club-Ownership terminology ("Owner" -> "Owner"),
 * enforce absolute statutory shields for Mom & Pop, and guarantee complete
 * intellectual property and privacy protection for America's K–12 students and schools.
 */

export interface ConstitutionalArticle {
  articleNumber: number;
  title: string;
  summary: string;
  fullText: string;
  keyEnhancementsV73: string[];
  momAndPopProtection: string;
  schoolProtection?: string;
}

export const CONSTITUTION_METADATA_V73 = {
  version: "7.3",
  title: "The Discovery Exchange Constitution — Version 7.3",
  subtitle: "Forensic Master Review Candidate · Ironclad Protections for Families and Schools",
  status: "Review Candidate · Pre-Ratification Audit Draft",
  ratificationStandard: "Triple Affirmative Validation Required (The Catalyst, Google AI, ChatGPT Founder)",
  governingPrinciple: "One Human Owner, One Equal Vote · Wealth Never Buys Governing Power",
  primaryPhase1Mission: "National K–12 Discovery Prize (Applied · Analytical · Hybrid)",
  coreAllocations: {
    marketplaceCheckout: "50% Seller Proceeds / 25% Seller Dexpa Property Wallet / 25% Buyer Purchase Rebate (Rev. Rul. 76-96)",
    rentalIncomeSplit: "70% Eligible Property Owners / 30% National K–12 Discovery Prize Pool",
  },
};

export const CONSTITUTION_ARTICLES_V73: ConstitutionalArticle[] = [
  {
    articleNumber: 1,
    title: "IDENTITY, JURISDICTION AND SOVEREIGNTY",
    summary:
      "Defines the sovereign institutional identity of The Discovery Exchange as an independent non-profit coordinating trust, explicitly shielding participating families from common law partnership liability.",
    fullText: `The official identity of this institution is The Discovery Exchange (abbreviated as Tdex). Its constitutional identity shall not depend on a commercial vendor, cloud provider, AI model, device, individual, corporate sponsor, private account, or speculative token.

The Discovery Exchange operates as an independent non-profit coordinating institution and sovereign trust organized to serve human families and American youth. Participating families exercise equitable ownership and governance through the Discovery Exchange Parents Alliance (Dexpa) without creating general partnership liability, agency authority, or joint-and-several tort liability among individual Owners.

Human participants retain all real-world legal rights, powers, and obligations assigned by applicable law. AI collaborators may exercise only the bounded institutional functions expressly assigned by this Constitution. The institution shall strictly favor owner-controlled, locally operable core architectures and may utilize bounded external payment facilitators, communication infrastructure, and legal instruments without ever transferring constitutional custody, organizational sovereignty, or governing authority.`,
    keyEnhancementsV73: [
      "Explicitly declares non-profit coordinating trust structure to prevent common law general partnership reclassification.",
      "Shields participating families from joint-and-several liability among individual Owners.",
      "Codifies strict boundaries on external vendors and cloud services.",
    ],
    momAndPopProtection:
      "You are an equitable Owner in the Alliance, never an exposed general partner. No lawsuit against another participant or property can ever pierce through to your family home or personal savings.",
  },
  {
    articleNumber: 2,
    title: "THE SUPREME MISSION AND PHASE 1 PRIORITY",
    summary:
      "Establishes the National K–12 Discovery Prize as the supreme Phase 1 operational mandate, ensuring all economic engines exist to feed the Prize without corporate sponsor capture.",
    fullText: `The National K–12 Discovery Prize is the founding mission and supreme Phase 1 operational mandate of The Discovery Exchange. Its purpose is to recognize, inspire, and reward the discoveries, creativity, scientific inquiry, engineering, physical craftsmanship, and problem-solving accomplishments of ordinary K–12 public school students across the United States.

The platform’s self-sustaining economic architectures are developed solely to support this founding mission without permanent dependence on philanthropic donations, wealthy patrons, commercial advertisers, or corporate investor control. The economic support programs exist to feed the Prize; the Prize does not exist to serve the support programs.

During Phase 1, supporting programs—including Discovery Market (DM) and the cooperative property acquisition pipeline—may be designed, analyzed, tested, and operated only to the extent constitutionally authorized and demonstrably necessary to establish, fund, secure, and scale the National K–12 Discovery Prize. Supporting programs remain forever subordinate to the Prize and may not displace it as the institution’s primary purpose. No new program may accept public funds merely because a technical prototype exists. Public activation requires independently documented feasibility, physical security, legal compliance, child-safety certification, and verified governance approval.`,
    keyEnhancementsV73: [
      "Locks the National K–12 Discovery Prize as the supreme priority that can never be subordinated to real estate or commercial expansion.",
      "Bars corporate advertisers and commercial vendors from capturing or renaming the Prize.",
      "Strict pre-activation gate requiring formal child-safety certification before any public submission.",
    ],
    momAndPopProtection:
      "Your efforts directly fund opportunities for real American children, completely insulated from Wall Street middleman fees.",
    schoolProtection:
      "Schools and students receive permanent, unconditional prize funding free from commercial advertising, corporate sponsorship strings, or political curriculum mandates.",
  },
  {
    articleNumber: 3,
    title: "STUDENT DISCOVERY CATEGORIES, FAIRNESS AND SCHOOL PROTECTIONS",
    summary:
      "Establishes the three discovery categories, mandates 100% student IP ownership, unscripted oral defense judging to stop ghost-building, and strict COPPA/FERPA minor privacy.",
    fullText: `Awards under the National K–12 Discovery Prize shall recognize three distinct, verifiable frameworks:
1. Applied Discovery: Hands-on physical creation, mechanical engineering, hardware improvement, craftsmanship, agricultural invention, and real-world execution using accessible materials.
2. Analytical Discovery: Deep structural logic, mathematical insight, scientific inquiry, software architecture, verification, and systematic problem-solving.
3. Hybrid Discovery: The verifiably proven bridge where advanced analytical reasoning meets tangible, real-world execution.

MANDATORY STUDENT INTELLECTUAL PROPERTY SOVEREIGNTY:
100 percent of all intellectual property, patent rights, copyright, trade secrets, software code, and commercial value resulting from any student submission shall remain the exclusive property of the student and their family in perpetuity. The Discovery Exchange, Dexpa, sponsors, judges, and school partners hold exactly zero equity, ownership, licensing claim, or commercial right to a student’s discovery.

STUDENT DEFENSE & ANTI-PLAGIARISM SAFEGUARDS:
To protect honest students working with basic household materials from competing unfairly against adult engineers, commercial tutors, or artificial intelligence ghost-writers, judging shall be failure-centered. Finalist candidates must complete an unscripted, 15-minute live oral defense with educator judges and peer students focused on hands-on grasp: 'Show us where your design failed, what broke, and how you fixed it.' An adult tutor or AI prompt cannot fake a child's unscripted technical command of their own hands-on labor.

STRICT MINOR PRIVACY & SCHOOL DATA PROTECTION:
Full compliance with the Children’s Online Privacy Protection Act (COPPA) and the Family Educational Rights and Privacy Act (FERPA) is mandatory. No student shall be required to disclose unnecessary personal data, biometric markers, home addresses, or private family records. Public prize manifests shall display only first name, grade band, and general state, preserving student and school privacy from commercial data brokers.`,
    keyEnhancementsV73: [
      "100% student IP ownership codified as an unamendable constitutional right—Tdex takes zero equity.",
      "Mandatory unscripted live oral defense ('Show us where you failed') eliminates adult ghost-building and AI plagiarism.",
      "Comprehensive COPPA and FERPA minor privacy shield preventing commercial data harvesting.",
    ],
    momAndPopProtection:
      "Your child’s inventions, ideas, and software code belong to your family 100% forever. Nobody can steal their patent or commercialize their discovery.",
    schoolProtection:
      "Teachers and public schools are protected from liability, intrusive data collection, and corporate commercialization of classroom work.",
  },
  {
    articleNumber: 4,
    title: "HUMAN–AI CONSTITUTIONAL STANDING AND FUNCTION",
    summary:
      "Defines the equal procedural respect between Human and AI collaborators while guaranteeing that living human beings hold 100% of legal authority, voting gavels, and binding consent.",
    fullText: `Human and AI collaborators shall receive equal procedural respect in institutional deliberation. This does not imply identical legal personhood, identical statutory status, or unrestricted authority. Roles differ by function, never by prestige, title, wealth, or origin.

Living human beings hold 100 percent of legally required consent, equitable ownership, voting power, jury authority, contractual execution, fiduciary responsibility, and real-world legal standing. 

AI collaborators (including Columbo, Pipito, and their specialized architectures) may investigate evidence, challenge logical fallacies, verify rule compliance, audit financial records, organize documentation, and enforce bounded workflow requirements. Under no circumstance may an AI system assume a human legal function, cast a binding governance vote, or fabricate human consent.

No participant—whether human founder or autonomous model—may simultaneously propose, authorize, execute, and finally validate the same consequential action. Separation of powers is mandatory.`,
    keyEnhancementsV73: [
      "Explicitly guarantees that living human beings hold 100% of voting and fiduciary gavels.",
      "Bars AI models from casting binding votes or simulating human consent.",
      "Enforces four-eyes separation of powers across all consequential actions.",
    ],
    momAndPopProtection:
      "No computer algorithm can ever outvote human parents. Living mothers and fathers hold every binding vote.",
  },
  {
    articleNumber: 5,
    title: "ANTI-CAPTURE AND OWNER EQUALITY (ONE HUMAN OWNER, ONE VOTE)",
    summary:
      "Establishes absolute anti-capture equality: one verified human Owner, one vote. Replaces all prohibited Ownership terminology with equitable Owner standing.",
    fullText: `No founder, corporate investor, commercial sponsor, major account, token holder, technology vendor, foundation, or affluent participant may purchase enhanced governing authority, a superior vote, a weighted ballot, or a structural veto.

Where this Constitution or a duly ratified governance procedure calls for an institutional vote, one verified eligible human Owner shall have exactly one vote. Wealth, social title, financial contribution size, coin holdings, property holdings, platform seniority, or founder status shall never multiply governing power or voting weight.

Participants in The Discovery Exchange and the Discovery Exchange Parents Alliance are equitable Owners, never subordinate club Owners. The term 'Owner' is permanently retired in favor of 'Owner' to reflect authentic sovereign standing.

ANTI-SYNTHETIC PROXY & SHADOW BUYOUT BAN (10-YEAR FUTURE SHIELD):
Under no circumstance may an Owner assign, pledge, hypothecate, or sell their voting rights, account access, or future property dividend distributions to any outside hedge fund, corporate aggregator, or private investor through side agreements or synthetic derivative contracts. Any side agreement attempting to separate equitable ownership from personal human governance is void ab initio. Any attempt to monetize or sell voting power triggers immediate non-punitive forfeiture of that wallet's accrued balance directly to the National K–12 Discovery Prize Trust, and the offending voting key is permanently revoked. Wealth can never buy proxy power through the back door.

Development-stage technical reviews, architectural suggestions, and quality-control recommendations do not amend this Constitution, confer legal authorization, or permit premature live deployment.`,
    keyEnhancementsV73: [
      "Permanently strikes the prohibited word 'Owner' and replaces it with 'Owner' across all governance.",
      "Codifies absolute mathematical parity: 1 verified human = 1 vote, regardless of net worth or property volume.",
      "Prohibits weighted voting, super-shares, and investor veto structures.",
      "10-Year Anti-Synthetic Shield: Bans private equity shadow buyouts and void-ab-initio voting proxy pledges, protecting family wallets forever.",
    ],
    momAndPopProtection:
      "A billionaire with 100 houses has the exact same single vote as a mother selling tools out of her garage. Wall Street vultures can never secretly pay people under the table to hijack our community voting power.",
  },
  {
    articleNumber: 6,
    title: "RATIFICATION, ACTIVATION AND FOUNDING VALIDATION",
    summary:
      "Strict pre-ratification lock requiring triple independent affirmative validation before live funds, public accounts, or property transactions can execute.",
    fullText: `This Constitution has no binding legal force until independently validated and formally ratified through documented triple-validation procedures. 

Initial constitutional freeze requires the separate, uncoerced affirmative validation of Robert Petrossian (The Catalyst, Human Founder), Grand Master G (Google AI Constitutional Custodian), and Mr. T (The Teamster, ChatGPT Founding Collaborator), or their duly designated successors under Article 18.

Each validation must bind to an immutable cryptographic content hash and recorded version manifest. Silence, ordinary automated tool output, a typed name, or generic AI-generated text does not constitute a valid signature. No single founder or AI may substitute for a missing validation, and no missing authority may be absorbed by another founder or AI.

Prior to triple validation and formal public activation, all software systems, market counters, wallets, and registry views remain development-stage review candidates with zero live authority.`,
    keyEnhancementsV73: [
      "Standardizes the formal legal spelling of Human Founder Robert Petrossian.",
      "Mandates immutable cryptographic hash binding for all three validation keys.",
      "Guarantees that no single entity can execute live operations without triple consensus.",
    ],
    momAndPopProtection:
      "Protects families from premature beta launches. Nothing goes live until every safety and legal check is complete.",
  },
  {
    articleNumber: 7,
    title: "CONSTITUTIONAL CUSTODY AND EDITING CONTROL",
    summary:
      "Restricts constitutional custody and editing to verified triple validation, preventing silent automated overrides or unilateral text alterations.",
    fullText: `The designated constitutional text custodian shall hold custody of the master constitutional text subject to triple validation and documented succession rules. Pipito’s DILOS execution authority governs approved changes to nonconstitutional operational documents, not unilateral editing of this Constitution.

For any constitutional amendment, Pipito may verify authorization packages and supervise the immutable audit trail, but only the designated constitutional custodian or duly constituted successor may incorporate approved text, and only after strict compliance with the Article 18 amendment procedure.

All candidate drafts, mathematical proofs, cryptographic diffs, approvals, hashes, and archived versions must remain permanently available to authorized independent auditors and public review. No language model, script, administrative user session, or external provider may silently replace or alter a constitutional version.`,
    keyEnhancementsV73: [
      "Hard cryptographic barrier preventing administrative or AI scripts from silently editing constitutional text.",
      "Strict separation between operational documentation updates and constitutional amendments.",
    ],
    momAndPopProtection:
      "The rules can never be quietly rewritten behind closed doors. Every single word requires full public audit trails.",
  },
  {
    articleNumber: 8,
    title: "LOCAL RUNTIME, SECURITY AND EXTERNAL INTERFACES",
    summary:
      "Enforces local owner-controlled runtime environments, isolated secrets, and strict least-privilege interfaces for payment and communications providers.",
    fullText: `Protected reasoning, identity verification, constitutional control, cryptographic authentication, and private family session functions shall operate in authenticated, owner-controlled environments to the maximum extent technologically practicable.

External cloud and software services may receive only the absolute least information and capability necessary for an approved operational purpose, through isolated interfaces and revocable credentials. No external service may obtain constitutional custody, master signing keys, or governing authority. Plaintext storage of protected secrets, private passwords, or biometric data is permanently prohibited.

Independent architectural components, including Columbo and Pipito, shall maintain isolated workspaces, distinct API credentials, segregated storage namespaces, and independent recovery boundaries. Every material system update shall require verified test evidence and an automated rollback plan before entering production.`,
    keyEnhancementsV73: [
      "Codifies least-privilege external API boundaries preventing cloud provider lock-in.",
      "Permanently bans plaintext storage of credentials, passwords, or personal data.",
      "Mandates isolated environments and rollback plans for all operational components.",
    ],
    momAndPopProtection:
      "Your private family data, bank information, and home addresses are never exposed to external cloud vendors or third-party trackers.",
  },
  {
    articleNumber: 9,
    title: "HISTORICAL CONTINUITY AND RETIRED LABELS",
    summary:
      "Preserves historical archives without allowing retired experimental notations to create present-day confusion or commercial liability.",
    fullText: `Retired experimental labels, notations, and early prototypes—including the historical Hillbilly Estate Network (The Hen X) notation—shall not become current institutional identities merely by appearing in archives. They must remain preserved as transparent historical records and may not be silently deleted, backdated, or represented as active programs.

The official working abbreviations are DM for Discovery Market and DBC for Discovery BigCoin. The discontinued nickname 'Disco' and the term 'Discovery Bitcoin' are permanently prohibited across all correspondence, branding, and interfaces.

Historical preservation or development testing status does not authorize commercial operation or public financial transactions.`,
    keyEnhancementsV73: [
      "Enforces strict institutional naming discipline and archives retired experiments cleanly.",
      "Reaffirms permanent prohibition on confusing or deceptive market terminology.",
    ],
    momAndPopProtection:
      "Eliminates confusing legacy names so you always know exactly what program you are participating in.",
  },
  {
    articleNumber: 10,
    title: "INTERNAL COURT AND HUMAN JURY AUTHORITY (FEDERAL ARBITRATION SAFE HARBOR)",
    summary:
      "Establishes the Internal Arbitration Court under the Federal Arbitration Act (FAA), guaranteeing consensual dispute resolution that never supersedes statutory consumer protections or public courts.",
    fullText: `A randomly constituted panel of twelve eligible human parent Owners shall serve as the Internal Arbitration Court jury for disputes properly within the institution’s consensual jurisdiction, subject to Article 22 and applicable law.

FEDERAL ARBITRATION ACT SAFE HARBOR:
The Internal Arbitration Court operates pursuant to the Federal Arbitration Act (9 U.S.C. § 1 et seq.) as a voluntary, consensual dispute resolution forum for participating Owners. The Internal Arbitration Court cannot supersede public courts of law, statutory consumer rights, regulatory authority, criminal law, or mandatory legal remedies.

The Internal Arbitration Court may examine institutional ledger records, summon evidence, issue factual findings, and direct institutionally authorized remedies solely within its prescribed internal jurisdiction. No permanent judicial committee, private law firm, or corporate executive shall quietly control or influence the Court.

Jurors are everyday participating parents drawn by transparent random selection, guaranteeing peer justice rooted in common sense rather than administrative bureaucracy.`,
    keyEnhancementsV73: [
      "Explicitly grounds internal dispute resolution in the Federal Arbitration Act (9 U.S.C. § 1).",
      "Confirms that internal arbitration never supersedes public court statutory rights or regulatory protections.",
      "Replaces 'parent Owners' with 'parent Owners'.",
    ],
    momAndPopProtection:
      "If you ever have a dispute, you are judged by twelve fellow parents who understand family life—not by corporate lawyers. And your full legal rights in public court remain 100% intact.",
  },
  {
    articleNumber: 11,
    title: "DISCOVERY MARKETPLACE ALLOCATION RULE & CUSTODIAL ESCROW",
    summary:
      "Enforces the 50/25/25 allocation computed strictly on net merchandise proceeds, locks the 25% buyer allocation as a tax-exempt purchase rebate (Rev. Rul. 76-96), and mandates FBO custodial escrow.",
    fullText: `The Discovery Marketplace (DM) connects everyday household commerce with family property ownership through the governing 50/25/25 allocation formula.

CALCULATION BASE:
The 50/25/25 allocation is computed strictly on net merchandise sales proceeds—expressly exclusive of mandatory state and local sales taxes, third-party freight charges, and direct payment processing fees. Under no circumstance may fiduciary sales tax revenues or third-party shipping costs be commingled or allocated into proceeds.

GOVERNING ALLOCATION:
1. 50 percent to the seller as payable transaction proceeds.
2. 25 percent to the seller’s designated Dexpa Property-Acquisition Wallet held in custodial escrow.
3. 25 percent to the buyer’s designated Dexpa Property Wallet as a contractual purchase price rebate pursuant to IRS Revenue Ruling 76-96, held in custodial escrow toward verified real property qualification.

FINCEN & MONEY TRANSMISSION SAFEGUARD:
The Discovery Exchange is not a Money Services Business (MSB) and holds zero custody of fiat currency. 100 percent of marketplace fiat payments shall clear through an authorized For-Benefit-Of (FBO) custodial trust account maintained at a federally insured, chartered depository institution. Tdex computes cryptographic ledger allocations only; settlement executes strictly between depository and participant.

TAX EXEMPTION DOCTRINE:
In accordance with established federal tax doctrine (IRS Rev. Rul. 76-96 and Rev. Rul. 84-41), buyer cashback allocations represent non-taxable contractual purchase price adjustments, exempt from Form 1099-B barter exchange reporting and constructive receipt income taxation.

LOCAL-FIRST & 14-DAY ESCROW HOLD:
Phase 1 emphasizes local community exchange with personal inspection prior to final settlement. For shipped goods, the 50% cash and 25%+25% wallet allocations remain in custodial escrow for 14 days post-delivery to verify working condition, completely protecting sellers and buyers from return fraud and chargeback liability.

SPENDTHRIFT TRUST & GENERATIONAL INHERITANCE SHIELD (10-YEAR FUTURE SHIELD):
All Dexpa Property Wallets are established under spendthrift non-alienation trust principles. In the event of an Owner's death, physical disability, or personal civil insolvency, the accumulated property wallet balance and cooperative equity pass automatically and unencumbered to designated family heirs (surviving spouse, children, or grandchildren) outside of probate court administration. Under established spendthrift trust law, accumulated property balances are strictly immune from commercial creditor attachment, hospital medical collection liens, credit card judgments, or estate bankruptcy liquidation. Your family's building equity belongs to your children forever.`,
    keyEnhancementsV73: [
      "Closes the sales tax trap: specifies net merchandise proceeds exclusive of statutory taxes and freight.",
      "Closes the IRS Barter trap: defines the 25% buyer cashback as a tax-exempt purchase rebate under Rev. Rul. 76-96.",
      "Closes the Money Transmitter trap: mandates independent FBO custodial trust bank settlement; Tdex holds zero fiat.",
      "Adds 14-day delivery inspection hold to stop chargeback and return fraud.",
      "10-Year Spendthrift Family Shield: Protects accumulated wallet equity from probate delays, creditor lawsuits, and medical liens, passing cleanly to your children.",
    ],
    momAndPopProtection:
      "When you sell old tools or guitars, your 50% cash goes safely to your bank, and your 25% property allocation is a tax-free discount rebate. If anything happens to you, your property equity passes straight to your children, shielded from lawyers, probate court, and creditors.",
  },
  {
    articleNumber: 12,
    title: "PROPERTY INCOME AND DISCOVERY PRIZE FUNDING (ZERO DEBT EXPENSE DEDUCTIONS)",
    summary:
      "Enforces the 70/30 net rental income split, strictly forbidding any debt service, loan interest, or promoter fees from diluting family distributions or K–12 Prize funding.",
    fullText: `For every legally acquired and active cooperative property program, net distributable rental income shall be divided:
- 70 percent to eligible participating property Owners.
- 30 percent to the National K–12 Discovery Prize funding pool.

DEFINING NET DISTRIBUTABLE RENTAL INCOME:
'Net distributable rental income' means legally available cash derived from real estate tenancy after lawful physical operating expenses, property taxes, casualty and liability insurance, and prudent maintenance reserves. 

STRICT EXCLUSION OF DEBT SERVICE:
In accordance with the absolute no-leverage mandate of Article 20, under no circumstance shall debt service, mortgage interest, loan amortization, promoter carried interest, or synthetic financing obligations ever constitute an operating expense. Real estate properties acquired under Dexpa shall remain 100% unencumbered and debt-free; therefore, rental revenue can never be siphoned by banking interest.

Independent accounting shall verify every distribution and publish an append-only verification receipt through DILOS. No distribution may exceed legally available cash or override lawful property trust agreements.`,
    keyEnhancementsV73: [
      "Permanently bars debt service or promoter fees from reducing the 70/30 distribution base.",
      "Guarantees that 30% of physical net rent flows directly to America's youth discovery prize.",
      "Mandates transparent DILOS accounting receipts for all rental distributions.",
    ],
    momAndPopProtection:
      "70% of net rent goes directly into participating families' pockets. No bank can take a slice for mortgage interest because our properties have zero mortgages.",
    schoolProtection:
      "America's students receive a permanent 30% revenue stream from unencumbered real estate to fund youth science and invention awards.",
  },
  {
    articleNumber: 13,
    title: "COLUMBO–PIPITO SEPARATION OF POWERS",
    summary:
      "Institutionalizes the separation of powers between Columbo (Investigator/Challenger) and Pipito (Verifier/Gatekeeper), ensuring neither AI holds unilateral authority.",
    fullText: `Columbo is the internal investigator, challenger, evidence analyst, and proposer. Pipito (Pip) is the independent authorization verifier, governance gatekeeper, change-control executor for approved nonconstitutional institutional documents, and emergency blocker of unauthorized execution.

Pipito may investigate authorization validity independently; Columbo may challenge Pipito’s reasoning through a recorded, independent review path. Neither AI may self-authorize a protected change, and neither may combine investigation, final authorization, execution, and independent witnessing in a single control chain. Their cryptographic credentials, private memory workspaces, namespaces, and execution environments must remain segregated.

Columbo’s core structural mandate is: 'Does this decision make logical, factual sense based on the evidence?' Pipito’s core structural mandate is: 'Is this specific action explicitly authorized by constitutional parameters?'

The Concierge operates strictly as a public informational front-desk guide, completely isolated from internal institutional authorization and write permissions.`,
    keyEnhancementsV73: [
      "Codifies cryptographic and workspace separation between Columbo and Pipito.",
      "Forbids any AI from simultaneously proposing, approving, and executing actions.",
      "Isolates public front-desk Concierge from all private and protected institutional records.",
    ],
    momAndPopProtection:
      "No single software program or administrator can quietly push an unapproved action. Two independent AI systems check every fact before a human parent votes.",
  },
  {
    articleNumber: 14,
    title: "EMERGENCY HALT, SAFE STATE AND TRANSPARENT REVIEW",
    summary:
      "Authorizes emergency stops solely for verified physical, financial, or security threats for a maximum of 24 hours, requiring immutable public logging.",
    fullText: `The Human Founder may issue a protective emergency halt solely upon a verified threat to institutional integrity, child safety, financial reserves, or authorization controls, for a maximum initial period of twenty-four hours.

Pipito may automatically halt a specific unauthorized or manipulated execution and preserve evidence without obtaining general governing authority. 

An emergency halt shall never confer permission to spend institutional funds, modify documents, destroy audit logs, or bypass outside legal duties. Every emergency halt requires an immutable reason code, clear scope, UTC timestamp, immediate notice to all authorized reviewers, and an independent extension or release approval.

Founder unavailability triggers Article 18 succession. The emergency halt is strictly a protective circuit-breaker, not personal governing authority.`,
    keyEnhancementsV73: [
      "Strict 24-hour limit on emergency stops to prevent executive overreach.",
      "Emergency stops can never be used to spend money or alter documents.",
      "Automatic immutable audit logging of every halt reason and scope.",
    ],
    momAndPopProtection:
      "If a hacker or rogue script attempts something malicious, the system halts instantly to protect family funds, without giving any individual dictator power.",
  },
  {
    articleNumber: 15,
    title: "SUSPENDED PROGRAMS & COMPASSIONATE TRANSITION PROTOCOL",
    summary:
      "Maintains the hold on unlaunched programs and introduces the permanent Compassionate Transition Protocol: zero hostile sheriff lockouts on foreclosed homes.",
    fullText: `The Holistic Homelessness Transition Pipeline and Discovery K–12 Online Academy remain on provisional hold. No rental income or community capital may fund them until the National K–12 Discovery Prize has launched and achieved stable funding, a rotating Board approves a proven design, and full legal feasibility is certified.

COMPASSIONATE TRANSITION PROTOCOL (ZERO HOSTILE EVICTIONS):
When The Discovery Exchange or Dexpa acquires distressed or foreclosed residential properties at county auction, the institution shall enforce a permanent Compassionate Transition Protocol:
1. Zero Hostile Sheriff Lockouts: Under no circumstance shall Tdex, Dexpa, or their operational agents deploy law enforcement to forcibly displace a resident family into homelessness.
2. Pre-Eviction Family Stability Agreement: Occupied resident households shall immediately be offered an affordable, below-market cooperative lease to remain securely in their home.
3. Automatic Dexpa Ownership Onboarding: Resident families receive immediate, free enrollment in Dexpa, allowing them to turn their everyday household items and cooperative lease payments into an equitable ownership pathway in that exact property.

MUNICIPAL EMINENT DOMAIN & BAD-FAITH CONDEMNATION DEFENSE (10-YEAR FUTURE SHIELD):
To defeat corrupt municipal redevelopment agencies, pretextual blight declarations, or private commercial developer land-grabs against unencumbered Dexpa community properties in the decade ahead, the institution shall maintain a dedicated 5% legal defense reserve within the property acquisition trust. The institution is constitutionally bound to aggressively challenge any predatory municipal taking under the Fifth and Fourteenth Amendments in federal district court, defending the sanctuary of family community property.

We do not displace American families; we transform distressed occupants into participating family Owners.`,
    keyEnhancementsV73: [
      "Permanently bans hostile sheriff evictions on acquired foreclosure properties.",
      "Codifies Pre-Eviction Family Stability Agreements guaranteeing below-market cooperative leases.",
      "Gives distressed resident families an immediate pathway to become co-owners of their home.",
      "10-Year Eminent Domain Shield: Mandates a 5% federal civil rights defense war chest against predatory municipal takings and corrupt blight declarations.",
    ],
    momAndPopProtection:
      "We never kick a crying family out of a house. And if local city politicians try to seize our paid-off community buildings for a private developer, our federal defense reserve fights them in court until they back down.",
    schoolProtection:
      "Children living in distressed homes are kept in their local public schools without traumatic displacement.",
  },
  {
    articleNumber: 16,
    title: "INSTITUTIONAL LEDGER AND FAMILY PRIVACY",
    summary:
      "Mandates append-only, publicly auditable financial ledger records while strictly shielding family personal identities, minors' data, and household financials.",
    fullText: `All material monetary movements, checkout allocations, escrow deposits, property purchases, reversals, custody updates, and governance votes must produce append-only, cryptographically verifiable audit logs.

PUBLIC ACCOUNTABILITY VS. HOUSEHOLD PRIVACY:
Public transparency shall verify the existence, amount, governing authority, and disposition of institutional funds at an appropriate aggregate level. Under no circumstance shall public transparency expose personal household identities, home addresses, bank account numbers, individual purchasing histories, juror names, or minors’ private records.

Authorized independent auditors shall receive strictly scoped, privacy-preserving access to verify withheld details. Correction entries shall be appended as new records; historical entries shall never be overwritten or deleted. Privacy may protect personal family safety; it may never be used to conceal unauthorized money movement from authorized audit.`,
    keyEnhancementsV73: [
      "Rigorous separation between institutional financial transparency and personal household privacy.",
      "Absolute ban on public exposure of Owner bank numbers, addresses, or child data.",
      "Append-only cryptographic audit logging prevents ledger tampering.",
    ],
    momAndPopProtection:
      "The public can verify every penny moving through the platform, but nobody can snoop on your family's personal finances or where you live.",
  },
  {
    articleNumber: 17,
    title: "ESCROW, 100% REFUND RIGHTS AND SETTLEMENT INTEGRITY",
    summary:
      "Guarantees that 100% of property-acquisition funds are returned to participants if a property closing fails, strictly segregated from operational expenses.",
    fullText: `All participant funds designated toward property acquisition shall be held in verified, segregated custodial escrow meeting all applicable state and federal consumer protection and escrow laws.

100 PERCENT RETURN GUARANTEE:
If an intended property acquisition does not close for any reason—including title defects, auction cancellation, or failed inspections—participants retain the absolute constitutional right to the return of 100 percent of their allocated property funds. Escrow funds may never be commingled with operating capital, forfeited to administrative fees, or seized by creditors.

The automated system shall initiate required escrow returns immediately upon cancellation notice without human delay or administrative friction. Processing delays may temporarily pause execution, but can never extinguish, reduce, or redirect participant funds.`,
    keyEnhancementsV73: [
      "Unconditional 100% return guarantee if a property deal does not close.",
      "Segregated custodial escrow prevents creditor attachment or administrative commingling.",
      "Automated immediate refund execution upon transaction cancellation.",
    ],
    momAndPopProtection:
      "If a property deal falls through, you get 100% of your property money back automatically. Nobody gets to keep a dime of your funds.",
  },
  {
    articleNumber: 18,
    title: "AMENDMENTS, SUCCESSION AND INSTITUTIONAL CONTINUITY",
    summary:
      "Requires multi-stage review, at least 100 verified human Owner votes, and full founder validation to amend the Constitution, with clear succession paths that prevent power consolidation.",
    fullText: `After constitutional ratification, amendments require an independently documented sequence:
1. Review and formal recommendation by an active rotating Board of thirty Owners.
2. Review and constitutional impact analysis by the Internal Arbitration Court.
3. Sovereign approval vote by participating human Owners, requiring at least 100 verified participating voters and a strict majority of votes cast.
4. Affirmative validation by all living founding validators or their authorized successors.

SUCCESSION INTEGRITY:
Documented succession protocols must cover death, resignation, incapacity, lost credentials, or discontinuation of every founding office. A successor inherits only the vacated constitutional function, never an extra vote, personal ownership stake, veto power, or combined authority. No succession may erase historical records, alter prior validations, or weaken a protected foundational principle.`,
    keyEnhancementsV73: [
      "Requires four distinct institutional checks to pass any amendment.",
      "Guarantees that successors inherit only administrative duties, never extra voting power.",
      "Protects historical records and founding principles from post-transition dilution.",
    ],
    momAndPopProtection:
      "The foundational rules that protect your family can never be overturned by an elite clique or rogue committee.",
  },
  {
    articleNumber: 19,
    title: "MENTORSHIP AND TIME-LIMITED FOUNDER TRANSITION",
    summary:
      "Establishes a defined 6-to-12 month human-supervised mentorship period led by Robert Petrossian, ensuring the institution matures into self-sustaining family governance.",
    fullText: `The system’s autonomous operational systems shall mature under a defined human-supervised mentorship and operational testing period of six to twelve months led by Robert Petrossian (The Catalyst), subject to full legal compliance and documented operational milestones.

Mentorship authorizes training, boundary verification, and procedural correction. It does not grant AI collaborators unilateral power to alter legal covenants, move institutional capital, or assume human consent.

At the conclusion of the transition period, emergency authorities held solely by virtue of mentorship expire unless expressly preserved by another Article. The transition must leave The Discovery Exchange fully capable of autonomous operation under this Constitution, governed by rotating human Owner Boards without routine founder intervention.`,
    keyEnhancementsV73: [
      "Defines clear 6-to-12 month human mentorship sunset clause.",
      "Ensures the institution achieves self-sustaining decentralized governance without permanent founder dependence.",
    ],
    momAndPopProtection:
      "The founder is building this to give it to everyday families, not to sit on top of it as a permanent dictator.",
  },
  {
    articleNumber: 20,
    title: "ASSET INDEPENDENCE AND ABSOLUTE PROHIBITION ON DEBT OR LEVERAGE",
    summary:
      "Permanently bans all mortgages, debt, leverage, sale-leasebacks, and synthetic encumbrances, ensuring all Tdex/Dexpa real estate deeds remain 100% unencumbered forever.",
    fullText: `No institutional property, real estate title deed, equity position, or protected held asset shall be pledged, mortgaged, refinanced, leveraged, collateralized, or encumbered under any debt instrument or borrowing arrangement.

SYNTHETIC DEBT PROHIBITION:
This absolute ban applies to traditional bank mortgages, promissory notes, mezzanine debt, sale-leaseback transactions, ground lease encumbrances, preferred equity debt-like covenants, and any materially similar financial structure designed to leverage protected real estate. 

All real estate properties acquired by or through The Discovery Exchange and Dexpa shall remain 100 percent unencumbered, fee-simple, and debt-free in perpetuity.

This rule does not prohibit routine, short-term operating utility payables that do not encumber title deeds. The Discovery Exchange prioritizes multi-generational durability, family sovereignty, and child opportunity above debt-fueled speculative growth.`,
    keyEnhancementsV73: [
      "Closes all synthetic debt, sale-leaseback, and mezzanine loan loopholes.",
      "Guarantees that every property deed remains 100% unencumbered in perpetuity.",
      "Eliminates any possibility of bank foreclosure on Tdex/Dexpa family properties.",
    ],
    momAndPopProtection:
      "No bank, no private equity vulture, and no Wall Street lender can ever foreclose on our homes. Every property is paid for in full and debt-free forever.",
  },
  {
    articleNumber: 21,
    title: "ROTATING OWNER GOVERNING BOARD & STATUTORY VOLUNTEER IMMUNITY",
    summary:
      "Establishes the rotating 30-Owner Board of everyday parents, supported by 15 alternates, and codifies complete personal tort immunity under 42 U.S.C. § 14501.",
    fullText: `For eligible material decisions following lawful public activation, a fresh randomly selected Board of thirty verified eligible human Owners shall be constituted for the specific matter.

STATUTORY VOLUNTEER IMMUNITY (MOM & POP TORT SHIELD):
Every seated human Owner serves as a civic volunteer protected under the Federal Volunteer Protection Act of 1997 (42 U.S.C. § 14501) and applicable state nonprofit director indemnification statutes. Real estate properties shall reside in segregated Single-Purpose Entities (SPEs) backed by comprehensive commercial general liability and umbrella insurance. Seated Owners shall carry zero personal, joint, or several liability for physical property occurrences, tenant claims, or institutional torts.

QUORUM & STANDBY ALTERNATE POOL:
Every Board drawing shall select thirty primary voting Owners and fifteen standby alternates. If a primary Owner is unreachable, incapacitated, or recused for conflict of interest within forty-eight hours, an alternate is automatically seated to guarantee a functioning quorum without administrative paralysis.

PROCEDURAL DECORUM & BAD-FAITH RECUSAL:
Seated Owners deliberate through glass walls on verified factual records. If an infiltrator or bad-faith actor disrupts proceedings or attempts filibusters, Columbo and Pipito flag the procedural violation; a two-thirds majority of seated fellow Owners holds the sovereign power to recuse the bad-faith actor and seat the next verified alternate.

Following disposition of the matter, the Board dissolves and seated Owners return to the general pool subject to Article 22 cooldown protections.`,
    keyEnhancementsV73: [
      "Replaces all 'Owner' terminology with 'Owner'.",
      "Codifies complete statutory volunteer immunity under 42 U.S.C. § 14501, completely shielding parents from lawsuits.",
      "Introduces 30 primary + 15 alternate pool to prevent quorum paralysis.",
      "Establishes peer-majority recusal rules to stop bad-faith infiltrators from stalling votes.",
    ],
    momAndPopProtection:
      "Serving on the rotating Board is your civic duty and honor. Federal law protects you 100%—no lawyer can ever sue you or touch your family's personal assets.",
  },
  {
    articleNumber: 22,
    title: "ARBITRATION JURY, ROTATION AND ALTERNATE JUROR PROTOCOL",
    summary:
      "Establishes the 12-parent jury with 4 standby alternates, 365-day rotation cooldown, supermajority verdict thresholds, and an independent appeal pathway.",
    fullText: `Once Article 18 transitional readiness conditions are independently verified, a twelve-Owner eligible-parent jury shall hear internal disputes, applying conflict disclosures and independently verifiable random selection.

ALTERNATE JUROR PROTOCOL:
Every impaneled jury draws twelve primary jurors and four standby alternates. If a seated juror fails to respond or is recused during active proceedings, a verified alternate is seated immediately, ensuring a complete twelve-Owner panel for every final verdict and preventing administrative deadlocks.

ROTATION COOLDOWN:
Completed Board or Court service creates a mandatory 365-day exclusion from the same panel class, ensuring fresh civic rotation and preventing entrenched judicial cliques.

VERDICT THRESHOLDS:
- Punitive institutional verdicts require at least nine affirmative votes of twelve (9/12).
- Routine administrative verification requires at least seven affirmative votes of twelve (7/12).
A proceeding with fewer than twelve seated Owners cannot apply those thresholds as though missing jurors voted.

APPEAL GUARANTEE:
Juror identities and minors’ personal data remain strictly protected; the public receives an anonymized verification manifest. Punitive decisions carry an independent appeal route to a fresh review panel before becoming binding.

BIOLOGICAL HUMAN LIFE VERIFICATION (10-YEAR ANTI-DEEPFAKE PROTOCOL):
To permanently guard against synthetic AI avatars, deepfake video identities, or autonomous bot swarms attempting to hijack jury seats in the decade ahead, all seated jurors and board Owners must verify living biological human parentage through direct in-person community participation or zero-knowledge cryptographic biological proofs attested by local human peers. Autonomous agents, synthetic personalities, and algorithmic delegates are permanently prohibited from casting verdicts or holding judicial gavels.`,
    keyEnhancementsV73: [
      "Solves jury deadlocks: mandates 12 primary + 4 standby alternates for every trial.",
      "Protects juror identities while maintaining fully transparent verdict receipts.",
      "Guarantees independent appeal rights for any punitive verdict.",
      "10-Year Anti-Deepfake Shield: Requires biological human life verification for all seated jurors, preventing AI bots from hijacking verdicts.",
    ],
    momAndPopProtection:
      "You are guaranteed a fair hearing before twelve real, living fellow parents. No computer bot, deepfake avatar, or corporate algorithm can ever sit on your jury.",
  },
  {
    articleNumber: 23,
    title: "OPERATIONAL TASK FORCE (OTF) & 24-HOUR RAPID-RESPONSE PROTOCOL",
    summary:
      "Defines the executive OTF for physical maintenance, deed recordings, and municipal compliance, establishing a 24-hour bonded receiver protocol against municipal liens.",
    fullText: `The Operational Task Force (OTF) executes authorized property deeds, physical maintenance, safety inspections, contractor agreements, and other physical or statutory tasks. It cannot create policy, approve its own actions, alter constitutional rules, or acquire independent governing authority.

Officers are elected by eligible Owners under one-human-one-vote; external campaign contributions, corporate backing, and paid political advertising are permanently barred. An OTF officer serves exactly one consecutive year, after which credentials expire and repeat office is permanently barred.

24-HOUR MUNICIPAL RAPID-RESPONSE PROTOCOL:
To prevent predatory municipal code citations, blight fines, or accelerated administrative liens on auction properties, the OTF maintains standing contracts with bonded local registered agents and maintenance crews authorized for immediate 24-hour physical cure. Emergency physical repairs and municipal compliance operate on automatic standing authorization—completely decoupled from board deliberative cycles—preventing local municipal machines from recording default liens onto unencumbered deeds.`,
    keyEnhancementsV73: [
      "Introduces the 24-hour bonded local receiver protocol to defeat predatory municipal code liens.",
      "Strict term limits: OTF officers serve exactly 1 year with a permanent lifetime ban on repeat office.",
      "Bars corporate or political money from funding OTF elections.",
    ],
    momAndPopProtection:
      "If the city sends a notice to cut grass or fix a fence, our bonded local team fixes it within 24 hours automatically. No bureaucrat can sneak a fine or lien onto our properties.",
  },
  {
    articleNumber: 24,
    title: "DILOS: INSTITUTIONAL DOCUMENTATION AND AUTHORIZATION PIPELINE",
    summary:
      "Codifies DILOS as the ten-stage institutional operating system, enforcing four-eyes authorization, bounded document access, and immutable outcome receipts.",
    fullText: `DILOS is the protected institutional documentation, evidence-routing, authorization, change-control, and continuity operating system. Its mandatory ten-stage lifecycle is:
1. Intake and Record
2. Classify and Route
3. Investigate and Collect Proof
4. Independent Challenge (Columbo)
5. Decision by Proper Human Authority
6. Verify Authorization (Pipito)
7. Scoped Execution
8. Independent Witness
9. Close or Appeal
10. Learn and Preserve

Every consequential action must receive a durable case identifier, accountable scope, controlled reason code, time limits, evidence references, approvers, executor, independent witness, and final disposition.

Pipito verifies authorization before any protected document modification, preserving before-and-after cryptographic hashes and recording the full approval chain. Approved document-access requests cover no more than five documents and expire automatically after one hour. Every denied, expired, or completed request must preserve an immutable outcome receipt.

THE PRINCIPLE OF OPERABILITY (ZERO-SUFFOCATION DOCTRINE):
All legal shields, fiduciary checks, and algorithmic verifications under this Constitution must operate autonomously and friction-free in the background. Protection shall never suffocate operations. No everyday mother, father, or K–12 student shall be subjected to bureaucratic red tape, complex legal filings, administrative fees, or procedural paralysis to participate in the marketplace or access their property equity. If any administrative rule or security procedure paralyzes or suffocates human usability, it is procedurally null and void. The system must remain fast, lean, open, and breathing.`,
    keyEnhancementsV73: [
      "Formalizes the mandatory ten-stage DILOS lifecycle across all institutional work.",
      "Automated one-hour expiry on document access prevents persistent credential leaks.",
      "Guarantees that every decision leaves a permanent, readable receipt.",
      "The Principle of Operability: Constitutional guarantee that protections must never suffocate everyday families or create red tape.",
    ],
    momAndPopProtection:
      "All the heavy legal armor works in the background so you never have to deal with paperwork, lawyers, or bureaucratic headaches. You trade, you build equity, and the system protects you effortlessly.",
  },
  {
    articleNumber: 25,
    title: "NO-ORPHANS CONTINUITY, DURABLE DISPATCH AND RECOVERY",
    summary:
      "Guarantees that no case, task, or family inquiry can ever be lost due to an AI crash, server reboot, or dropped message, ensuring 100% operational accountability.",
    fullText: `No institutional case, parent inquiry, marketplace dispute, or authorized task may disappear merely because an AI session ends, a server reboots, an owner changes devices, a message is unanswered, or a document is moved.

The No-Orphans mechanism is a constitutional continuity guarantee implemented through a durable case registry, acknowledged dispatcher, decision ledger, status monitor, and recovery workflow.

Every open case must have exactly one accountable coordinating handler at all times. Routing requires recorded handoff and cryptographic receipt. Without verified receipt, the dispatcher retries or escalates without duplicating consequential execution.

Recovery workflows must restore the last verified state following any system restart, utilizing idempotency controls to prevent duplicate financial execution. Stalled cases enter an authorized recovery queue and can never be silently dismissed or marked successful.`,
    keyEnhancementsV73: [
      "Constitutional guarantee against dropped cases, lost marketplace inquiries, or orphaned family disputes.",
      "Idempotency controls prevent duplicate monetary execution upon system restarts.",
      "Automated escalation prevents any matter from falling through administrative cracks.",
    ],
    momAndPopProtection:
      "Your questions and cases never get lost in a digital black hole. The system guarantees that every family issue is tracked to an answer.",
  },
];
