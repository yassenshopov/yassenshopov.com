import Image from 'next/image';
import { forwardRef } from 'react';
import { getTechBadgeMeta, getTechColor } from '@/data/projects';

type TechBadgeSize = 'sm' | 'md';

interface TechBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tag: string;
  size?: TechBadgeSize;
}

const SIZES: Record<
  TechBadgeSize,
  { text: string; gap: string; pad: string; icon: string; img: number }
> = {
  sm: { text: 'text-xs', gap: 'gap-1.5', pad: 'px-2.5 py-1', icon: 'h-3.5 w-3.5', img: 14 },
  md: { text: 'text-sm', gap: 'gap-2', pad: 'px-3 py-1.5', icon: 'h-4 w-4', img: 16 },
};

// Single source of truth for the solid brand-colored tech pill used on the
// homepage, the projects overview, and individual project case studies. The
// logo is monochrome and inherits the pill's text color (white), so it reads as
// a clean part of the label rather than a separate chip.
export const TechBadge = forwardRef<HTMLSpanElement, TechBadgeProps>(function TechBadge(
  { tag, size = 'sm', className = '', style, ...props },
  ref
) {
  const meta = getTechBadgeMeta(tag);
  const TechIcon = meta.icon;
  const s = SIZES[size];

  return (
    <span
      ref={ref}
      className={`inline-flex items-center rounded-full font-medium text-white transition-colors duration-200 ${s.text} ${s.gap} ${s.pad} ${className}`}
      style={{ backgroundColor: getTechColor(tag), ...style }}
      {...props}
    >
      {TechIcon ? (
        <TechIcon className={`${s.icon} shrink-0`} aria-hidden="true" />
      ) : meta.iconSrc ? (
        <Image
          src={meta.iconSrc}
          alt=""
          width={s.img}
          height={s.img}
          className={`${s.icon} shrink-0 object-contain brightness-0 invert`}
        />
      ) : null}
      {meta.label}
    </span>
  );
});
