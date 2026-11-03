import { EmailCampaign } from "../types/campaign";

export type AccessibilityTier = "accessible" | "moderate" | "dense";

export interface ReadabilityMetrics {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  complexWordCount: number;
  longSentenceCount: number;
  estimatedReadMinutes: number;
  accessibilityTier: AccessibilityTier;
  accessibilityLabel: string;
  audienceBand: string;
  guidanceNote: string;
}

export interface CampaignReadabilityReport {
  overall: ReadabilityMetrics;
  sectionMetrics: Record<string, ReadabilityMetrics>;
  hardestSection: {
    id: string;
    heading: string;
    grade: number;
  } | null;
}

const IRREGULAR_SYLLABLES: Record<string, number> = {
  area: 3,
  business: 2,
  every: 2,
  evening: 2,
  family: 3,
  families: 3,
  future: 2,
  garage: 2,
  general: 3,
  idea: 3,
  ideas: 3,
  interest: 3,
  national: 3,
  orange: 2,
  people: 2,
  property: 3,
  properties: 3,
  real: 1,
  science: 2,
  scientific: 4,
  separate: 3,
  special: 2,
  student: 2,
  students: 2,
  tdex: 2,
  dxpa: 4,
};

export function countWordSyllables(rawToken: string): number {
  const cleaned = rawToken
    .toLowerCase()
    .replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");

  if (!cleaned) return 0;

  // Numeric tokens (e.g. "50", "2026", "7-12")
  if (/^[0-9/\-.,%$]+$/.test(cleaned)) {
    const digitsOnly = cleaned.replace(/[^0-9]/g, "");
    return Math.max(1, Math.min(3, Math.ceil(digitsOnly.length / 2)));
  }

  // Handle hyphenated or slash compounds by summing sub-parts
  if (cleaned.includes("-") || cleaned.includes("/")) {
    const parts = cleaned.split(/[-/]/).filter(Boolean);
    if (parts.length > 1) {
      return parts.reduce((sum, p) => sum + countWordSyllables(p), 0);
    }
  }

  const alpha = cleaned.replace(/[^a-z]/g, "");
  if (!alpha) return 1;

  if (IRREGULAR_SYLLABLES[alpha] !== undefined) {
    return IRREGULAR_SYLLABLES[alpha];
  }

  if (alpha.length <= 3) {
    return 1;
  }

  let word = alpha;

  // Strip silent trailing 'e', preserving consonant + 'le' (e.g. "simple", "table")
  if (word.endsWith("e")) {
    if (!word.endsWith("le") || /[aeiouy]le$/.test(word)) {
      word = word.slice(0, -1);
    }
  }

  // Handle common silent '-ed' and '-es' inflections
  if (word.endsWith("ed") && word.length > 4 && !/[td]ed$/.test(word)) {
    word = word.slice(0, -2);
  } else if (
    word.endsWith("es") &&
    word.length > 4 &&
    !/(?:s|z|x|sh|ch)es$/.test(word)
  ) {
    word = word.slice(0, -2);
  }

  const vowelGroups = word.match(/[aeiouy]+/g);
  let count = vowelGroups ? vowelGroups.length : 1;

  // Hiatus vowel pairs that form two distinct syllables (e.g. "create", "museum", "priority")
  const hiatusMatches = word.match(/ia|io|iu|ua|uo|eo|eou/g);
  if (hiatusMatches) {
    // Subtract false positives after t/c/s where 'io'/'ia' is a single 'sh' sound ("nation", "special", "official")
    const palatalMatches = word.match(/[tcs]i[ao]/g);
    const extra =
      hiatusMatches.length - (palatalMatches ? palatalMatches.length : 0);
    if (extra > 0) {
      count += extra;
    }
  }

  return Math.max(1, count);
}

function splitIntoSentences(blocks: string[]): string[] {
  const sentences: string[] = [];

  for (const rawBlock of blocks) {
    if (!rawBlock || !rawBlock.trim()) continue;
    // Remove raw URLs so links do not inflate word/syllable ratios
    const withoutUrls = rawBlock.replace(/https?:\/\/\S+/gi, "");
    // Split on paragraph newlines and terminal punctuation (. ! ? ;)
    const segments = withoutUrls
      .split(/\n+|(?<=[.!?;])\s+/)
      .map((s) => s.trim())
      .filter((s) => /[a-zA-Z0-9]/.test(s));

    sentences.push(...segments);
  }

  return sentences;
}

function extractWords(text: string): string[] {
  return text
    .replace(/[—–]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, ""))
    .filter((t) => /[a-zA-Z0-9]/.test(t));
}

