const cloudinaryRegex = /^https?:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video)\/upload\/(.*)$/i;

const normalizeCloudinaryUrl = (url) => {
  if (typeof url !== "string") return null;

  const [cleanUrl] = url.split("?");
  const match = cleanUrl.match(cloudinaryRegex);
  if (!match) return null;

  const [prefix, rest] = cleanUrl.split("/upload/");
  if (!rest) return null;

  const versionSplit = rest.split(/(\/v\d+\/)/);
  if (versionSplit.length === 3) {
    return {
      base: `${prefix}/upload/`,
      version: versionSplit[1],
      resourcePath: versionSplit[2],
    };
  }

  return {
    base: `${prefix}/upload/`,
    version: "",
    resourcePath: rest,
  };
};

export const isCloudinaryUrl = (url) => Boolean(normalizeCloudinaryUrl(url));

export const getCloudinaryUrl = (url, width = 800) => {
  const parsed = normalizeCloudinaryUrl(url);
  if (!parsed) return url;

  const transformation = `f_auto,q_auto,w_${width}`;
  return `${parsed.base}${transformation}/${parsed.version}${parsed.resourcePath}`;
};

export const makeCloudinarySrcSet = (url, widths = [400, 600, 900, 1200]) => {
  if (!isCloudinaryUrl(url)) return "";
  return widths
    .map((w) => `${getCloudinaryUrl(url, w)} ${w}w`)
    .join(", ");
};

export const getCloudinaryHeroUrl = (url) => getCloudinaryUrl(url, 1200);
export const getCloudinaryCardUrl = (url) => getCloudinaryUrl(url, 600);
export const getCloudinaryThumbnailUrl = (url) => getCloudinaryUrl(url, 400);
