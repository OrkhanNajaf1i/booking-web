/**
 * Nömrə — zəng və kopyalama ilə.
 *
 * Telefonla qeydiyyatdan keçən müştəri üçün nömrə əsas əlaqə yoludur:
 * randevunu dəqiqləşdirmək, gecikməni xəbər vermək lazım gəlir. Nömrəni
 * əl ilə seçib köçürmək isə cədvəldə əziyyətlidir.
 *
 * Ona görə nömrə düymədir: bir kliklə iki seçim çıxır — **zəng et**
 * (masaüstündə Skype/telefon tətbiqinə, mobildə birbaşa yığıma verir)
 * və **kopyala**.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Copy, Phone } from 'lucide-react';

import { cn } from '@/lib/utils';

/** "+994501112233" → "+994 50 111 22 33" */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');

  // Azərbaycan nömrəsi: 994 + 9 rəqəm.
  if (digits.length === 12 && digits.startsWith('994')) {
    const rest = digits.slice(3);
    return `+994 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5, 7)} ${rest.slice(7)}`;
  }

  // Tanınmayan forma olduğu kimi qalır — səhv formatlamaqdansa
  // toxunmamaq yaxşıdır.
  return raw;
}

/** Zəng üçün yığılan forma — boşluqsuz. */
function dialable(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('994')) return `+${digits}`;
  if (digits.length === 10 && digits.startsWith('0')) return `+994${digits.slice(1)}`;
  return raw.trim();
}

export function PhoneAction({
  phone,
  className,
  compact = false,
}: {
  phone?: string | null;
  className?: string;
  /** Cədvəldə daha kiçik görünüş. */
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /*
    Menyu `body`-yə portal ilə çıxarılır.

    Cədvəl dar ekranda üfüqi sürüşür (`overflow-x: auto`), CSS isə belə
    halda şaquli daşmanı da kəsir — menyu cədvəlin içində qalsaydı
    "Kopyala" sətri görünməzdi.
  */
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(null);

  // Düymənin ekrandakı yeri — menyu onun altında açılır.
  useLayoutEffect(() => {
    if (!open) {
      setAnchor(null);
      return;
    }

    const place = () => {
      const box = containerRef.current?.getBoundingClientRect();
      if (!box) return;

      const MENU_WIDTH = 176;
      setAnchor({
        top: box.bottom + 4,
        // Sağ kənara sığmayanda menyu sola sürüşür.
        left: Math.min(box.left, window.innerWidth - MENU_WIDTH - 8),
      });
    };

    place();
    // Sürüşdürmə və ölçü dəyişməsi menyunu düymədən ayırır.
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open]);

  // Kənara klik menyunu bağlayır.
  useEffect(() => {
    if (!open) return;

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;
      // Menyu portaldadır, ona görə `contains` ilə yanaşı onun öz
      // sahəsi də yoxlanılır.
      const insideMenu = (target as HTMLElement)?.closest?.('[data-phone-menu]');
      if (!containerRef.current?.contains(target) && !insideMenu) setOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onDocumentClick);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onDocumentClick);
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  // "Kopyalandı" işarəsi özü sönür.
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  if (!phone?.trim()) {
    return <span className={cn('text-sm text-slate-400', className)}>—</span>;
  }

  const number = dialable(phone);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);
    } catch {
      // Buferə icazə verilməyən mühitlərdə (HTTP, köhnə brauzer)
      // köhnə üsul işləyir.
      const field = document.createElement('textarea');
      field.value = number;
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      document.body.removeChild(field);
      setCopied(true);
    }
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          // Telefonda nömrə barmaqla basılır — 24 piksellik sətir azdır.
          'group inline-flex min-h-10 items-center gap-1.5 rounded-md py-0.5 font-medium transition-colors sm:min-h-0',
          'text-slate-900 hover:text-brand-700 dark:text-slate-100 dark:hover:text-brand-400',
          compact ? 'text-sm' : 'text-sm',
        )}
      >
        <Phone
          size={13}
          className="shrink-0 text-slate-400 transition-colors group-hover:text-brand-700"
        />
        <span className="tabular">{formatPhone(phone)}</span>
        {copied && <Check size={13} className="text-success-700" />}
      </button>

      {open &&
        anchor &&
        createPortal(
          <div
            role="menu"
            data-phone-menu=""
            style={{ top: anchor.top, left: anchor.left }}
            className="fixed z-50 w-44 overflow-hidden rounded-lg border border-slate-200 bg-popover shadow-lg dark:border-slate-700"
          >
            <a
              role="menuitem"
              href={`tel:${number}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Phone size={14} className="text-brand-700" />
              Zəng et
            </a>

            <span className="block h-px bg-slate-100 dark:bg-slate-800" />

            <button
              role="menuitem"
              type="button"
              onClick={copy}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Copy size={14} className="text-slate-400" />
              Kopyala
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
