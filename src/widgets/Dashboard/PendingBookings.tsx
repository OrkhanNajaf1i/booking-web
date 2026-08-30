import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, Inbox, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { bookingApi } from '@/entities/booking/api/bookingApi';
import { extractErrorMessage } from '@/shared/api/errors';
import { formatShortDateTime } from '@/shared/lib/date';

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
    <section className="rounded-2xl border border-gray-100 bg-white">
      <header className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
        <Inbox size={16} className="text-gray-400" />
        <h2 className="text-sm font-semibold text-gray-900">
          Təsdiq gözləyən
        </h2>
        {businessId && bookings.length > 0 && (
          <Link
            to={`/business/${businessId}/bookings`}
            className="ml-auto text-xs text-gray-500 hover:text-gray-900"
          >
            Hamısına bax →
          </Link>
        )}
      </header>

      {isLoading && (
        <p className="px-5 py-8 text-center text-sm text-gray-400">Yüklənir…</p>
      )}

      {!isLoading && bookings.length === 0 && (
        <p className="px-5 py-10 text-center text-sm text-gray-400">
          Cavab gözləyən sorğu yoxdur
        </p>
      )}

      <ul className="divide-y divide-gray-50">
        {bookings.map((booking) => (
          <li key={booking.id} className="flex items-center gap-3 px-5 py-3">
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-gray-900">
                {formatShortDateTime(booking.start_time)}
              </span>
              <span className="block truncate text-xs text-gray-500">
                {booking.notes || `${booking.duration_mins} dəqiqə`}
              </span>
            </span>

            <button
              onClick={() => confirm.mutate(booking.id)}
              disabled={confirm.isPending}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {confirm.isPending && confirm.variables === booking.id ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Check size={12} />
              )}
              Təsdiqlə
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
