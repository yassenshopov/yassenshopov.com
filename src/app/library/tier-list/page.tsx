'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clapperboard, Monitor, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import LibraryTierList from '@/components/library/LibraryTierList';
import LibraryModal from '@/components/library/LibraryModal';
import { libraryItems, type LibraryItem } from '@/data/library';
import {
  TIER_BOARDS,
  TIER_KEYS,
  itemMatchesBoard,
  materializeBoard,
  tierData,
  type BoardTiers,
  type TierBoardId,
  type TierData,
} from '@/data/library-tiers';
import {
  getCreatorLabel,
  getStatusColor,
  getRelatedItems as getRelatedItemsUtil,
  getSeriesInfo as getSeriesInfoUtil,
  getRelationshipLabel,
} from '@/lib/library-utils';

const TIER_EDIT_ENABLED = process.env.NODE_ENV === 'development';

const BOARD_ICONS: Record<TierBoardId, typeof BookOpen> = {
  fiction: BookOpen,
  nonfiction: BookOpen,
  movies: Clapperboard,
  series: Monitor,
  'anime-manga': Sparkles,
};

export default function LibraryTierListPage() {
  const [board, setBoard] = useState<TierBoardId>('fiction');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Full tier state lives here so drag edits survive board switches in a
  // session (the imported JSON is only re-seeded on a full reload).
  const [tierState, setTierState] = useState<TierData>(() => JSON.parse(JSON.stringify(tierData)));

  const items = useMemo(
    () => libraryItems.filter((item) => itemMatchesBoard(item, board)),
    [board]
  );

  // Ordered display order in the visible tiers (used for modal prev/next).
  const orderedItems = useMemo(() => {
    const layout = materializeBoard(items, tierState[board]);
    const byId = new Map(items.map((i) => [i.id, i] as const));
    const out: LibraryItem[] = [];
    for (const key of TIER_KEYS) {
      for (const id of layout[key] ?? []) {
        const found = byId.get(id);
        if (found) out.push(found);
      }
    }
    return out;
  }, [items, tierState, board]);

  const boardLayout = useMemo(
    () => materializeBoard(items, tierState[board]),
    [items, tierState, board]
  );

  const getRelatedItems = useCallback(
    (item: LibraryItem, limit?: number) => getRelatedItemsUtil(item, libraryItems, limit),
    []
  );
  const getSeriesInfo = useCallback(
    (item: LibraryItem) => getSeriesInfoUtil(item, libraryItems),
    []
  );

  const handleMove = useCallback(
    async (itemId: string, toTier: string, beforeId: string | null) => {
      const snapshot = tierState[board];

      let nextLayout: BoardTiers | null = null;
      setTierState((current) => {
        const layout = materializeBoard(items, current[board]);
        const next: BoardTiers = {};
        for (const key of TIER_KEYS) next[key] = (layout[key] ?? []).filter((id) => id !== itemId);

        const target = next[toTier] ?? (next[toTier] = []);
        const idx = beforeId ? target.indexOf(beforeId) : -1;
        if (idx >= 0) target.splice(idx, 0, itemId);
        else target.push(itemId);

        nextLayout = next;
        return { ...current, [board]: next };
      });

      try {
        const res = await fetch('/api/library/tier', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ boardId: board, tiers: nextLayout }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `HTTP ${res.status}`);
        }
      } catch (err) {
        setTierState((current) => ({ ...current, [board]: snapshot }));
        toast.error(`Couldn't save tier: ${(err as Error).message}`);
      }
    },
    [board, items, tierState]
  );

  const navigateToItem = useCallback(
    (direction: 'prev' | 'next') => {
      setSelectedItem((current) => {
        if (!current) return current;
        const list = orderedItems;
        const index = list.findIndex((i) => i.id === current.id);
        if (index === -1) return current;
        const nextIndex =
          direction === 'prev'
            ? (index - 1 + list.length) % list.length
            : (index + 1) % list.length;
        return list[nextIndex];
      });
      setIsTransitioning(true);
      requestAnimationFrame(() => setIsTransitioning(false));
    },
    [orderedItems]
  );

  return (
    <Layout>
      <section className="container mx-auto px-4 pt-24 pb-16">
        <Link
          href="/library"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Link>

        <div className="mt-4 flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
            Tier List
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            My books, movies, and series ranked into tiers — one board per category.
            {TIER_EDIT_ENABLED && ' Drag the covers between tiers, or within a row to reorder.'}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Tier list board"
          className="mt-8 flex gap-1 overflow-x-auto rounded-xl border border-border bg-muted/40 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:inline-flex sm:overflow-visible"
        >
          {TIER_BOARDS.map((b) => {
            const Icon = BOARD_ICONS[b.id];
            const isActive = board === b.id;
            return (
              <button
                key={b.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setBoard(b.id)}
                className={[
                  'relative flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                {isActive && (
                  <motion.span
                    layoutId="tier-board-pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-lg bg-background shadow-sm ring-1 ring-border"
                  />
                )}
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{b.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <LibraryTierList
            boardId={board}
            items={items}
            board={boardLayout}
            onItemClick={setSelectedItem}
            onMove={handleMove}
            editable={TIER_EDIT_ENABLED}
          />
        </div>
      </section>

      <LibraryModal
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        onNavigate={navigateToItem}
        isTransitioning={isTransitioning}
        sortedItems={orderedItems}
        getCreatorLabel={getCreatorLabel}
        getStatusColor={getStatusColor}
        getRelatedItems={getRelatedItems}
        getSeriesInfo={getSeriesInfo}
        getRelationshipLabel={getRelationshipLabel}
        onSelectItem={setSelectedItem}
      />
    </Layout>
  );
}
