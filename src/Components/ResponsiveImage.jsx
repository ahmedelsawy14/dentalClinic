import { memo, useMemo, useState } from "react";
import { getCloudinaryUrl, isCloudinaryUrl, makeCloudinarySrcSet } from "../client/cloudinary";

function ResponsiveImage({
  src,
  alt,
  width,
  height,
  srcSet,
  sizes,
  priority = false,
  loading,
  placeholderColor = "#0f2744",
  className = "",
  wrapperClassName = "",
  style = {},
  onLoad = null,
  onError = null,
}) {
  const [error, setError] = useState(false);

  const resolvedSrc = useMemo(
    () => (isCloudinaryUrl(src) ? getCloudinaryUrl(src, width || 800) : src),
    [src, width],
  );
  const resolvedSrcSet = useMemo(
    () =>
      srcSet ||
      (isCloudinaryUrl(src) ? makeCloudinarySrcSet(src, [400, 600, 900, 1200]) : undefined),
    [src, srcSet],
  );
  const aspectRatio = width && height ? `${width} / ${height}` : undefined;
  const resolvedLoading = loading || (priority ? "eager" : "lazy");

  return (
    <div
      className={`relative overflow-hidden ${wrapperClassName}`}
      style={{ width: "100%", aspectRatio, background: placeholderColor, ...style }}
    >
      {!error ? (
        <img
          src={resolvedSrc}
          srcSet={resolvedSrcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={resolvedLoading}
          fetchPriority={priority ? "high" : "auto"}
          decoding={priority ? "sync" : "async"}
          className={`absolute inset-0 h-full w-full object-cover ${className}`}
          onLoad={(event) => {
            onLoad?.(event);
          }}
          onError={(event) => {
            setError(true);
            onError?.(event);
          }}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center bg-slate-200/70 px-4 text-center text-xs text-slate-500"
          role="img"
          aria-label={alt || "تعذر تحميل الصورة"}
        >
          تعذر تحميل الصورة
        </div>
      )}
    </div>
  );
}

export default memo(ResponsiveImage);
