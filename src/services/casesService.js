import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { uploadImage } from "./cloudinaryService";

const casesRef = collection(db, "cases");

function normalizeFirestoreDate(value) {
  if (!value) {
    return new Date().toISOString();
  }

  if (typeof value?.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return new Date().toISOString();
}

function normalizeCase(docSnapshot) {
  const data = docSnapshot.data();

  return {
    id: docSnapshot.id,
    title: data.title || "حالة بدون عنوان",
    beforeImage: data.beforeImageUrl || "",
    afterImage: data.afterImageUrl || "",
    createdAt: normalizeFirestoreDate(data.createdAt),
    updatedAt: normalizeFirestoreDate(data.updatedAt || data.createdAt),
  };
}

async function resolveImageUrl(file, fallbackUrl = "") {
  if (file instanceof File) {
    return uploadImage(file);
  }

  return fallbackUrl || "";
}

export async function createCase(data) {
  const beforeImageUrl = await resolveImageUrl(data.beforeImageFile, data.beforeImageUrl);
  const afterImageUrl = await resolveImageUrl(data.afterImageFile, data.afterImageUrl);

  const createdRef = await addDoc(casesRef, {
    title: data.title,
    beforeImageUrl,
    afterImageUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: createdRef.id,
    title: data.title,
    beforeImage: beforeImageUrl,
    afterImage: afterImageUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function getCases() {
  const casesQuery = query(casesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(casesQuery);

  return snapshot.docs.map(normalizeCase);
}

export async function updateCase(caseId, data) {
  const beforeImageUrl = await resolveImageUrl(data.beforeImageFile, data.beforeImageUrl);
  const afterImageUrl = await resolveImageUrl(data.afterImageFile, data.afterImageUrl);

  await updateDoc(doc(db, "cases", caseId), {
    title: data.title,
    beforeImageUrl,
    afterImageUrl,
    updatedAt: serverTimestamp(),
  });

  return {
    id: caseId,
    title: data.title,
    beforeImage: beforeImageUrl,
    afterImage: afterImageUrl,
    updatedAt: new Date().toISOString(),
  };
}

export async function deleteCase(caseId) {
  await deleteDoc(doc(db, "cases", caseId));
}

export async function restoreCase(caseData) {
  return createCase({
    title: caseData.title,
    beforeImageUrl: caseData.beforeImage,
    afterImageUrl: caseData.afterImage,
  });
}
