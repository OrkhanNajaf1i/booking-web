import { NavLink, useParams } from 'react-router-dom';
import type { NavItem } from '../model/types';
import clsx from 'clsx';

interface Props {
  item: NavItem;
  collapsed: boolean;
}

export function SidebarNavItem({ item, collapsed }: Props) {
  const { businessId } = useParams();
  const to = item.path(businessId ?? '');

  return (
    <NavLink
      to={to}
      title={item.label}
      className={({ isActive }) =>
        clsx(
          'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
          'hover:bg-neutral-100 dark:hover:bg-neutral-800',
          isActive
            ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white'
            : 'text-neutral-500 dark:text-neutral-400'
        )
      }
    >
      <item.icon
        size={18}
        className="shrink-0 transition-transform duration-150 group-hover:scale-110"
      />
      {!collapsed && (
        <span className="truncate transition-opacity duration-150">
          {item.label}
        </span>
      )}
    </NavLink>
  );
}
