"use client";

import { useEffect, useRef } from "react";

/**
 * Adds `is-visible` to the element (and any `.reveal` descendants) once it
 * scrolls into view. Pair with the `.reveal` utility in globals.css.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets: Element[] = root.classList.contains("reveal")
      ? [root, ...Array.from(root.querySelectorAll(".reveal"))]
      : Array.from(root.querySelectorAll(".reveal"));

    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return ref;
}
