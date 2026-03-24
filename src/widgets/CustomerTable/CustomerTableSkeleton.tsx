import { Skeleton } from '@/shared/ui/skeleton';

const COLUMNS = ['Name', 'Email', 'Phone', 'Status', 'Bookings', 'Notes'];

interface CustomerTableSkeletonProps {
  rows?: number;
}

export function CustomerTableSkeleton({ rows = 8 }: CustomerTableSkeletonProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {COLUMNS.map((col) => (
                <th key={col} className="px-4 py-3 text-left">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                {/* Name + avatar */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </td>
                {/* Email */}
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-36" />
                </td>
                {/* Phone */}
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-24" />
                </td>
                {/* Status badge */}
                <td className="px-4 py-3">
                  <Skeleton className="h-5 w-16 rounded-full" />
                </td>
                {/* Bookings count */}
                <td className="px-4 py-3 text-center">
                  <Skeleton className="mx-auto h-4 w-8" />
                </td>
                {/* Notes */}
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-32" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}
