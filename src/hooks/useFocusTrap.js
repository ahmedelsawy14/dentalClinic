import { useEffect } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

function getFocusableElements(container) {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true",
  );
}

export function useFocusTrap({ containerRef, isActive, onEscape, initialFocusRef = null }) {
  useEffect(() => {
    if (!isActive || !containerRef.current) {
      return undefined;
    }

    const container = containerRef.current;
    const previousActiveElement = document.activeElement;
    const focusableElements = getFocusableElements(container);
    const initialTarget = initialFocusRef?.current || focusableElements[0] || container;

    if (!container.hasAttribute("tabindex")) {
      container.setAttribute("tabindex", "-1");
    }

    initialTarget.focus?.();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onEscape?.();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const currentFocusable = getFocusableElements(container);
      if (!currentFocusable.length) {
        event.preventDefault();
        container.focus();
        return;
      }

      const firstElement = currentFocusable[0];
      const lastElement = currentFocusable[currentFocusable.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus?.();
    };
  }, [containerRef, initialFocusRef, isActive, onEscape]);
}
