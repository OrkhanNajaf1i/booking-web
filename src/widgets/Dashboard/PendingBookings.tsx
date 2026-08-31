import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, Inbox, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { bookingApi } from '@/entities/booking/api/bookingApi';
import { extractErrorMessage } from '@/shared/api/errors';
import { formatShortDateTime } from '@/shared/lib/date';
import { Button } from '@/shared/ui/primitives';

/**
 * Cavab gözləyən sorğular.
 *
 * Dashboard-dan birbaşa təsdiqləmək mümkündür — provider hər dəfə
 * Bronlar səhifəsinə keçməməlidir. Alternativ vaxt təklifi kimi daha
 * mürəkkəb əməliyyatlar üçün həmin səhifəyə keçid verilir.
 */
export function PendingBookings() {
  const queryClient = useQueryClient();
  const { businessId } = useParams<{ businessId: string }>();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings', 'list', 'pending'],
    queryFn: () => bookingApi.list({ status: 'pending', limit: 5 }),
  });

  const confirm = useMutation({
    mutationFn: (id: string) => bookingApi.confirm(id),
    onSuccess: () => {
      toast.success('Bron təsdiqləndi');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error) =>
      toast.error(extractErrorMessage(error, 'Təsdiq alınmadı')),
  });

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-card shadow-xs dark:border-slate-800">
      <header className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <Inbox size={15} className="text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Təsdiq gözləyən
        </h2>
        {businessId && bookings.length > 0 && (
          <Link
            to={`/business/${businessId}/bookings`}
            className="ml-auto text-xs font-medium text-brand-700 transition-colors hover:text-brand-800 dark:text-brand-400"
          >
            Hamısına bax →
          </Link>
        )}
      </header>

      {isLoading && (
        <p className="px-5 py-10 text-center text-sm text-slate-500">Yüklənir…</p>
      )}

      {!isLoading && bookings.length === 0 && (
        <p className="px-5 py-12 text-center text-sm text-slate-500">
          Cavab gözləyən sorğu yoxdur
        </p>
      )}

      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {bookings.map((booking) => (
          <li key={booking.id} className="flex items-center gap-3 px-5 py-3">
            <span className="min-w-0 flex-1">
              <span className="tabular block text-sm font-medium text-slate-900 dark:text-white">
                {formatShortDateTime(booking.start_time)}
              </span>
              <span className="block truncate text-xs text-slate-500">
                {booking.notes || `${booking.duration_mins} dəqiqə`}
              </span>
            </span>

            <Button
              size="sm"
              variant="primary"
              onClick={() => confirm.mutate(booking.id)}
              disabled={confirm.isPending}
              icon={
                confirm.isPending && confirm.variables === booking.id ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Check size={12} />
                )
              }
            >
              Təsdiqlə
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
