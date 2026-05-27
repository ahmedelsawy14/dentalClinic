import {
  isQuotaExceededError,
  readStorageJSON,
  writeStorageJSON,
} from "./storage";

const DENTAL_CASES_KEY = "dental_cases";

function normalizeCaseData(caseData) {
  return {
    id: caseData.id || crypto.randomUUID(),
    title: caseData.title?.trim() || "حالة بدون عنوان",
    beforeImage: caseData.beforeImage || "",
    afterImage: caseData.afterImage || "",
    createdAt: caseData.createdAt || new Date().toISOString(),
    updatedAt: caseData.updatedAt || caseData.createdAt || new Date().toISOString(),
  };
}

function parseStoredCases() {
  const parsedCases = readStorageJSON(DENTAL_CASES_KEY, [], {
    validate: (value) => Array.isArray(value),
  });

  if (!Array.isArray(parsedCases)) {
    return [];
  }

  return parsedCases.map(normalizeCaseData);
}

export function getStoredCases() {
  return parseStoredCases().sort((firstCase, secondCase) => {
    return new Date(secondCase.createdAt).getTime() - new Date(firstCase.createdAt).getTime();
  });
}

export function saveStoredCases(cases) {
  const result = writeStorageJSON(DENTAL_CASES_KEY, cases);

  if (!result.ok) {
    if (result.reason === "quota" || isQuotaExceededError(result.error)) {
      throw new Error("مساحة التخزين المحلية امتلأت. حاول تقليل عدد الصور أو حجمها ثم أعد المحاولة.");
    }

    throw new Error("تعذر حفظ الحالات محليًا على هذا الجهاز حاليًا.");
  }
}

export function createDentalCase(caseData) {
  const nextCase = normalizeCaseData({
    ...caseData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const updatedCases = [nextCase, ...parseStoredCases()];
  saveStoredCases(updatedCases);
  return nextCase;
}

export function updateDentalCase(caseId, caseData) {
  const updatedCases = parseStoredCases().map((storedCase) => {
    if (storedCase.id !== caseId) {
      return storedCase;
    }

    return normalizeCaseData({
      ...storedCase,
      ...caseData,
      id: storedCase.id,
      createdAt: storedCase.createdAt,
      updatedAt: new Date().toISOString(),
    });
  });

  saveStoredCases(updatedCases);
  return updatedCases;
}

export function deleteDentalCase(caseId) {
  const filteredCases = parseStoredCases().filter((storedCase) => storedCase.id !== caseId);
  saveStoredCases(filteredCases);
  return filteredCases;
}

export function restoreDentalCase(caseData) {
  const normalizedCase = normalizeCaseData(caseData);
  const updatedCases = [
    normalizedCase,
    ...parseStoredCases().filter((storedCase) => storedCase.id !== normalizedCase.id),
  ];
  saveStoredCases(updatedCases);
  return updatedCases;
}

export function duplicateDentalCase(caseId) {
  const targetCase = parseStoredCases().find((storedCase) => storedCase.id === caseId);

  if (!targetCase) {
    return null;
  }

  const duplicatedCase = normalizeCaseData({
    ...targetCase,
    id: crypto.randomUUID(),
    title: `${targetCase.title} - نسخة`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const updatedCases = [duplicatedCase, ...parseStoredCases()];
  saveStoredCases(updatedCases);
  return duplicatedCase;
}
