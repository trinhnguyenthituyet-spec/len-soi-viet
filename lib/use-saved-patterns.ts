"use client";

import { useCallback, useEffect, useState } from "react";
import { SAVED_PATTERNS_STORAGE_KEY } from "./constants";

export interface SavedPatternEntry {
  patternId: string;
  savedAt: string;
  notes: string;
}

function readStorage(): SavedPatternEntry[] {
  try {
    const raw = window.localStorage.getItem(SAVED_PATTERNS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStorage(entries: SavedPatternEntry[]) {
  window.localStorage.setItem(SAVED_PATTERNS_STORAGE_KEY, JSON.stringify(entries));
}

export function useSavedPatterns() {
  const [entries, setEntries] = useState<SavedPatternEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEntries(readStorage());
    setHydrated(true);
  }, []);

  const isSaved = useCallback(
    (patternId: string) => entries.some((e) => e.patternId === patternId),
    [entries],
  );

  const toggleSave = useCallback((patternId: string) => {
    setEntries((prev) => {
      const exists = prev.some((e) => e.patternId === patternId);
      const next = exists
        ? prev.filter((e) => e.patternId !== patternId)
        : [...prev, { patternId, savedAt: new Date().toISOString(), notes: "" }];
      writeStorage(next);
      return next;
    });
  }, []);

  const removeSaved = useCallback((patternId: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.patternId !== patternId);
      writeStorage(next);
      return next;
    });
  }, []);

  const updateNotes = useCallback((patternId: string, notes: string) => {
    setEntries((prev) => {
      const next = prev.map((e) => (e.patternId === patternId ? { ...e, notes } : e));
      writeStorage(next);
      return next;
    });
  }, []);

  return { entries, hydrated, isSaved, toggleSave, removeSaved, updateNotes };
}
