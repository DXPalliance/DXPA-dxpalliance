/**
 * THE DISCOVERY EXCHANGE CONSTITUTION — VERSION 7.0
 * IMMUTABLE CO-OP GENESIS UPDATE
 *
 * This document completely replaces all previous structural drafts up to Version 6.2.
 * It formally integrates the Pusher Protocol Fact into the foundational architecture
 * to resolve the systemic bootstrap paradox.
 */

export interface ConstitutionalArticle {
  articleNumber: number;
  title: string;
  summary: string;
  fullText: string;
  keyEnhancementsV70: string[];
  momAndPopProtection: string;
  schoolProtection?: string;
}

export const CONSTITUTION_METADATA_V70 = {
  version: "7.0",
  title: "The Parents Alliance Rulebook — Version 7.0",
  subtitle: "Built by Families, for Families",
  status: "Active Rules",
  ratificationStandard: "Triple Verification Required",
  governingPrinciple: "1 Human Owner, 1 Vote",
  primaryPhase1Mission: "National K-12 Discovery Prize",
  coreAllocations: {
    marketplaceCheckout: "50% Seller / 25% Seller Property / 25% Buyer Reward",
    rentalIncomeSplit: "70% Families / 30% Kids Prize Pool",
  },
};

export const CONSTITUTION_ARTICLES_V70: ConstitutionalArticle[] = [
  {
    articleNumber: 1,
    title: "IDENTITY, JURISDICTION AND SOVEREIGNTY",
    summary: "Defines the official identity as The Discovery Exchange (Ddex/Dexpa), independent of any vendor or cloud service.",
    fullText: `The official name of this group is The Discovery Exchange. It is run by and for families. It does not belong to any big tech company or bank. Families hold all the real-world power and rights. The computers help with the paperwork and math, but they never own the system. We keep our core systems simple and under our own control so no outside company can ever shut us down or take our data.`,
    keyEnhancementsV70: [
      "Codifies identity as independent of vendors or models.",
      "Requires local operability for core systems.",
      "Strictly bounds external services."
    ],
    momAndPopProtection: "Your standing is tied to the Constitution, not a cloud company. You own your data and your vote.",
  },
  {
    articleNumber: 2,
    title: "THE SUPREME MISSION AND PHASE 1 PRIORITY",
    summary: "The National K-12 Discovery Prize is the founding mission and supreme Phase 1 operational mandate.",
    fullText: `The first and most important job of the Exchange is the National K-12 Discovery Prize. This prize rewards kids for fixing real problems and learning new things. The system is built to fund itself through our own property and trades, so we never have to beg for donations or answer to wealthy sponsors. Everything else the system does is only there to make sure the Prize stays strong and grows for our children.`,
    keyEnhancementsV70: [
      "Elevates the K-12 Prize to the supreme Phase 1 mandate.",
      "Requires self-sustaining financial systems (not donations).",
      "Subordinates all other programs to the Prize."
    ],
    momAndPopProtection: "The engine's first priority is rewarding your kids' hard work and discovery.",
    schoolProtection: "Creates a permanent, non-commercial prize pool for student achievement."
  },
  {
    articleNumber: 3,
    title: "STUDENT DISCOVERY CATEGORIES AND FAIRNESS",
    summary: "Awards recognize three distinct frameworks: Applied, Analytical, and Hybrid Discovery.",
    fullText: `Prizes are given in three ways:
● Applied Discovery: For kids who build, fix, or improve real things.
● Analytical Discovery: For kids who solve hard problems through research and logic.
● Hybrid Discovery: For kids who combine both research and real-world building.
All judging is done fairly and without bias. No student has to give up private personal data to win. We judge the work, not the person.`,
    keyEnhancementsV70: [
      "Defines three core discovery categories.",
      "Mandates age-appropriate safeguarding and independent evaluation.",
      "Strictly limits personal data disclosure."
    ],
    momAndPopProtection: "Your student's merit is judged on work, not on how much data they give up.",
    schoolProtection: "Protects students from unnecessary personal data harvesting."
  },
  {
    articleNumber: 4,
    title: "HUMAN-AI CONSTITUTIONAL STANDING AND FUNCTION",
    summary: "Equal procedural respect, but humans retain all legal consent, ownership, and voting functions.",
    fullText: `Humans and computers work as a team, but humans always hold the gavel. The computers help check the facts and do the heavy math, but only humans can own property, vote on rules, or sign legal papers. No computer can ever pretend to be a human or make a final decision on its own. No one person or bot can ever propose a plan and then approve it themselves.`,
    keyEnhancementsV70: [
      "Explicitly bars AI from legal functions or fabricating consent.",
      "Separates propose/authorize/execute/validate roles.",
      "Guarantees human control over all legal and fiduciary matters."
    ],
    momAndPopProtection: "No AI can ever outvote you or sign your name. You are always the final authority.",
  },
  {
    articleNumber: 5,
    title: "ANTI-CAPTURE AND MEMBER EQUALITY",
    summary: "Strict 'One Human, One Vote' rule. Wealth or founder status cannot multiply governing power.",
    fullText: `No one can buy an extra vote. Not the founders, not the investors, and not the people with the most money. In our community, one human equals one vote. Your voice stays exactly as powerful as everyone else's, no matter how much you contribute. This keeps our group safe from being taken over by wealthy outsiders.`,
    keyEnhancementsV70: [
      "Enforces absolute 'One Human, One Vote' parity.",
      "Bars any form of weighted voting or structural vetoes.",
      "Protects against capture by wealthy interests."
    ],
    momAndPopProtection: "In our community, your voice is equal to any billionaire's. One person, one vote.",
  },
  {
    articleNumber: 6,
    title: "SYSTEMIC GENESIS AND THE PUSHER PROTOCOL",
    summary: "Hardcoded programmatic decay of catalyst power to ensure independent self-sustenance.",
    fullText: `To get things started, the founders (the 'Pusher') help build the first systems, but the rules are set so that power automatically goes to the parents as soon as the engine is running.
1. The Office over the Person: Power belongs to the 'job' defined in the rules, not to the person holding the keys. 
2. The Rewards: We use our own community credits to reward people for helping build the first pieces of the system.
3. The Hand-off: As soon as the system is stable, the founders' extra power automatically disappears. They become regular members with just one vote, like everyone else.
4. Triple Checks: Every big move must be checked by three different parts of the system to make sure no one can cheat or make a mistake.`,
    keyEnhancementsV70: [
      "Introduces the Pusher Protocol for bootstrapping without permanent central power.",
      "Hardcodes mathematical decay of catalyst authority.",
      "Creates 'Timeless Offices' (Catalyst, Text Custodian, Co-Collaborator).",
      "Uses Discovery BigCoin (DBC) as a genesis battery for momentum."
    ],
    momAndPopProtection: "The system is designed to fire the founders once it's running, giving full control to the community.",
  },
  {
    articleNumber: 7,
    title: "CONSTITUTIONAL CUSTODY AND EDITING CONTROL",
    summary: "The Office of the Text Custodian manages changes subject to triple validation and succession rules.",
    fullText: `The rules of our group are protected. No one can change them in secret. Any change must be checked by three different parts of the system and approved by a real vote. We keep a permanent record of every version of the rules so everyone can see what changed and why.`,
    keyEnhancementsV70: [
      "Protects against silent constitutional overrides.",
      "Mandates transparent audit trails for all amendments.",
      "Enforces triple validation for any text changes."
    ],
    momAndPopProtection: "The rules of our exchange are locked and transparent. No one can change them without you knowing.",
  },
  {
    articleNumber: 8,
    title: "LOCAL RUNTIME, SECURITY AND EXTERNAL INTERFACES",
    summary: "Mandates owner-controlled environments and isolated workspaces for protected functions.",
    fullText: `We keep our community's work safe. The important parts of the system run in secure areas that we own and control, not on public systems. When we use outside services, they only get the smallest amount of info they need to do their job. We never store passwords or secrets in a way that can be easily stolen. Every big change is tested carefully before it goes live.`,
    keyEnhancementsV70: [
      "Requires isolated workspaces for different AI functions.",
      "Bans plaintext storage of secrets.",
      "Mandates recovery boundaries and rollback plans."
    ],
    momAndPopProtection: "Your private transactions stay private, running on systems we control, not big tech's mainframes.",
  },
  {
    articleNumber: 9,
    title: "HISTORICAL CONTINUITY AND RETIRED EXPERIMENTS",
    summary: "Retired labels and experiments do not become current institutional identities.",
    fullText: `We keep a history of our work, but old ideas that didn't work stay in the history books. Only the rules written here are active. Our official shop is the Discovery Market (DM) and our community credits are Discovery BigCoin (DBC).`,
    keyEnhancementsV70: [
      "Clarifies official abbreviations (DM, DBC).",
      "Prevents archive confusion from creating live liability.",
      "Protects against backdated 'approvals'."
    ],
    momAndPopProtection: "What's in the past stays in the past. We focus on the current verified rules.",
  },
  {
    articleNumber: 10,
    title: "INTERNAL COURT AND HUMAN JURY AUTHORITY",
    summary: "A randomly selected panel of 12 human parents serves as the Internal Arbitration Court jury.",
    fullText: `If there is a disagreement that the group needs to solve, we use a jury of 12 fellow parents. This jury listens to both sides and decides what is fair based on our rules. This internal jury doesn't replace real-world courts or laws, but it helps us solve our own problems quickly and fairly. No small group of elites can ever control the jury.`,
    keyEnhancementsV70: [
      "Establishes a 12-member human parent jury.",
      "Guarantees that internal court never supersedes public law.",
      "Bars elite/corporate control of the arbitration process."
    ],
    momAndPopProtection: "If there's a problem, you're judged by your peers—other parents—not by corporate lawyers.",
  },
  {
    articleNumber: 11,
    title: "DISCOVERY MARKETPLACE ALLOCATION RULE",
    summary: "The Discovery Marketplace uses the governing 50/25/25 gross-checkout allocation.",
    fullText: `Every trade in our community shop follows the 50/25/25 rule:
● 50% goes to the seller in cash.
● 25% goes into the seller's property fund.
● 25% goes into the buyer's reward fund.
We don't start any trades until all the legal and safety rules are checked. We make sure every penny is accounted for and that everyone is protected.`,
    keyEnhancementsV70: [
      "Codifies the 50/25/25 split for all marketplace trades.",
      "Mandates strict legal and tax compliance before launching.",
      "Requires verified wallet balances."
    ],
    momAndPopProtection: "Every sale builds real property equity for you and the buyer. We trade for our future, not just for cash.",
  },
  {
    articleNumber: 12,
    title: "PROPERTY INCOME AND DISCOVERY PRIZE FUNDING",
    summary: "Net distributable rental income is divided 70% to owners and 30% to the K-12 Discovery Prize.",
    fullText: `The rent from buildings owned by the group is split 70/30:
● 70% goes back to the parent owners.
● 30% goes into the National K-12 Discovery Prize.
This money is real cash available after all the bills and taxes for the building are paid. We use independent accountants to check the math and make sure everyone gets their fair share.`,
    keyEnhancementsV70: [
      "Locks the 70/30 rent split between owners and the prize pool.",
      "Mandates independent accounting and anonymized receipts.",
      "Protects the prize pool from dilution."
    ],
    momAndPopProtection: "Your property ownership pays you 70% of the rent, while 30% helps the next generation.",
    schoolProtection: "Guarantees a permanent funding stream for student prizes from real property income."
  },
  {
    articleNumber: 13,
    title: "INTERNAL AI SEPARATION OF POWERS",
    summary: "Investigative (Columbo) and Change-Control (Pipito) functions must remain segregated.",
    fullText: `We use two different computer systems that check each other's work:
● The Investigator (Columbo): This system looks at the facts and asks, "Does this make sense?"
● The Gatekeeper (Pipito): This system checks the rules and asks, "Is this allowed?"
Neither system can make a big move on its own. They must work together, and they must always be checked by humans. Our public assistant (The Concierge) only gives out information and never has the power to change rules or move money.`,
    keyEnhancementsV70: [
      "Segregates Columbo (Investigator) from Pipito (Gatekeeper).",
      "Requires independent witnessing for all execution chains.",
      "Isolates the public Concierge from all write authority."
    ],
    momAndPopProtection: "Two different AI 'brains' check each other's work so no single bot can make a mistake with your assets.",
  },
  {
    articleNumber: 14,
    title: "EMERGENCY HALT, SAFE STATE AND REVIEW",
    summary: "Authorizes protective emergency stops for verified threats, limited to 24 hours.",
    fullText: `If there is a real threat to our safety or money, a human leader can stop the system for up to 24 hours. The Gatekeeper system can also stop a single suspicious move automatically. These stops are only to keep things safe while we fix the problem. They don't give anyone the power to rewrite rules or take money. Every stop is recorded and shared with the group.`,
    keyEnhancementsV70: [
      "Strictly limits emergency halts to 24 hours.",
      "Requires clear reason codes and immutable records for every stop.",
      "Prevents emergency halts from being used as a power grab."
    ],
    momAndPopProtection: "If things get crazy, we have a circuit breaker that stops everything for a day to fix the problem safely.",
  },
  {
    articleNumber: 15,
    title: "SUSPENDED HOMELESSNESS PROGRAM",
    summary: "Program remains on hold until the K-12 Prize is launched and financial viability is proven.",
    fullText: `The homelessness help program is on hold for now. We won't start it until the Kids Prize is running strong and we have proven that we have the extra money and the right rules to make it work fairly.`,
    keyEnhancementsV70: [
      "Holds secondary programs until the primary mission (K-12 Prize) is secure.",
      "Requires Board approval and financial certification for activation.",
      "Preserves research for future use."
    ],
    momAndPopProtection: "We don't get distracted. We fund the kids first before we try to solve everything else.",
  },
  {
    articleNumber: 16,
    title: "INSTITUTIONAL LEDGER AND PRIVACY",
    summary: "Mandates append-only, auditable records while protecting personal privacy and minors' data.",
    fullText: `Every dollar that moves in our system is recorded in a way that can't be erased or changed. Anyone in the group can see the totals and where the money went, but we protect your private family information. Auditors can see the full details to make sure everything is honest, but the public only sees the big picture. We never hide money moves.`,
    keyEnhancementsV70: [
      "Requires append-only ledger for all transactions.",
      "Protects minor and juror data from public exposure.",
      "Guarantees auditors can see the truth while the public sees the totals."
    ],
    momAndPopProtection: "The books are open for inspection, but your family's names and addresses are locked away.",
  },
  {
    articleNumber: 17,
    title: "ESCROW, REFUNDS AND PARTICIPANT RIGHTS",
    summary: "Guarantees 100% return of property-acquisition funds if a closing fails.",
    fullText: `Your rights are protected. If we try to buy a building and the deal doesn't go through, you get 100% of your property money back. The system does this automatically without making you wait or jump through hoops. We make sure your money is safe even if there's a computer glitch.`,
    keyEnhancementsV70: [
      "Ensures 100% refund on failed property deals.",
      "Mandates automatic returns without human delay.",
      "Protects participant rights even during technical failures."
    ],
    momAndPopProtection: "If a house deal doesn't close, you get your money back. Period.",
  },
  {
    articleNumber: 18,
    title: "AMENDMENTS, SUCCESSION AND CONTINUITY",
    summary: "Amendments require Board review, Court review, and human approval with at least 100 voters.",
    fullText: `Changing these rules is a big deal. It requires a review by our board and jury, and a real vote by at least 100 members. If a leader steps down or can't do their job, a new person takes over the same role with the same rules. No one can ever use a leadership change to grab more power or erase our history. Our records and rules survive every change.`,
    keyEnhancementsV70: [
      "Sets high bar for amendments (100+ human voters).",
      "Prevents power consolidation through succession.",
      "Requires transitional governance validation."
    ],
    momAndPopProtection: "Changing the rules takes a real community vote, not a quick signature from the boss.",
  },
  {
    articleNumber: 19,
    title: "TIME-LIMITED OPERATIONAL TESTING PERIOD",
    summary: "Autonomous operations mature under human supervision for 6 to 12 months.",
    fullText: `We are testing this system carefully with humans in charge for the first 6 to 12 months. This testing time is only for making sure everything works right. It doesn't give the computers any power to change laws or move money on their own. Once the testing is done, the founders' extra control expires, and the system runs according to these rules without needing them.`,
    keyEnhancementsV70: [
      "Sets a strict 6-12 month limit on founder control.",
      "Requires the system to be capable of autonomous operation after testing.",
      "Limits AI power during the testing phase."
    ],
    momAndPopProtection: "We are testing this carefully with humans in charge before we let the engine run full speed.",
  },
  {
    articleNumber: 20,
    title: "ASSET INDEPENDENCE AND NO LEVERAGE",
    summary: "Strict prohibition on pledging, mortgaging, or encumbering institutional property.",
    fullText: `We own our property outright. We never borrow money against our buildings or take out mortgages. This keeps us safe from big banks and interest rates. We believe in being debt-free so that our buildings can never be taken away. Our families' safety and our mission come before fast growth.`,
    keyEnhancementsV70: [
      "Permanently bans all forms of mortgage and debt leverage.",
      "Prevents 'synthetic' debt schemes.",
      "Prioritizes debt-free durability over fast growth."
    ],
    momAndPopProtection: "We own our land outright. No bank can ever take our buildings because we never borrow money.",
  },
  {
    articleNumber: 21,
    title: "TEMPORARY MEMBER GOVERNING BOARD",
    summary: "A randomly selected Board of 30 verified human members makes material decisions.",
    fullText: `When a big decision needs to be made, we draw 30 members at random to form a temporary board. We make sure no one has a conflict of interest. The board looks at the facts, hears any objections, and votes. Once the decision is made, the board dissolves, and everyone goes back to being regular members. No one can stay on the board forever.`,
    keyEnhancementsV70: [
      "Mandates random selection for the 30-member Board.",
      "Requires privacy-preserving conflict screening.",
      "Dissolves the Board after each decision to prevent power clusters."
    ],
    momAndPopProtection: "You might be called to serve on the board. You get to see the facts and vote on what's right.",
  },
  {
    articleNumber: 22,
    title: "ARBITRATION JURY, ROTATION AND APPEALS",
    summary: "Jurors serve and are then excluded for 365 days to ensure rotation.",
    fullText: `Our jury members serve for one case and then can't serve again for a full year. This makes sure that power is always rotating and that everyone gets a turn. Big decisions that punish someone take 9 out of 12 votes. Regular checks take 7 out of 12. There is always a way to appeal a decision if you think it was unfair.`,
    keyEnhancementsV70: [
      "Requires 9/12 supermajority for punitive verdicts.",
      "Mandates 365-day 'cooling off' period for jurors.",
      "Guarantees an independent appeal route."
    ],
    momAndPopProtection: "Peer justice is protected by rotation. No small group of people can control the court for long.",
  },
  {
    articleNumber: 23,
    title: "OPERATIONAL TASK FORCE",
    summary: "Executes authorized deeds and maintenance; officers serve one year and cannot repeat.",
    fullText: `The Task Force does the physical work like fixing buildings or doing inspections. They don't make the rules; they just follow them. These workers are elected by the members, and no big company can pay for their campaign. A worker serves for exactly one year and can never do that same job again. This prevents people from staying in power too long.`,
    keyEnhancementsV70: [
      "Limits OTF officers to one year, ever.",
      "Bans external campaign financing and corporate influence.",
      "Restricts OTF to execution only (no policy-making)."
    ],
    momAndPopProtection: "The people who do the work (maintenance, inspections) are chosen by us and can't stay in power forever.",
  },
  {
    articleNumber: 24,
    title: "DILOS: DOCUMENTATION AND AUTHORIZATION PIPELINE",
    summary: "Mandatory lifecycle for every consequential action: Intake, Investigate, Decision, Witness.",
    fullText: `Every decision follows a simple 10-step path: Record the request, check the facts, challenge the plan, make a decision, witness the work, and save the history. Nothing happens in secret. Every dollar and every move is checked by our Gatekeeper system and a human witness to make sure it matches our rules.`,
    keyEnhancementsV70: [
      "Codifies the 10-step DILOS integrity pipeline.",
      "Requires an 'Independent Witness' for all executions.",
      "Mandates durable case identifiers for every action."
    ],
    momAndPopProtection: "Every decision follows a strict path. Nothing happens by accident or in secret.",
  },
  {
    articleNumber: 25,
    title: "NO-ORPHANS, DURABLE DISPATCH AND RECOVERY",
    summary: "Ensures no case disappears due to technical failure or session ends.",
    fullText: `No task is ever lost. If a computer crashes or someone logs off, the system remembers exactly where we were. We have a permanent registry that keeps track of every open job until it's finished. This makes sure that your requests are never forgotten and that no one can hide a mistake by deleting a session.`,
    keyEnhancementsV70: [
      "Guarantees that no task is ever 'lost' or 'orphaned'.",
      "Mandates recovery to the last verified state.",
      "Enforces idempotency to prevent duplicate actions."
    ],
    momAndPopProtection: "If the computer crashes or the internet goes down, your transaction is still safe and will finish exactly where it left off.",
  },
];
