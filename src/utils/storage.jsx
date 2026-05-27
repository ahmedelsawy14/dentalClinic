function safeParseJSON(value, fallback) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function isQuotaExceededError(error) {
  return error?.name === "QuotaExceededError" || error?.code === 22;
}

export function readStorageJSON(key, fallback, options = {}) {
  if (!canUseStorage()) {
    return fallback;
  }

  const parsed = safeParseJSON(window.localStorage.getItem(key), fallback);
  const isValid = options.validate ? options.validate(parsed) : true;
  return isValid ? parsed : fallback;
}

export function writeStorageJSON(key, value) {
  if (!canUseStorage()) {
    return { ok: false, reason: "unavailable" };
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: isQuotaExceededError(error) ? "quota" : "unknown",
      error,
    };
  }
}

export function removeStorageValue(key) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(key);
}
