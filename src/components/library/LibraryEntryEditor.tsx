'use client';

// Temporary: dev-only inline editor for LibraryItem id + LibraryEntry rows.
// Remove this file (and the matching API routes at
// src/app/api/library/update-entry/route.ts and
// src/app/api/library/update-item/route.ts) when the library data is locked
// down — same lifecycle as the cover-upload drag-and-drop in LibraryItemCard.

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Hash, Loader2, Pencil, Save, Star, Undo2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { LibraryEntry, LibraryItem, ReadingStatus } from '@/data/library';

const ID_PATTERN = /^[a-zA-Z0-9._-]+$/;

const STATUS_OPTIONS: ReadingStatus[] = ['completed', 'in-progress', 'on-pause', 'dnf'];

interface LibraryEntryEditorProps {
  item: LibraryItem;
  /**
   * Called after a successful entry save. `entries` is the full updated array
   * so the modal can re-derive the displayed (latest-entry) values.
   * `entryIndex` is the position that was edited.
   */
  onSaved: (entries: LibraryEntry[], entryIndex: number) => void;
  /**
   * Called after a successful id rename. The modal should mirror the new id
   * locally so subsequent saves (and the close/navigate buttons) keep working
   * without a refresh.
   */
  onIdSaved: (newId: string) => void;
}

interface DraftEntry {
  status: ReadingStatus;
  dateStarted: string;
  dateCompleted: string;
  rating: number | null;
  notes: string;
}

