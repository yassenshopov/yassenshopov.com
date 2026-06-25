'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen, Clapperboard, Monitor } from 'lucide-react';
import type { LibraryItem } from '@/data/library';
import { TIERS, UNRANKED_TIER, type BoardTiers, type TierBoardId } from '@/data/library-tiers';

function FallbackIcon({ type }: { type: LibraryItem['type'] }) {
  const className = 'w-6 h-6 text-muted-foreground';
  switch (type) {
    case 'book':
      return <BookOpen className={className} />;
    case 'movie':
      return <Clapperboard className={className} />;
    case 'series':
      return <Monitor className={className} />;
    default:
      return null;
  }
}

function TierThumbnail({
  item,
  onClick,
  draggable,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  item: LibraryItem;
  onClick: (item: LibraryItem) => void;
  draggable: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) {
  return (
    <button
      type="button"
      data-tile="1"
      data-id={item.id}
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.id);
        onDragStart(item.id);
      }}
      onDragEnd={onDragEnd}
      onClick={() => onClick(item)}
      title={item.title}
      aria-label={item.title}
      className={`group/tile relative aspect-[3/4] w-16 sm:w-20 shrink-0 overflow-hidden bg-muted outline-none transition-[transform,opacity] duration-200 hover:z-10 hover:scale-110 focus-visible:z-10 focus-visible:scale-110 ${
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      } ${isDragging ? 'opacity-40' : ''}`}
    >
      {item.coverImage ? (
        <Image
          src={item.coverImage}
          alt={item.title}
          fill
          sizes="80px"
          draggable={false}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <FallbackIcon type={item.type} />
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/90 to-transparent p-1 opacity-0 transition-all duration-200 group-hover/tile:translate-y-0 group-hover/tile:opacity-100 group-focus-visible/tile:translate-y-0 group-focus-visible/tile:opacity-100">
        <span className="line-clamp-2 text-[9px] font-medium leading-tight text-white">
          {item.title}
        </span>
      </div>
    </button>
  );
}

/** The id of the tile to insert before, or null to append at the end. */
function dropBeforeId(container: HTMLElement, clientX: number, clientY: number): string | null {
  const tiles = Array.from(container.querySelectorAll<HTMLElement>('[data-tile="1"]'));
  for (const tile of tiles) {
    const r = tile.getBoundingClientRect();
    const inRow = clientY >= r.top && clientY <= r.bottom;
    if (inRow && clientX < r.left + r.width / 2) return tile.dataset.id ?? null;
  }
  return null;
}

function TierRow({
  label,
  sublabel,
  colorClass,
  items,
  onItemClick,
  editable,
  draggingId,
  onDragStartItem,
  onDragEndItem,
  onDrop,
}: {
  label: string;
  sublabel?: string;
  colorClass: string;
  items: LibraryItem[];
  onItemClick: (item: LibraryItem) => void;
  editable: boolean;
  draggingId: string | null;
  onDragStartItem: (id: string) => void;
  onDragEndItem: () => void;
  onDrop: (beforeId: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);

  const dropHandlers = editable
    ? {
        onDragOver: (e: React.DragEvent) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          if (!isOver) setIsOver(true);
        },
        onDragLeave: (e: React.DragEvent) => {
          if (!containerRef.current?.contains(e.relatedTarget as Node)) setIsOver(false);
        },
        onDrop: (e: React.DragEvent) => {
          e.preventDefault();
          setIsOver(false);
          const beforeId = containerRef.current
            ? dropBeforeId(containerRef.current, e.clientX, e.clientY)
            : null;
          onDrop(beforeId);
        },
      }
    : {};

  return (
    <div className="flex min-h-[6rem]">
      <div
        className={`flex w-16 sm:w-24 shrink-0 flex-col items-center justify-center gap-0.5 ${colorClass} p-2 text-center`}
      >
        <span className="text-2xl sm:text-3xl font-black leading-none tracking-tight text-black/85">
          {label}
        </span>
        {sublabel && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-black/60">
            {sublabel}
          </span>
        )}
      </div>
      <div
        ref={containerRef}
        className={`flex flex-1 flex-wrap content-start items-start bg-card transition-shadow ${
          isOver ? 'ring-2 ring-inset ring-primary' : ''
        }`}
        {...dropHandlers}
      >
        {items.length === 0 ? (
          <span className="self-center p-3 text-xs italic text-muted-foreground">
            {editable && draggingId ? 'Drop here' : 'Nothing here yet'}
          </span>
        ) : (
          items.map((item) => (
            <TierThumbnail
              key={item.id}
              item={item}
              onClick={onItemClick}
              draggable={editable}
              onDragStart={onDragStartItem}
              onDragEnd={onDragEndItem}
              isDragging={draggingId === item.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface LibraryTierListProps {
  boardId: TierBoardId;
  items: LibraryItem[];
  /** Materialized, ordered tier lists for this board. */
  board: BoardTiers;
  onItemClick: (item: LibraryItem) => void;
  /** Move `itemId` into `toTier`, inserting before `beforeId` (null = append). */
  onMove?: (itemId: string, toTier: string, beforeId: string | null) => void;
  /** Enables drag-and-drop ranking + reordering (dev only). */
  editable?: boolean;
}

export default function LibraryTierList({
  boardId,
  items,
  board,
  onItemClick,
  onMove,
  editable = false,
}: LibraryTierListProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const itemById = useMemo(() => {
    const map = new Map<string, LibraryItem>();
    for (const item of items) map.set(item.id, item);
    return map;
  }, [items]);

  const resolve = (ids: string[]): LibraryItem[] =>
    ids.map((id) => itemById.get(id)).filter((i): i is LibraryItem => Boolean(i));

  function handleDrop(toTier: string, beforeId: string | null) {
    if (!draggingId) return;
    if (beforeId !== draggingId) onMove?.(draggingId, toTier, beforeId);
    setDraggingId(null);
  }

  const rows = [
    ...TIERS.map((t) => ({
      key: t.id,
      label: t.label,
      sublabel: undefined as string | undefined,
      colorClass: t.colorClass,
    })),
    // The unranked pool is a staging area for ranking — only surface it while
    // editing (dev). In production the board shows just the ranked tiers.
    ...(editable
      ? [
          {
            key: UNRANKED_TIER,
            label: '·',
            sublabel: 'Unranked',
            colorClass: 'bg-muted-foreground/30',
          },
        ]
      : []),
  ];

  return (
    <motion.div
      key={boardId}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden border border-border"
    >
      {rows.map((row) => (
        <TierRow
          key={row.key}
          label={row.label}
          sublabel={row.sublabel}
          colorClass={row.colorClass}
          items={resolve(board[row.key] ?? [])}
          onItemClick={onItemClick}
          editable={editable}
          draggingId={draggingId}
          onDragStartItem={setDraggingId}
          onDragEndItem={() => setDraggingId(null)}
          onDrop={(beforeId) => handleDrop(row.key, beforeId)}
        />
      ))}
    </motion.div>
  );
}
