import { TIER_BY_ID, getItemTier } from '@/data/library-tiers';

interface TierBadgeProps {
  itemId: string;
  size?: 'sm' | 'md';
}

/**
 * Shows the item's manual tier ranking (S/A/B/C/D) as a colored badge,
 * replacing the old star rating in the library card and modal. Renders nothing
 * when the item hasn't been placed on any board.
 */
export default function TierBadge({ itemId, size = 'sm' }: TierBadgeProps) {
  const tierId = getItemTier(itemId);
  const isMd = size === 'md';

  if (!tierId) {
    return null;
  }

  const tier = TIER_BY_ID[tierId];
  const chip = isMd ? 'h-7 w-7 text-base rounded' : 'h-5 w-5 text-xs rounded-[3px]';
  const label = isMd ? 'text-xs' : 'text-[10px]';

  return (
    <span
      title={`${tier.label} tier`}
      aria-label={`${tier.label} tier`}
      className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md bg-muted/50 shadow-none ring-1 ring-inset ring-border ${
        isMd ? 'py-1 pl-1 pr-2.5' : 'py-0.5 pl-0.5 pr-2'
      }`}
    >
      <span
        className={`inline-flex items-center justify-center font-black leading-none text-black/85 shadow-none ${tier.colorClass} ${chip}`}
      >
        {tier.label}
      </span>
      <span className={`font-bold uppercase tracking-wider text-foreground/80 ${label}`}>
        Tier
      </span>
    </span>
  );
}