function entryToDraft(entry: LibraryEntry): DraftEntry {
  return {
    status: entry.status,
    dateStarted: entry.dateStarted ?? '',
    dateCompleted: entry.dateCompleted ?? '',
    rating: entry.rating ?? null,
    notes: entry.notes ?? '',
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

function buildPatch(
  draft: DraftEntry,
  original: DraftEntry,
): Record<string, string | number | null> {
  const patch: Record<string, string | number | null> = {};
  if (draft.status !== original.status) patch.status = draft.status;
  if (draft.dateStarted !== original.dateStarted) {
    patch.dateStarted = draft.dateStarted === '' ? null : draft.dateStarted;
  }
  if (draft.dateCompleted !== original.dateCompleted) {
    patch.dateCompleted = draft.dateCompleted === '' ? null : draft.dateCompleted;
  }
  if (draft.rating !== original.rating) {
    patch.rating = draft.rating;
  }
  if (draft.notes !== original.notes) {
    patch.notes = draft.notes === '' ? null : draft.notes;
  }
  return patch;
}

function formatStatusLabel(s: string) {
  return s
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function IdRow({
  currentId,
  onPersist,
}: {
  currentId: string;
  onPersist: (newId: string) => void;
}) {
  const [draft, setDraft] = useState(currentId);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraft(currentId);
  }, [currentId]);

  const trimmed = draft.trim();
  const isDirty = trimmed !== currentId;
  const isValidFormat = trimmed === '' || ID_PATTERN.test(trimmed);
  const canSave = isDirty && trimmed !== '' && isValidFormat;

  async function handleSave() {
    if (!canSave) return;
    setIsSaving(true);
    const toastId = toast.loading('Renaming item…');
    try {
      const res = await fetch('/api/library/update-item', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: currentId, patch: { id: trimmed } }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      const nextId = typeof body.id === 'string' ? body.id : trimmed;
      onPersist(nextId);
      toast.success(`Renamed to "${nextId}".`, { id: toastId });
    } catch (err) {
      toast.error(`Rename failed: ${(err as Error).message}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-md border border-border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <Hash className="w-3 h-3" />
          Item id
        </span>
        <div className="flex items-center gap-2">
          {isDirty && !isSaving && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setDraft(currentId)}
              className="h-8 px-2 text-xs"
            >
              <Undo2 className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={!canSave || isSaving}
            className="h-8 px-3 text-xs"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 mr-1" />
            )}
            Save id
          </Button>
        </div>
      </div>

      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        spellCheck={false}
        autoComplete="off"
        className={`h-9 font-mono text-sm ${
          !isValidFormat ? 'border-destructive focus-visible:ring-destructive' : ''
        }`}
        aria-invalid={!isValidFormat}
      />

      <p className="text-[11px] text-muted-foreground leading-snug">
        {!isValidFormat
          ? 'Only letters, digits, dot, underscore, and hyphen are allowed.'
          : 'Renaming also rewrites this id everywhere it appears in other items\' relationships (prequel, sequel, related, sameUniverse, adaptations, basedOn).'}
      </p>
    </div>
  );
}

function StarPicker({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (rating: number | null) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const n = i + 1;
        const active = value != null && n <= value;
        return (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
            // Click twice on the same star to clear it.
            onClick={() => onChange(value === n ? null : n)}
            className="p-0.5 rounded hover:bg-muted/60 transition-colors"
          >
            <Star
              className={`w-4 h-4 ${
                active ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/40'
              }`}
            />
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => onChange(null)}
        className="ml-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors"
      >
        Clear
      </button>
    </div>
  );
}

function EntryRow({
  itemId,
  entry,
  entryIndex,
  totalEntries,
  onPersist,
}: {
  itemId: string;
  entry: LibraryEntry;
  entryIndex: number;
  totalEntries: number;
  onPersist: (updatedEntry: LibraryEntry, entryIndex: number) => void;
}) {
  const original = useMemo(() => entryToDraft(entry), [entry]);
  const [draft, setDraft] = useState<DraftEntry>(original);
  const [isSaving, setIsSaving] = useState(false);

  // Reset draft if the underlying entry changes (e.g. after a successful save
  // higher up the tree, or when navigating to a different item).
  useEffect(() => {
    setDraft(entryToDraft(entry));
  }, [entry]);

  const isDirty = !draftsEqual(draft, original);

  async function handleSave() {
    const patch = buildPatch(draft, original);
    if (Object.keys(patch).length === 0) return;

    setIsSaving(true);
    const toastId = toast.loading('Saving entry…');
    try {
      const res = await fetch('/api/library/update-entry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: itemId, entryIndex, patch }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      const nextEntry = body.entry as LibraryEntry;
      onPersist(nextEntry, entryIndex);
      toast.success('Entry saved.', { id: toastId });
    } catch (err) {
      toast.error(`Save failed: ${(err as Error).message}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setDraft(original);
  }

  const headingLabel = totalEntries > 1 ? `Entry ${entryIndex + 1} of ${totalEntries}` : 'Entry';
  const summaryDate = entry.dateCompleted || entry.dateStarted;

  return (
    <div className="rounded-md border border-border bg-muted/30 p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {headingLabel}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatStatusLabel(entry.status)}
            {summaryDate ? ` · ${summaryDate}` : ''}
            {entry.rating != null ? ` · ${entry.rating}/5` : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && !isSaving && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleReset}
              className="h-8 px-2 text-xs"
            >
              <Undo2 className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="h-8 px-3 text-xs"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 mr-1" />
            )}
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Status
          </Label>
          {/* Plain <select> keeps focus behaviour predictable inside the
              modal's overflow container; the shadcn Select renders its
              listbox in a Portal which we don't need here. */}
          <select
            value={draft.status}
            onChange={(e) =>
              setDraft((d) => ({ ...d, status: e.target.value as ReadingStatus }))
            }
            className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {formatStatusLabel(s)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Rating
          </Label>
          <div className="flex h-9 items-center">
            <StarPicker
              value={draft.rating}
              onChange={(rating) => setDraft((d) => ({ ...d, rating }))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Date started
          </Label>
          <Input
            type="date"
            value={draft.dateStarted}
            onChange={(e) => setDraft((d) => ({ ...d, dateStarted: e.target.value }))}
            className="h-9"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Date completed
          </Label>
          <Input
            type="date"
            value={draft.dateCompleted}
            onChange={(e) => setDraft((d) => ({ ...d, dateCompleted: e.target.value }))}
            className="h-9"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Notes
        </Label>
        <Textarea
          value={draft.notes}
          onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
          rows={3}
          placeholder="Optional thoughts about this read/watch…"
          className="text-sm"
        />
      </div>
    </div>
  );
}

export default function LibraryEntryEditor({
  item,
  onSaved,
  onIdSaved,
}: LibraryEntryEditorProps) {
  // We mirror entries locally so each successful save updates the row in place
  // without needing to refetch the static JSON. The modal also receives the
  // updated array via onSaved so it can re-project the latest-entry fields.
  //
  // The modal remounts this component (via `key={selectedItem.id}`) when the
  // user navigates to a different item, which is how state resets between
  // items — no useEffect needed here.
  const [entries, setEntries] = useState<LibraryEntry[]>(item.entries ?? []);
  const [isOpen, setIsOpen] = useState(false);

  const hasEntries = entries.length > 0;

  function handlePersist(updatedEntry: LibraryEntry, entryIndex: number) {
    const next = entries.map((e, i) => (i === entryIndex ? updatedEntry : e));
    setEntries(next);
    onSaved(next, entryIndex);
  }

  return (
    <section className="rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5 p-4">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">
          <Pencil className="w-3.5 h-3.5" />
          Dev edit · {hasEntries ? `${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}` : 'no entries'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-amber-700 dark:text-amber-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
          <IdRow currentId={item.id} onPersist={onIdSaved} />

          {hasEntries ? (
            entries.map((entry, i) => (
              <EntryRow
                key={`${item.id}-entry-${i}`}
                itemId={item.id}
                entry={entry}
                entryIndex={i}
                totalEntries={entries.length}
                onPersist={handlePersist}
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground">
              This item has no entries yet (it&apos;s on a wishlist/watchlist). Add one
              directly to <code>src/data/library-items.json</code> to enable inline editing.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
