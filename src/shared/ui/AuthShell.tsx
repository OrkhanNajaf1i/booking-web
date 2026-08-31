/**
 * Giriş və qeydiyyat ekranlarının çərçivəsi.
 *
 * Sol tərəf yalnız geniş ekranda görünür: burada panelin kimə və nəyə
 * yaradığı deyilir. Dar ekranda o hissə tamamilə çıxarılır — telefonda
 * adam formanı görmək istəyir, reklam mətnini yox.
 *
 * Admin panel **yalnız xidmət göstərənlər** üçündür (bax: CLAUDE.md).
 * Ona görə mətn birbaşa onlara müraciət edir; müştəri buraya səhvən
 * gəlibsə, tətbiqə yönləndirən qeyd aşağıdadır.
 */
import type { ReactNode } from 'react';
import { CalendarCheck, Clock3, Users } from 'lucide-react';

import { BrandMark } from './BrandMark';

const HIGHLIGHTS = [
  {
    icon: Clock3,
    title: 'İş saatlarını özünüz təyin edin',
    text: 'Seçim addımı 15 dəqiqə də ola bilər, 1 saat da. Nahar fasiləsini söndürmək olur.',
  },
  {
    icon: CalendarCheck,
    title: 'Randevu dərhal bildirilir',
    text: 'Müştəri vaxt seçən kimi xəbər tutursunuz — təsdiqləyin və ya başqa vaxt təklif edin.',
  },
  {
    icon: Users,
    title: 'Tək və ya komanda',
    text: 'Tək işləyirsinizsə işçi əlavə etmək lazım deyil — özünüz işçi sayılırsınız.',
  },
];

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* ── Marka tərəfi ─────────────────────────────────────── */}
      <aside className="relative hidden overflow-hidden bg-brand-800 px-12 py-14 lg:flex lg:flex-col lg:justify-between">
        {/* Yumşaq işıq ləkəsi — düz rəng lövhə kimi görünür */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-24 size-[28rem] rounded-full bg-brand-500/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-20 size-[24rem] rounded-full bg-brand-400/15 blur-3xl"
        />

        <div className="relative">
          <span className="inline-flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-[10px] bg-white/12 ring-1 ring-white/20">
              <svg viewBox="0 0 32 32" className="size-6" aria-hidden="true">
                <rect
                  x="7"
                  y="9"
                  width="18"
                  height="16"
                  rx="3"
                  fill="none"
                  stroke="#ccfbf1"
                  strokeWidth="2"
                />
                <path
                  d="M12 6.5v4M20 6.5v4"
                  stroke="#ccfbf1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 17.5l3 3 5.5-6"
                  fill="none"
                  stroke="#5eead4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-[17px] font-bold tracking-tight text-white">
              Bookify
            </span>
          </span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-[28px] leading-tight font-bold tracking-tight text-white">
            Randevularınız bir yerdə.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-brand-100">
            Xəstəxana, həkim, bərbər və ustalar üçün. Boş vaxtlarınız
            ayarlarınıza görə avtomatik hesablanır.
          </p>

          <ul className="mt-10 space-y-6">
            {HIGHLIGHTS.map(({ icon: Icon, title: heading, text }) => (
              <li key={heading} className="flex gap-3.5">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-brand-200 ring-1 ring-white/15">
                  <Icon size={16} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">
                    {heading}
                  </span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-brand-100/80">
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-brand-200/70">
          Müştərisiniz? Randevu üçün mobil tətbiqdən istifadə edin.
        </p>
      </aside>

      {/* ── Forma tərəfi ─────────────────────────────────────── */}
      <main className="flex items-center justify-center px-5 py-10 sm:px-8 sm:py-12">
        <div className="w-full max-w-[400px]">
          {/* Dar ekranda marka yuxarıda görünür */}
          <div className="mb-8 lg:hidden">
            <BrandMark />
          </div>

          <h1 className="text-[22px] font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
            {title}
          </h1>
          <p className="mt-1.5 text-[13px] text-slate-500 sm:text-sm">{description}</p>

          <div className="mt-7">{children}</div>

          {footer && (
            <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-500 dark:border-slate-800">
              {footer}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
