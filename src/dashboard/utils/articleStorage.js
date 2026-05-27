import { getAllServices, getServiceBySlug } from "../../data/services";
import { buildSeedArticles, dashboardSpecialties, dashboardSpecialtyMap } from "./dashboardData";
import { calculateReadingTime, extractExcerpt } from "./seoHelpers";
import { canUseStorage, readStorageJSON, removeStorageValue, writeStorageJSON } from "../../utils/storage";

export const DASHBOARD_STORAGE_EVENT = "hazem-dashboard-storage";
export const DENTAL_ARTICLES_KEY = "dental_articles";
export const DENTAL_ARTICLE_DRAFT_KEY = "dental_article_draft";
export const DENTAL_GUIDE_DRAFT_KEY = "dental_service_guide_draft";

function emitDashboardStorage(detail) {
  if (!canUseStorage()) {
    return;
  }

  window.dispatchEvent(new CustomEvent(DASHBOARD_STORAGE_EVENT, { detail }));
}

function createGuideBlueprint(service) {
  return {
    intro: service.article?.intro || "",
    sections: (service.article?.sections || []).map((section) => ({
      title: section.title,
      points: Array.isArray(section.points) ? [...section.points] : [],
      paragraphs: Array.isArray(section.paragraphs) ? [...section.paragraphs] : [],
    })),
    continuation: (service.article?.continuation || []).map((section) => ({
      title: section.title,
      points: Array.isArray(section.points) ? [...section.points] : [],
      paragraphs: Array.isArray(section.paragraphs) ? [...section.paragraphs] : [],
    })),
  };
}

