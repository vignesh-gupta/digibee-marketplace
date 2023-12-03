import { RefObject, useEffect } from "react";

type Event = MouseEvent | TouchEvent | KeyboardEvent;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }

      handler(event); // Call the handler only if the click is outside of the element passed.
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handler(e);
    };

    document.addEventListener("keydown", handleEscape);

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [ref, handler]); // Reload only if ref or handler changes
};
