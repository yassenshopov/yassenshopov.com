'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { LibraryItem, LibraryEntry, ReadingStatus, getLatestEntry } from '@/data/library';

export interface DraftEntry {
  status: ReadingStatus;
  dateStarted: string;
  dateCompleted: string;
  rating: number | null;
  notes: string;
}

function seedDraft(item: LibraryItem): DraftEntry {
  const latest = item.entries ? getLatestEntry(item.entries) : undefined;
  return {
    status: latest?.status ?? (item.status as ReadingStatus) ?? 'completed',
    dateStarted: latest?.dateStarted ?? item.dateStarted ?? '',
    dateCompleted: latest?.dateCompleted ?? item.dateCompleted ?? '',
    rating: latest?.rating ?? item.rating ?? null,
    notes: latest?.notes ?? item.notes ?? '',
  };
}

function draftsEqual(a: DraftEntry, b: DraftEntry): boolean {
  return (
    a.status === b.status &&
    a.dateStarted === b.dateStarted &&
    a.dateCompleted === b.dateCompleted &&
    a.rating === b.rating &&
    a.notes === b.notes
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
  return patch;
}

export function useLibraryEntryEditor(selectedItem: LibraryItem) {
  const [entriesOverride, setEntriesOverride] = useState<LibraryEntry[] | null>(null);
  const [idOverride, setIdOverride] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftEntry>(() => seedDraft(selectedItem));
  const [draftId, setDraftId] = useState(selectedItem.id);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEntriesOverride(null);
    setIdOverride(null);
    setDraft(seedDraft(selectedItem));
    setDraftId(selectedItem.id);
  }, [selectedItem]);

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

  const original = useMemo(() => seedDraft(displayItem), [displayItem]);
  const isDirty = canEdit && (!draftsEqual(draft, original) || draftId.trim() !== displayItem.id);

  const resetDraft = useCallback(() => {
    setDraft(seedDraft(displayItem));
    setDraftId(displayItem.id);
  }, [displayItem]);

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
        const res = await fetch('/api/library/update-entry', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id: displayItem.id, patch: entryPatch }),
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
  }, [isDirty, isSaving, draft, original, draftId, displayItem]);

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
