import { createElement, memo, useEffect, useRef, useState } from "react";

function Reveal({
  as: Tag = "div",
  children,
  className = "",
  delay = 0,
  distance = 16,
  threshold = 0.12,
  disabled = false,
  ...rest
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(disabled);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    if (disabled) {
      setIsVisible(true);
      return undefined;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [disabled, threshold]);

  return createElement(
    Tag,
    {
      ref,
      className,
      ...rest,
      style: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate3d(0,0,0)" : `translate3d(0, ${distance}px, 0)`,
        transition: `opacity 460ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 460ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: isVisible ? "auto" : "opacity, transform",
        ...rest.style,
      },
    },
    children,
  );
}

export default memo(Reveal);
