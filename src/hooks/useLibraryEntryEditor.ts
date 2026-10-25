'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import {
  type LibraryItem,
  type LibraryEntry,
  type ReadingStatus,
  getLatestEntry,
} from '@/data/library';
import { findLatestEntryIndex } from '@/lib/library-entry-validation';

export interface DraftEntry {
  status: ReadingStatus;
  dateStarted: string;
  dateCompleted: string;
  rating: number | null;
  notes: string;
  displayTitle: string;
  subtitle: string;
  coverImage: string;
}

function entryAtIndex(item: LibraryItem, entryIndex: number | null): LibraryEntry | undefined {
  const entries = item.entries ?? [];
  if (entries.length === 0) return undefined;
  if (entryIndex !== null && entryIndex >= 0 && entryIndex < entries.length) {
    return entries[entryIndex];
  }
  return getLatestEntry(entries);
}

function seedDraft(item: LibraryItem, entryIndex: number | null): DraftEntry {
  const target = entryAtIndex(item, entryIndex);
  const latest = item.entries ? getLatestEntry(item.entries) : undefined;
  const source = target ?? latest;
  return {
    status: source?.status ?? (item.status as ReadingStatus) ?? 'completed',
    dateStarted: source?.dateStarted ?? item.dateStarted ?? '',
    dateCompleted: source?.dateCompleted ?? item.dateCompleted ?? '',
    rating: source?.rating ?? item.rating ?? null,
    notes: source?.notes ?? item.notes ?? '',
    displayTitle: source?.displayTitle ?? '',
    subtitle: source?.subtitle ?? '',
    coverImage: source?.coverImage ?? '',
  };
}

function draftsEqual(a: DraftEntry, b: DraftEntry): boolean {
  return (
    a.status === b.status &&
    a.dateStarted === b.dateStarted &&
    a.dateCompleted === b.dateCompleted &&
    a.rating === b.rating &&
    a.notes === b.notes &&
    a.displayTitle === b.displayTitle &&
    a.subtitle === b.subtitle &&
    a.coverImage === b.coverImage
  );
}

function buildEntryPatch(
  draft: DraftEntry,
  original: DraftEntry
): Record<string, string | number | null> {
  const patch: Record<string, string | number | null> = {};
  if (draft.status !== original.status) patch.status = draft.status;
  if (draft.dateStarted !== original.dateStarted) {
    patch.dateStarted = draft.dateStarted === '' ? null : draft.dateStarted;
  }
  if (draft.dateCompleted !== original.dateCompleted) {
    patch.dateCompleted = draft.dateCompleted === '' ? null : draft.dateCompleted;
  }
  if (draft.rating !== original.rating) patch.rating = draft.rating;
  if (draft.notes !== original.notes) {
    patch.notes = draft.notes === '' ? null : draft.notes;
  }
  if (draft.displayTitle !== original.displayTitle) {
    patch.displayTitle = draft.displayTitle === '' ? null : draft.displayTitle;
  }
  if (draft.subtitle !== original.subtitle) {
    patch.subtitle = draft.subtitle === '' ? null : draft.subtitle;
  }
  if (draft.coverImage !== original.coverImage) {
    patch.coverImage = draft.coverImage === '' ? null : draft.coverImage;
  }
  return patch;
}

function resolveSaveEntryIndex(item: LibraryItem, entryIndex: number | null): number {
  const entries = item.entries ?? [];
  if (entryIndex !== null && entryIndex >= 0 && entryIndex < entries.length) {
    return entryIndex;
  }
  return findLatestEntryIndex(entries);
}

export function useLibraryEntryEditor(
  selectedItem: LibraryItem,
  selectedEntryIndex: number | null = null
) {
  const [entriesOverride, setEntriesOverride] = useState<LibraryEntry[] | null>(null);
  const [idOverride, setIdOverride] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftEntry>(() => seedDraft(selectedItem, selectedEntryIndex));
  const [draftId, setDraftId] = useState(selectedItem.id);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEntriesOverride(null);
    setIdOverride(null);
    setDraft(seedDraft(selectedItem, selectedEntryIndex));
    setDraftId(selectedItem.id);
  }, [selectedItem, selectedEntryIndex]);

  const displayItem: LibraryItem = useMemo(() => {
    if (!entriesOverride && !idOverride) return selectedItem;

    const base: LibraryItem = idOverride ? { ...selectedItem, id: idOverride } : selectedItem;
    if (!entriesOverride) return base;

    const latest = getLatestEntry(entriesOverride);
    if (!latest) return { ...base, entries: entriesOverride };
    return {
      ...base,
      entries: entriesOverride,
      status: latest.status,
      rating: latest.rating ?? null,
      dateCompleted: latest.dateCompleted,
      dateStarted: latest.dateStarted,
      notes: latest.notes,
    };
  }, [selectedItem, entriesOverride, idOverride]);

  const canEdit = process.env.NODE_ENV === 'development' && (displayItem.entries?.length ?? 0) > 0;

  const original = useMemo(
    () => seedDraft(displayItem, selectedEntryIndex),
    [displayItem, selectedEntryIndex]
  );
  const isDirty = canEdit && (!draftsEqual(draft, original) || draftId.trim() !== displayItem.id);

  const resetDraft = useCallback(() => {
    setDraft(seedDraft(displayItem, selectedEntryIndex));
    setDraftId(displayItem.id);
  }, [displayItem, selectedEntryIndex]);

  const handleSave = useCallback(async () => {
    if (!isDirty || isSaving) return;
    const entryPatch = buildEntryPatch(draft, original);
    const nextId = draftId.trim();
    const idDirty = nextId !== '' && nextId !== displayItem.id;
    if (Object.keys(entryPatch).length === 0 && !idDirty) return;

    setIsSaving(true);
    const toastId = toast.loading('Saving\u2026');
    try {
      if (Object.keys(entryPatch).length > 0) {
        const saveIndex = resolveSaveEntryIndex(displayItem, selectedEntryIndex);
        const res = await fetch('/api/library/update-entry', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            id: displayItem.id,
            entryIndex: saveIndex,
            patch: entryPatch,
          }),
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`);
        const savedEntry = body.entry as LibraryEntry;
        const savedIndex = body.entryIndex as number;
        const baseEntries = displayItem.entries ?? [];
        setEntriesOverride(baseEntries.map((e, i) => (i === savedIndex ? savedEntry : e)));
      }

      if (idDirty) {
        const res = await fetch('/api/library/update-item', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id: displayItem.id, patch: { id: nextId } }),
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`);
        const persistedId = typeof body.id === 'string' ? body.id : nextId;
        setIdOverride(persistedId);
        setDraftId(persistedId);
      }

      toast.success('Saved.', { id: toastId });
    } catch (err) {
      toast.error(`Save failed: ${(err as Error).message}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  }, [isDirty, isSaving, draft, original, draftId, displayItem, selectedEntryIndex]);

  return {
    displayItem,
    draft,
    setDraft,
    draftId,
    setDraftId,
    isSaving,
    canEdit,
    isDirty,
    resetDraft,
    handleSave,
  };
}
