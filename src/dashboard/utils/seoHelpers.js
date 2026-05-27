const TITLE_MIN = 45;
const TITLE_MAX = 60;
const DESCRIPTION_MIN = 110;
const DESCRIPTION_MAX = 160;

export function slugifyText(value) {
  return value
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function splitParagraphs(content) {
  return content
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitWords(content) {
  return content
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function estimateReadability(content) {
  const paragraphs = splitParagraphs(content);
  const sentences = content
    .split(/[.!?؟]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const words = splitWords(content);
  const averageSentenceLength = sentences.length ? Math.round(words.length / sentences.length) : 0;
  const tone =
    averageSentenceLength <= 20 && paragraphs.length >= 2
      ? "Easy to scan"
      : averageSentenceLength <= 28
        ? "Fair"
        : "Dense";

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    averageSentenceLength,
    tone,
  };
}

export function calculateReadingTime(content) {
  const wordCount = splitWords(content).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 180));

  return {
    wordCount,
    minutes,
    label: `${minutes} ${minutes === 1 ? "دقيقة قراءة" : "دقائق قراءة"}`,
  };
}

export function extractExcerpt(content, fallbackTitle = "") {
  const firstMeaningfulParagraph = splitParagraphs(content)[0] || fallbackTitle;
  return firstMeaningfulParagraph.slice(0, 180).trim();
}

export function extractKeywords({ title, content, specialtyTitle }) {
  const candidateWords = `${title} ${specialtyTitle} ${content}`
    .replace(/[.,!?،؛:()"'`[\]{}]/g, " ")
    .split(/\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 2);

  const counts = candidateWords.reduce((accumulator, word) => {
    accumulator[word] = (accumulator[word] || 0) + 1;
    return accumulator;
  }, {});

  const repeatedWords = Object.entries(counts)
    .sort((firstItem, secondItem) => secondItem[1] - firstItem[1])
    .slice(0, 6)
    .map(([word]) => word);

  return [...new Set([specialtyTitle, ...title.split(/\s+/).filter(Boolean), ...repeatedWords])].filter(Boolean).slice(0, 8);
}

export function generateMetaDescription({ content, specialtyTitle, title }) {
  const baseDescription = extractExcerpt(content, title);
  const withSpecialty = specialtyTitle && !baseDescription.includes(specialtyTitle)
    ? `${specialtyTitle} - ${baseDescription}`
    : baseDescription;

  return withSpecialty.slice(0, DESCRIPTION_MAX).trim();
}

export function generateSeoTitle({ title, specialtyTitle }) {
  const baseTitle = specialtyTitle ? `${title} | ${specialtyTitle} | Hazem Clinic` : `${title} | Hazem Clinic`;
  return baseTitle.slice(0, TITLE_MAX).trim();
}

export function getMetaIndicator(length, min, max) {
  if (!length) {
    return { tone: "empty", label: "Missing" };
  }

  if (length < min) {
    return { tone: "warning", label: "Too short" };
  }

  if (length > max) {
    return { tone: "danger", label: "Too long" };
  }

  return { tone: "success", label: "Optimal" };
}

export function getSeoWarnings(article, specialtyTitle = "") {
  const titleIndicator = getMetaIndicator(article.seoTitle.length, TITLE_MIN, TITLE_MAX);
  const descriptionIndicator = getMetaIndicator(
    article.seoDescription.length,
    DESCRIPTION_MIN,
    DESCRIPTION_MAX,
  );
  const warnings = [];

  if (titleIndicator.tone !== "success") warnings.push("title");
  if (descriptionIndicator.tone !== "success") warnings.push("description");

  const readability = estimateReadability(article.content);
  if (readability.paragraphCount < 2 || readability.averageSentenceLength > 28) warnings.push("readability");
  if (specialtyTitle && !article.title.includes(specialtyTitle)) warnings.push("specialty");

  return warnings;
}

export function calculateSeoScore(article, specialtyTitle = "") {
  const readability = estimateReadability(article.content);
  let score = 0;

  if (getMetaIndicator(article.seoTitle.length, TITLE_MIN, TITLE_MAX).tone === "success") score += 35;
  if (
    getMetaIndicator(article.seoDescription.length, DESCRIPTION_MIN, DESCRIPTION_MAX).tone === "success"
  ) score += 35;
  if (readability.paragraphCount >= 2) score += 10;
  if (readability.wordCount >= 80) score += 10;
  if (specialtyTitle && article.title.includes(specialtyTitle)) score += 10;

  return Math.min(score, 100);
}

export function getSeoTone(score) {
  if (score >= 85) return "strong";
  if (score >= 65) return "good";
  if (score >= 45) return "average";
  return "weak";
}

export function buildArticlePayload(formData) {
  return {
    title: formData.title.trim(),
    content: formData.content.trim(),
    specialty: formData.specialty,
    status: formData.status || "published",
  };
}

export function enrichArticlePayload(article, specialty) {
  const excerpt = extractExcerpt(article.content, article.title);
  const seoTitle = generateSeoTitle({ title: article.title, specialtyTitle: specialty?.title || "" });
  const seoDescription = generateMetaDescription({
    content: article.content,
    specialtyTitle: specialty?.title || "",
    title: article.title,
  });
  const keywords = extractKeywords({
    title: article.title,
    content: article.content,
    specialtyTitle: specialty?.title || "",
  });
  const readingTime = calculateReadingTime(article.content);

  return {
    ...article,
    slug: slugifyText(article.title),
    excerpt,
    seoTitle,
    seoDescription,
    keywords,
    ogTitle: seoTitle,
    ogDescription: seoDescription,
    canonicalUrl: article.specialty ? `/services/${article.specialty}` : "/services",
    schemaType: "Article",
    readingTime,
    image: specialty?.coverImage || "",
  };
}

export function validateArticlePayload(article) {
  const errors = {};

  if (!article.title) errors.title = "يرجى إدخال عنوان المقال.";
  if (!article.content) errors.content = "يرجى إدخال محتوى المقال.";
  if (!article.specialty) errors.specialty = "يرجى اختيار التخصص.";

  return errors;
}
