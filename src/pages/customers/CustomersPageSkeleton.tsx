import { CustomerTableSkeleton } from '@/widgets/CustomerTable/CustomerTableSkeleton';
import { Skeleton } from '@/shared/ui/skeleton';

export function CustomersPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Page header */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Search / filter bar */}
      <div className="mb-4 flex items-center gap-3">
        <Skeleton className="h-9 w-64 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
        <div className="ml-auto">
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
      </div>

      <CustomerTableSkeleton rows={10} />
    </div>
  );
}
