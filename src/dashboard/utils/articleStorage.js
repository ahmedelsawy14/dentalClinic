import { getAllServices, getServiceBySlug } from "../../data/services";
import { buildSeedArticles, dashboardSpecialties, dashboardSpecialtyMap } from "./dashboardData";
import { calculateReadingTime, extractExcerpt } from "./seoHelpers";
import { canUseStorage, readStorageJSON, removeStorageValue, writeStorageJSON } from "../../utils/storage";
import { collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";

export const DASHBOARD_STORAGE_EVENT = "hazem-dashboard-storage";
export const DENTAL_ARTICLES_KEY = "dental_articles";
export const DENTAL_ARTICLE_DRAFT_KEY = "dental_article_draft";
export const DENTAL_GUIDE_DRAFT_KEY = "dental_service_guide_draft";

// Local in-memory cache populated reactively from Firestore
const seedArticles = buildSeedArticles();
const cache = { ...seedArticles };
const listeners = new Set();

function notifyListeners(detail) {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error("Error in article storage listener:", e);
    }
  });
}

function emitDashboardStorage(detail) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(DASHBOARD_STORAGE_EVENT, { detail }));
  }
  notifyListeners(detail);
}

// Set up Firestore listeners
if (typeof window !== "undefined") {
  const guidesRef = collection(db, "guides");
  const articlesRef = collection(db, "articles");

  // Subscribe to Guides
  onSnapshot(guidesRef, (snapshot) => {
    snapshot.docs.forEach((docSnap) => {
      const slug = docSnap.id;
      const data = docSnap.data();
      if (cache[slug]) {
        cache[slug].guide = {
          intro: data.intro || "",
          sections: data.sections || [],
          continuation: data.continuation || [],
          updatedAt: data.updatedAt || new Date().toISOString(),
        };
      }
    });
    notifyListeners({ type: "guides-update" });
  }, (error) => {
    console.error("Firestore guides subscription failed (check rules):", error);
  });

  // Subscribe to Articles
  onSnapshot(articlesRef, (snapshot) => {
    // Reset articles in cache for all specialties before refilling
    Object.keys(cache).forEach((slug) => {
      cache[slug].articles = [];
    });

    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const slug = data.specialty;
      if (cache[slug]) {
        cache[slug].articles.push({
          id: docSnap.id,
          specialty: slug,
          title: data.title || "",
          content: data.content || "",
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          published: data.published ?? true,
          excerpt: data.excerpt || "",
          readingTime: data.readingTime || 0,
        });
      }
    });

    // Sort articles by createdAt
    Object.keys(cache).forEach((slug) => {
      cache[slug].articles.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });

    notifyListeners({ type: "articles-update" });
  }, (error) => {
    console.error("Firestore articles subscription failed (check rules):", error);
  });
}

function getContentSnapshot() {
  return cache;
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

export async function upsertArticle(article, currentId) {
  const specialtySlug = article.specialty;
  const snapshot = getContentSnapshot();
  const scopedContent = snapshot[specialtySlug];

  if (!scopedContent) {
    return null;
  }

  const now = new Date().toISOString();
  const articleId = currentId || crypto.randomUUID();
  const existingArticle = scopedContent.articles.find((item) => item.id === articleId);

  const content = article.content?.toString().trim() || "";
  const title = article.title?.toString().trim() || "";

  const nextArticle = {
    specialty: specialtySlug,
    title,
    content,
    createdAt: existingArticle?.createdAt || article.createdAt || now,
    updatedAt: now,
    published: article.published ?? existingArticle?.published ?? true,
    excerpt: extractExcerpt(content, title),
    readingTime: calculateReadingTime(content),
  };

  const docRef = doc(db, "articles", articleId);
  await setDoc(docRef, nextArticle);

  emitDashboardStorage({ type: "article-upsert", articleId, specialtySlug });

  return {
    id: articleId,
    ...nextArticle,
  };
}

export async function deleteArticle(articleId) {
  const docRef = doc(db, "articles", articleId);
  await deleteDoc(docRef);

  emitDashboardStorage({ type: "article-delete", articleId });
}

export async function saveServiceGuide(specialtySlug, guidePayload) {
  const service = getServiceBySlug(specialtySlug);
  const snapshot = getContentSnapshot();
  const scopedContent = snapshot[specialtySlug];

  if (!service || !scopedContent) {
    return null;
  }

  const docRef = doc(db, "guides", specialtySlug);
  const guideData = {
    intro: guidePayload.intro?.toString().trim() || "",
    sections: (guidePayload.sections || []).map((section) => ({
      paragraphs: Array.isArray(section.paragraphs) ? [...section.paragraphs] : [],
    })),
    continuation: (guidePayload.continuation || []).map((section) => ({
      paragraphs: Array.isArray(section.paragraphs) ? [...section.paragraphs] : [],
    })),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, guideData);
  emitDashboardStorage({ type: "guide-save", specialtySlug });

  return guideData;
}

export function resetArticlesToSeed() {
  return buildSeedArticles();
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
  listeners.add(listener);

  if (!canUseStorage()) {
    return () => {
      listeners.delete(listener);
    };
  }

  const handleStorage = (event) => {
    if (
      !event.key ||
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
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(DASHBOARD_STORAGE_EVENT, handleDashboardEvent);
  };
}
