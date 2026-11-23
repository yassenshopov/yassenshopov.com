'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  LibraryTabList,
  LibraryTabTrigger,
  libraryTabSizeClass,
} from '@/components/library/LibraryTabBar';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import LibraryTierList from '@/components/library/LibraryTierList';
import { type LibraryItem } from '@/data/library';
import {
  TIER_BOARDS,
  TIER_KEYS,
  TIERS,
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

const LibraryModal = dynamic(() => import('@/components/library/LibraryModal'), { ssr: false });

const TIER_EDIT_ENABLED = process.env.NODE_ENV === 'development';

const BOARD_IDS = new Set<string>(TIER_BOARDS.map((b) => b.id));

function isBoardId(value: string | null | undefined): value is TierBoardId {
  return Boolean(value) && BOARD_IDS.has(value as string);
}

export function LibraryTierListView({ items: allItems }: { items: LibraryItem[] }) {
  return (
    <Suspense fallback={<Layout>{null}</Layout>}>
      <LibraryTierListContent allItems={allItems} />
    </Suspense>
  );
}

function LibraryTierListContent({ allItems }: { allItems: LibraryItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const boardParam = searchParams.get('board');

  const [board, setBoard] = useState<TierBoardId>(() =>
    isBoardId(boardParam) ? boardParam : 'fiction'
  );
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Full tier state lives here so drag edits survive board switches in a
  // session (the imported JSON is only re-seeded on a full reload).
  const [tierState, setTierState] = useState<TierData>(() => structuredClone(tierData));

  // Keep the active board in sync with the URL so a board is shareable and
  // survives back/forward navigation. The query param is the source of truth.
  useEffect(() => {
    if (isBoardId(boardParam) && boardParam !== board) setBoard(boardParam);
  }, [boardParam, board]);

  const selectBoard = useCallback(
    (next: TierBoardId) => {
      // Drive the switch from local state for an instant swap, then reflect it
      // in the URL via the History API. Unlike router.replace this does *not*
      // kick off a soft navigation, so there's no flash on every tab click —
      // Next still keeps useSearchParams in sync for back/forward + sharing.
      setBoard(next);
      const params = new URLSearchParams(searchParams.toString());
      params.set('board', next);
      window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
    },
    [pathname, searchParams]
  );

  const items = useMemo(
    () => allItems.filter((item) => itemMatchesBoard(item, board)),
    [allItems, board]
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
    (item: LibraryItem, limit?: number) => getRelatedItemsUtil(item, allItems, limit),
    [allItems]
  );
  const getSeriesInfo = useCallback(
    (item: LibraryItem) => getSeriesInfoUtil(item, allItems),
    [allItems]
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
      <section className="relative isolate overflow-hidden border-b border-border bg-linear-to-b from-background via-background to-muted/40 scroll-mt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 12% 18%, color-mix(in oklch, var(--primary) 16%, transparent) 0%, transparent 42%), radial-gradient(circle at 88% 82%, color-mix(in oklch, var(--primary) 12%, transparent) 0%, transparent 42%)',
          }}
        />

        <div className="container mx-auto px-4 pb-12 pt-24">
          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </Link>

          <div className="mt-6 flex flex-col gap-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium md:text-sm">
                Ranked by
                <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src="/resources/images/main_page/YassenShopov.jpg"
                    alt="Yassen Shopov"
                    fill
                    sizes="20px"
                    className="object-cover"
                  />
                </span>
                Yassen Shopov
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-bold leading-[0.95] tracking-tighter text-foreground md:text-6xl">
                Tier List
              </h1>
              <div className="flex items-center gap-1.5" aria-hidden>
                {TIERS.map((t) => (
                  <span
                    key={t.id}
                    className={`flex h-7 w-7 items-center justify-center rounded-[4px] text-sm font-black leading-none text-black/85 ${t.colorClass}`}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </div>

            <p className="max-w-2xl leading-relaxed text-muted-foreground">
              My books, movies, and series ranked from S to D &mdash; one board per category.
            </p>
          </div>
        </div>

        <LibraryTabList
          aria-label="Tier list board"
          className="w-full overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex min-w-full">
            {TIER_BOARDS.map((b) => (
              <LibraryTabTrigger
                key={b.id}
                isActive={board === b.id}
                onSelect={() => selectBoard(b.id)}
                underlineLayoutId="tier-board-tab"
                className={`min-w-0 flex-1 whitespace-nowrap sm:px-5 ${libraryTabSizeClass}`}
              >
                {b.label}
              </LibraryTabTrigger>
            ))}
          </div>
        </LibraryTabList>
      </section>

      <section className="container mx-auto px-4 py-10">
        <LibraryTierList
          boardId={board}
          items={items}
          board={boardLayout}
          onItemClick={setSelectedItem}
          onMove={handleMove}
          editable={TIER_EDIT_ENABLED}
        />
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
