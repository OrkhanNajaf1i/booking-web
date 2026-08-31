import { NavLink, useParams } from 'react-router-dom';
import clsx from 'clsx';

import type { NavItem } from '../model/types';

interface Props {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
}

export function SidebarNavItem({ item, collapsed, onNavigate }: Props) {
  const { businessId } = useParams();
  const to = item.path(businessId ?? '');

  return (
    <NavLink
      to={to}
      title={item.label}
      onClick={onNavigate}
      className={({ isActive }) =>
        clsx(
          // Telefonda barmaq üçün 44 piksel; masaüstündə sıxlıq
          // daha dəyərlidir, ona görə geri kiçilir.
          'group relative flex min-h-11 items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors sm:min-h-0',
          collapsed ? 'justify-center px-0' : 'px-3',
          isActive
            ? 'bg-brand-50 text-brand-800 dark:bg-brand-700/15 dark:text-brand-200'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Aktiv səhifə yalnız rənglə deyil, sol kənardakı zolaqla da
              göstərilir — rəngi ayırd edə bilməyən istifadəçi üçün. */}
          {isActive && (
            <span
              aria-hidden="true"
              className="absolute top-1.5 bottom-1.5 -left-2 w-1 rounded-r-full bg-brand-700 dark:bg-brand-400"
            />
          )}
          <item.icon size={18} className="shrink-0" />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );
}