export function analyzeTextReadability(blocks: string[]): ReadabilityMetrics {
  const sentences = splitIntoSentences(blocks);

  if (sentences.length === 0) {
    return {
      fleschReadingEase: 100,
      fleschKincaidGrade: 1.0,
      wordCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
      avgWordsPerSentence: 0,
      avgSyllablesPerWord: 0,
      complexWordCount: 0,
      longSentenceCount: 0,
      estimatedReadMinutes: 0,
      accessibilityTier: "accessible",
      accessibilityLabel: "Ready for Copy",
      audienceBand: "Add body copy to analyze reading level",
      guidanceNote: "Enter body copy below to compute Flesch-Kincaid metrics.",
    };
  }

  let totalWords = 0;
  let totalSyllables = 0;
  let complexWordCount = 0;
  let longSentenceCount = 0;

  for (const sentence of sentences) {
    const words = extractWords(sentence);
    if (words.length === 0) continue;

    if (words.length > 25) {
      longSentenceCount++;
    }

    totalWords += words.length;

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const syl = countWordSyllables(w);
      totalSyllables += syl;

      const isProperMidSentence = i > 0 && /^[A-Z]/.test(w);
      const isCompound = w.includes("-") || w.includes("/");
      if (syl >= 3 && !isProperMidSentence && !isCompound) {
        complexWordCount++;
      }
    }
  }

  const effectiveSentences = Math.max(1, sentences.length);
  const effectiveWords = Math.max(1, totalWords);

  const avgWordsPerSentence = effectiveWords / effectiveSentences;
  const avgSyllablesPerWord = totalSyllables / effectiveWords;

  const rawFre =
    206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  const rawFkgl =
    0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;

  const fleschReadingEase = Number(
    Math.max(0, Math.min(100, rawFre)).toFixed(1)
  );
  const fleschKincaidGrade = Number(
    Math.max(1, Math.min(18, rawFkgl)).toFixed(1)
  );

  const estimatedReadMinutes = Number(
    Math.max(0.2, totalWords / 200).toFixed(1)
  );

  let accessibilityTier: AccessibilityTier = "accessible";
  let accessibilityLabel = "Accessible for All Families";
  let audienceBand = "Grades 6–8 · Clear & Conversational";
  let guidanceNote =
    "Sentence length and vocabulary sit in the ideal Grades 6–8 window for busy parents, students, and educators.";

  if (fleschReadingEase >= 60 && fleschKincaidGrade <= 9.0) {
    accessibilityTier = "accessible";
    accessibilityLabel = "Accessible for All Families";
    audienceBand =
      fleschReadingEase >= 70
        ? "Grades 6–7 · Effortless Family Read"
        : "Grades 8–9 · Clear Household Read";
    if (longSentenceCount > 0) {
      guidanceNote = `Overall copy is family-friendly, though splitting ${longSentenceCount} sentence${
        longSentenceCount > 1 ? "s" : ""
      } over 25 words will make mobile reading even faster.`;
    }
  } else if (fleschReadingEase >= 45 && fleschKincaidGrade <= 11.5) {
    accessibilityTier = "moderate";
    accessibilityLabel = "Moderate Reading Complexity";
    audienceBand = "Grades 10–11 · High School / Adult";
    guidanceNote =
      longSentenceCount > 0
        ? `Break up ${longSentenceCount} long sentence${
            longSentenceCount > 1 ? "s" : ""
          } (>25 words) or use Simplify for Families to reach a Grade 7–8 reading level.`
        : `Swap ${complexWordCount} multi-syllable terms for plain everyday words to bring this copy into the Grade 7–8 family range.`;
  } else {
    accessibilityTier = "dense";
    accessibilityLabel = "Dense / Institutional Copy";
    audienceBand = "Grade 12+ · College / Legal";
    guidanceNote = `Copy reads at Grade ${fleschKincaidGrade} (${complexWordCount} complex words, ${longSentenceCount} sentences >25 words). Simplify sentences so every household can scan key points quickly.`;
  }

  return {
    fleschReadingEase,
    fleschKincaidGrade,
    wordCount: totalWords,
    sentenceCount: effectiveSentences,
    syllableCount: totalSyllables,
    avgWordsPerSentence: Number(avgWordsPerSentence.toFixed(1)),
    avgSyllablesPerWord: Number(avgSyllablesPerWord.toFixed(2)),
    complexWordCount,
    longSentenceCount,
    estimatedReadMinutes,
    accessibilityTier,
    accessibilityLabel,
    audienceBand,
    guidanceNote,
  };
}

export function analyzeCampaignReadability(
  campaign: EmailCampaign
): CampaignReadabilityReport {
  const proseBlocks: string[] = [
    campaign.heroHeadline,
    campaign.heroSubheadline,
    campaign.openingSalutation,
  ];

  const sectionMetrics: Record<string, ReadabilityMetrics> = {};
  let hardestSection: { id: string; heading: string; grade: number } | null =
    null;

  for (const sec of campaign.bodySections) {
    const secBlocks = [sec.body, sec.callout || ""].filter((s) => s.trim());
    proseBlocks.push(sec.heading, ...secBlocks);

    const metrics = analyzeTextReadability(
      secBlocks.length > 0 ? secBlocks : [sec.heading]
    );
    sectionMetrics[sec.id] = metrics;

    if (
      metrics.wordCount >= 8 &&
      (!hardestSection || metrics.fleschKincaidGrade > hardestSection.grade)
    ) {
      hardestSection = {
        id: sec.id,
        heading: sec.heading || "Untitled Section",
        grade: metrics.fleschKincaidGrade,
      };
    }
  }

  if (campaign.closingSignoff) {
    proseBlocks.push(campaign.closingSignoff);
  }

  const overall = analyzeTextReadability(proseBlocks);

  return {
    overall,
    sectionMetrics,
    hardestSection,
  };
}
