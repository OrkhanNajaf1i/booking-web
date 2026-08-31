import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Menu } from 'lucide-react';

import { NotificationBell } from './NotificationBell';
import { useBusinessQuery } from '@/entities/business';
import { decodeJwt } from '@/shared/lib/jwt';

/** "Səhiyyə Klinikası" → "SK". Boş ad gələndə çökməməlidir. */
function getInitials(name?: string | null): string {
  const clean = (name ?? '').trim();
  if (!clean) return '—';

  return clean
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase();
}

/**
 * Girmiş istifadəçinin e-poçtu.
 *
 * Əvvəl burada sabit yazılmış ad və e-poçt vardı — hər istifadəçi
 * başqasının məlumatını görürdü. Token onsuz da yaddaşdadır, oradan
 * oxunur.
 */
function useSessionEmail(): string | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  const claims = decodeJwt<{ email?: string }>(token);
  return claims?.email ?? null;
}

interface TopbarProps {
  /** Telefonda yan paneli açır. */
  onOpenMenu?: () => void;
  showMenuButton?: boolean;
}

export function Topbar({ onOpenMenu, showMenuButton = false }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { data: business } = useBusinessQuery();
  const email = useSessionEmail();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login', { replace: true });
  };

  return (
    <header className="flex h-15 shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-card px-4 sm:px-6 dark:border-slate-800">
      <div className="flex min-w-0 items-center gap-1">
        {showMenuButton && (
          <button
            onClick={onOpenMenu}
            aria-label="Menyunu aç"
            className="-ml-2 rounded-lg p-2.5 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Menu size={20} />
          </button>
        )}

        {/*
          Telefonda biznesin ADI göstərilir, masaüstündə ixtisas.
          Səbəb: dar ekranda yan panel gizlidir və hansı hesabda
          olduğunu başqa heç nə demir; masaüstündə isə ad onsuz da
          sağ küncdə görünür.
        */}
        <span className="truncate text-sm font-medium text-slate-600 sm:hidden dark:text-slate-300">
          {business?.name ?? ''}
        </span>
        <span className="hidden truncate text-sm font-medium text-slate-500 sm:block">
          {business?.service_category || business?.category_name || ''}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <NotificationBell />

        <div className="relative">
          <button
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2.5 rounded-lg py-1.5 pr-2 pl-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-semibold text-brand-800 dark:bg-brand-700/20 dark:text-brand-200">
              {getInitials(business?.name)}
            </span>

            <span className="hidden max-w-40 truncate text-sm font-medium text-slate-700 sm:block dark:text-slate-200">
              {business?.name ?? 'Hesab'}
            </span>

            <ChevronDown size={14} className="hidden shrink-0 text-slate-400 sm:block" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />

              <div
                role="menu"
                className="absolute top-12 right-0 z-40 w-60 overflow-hidden rounded-xl border border-slate-200 bg-popover shadow-lg dark:border-slate-700"
              >
                <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                    {business?.name ?? 'Hesab'}
                  </p>
                  {email && (
                    <p className="mt-0.5 truncate text-xs text-slate-500">{email}</p>
                  )}
                </div>

                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-danger-700 transition-colors hover:bg-danger-50 dark:hover:bg-danger-700/10"
                >
                  <LogOut size={15} />
                  Çıxış
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
