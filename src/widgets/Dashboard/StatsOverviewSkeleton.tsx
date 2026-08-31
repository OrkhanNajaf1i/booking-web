import { Skeleton } from '@/shared/ui/skeleton';

export function StatsOverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl bg-white p-6 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-20" />
              <div className="flex items-center gap-1 pt-1">
                <Skeleton className="h-3 w-6" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
