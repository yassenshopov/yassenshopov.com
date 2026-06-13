import { TIER_BY_ID, getItemTier } from '@/data/library-tiers';

interface TierBadgeProps {
  itemId: string;
  size?: 'sm' | 'md';
}

/**
 * Shows the item's manual tier ranking (S/A/B/C/D) as a colored badge,
 * replacing the old star rating in the library card and modal. Falls back to a
 * muted "Unranked" label when the item hasn't been placed on any board.
 */
export default function TierBadge({ itemId, size = 'sm' }: TierBadgeProps) {
  const tierId = getItemTier(itemId);
  const isMd = size === 'md';

  if (!tierId) {
    return (
      <span
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-md bg-muted/50 ring-1 ring-inset ring-border ${
          isMd ? 'px-2.5 py-1' : 'px-2 py-0.5'
        }`}
      >
        <span
          className={`font-semibold uppercase tracking-wider text-muted-foreground ${
            isMd ? 'text-xs' : 'text-[10px]'
          }`}
        >
          Unranked
        </span>
      </span>
    );
  }

  const tier = TIER_BY_ID[tierId];
  const chip = isMd ? 'h-7 w-7 text-base rounded' : 'h-5 w-5 text-xs rounded-[3px]';
  const label = isMd ? 'text-xs' : 'text-[10px]';

  return (
    <span
      title={`${tier.label} tier`}
      aria-label={`${tier.label} tier`}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md bg-muted/50 ring-1 ring-inset ring-border ${
        isMd ? 'py-1 pl-1 pr-2.5' : 'py-0.5 pl-0.5 pr-2'
      }`}
    >
      <span
        className={`inline-flex items-center justify-center font-black leading-none text-black/85 ${tier.colorClass} ${chip}`}
      >
        {tier.label}
      </span>
      <span className={`font-bold uppercase tracking-wider text-foreground/80 ${label}`}>
        Tier
      </span>
    </span>
  );
}
