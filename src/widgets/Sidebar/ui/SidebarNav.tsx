import { SidebarNavItem } from './SidebarNavItem';
import type { NavGroup } from '../model/types';
import clsx from 'clsx';

interface Props {
  groups: NavGroup[];
  collapsed: boolean;
}

export function SidebarNav({ groups, collapsed }: Props) {
  return (
    <nav className="flex flex-col gap-5 px-2">
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-0.5">
          {/* Qrup başlığı — collapsed olduqda gizlənir */}
          {!collapsed && (
            <span className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              {group.title}
            </span>
          )}
          {group.items.map((item) => (
            <SidebarNavItem
              key={item.label}
              item={item}
              collapsed={collapsed}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}
