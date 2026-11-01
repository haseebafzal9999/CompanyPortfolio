"use client";

import { useEffect } from "react";

// Pauses every CSS-driven infinite animation while the tab is hidden.
export default function VisibilityGovernor() {
  useEffect(() => {
    const sync = () =>
      document.documentElement.classList.toggle("page-hidden", document.visibilityState !== "visible");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  return null;
}
