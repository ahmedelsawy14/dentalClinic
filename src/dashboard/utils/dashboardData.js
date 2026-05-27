import { getAllServices } from "../../data/services";

function cloneParagraphGroups(groups = []) {
  return groups.map((group) => ({
    paragraphs: Array.isArray(group.paragraphs) ? [...group.paragraphs] : [],
  }));
}

function createDefaultGuide(service) {
  return {
    intro: service.article?.intro || "",
    sections: cloneParagraphGroups(service.article?.sections),
    continuation: cloneParagraphGroups(service.article?.continuation),
    updatedAt: new Date().toISOString(),
  };
}

export const dashboardSpecialties = getAllServices().map((service) => ({
  title: service.title,
  slug: service.slug,
  description: service.description || service.summary,
  summary: service.summary,
  serviceSlug: service.slug,
  coverImage: service.cardImage || service.heroImage,
}));

export const dashboardSpecialtyMap = Object.fromEntries(
  dashboardSpecialties.map((specialty) => [specialty.slug, specialty]),
);

export function buildSeedArticles() {
  return Object.fromEntries(
    getAllServices().map((service) => [
      service.slug,
      {
        guide: createDefaultGuide(service),
        articles: [],
      },
    ]),
  );
}
