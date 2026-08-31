/**
 * Marka nişanı.
 *
 * Əvvəl "Bookify" sadəcə mətn idi. Nişan onu tanınan hala gətirir və
 * favicon ilə eyni formadadır — istifadəçi tabları arasında axtararkən
 * eyni şəkli görməlidir.
 */
import { cn } from '@/lib/utils';

export function BrandGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('size-8', className)}
      role="img"
      aria-label="Bookify"
    >
      <rect width="32" height="32" rx="8" className="fill-brand-700" />
      <rect
        x="7"
        y="9"
        width="18"
        height="16"
        rx="3"
        fill="none"
        className="stroke-brand-100"
        strokeWidth="2"
      />
      <path
        d="M12 6.5v4M20 6.5v4"
        className="stroke-brand-100"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Təsdiq işarəsi — bron qəbul olunub */}
      <path
        d="M12 17.5l3 3 5.5-6"
        fill="none"
        className="stroke-brand-400"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandMark({
  className,
  showName = true,
}: {
  className?: string;
  showName?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <BrandGlyph />
      {showName && (
        <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-white">
          Bookify
        </span>
      )}
    </span>
  );
}
