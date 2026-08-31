import { Skeleton } from '@/shared/ui/skeleton';
import { NAV_GROUPS } from '../model/navConfig';

export function SidebarSkeleton() {
  return (
    <aside className="flex h-screen w-55 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center border-b border-slate-200 px-4 dark:border-slate-800">
        <Skeleton className="h-5 w-20" />
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        <nav className="flex flex-col gap-5 px-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="flex flex-col gap-0.5">
              <Skeleton className="mb-1 ml-3 h-2.5 w-16" />
              {group.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-lg px-3 py-2"
                >
                  <Skeleton className="h-4.5 w-4.5 shrink-0 rounded" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Collapse toggle */}
      <div className="shrink-0 border-t border-slate-200 p-2 dark:border-slate-800">
        <div className="flex items-center gap-2 px-3 py-2">
          <Skeleton className="h-4.5 w-4.5 rounded" />
          <Skeleton className="h-4 w-14" />
        </div>
      </div>
    </aside>
  );
}
