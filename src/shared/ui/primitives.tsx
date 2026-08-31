/**
 * Paylaşılan UI parçaları.
 *
 * Əvvəl hər səhifə öz düyməsini, kartını və nişanını əl ilə yazırdı.
 * Nəticədə eyni şey hər yerdə bir az fərqli görünürdü: bir səhifədə
 * qara düymə, digərində mavi; kartın küncü gah 8, gah 16 piksel.
 *
 * Buradakı parçalar həmin qərarları bir yerdə saxlayır. Səhifə nə
 * göstərəcəyini seçir, necə görünəcəyini yox.
 */
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

// ─── Düymə ───────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const BUTTON_BASE =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium ' +
  'transition-colors disabled:pointer-events-none disabled:opacity-50 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  // Ekranda bir dənə əsas hərəkət olur — bron təsdiqlə, yadda saxla.
  primary: 'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900',
  // Yan hərəkətlər: görünür, amma diqqəti oğurlamır.
  secondary:
    'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 ' +
    'active:bg-slate-100 dark:border-slate-700 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-800',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 ' +
    'dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
  // Geri qaytarılmayan hərəkət. Sərhədlə verilir ki, təsadüfən
  // basılmasın — dolu qırmızı düymə gözü özünə çəkir.
  danger:
    'border border-danger-200 bg-white text-danger-700 hover:bg-danger-50 ' +
    'dark:border-danger-700/50 dark:bg-transparent dark:text-danger-600 dark:hover:bg-danger-700/10',
};

/*
  Ölçülər telefonda böyüyür.

  Barmaq siçandan kobuddur: 32 piksellik düyməni basmaq üçün adam
  diqqətlə nişan almalı olur. Telefonda hədd 40 pikseldir, masaüstündə
  isə sıxlıq daha dəyərlidir — ona görə `sm:` ilə geri kiçilir.
*/
const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'h-10 px-3 text-xs sm:h-8',
  md: 'h-10 px-4 text-sm sm:h-9.5',
  lg: 'h-11 px-5 text-sm',
};

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Gözləmə vaxtı fırlanan işarə göstərir və düyməni bağlayır. */
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className)}
      {...rest}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 13 : 15} className="animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}

// ─── Kart ────────────────────────────────────────────────────

interface CardProps extends ComponentPropsWithoutRef<'div'> {
  as?: ElementType;
  /** Kliklənən kartlar üzərinə gələndə cavab verməlidir. */
  interactive?: boolean;
  padded?: boolean;
}

export function Card({
  as: Tag = 'div',
  interactive = false,
  padded = true,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-xl border border-slate-200 bg-card shadow-xs',
        'dark:border-slate-800',
        padded && 'p-5',
        interactive &&
          'transition-shadow hover:shadow-md focus-within:shadow-md cursor-pointer',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// ─── Nişan ───────────────────────────────────────────────────

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  success: 'bg-success-50 text-success-700 dark:bg-success-700/15 dark:text-success-200',
  warning: 'bg-warning-50 text-warning-700 dark:bg-warning-700/15 dark:text-warning-200',
  danger: 'bg-danger-50 text-danger-700 dark:bg-danger-700/15 dark:text-danger-200',
  info: 'bg-info-50 text-info-700 dark:bg-info-700/15 dark:text-info-200',
  brand: 'bg-brand-50 text-brand-800 dark:bg-brand-700/15 dark:text-brand-200',
};

export function Badge({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

// ─── Səhifə başlığı ──────────────────────────────────────────

export function PageHeader({
  title,
  description,
  actions,
  meta,
}: {
  title: string;
  description?: string;
  /** Sağdakı əsas hərəkət(lər) */
  actions?: ReactNode;
  /** Başlığın altındakı canlı göstərici və s. */
  meta?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
        )}
        {meta}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

// ─── Boş vəziyyət ────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white/50 px-6 py-14 text-center dark:border-slate-700 dark:bg-transparent">
      <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
        {icon}
      </div>
      <p className="mt-4 text-sm font-medium text-slate-900 dark:text-white">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

// ─── Sahə ────────────────────────────────────────────────────

const FIELD_BASE =
  'w-full rounded-lg border border-input bg-white px-3 text-sm text-slate-900 ' +
  'placeholder:text-slate-400 transition-colors ' +
  'focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 ' +
  'disabled:cursor-not-allowed disabled:bg-slate-50 ' +
  'dark:bg-slate-900 dark:text-slate-100';

export function TextField({ className, ...rest }: ComponentPropsWithoutRef<'input'>) {
  return <input className={cn(FIELD_BASE, 'h-9.5', className)} {...rest} />;
}

export function TextArea({ className, ...rest }: ComponentPropsWithoutRef<'textarea'>) {
  return <textarea className={cn(FIELD_BASE, 'resize-none py-2', className)} {...rest} />;
}

export function SelectField({ className, ...rest }: ComponentPropsWithoutRef<'select'>) {
  return <select className={cn(FIELD_BASE, 'h-9.5', className)} {...rest} />;
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      {children}
      {/* Xəta göstərilirsə ipucu susur — iki mətn bir-birini boğur. */}
      {error ? (
        <span className="text-xs text-danger-700">{error}</span>
      ) : (
        hint && <span className="text-xs text-slate-500">{hint}</span>
      )}
    </label>
  );
}

// ─── Dialoq ──────────────────────────────────────────────────

export function Dialog({
  title,
  onClose,
  footer,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-[2px] sm:items-center"
      onMouseDown={(event) => {
        // Yalnız fona basanda bağlanır — içəridə mətn seçəndə yox.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          'my-8 w-full overflow-hidden rounded-2xl bg-card shadow-lg',
          wide ? 'max-w-lg' : 'max-w-md',
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Bağla"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5">{children}</div>

        {footer && (
          <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50/60 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-900/40">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
