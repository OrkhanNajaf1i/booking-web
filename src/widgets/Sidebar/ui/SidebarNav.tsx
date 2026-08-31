import { SidebarNavItem } from './SidebarNavItem';
import type { NavGroup } from '../model/types';

interface Props {
  groups: NavGroup[];
  collapsed: boolean;
}

export function SidebarNav({ groups, collapsed }: Props) {
  return (
    <nav className="flex flex-col gap-6 px-3">
      {groups.map((group, index) => (
        <div key={group.title} className="flex flex-col gap-0.5">
          {collapsed ? (
            // Daralmış halda başlıq sığmır; qruplar yalnız nazik
            // ayırıcı ilə seçilir — ilkindən əvvəl lazım deyil.
            index > 0 && (
              <span
                aria-hidden="true"
                className="mx-auto mb-2 h-px w-6 bg-slate-200 dark:bg-slate-800"
              />
            )
          ) : (
            <span className="mb-1.5 px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              {group.title}
            </span>
          )}

          {group.items.map((item) => (
            <SidebarNavItem key={item.label} item={item} collapsed={collapsed} />
          ))}
        </div>
      ))}
    </nav>
  );
}