function normalizeParagraphs(value, fallback = []) {
  if (Array.isArray(value)) {
    return value.map((item) => item?.toString().trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return fallback;
}

function normalizeArticleRecord(article, specialtySlug) {
  const content = article?.content?.toString().trim() || "";
  const createdAt = article?.createdAt || new Date().toISOString();
  const updatedAt = article?.updatedAt || createdAt;

  return {
    id: article?.id || crypto.randomUUID(),
    specialty: specialtySlug,
    title: article?.title?.toString().trim() || "",
    content,
    createdAt,
    updatedAt,
    published: article?.published ?? article?.status !== "draft",
    excerpt: extractExcerpt(content, article?.title || ""),
    readingTime: calculateReadingTime(content),
  };
}

function createGuideContent(service, storedGuide = {}) {
  const blueprint = createGuideBlueprint(service);

  return {
    intro: storedGuide?.intro?.toString().trim() || blueprint.intro,
    sections: blueprint.sections.map((section, index) => ({
      title: section.title,
      points: section.points,
      paragraphs: normalizeParagraphs(storedGuide?.sections?.[index]?.paragraphs, section.paragraphs),
    })),
    continuation: blueprint.continuation.map((section, index) => ({
      title: section.title,
      points: section.points,
      paragraphs: normalizeParagraphs(
        storedGuide?.continuation?.[index]?.paragraphs,
        section.paragraphs,
      ),
    })),
    updatedAt: storedGuide?.updatedAt || new Date().toISOString(),
  };
}

function normalizeLegacyShape(parsed) {
  const seed = buildSeedArticles();
  const safeMap = {};

  dashboardSpecialties.forEach((specialty) => {
    const currentValue = parsed?.[specialty.slug];

    if (Array.isArray(currentValue)) {
      safeMap[specialty.slug] = {
        guide: seed[specialty.slug].guide,
        articles: currentValue.map((article) => normalizeArticleRecord(article, specialty.slug)),
      };
      return;
    }

    const service = getServiceBySlug(specialty.slug);
    safeMap[specialty.slug] = {
      guide: createGuideContent(service, currentValue?.guide),
      articles: Array.isArray(currentValue?.articles)
        ? currentValue.articles.map((article) => normalizeArticleRecord(article, specialty.slug))
        : [],
    };
  });

  return safeMap;
}

function parseStoredArticles() {
  const seed = buildSeedArticles();

  if (!canUseStorage()) {
    return seed;
  }

  const parsed = readStorageJSON(DENTAL_ARTICLES_KEY, null, {
    validate: (value) => !value || typeof value === "object",
  });

  if (!parsed) {
    writeStorageJSON(DENTAL_ARTICLES_KEY, seed);
    return seed;
  }

  return normalizeLegacyShape(parsed);
}

function persistArticles(contentMap, detail) {
  if (!canUseStorage()) {
    return;
  }

  const result = writeStorageJSON(DENTAL_ARTICLES_KEY, contentMap);
  if (!result.ok) {
    throw new Error(
      result.reason === "quota"
        ? "مساحة التخزين المحلية امتلأت. حاول تقليل المحتوى أو حذف بعض البيانات قبل الحفظ."
        : "تعذر حفظ محتوى الداشبورد محليًا في الوقت الحالي.",
    );
  }

  emitDashboardStorage(detail);
}

function serializeContentMap(contentMap) {
  return Object.fromEntries(
    Object.entries(contentMap).map(([specialtySlug, value]) => [
      specialtySlug,
      {
        guide: {
          intro: value.guide.intro,
          sections: value.guide.sections.map((section) => ({
            paragraphs: [...section.paragraphs],
          })),
          continuation: value.guide.continuation.map((section) => ({
            paragraphs: [...section.paragraphs],
          })),
          updatedAt: value.guide.updatedAt,
        },
        articles: value.articles.map((article) => ({
          id: article.id,
          title: article.title,
          content: article.content,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          published: article.published,
        })),
      },
    ]),
  );
}

function getContentSnapshot() {
  const parsed = parseStoredArticles();

  return Object.fromEntries(
    getAllServices().map((service) => {
      const stored = parsed[service.slug] || {};
      const articles = Array.isArray(stored.articles)
        ? stored.articles
            .map((article) => normalizeArticleRecord(article, service.slug))
            .sort(
              (firstArticle, secondArticle) =>
                new Date(firstArticle.createdAt).getTime() - new Date(secondArticle.createdAt).getTime(),
            )
        : [];

      return [
        service.slug,
        {
          guide: createGuideContent(service, stored.guide),
          articles,
        },
      ];
    }),
  );
}

export function getSpecialties() {
  return dashboardSpecialties;
}

export function getSpecialtyBySlug(slug) {
  return dashboardSpecialtyMap[slug];
}

export function getArticlesSnapshot() {
  return Object.fromEntries(
    Object.entries(getContentSnapshot()).map(([specialtySlug, value]) => [specialtySlug, value.articles]),
  );
}

export function getArticlesBySpecialty(specialtySlug, options = {}) {
  const { publishedOnly = false, limit } =
    typeof options === "number" ? { publishedOnly: false, limit: options } : options;
  const content = getContentSnapshot()[specialtySlug];
  const scopedArticles = content?.articles || [];
  const filtered = publishedOnly ? scopedArticles.filter((article) => article.published) : scopedArticles;

  return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
}

export function getAllArticles() {
  return Object.values(getContentSnapshot())
    .flatMap((value) => value.articles)
    .sort(
      (firstArticle, secondArticle) =>
        new Date(secondArticle.updatedAt).getTime() - new Date(firstArticle.updatedAt).getTime(),
    );
}

export function getServiceContentBySlug(specialtySlug) {
  const content = getContentSnapshot()[specialtySlug];
  if (!content) {
    return null;
  }

  return {
    guide: content.guide,
    articles: content.articles.filter((article) => article.published),
  };
}

export function getEditableServiceContentBySlug(specialtySlug) {
  return getContentSnapshot()[specialtySlug] || null;
}

export function upsertArticle(article, currentId) {
  const snapshot = getContentSnapshot();
  const specialtySlug = article.specialty;
  const scopedContent = snapshot[specialtySlug];

  if (!scopedContent) {
    return null;
  }

  const now = new Date().toISOString();
  const articleId = currentId || crypto.randomUUID();
  const existingArticle = scopedContent.articles.find((item) => item.id === articleId);
  const nextArticle = normalizeArticleRecord(
    {
      ...article,
      id: articleId,
      createdAt: existingArticle?.createdAt || article.createdAt || now,
      updatedAt: now,
      published: article.published ?? existingArticle?.published ?? true,
    },
    specialtySlug,
  );

  const nextArticles = scopedContent.articles.filter((item) => item.id !== articleId);
  nextArticles.push(nextArticle);
  nextArticles.sort(
    (firstArticle, secondArticle) =>
      new Date(firstArticle.createdAt).getTime() - new Date(secondArticle.createdAt).getTime(),
  );

  snapshot[specialtySlug] = {
    ...scopedContent,
    articles: nextArticles,
  };

  persistArticles(serializeContentMap(snapshot), { type: "article-upsert", articleId, specialtySlug });
  return nextArticle;
}

export function deleteArticle(articleId) {
  const snapshot = getContentSnapshot();

  Object.keys(snapshot).forEach((specialtySlug) => {
    snapshot[specialtySlug] = {
      ...snapshot[specialtySlug],
      articles: snapshot[specialtySlug].articles.filter((item) => item.id !== articleId),
    };
  });

  persistArticles(serializeContentMap(snapshot), { type: "article-delete", articleId });
  return snapshot;
}

export function saveServiceGuide(specialtySlug, guidePayload) {
  const snapshot = getContentSnapshot();
  const service = getServiceBySlug(specialtySlug);
  const scopedContent = snapshot[specialtySlug];

  if (!service || !scopedContent) {
    return null;
  }

  snapshot[specialtySlug] = {
    ...scopedContent,
    guide: createGuideContent(service, {
      ...guidePayload,
      updatedAt: new Date().toISOString(),
    }),
  };

  persistArticles(serializeContentMap(snapshot), { type: "guide-save", specialtySlug });
  return snapshot[specialtySlug].guide;
}

export function resetArticlesToSeed() {
  const seedArticles = buildSeedArticles();
  persistArticles(seedArticles, { type: "article-reset" });
  return seedArticles;
}

export function getArticleById(articleId) {
  return getAllArticles().find((article) => article.id === articleId);
}

export function saveArticleDraft(draft) {
  if (!canUseStorage()) {
    return;
  }

  writeStorageJSON(DENTAL_ARTICLE_DRAFT_KEY, draft);
  emitDashboardStorage({ type: "article-draft" });
}

export function getArticleDraft(specialtySlug) {
  if (!canUseStorage()) {
    return null;
  }

  const parsed = readStorageJSON(DENTAL_ARTICLE_DRAFT_KEY, null, {
    validate: (value) => !value || typeof value === "object",
  });

  if (!parsed) {
    return null;
  }

  return specialtySlug && parsed.specialty !== specialtySlug ? null : parsed;
}

export function clearArticleDraft() {
  if (!canUseStorage()) {
    return;
  }

  removeStorageValue(DENTAL_ARTICLE_DRAFT_KEY);
  emitDashboardStorage({ type: "article-draft-clear" });
}

export function saveGuideDraft(specialtySlug, draft) {
  if (!canUseStorage()) {
    return;
  }

  const payload = { specialtySlug, draft };
  writeStorageJSON(DENTAL_GUIDE_DRAFT_KEY, payload);
  emitDashboardStorage({ type: "guide-draft" });
}

export function getGuideDraft(specialtySlug) {
  if (!canUseStorage()) {
    return null;
  }

  const parsed = readStorageJSON(DENTAL_GUIDE_DRAFT_KEY, null, {
    validate: (value) => !value || typeof value === "object",
  });

  if (!parsed || parsed.specialtySlug !== specialtySlug) {
    return null;
  }

  return parsed.draft || null;
}

export function clearGuideDraft() {
  if (!canUseStorage()) {
    return;
  }

  removeStorageValue(DENTAL_GUIDE_DRAFT_KEY);
  emitDashboardStorage({ type: "guide-draft-clear" });
}

export function subscribeToArticleStorage(listener) {
  if (!canUseStorage()) {
    return () => {};
  }

  const handleStorage = (event) => {
    if (
      !event.key ||
      event.key === DENTAL_ARTICLES_KEY ||
      event.key === DENTAL_ARTICLE_DRAFT_KEY ||
      event.key === DENTAL_GUIDE_DRAFT_KEY
    ) {
      listener();
    }
  };

  const handleDashboardEvent = () => listener();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(DASHBOARD_STORAGE_EVENT, handleDashboardEvent);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(DASHBOARD_STORAGE_EVENT, handleDashboardEvent);
  };
}
