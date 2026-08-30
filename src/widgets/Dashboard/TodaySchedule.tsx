import { useQuery } from '@tanstack/react-query';
import { CalendarClock } from 'lucide-react';

import { bookingApi } from '@/entities/booking/api/bookingApi';
import { BOOKING_STATUS_META } from '@/entities/booking/model/types';
import { formatTimeRange } from '@/shared/lib/date';

/** Günün başlanğıcı və sonu — yerli vaxtla. */
function todayRange(): { from: string; to: string } {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { from: start.toISOString(), to: end.toISOString() };
}

/**
 * Bu günün cədvəli.
 *
 * Ləğv edilmiş randevular göstərilmir — onlar günün planına aid deyil.
 * Realtime hadisə gələndə RealtimeProvider `bookings` keşini
 * invalidasiya edir, ona görə siyahı öz-özünə yenilənir.
 */
export function TodaySchedule() {
  const range = todayRange();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings', 'today', range.from],
    queryFn: () => bookingApi.list({ from: range.from, to: range.to }),
  });

  const visible = bookings
    .filter((booking) => booking.status !== 'cancelled')
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <section className="rounded-2xl border border-gray-100 bg-white">
      <header className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
        <CalendarClock size={16} className="text-gray-400" />
        <h2 className="text-sm font-semibold text-gray-900">
          Bu günün cədvəli
        </h2>
        {visible.length > 0 && (
          <span className="ml-auto text-xs text-gray-400">
            {visible.length} randevu
          </span>
        )}
      </header>

      {isLoading && (
        <p className="px-5 py-8 text-center text-sm text-gray-400">Yüklənir…</p>
      )}

      {!isLoading && visible.length === 0 && (
        <p className="px-5 py-10 text-center text-sm text-gray-400">
          Bu gün üçün randevu yoxdur
        </p>
      )}

      <ul className="divide-y divide-gray-50">
        {visible.map((booking) => {
          const meta = BOOKING_STATUS_META[booking.status];

          return (
            <li key={booking.id} className="flex items-center gap-4 px-5 py-3">
              <span className="w-24 shrink-0 text-sm font-semibold text-gray-900 tabular-nums">
                {formatTimeRange(booking.start_time, booking.end_time)}
              </span>

              <span className="min-w-0 flex-1 truncate text-sm text-gray-600">
                {booking.notes || `${booking.duration_mins} dəqiqəlik randevu`}
              </span>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${meta.className}`}
              >
                {meta.label}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
