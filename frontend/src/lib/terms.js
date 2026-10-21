"use client";

import { useEffect, useState } from "react";
import { apiGetCurrentTerm } from "./api";

/**
 * The current term (فصل جاری) is shown in many places: sidebar, banners, the
 * student portal. It is fetched once per page load and shared, and refreshed
 * whenever an admin changes it (see announceTermChange).
 */
let cache = { loaded: false, term: null, promise: null };
const listeners = new Set();

function publish(term) {
  cache = { loaded: true, term, promise: null };
  listeners.forEach((fn) => fn(term));
}

function load() {
  if (!cache.promise) {
    cache.promise = apiGetCurrentTerm()
      .then((term) => publish(term || null))
      .catch(() => publish(null));
  }
  return cache.promise;
}

/** Call after the current term is switched or edited so every consumer refreshes. */
export function announceTermChange() {
  cache = { loaded: false, term: cache.term, promise: null };
  load();
}

/** Returns { term, loading }. `term` is null when none is current or the API is down. */
export function useCurrentTerm() {
  const [state, setState] = useState({ term: cache.term, loading: !cache.loaded });

  useEffect(() => {
    const onChange = (term) => setState({ term, loading: false });
    listeners.add(onChange);
    if (cache.loaded) {
      setState({ term: cache.term, loading: false });
    } else {
      load();
    }
    return () => listeners.delete(onChange);
  }, []);

  return state;
}

// Season order used when an admin defines a term: the code is "<year>-<n>", the
// same scheme as the seeded "1404-1" (autumn 1404).
export const SEASONS = [
  { value: "پاییز", index: 1 },
  { value: "زمستان", index: 2 },
  { value: "بهار", index: 3 },
  { value: "تابستان", index: 4 },
];
