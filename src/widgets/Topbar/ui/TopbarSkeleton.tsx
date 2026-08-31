import { Skeleton } from '@/shared/ui/skeleton';

export function TopbarSkeleton() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-950">
      {/* Business category */}
      <Skeleton className="h-4 w-36" />

      {/* Right side */}
      <div className="flex items-center gap-1">
        {/* Notification bell */}
        <Skeleton className="h-9 w-9 rounded-lg" />

        {/* User menu button */}
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="hidden h-4 w-28 sm:block" />
          <Skeleton className="h-3 w-3 rounded" />
        </div>
      </div>
    </header>
  );
}
