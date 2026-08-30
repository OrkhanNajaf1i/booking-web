/**
 * Bronlar — işçi/adminin gələn sorğuları gördüyü və cavabladığı ekran.
 *
 * Müştəri bron edən kimi WebSocket hadisəsi gəlir, keş invalidasiya olunur
 * və sorğu səhifəni yeniləmədən siyahıda görünür.
 */
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CalendarClock, Check, Loader2, RefreshCw, X } from 'lucide-react';

import { bookingApi } from '@/entities/booking/api/bookingApi';
import {
  BOOKING_STATUS_META,
  type Booking,
  type BookingStatus,
} from '@/entities/booking/model/types';
import { ProposeTimeDialog } from '@/features/booking/propose/ui/ProposeTimeDialog';
import { useRealtime } from '@/shared/lib/realtime/RealtimeProvider';
import { formatDayLabel, formatTimeRange } from '@/shared/lib/date';

const FILTERS: { label: string; value: BookingStatus | 'all' }[] = [
  { label: 'Hamısı', value: 'all' },
  { label: 'Təsdiq gözləyir', value: 'pending' },
  { label: 'Təsdiqlənib', value: 'confirmed' },
  { label: 'Təklif göndərilib', value: 'reschedule_proposed' },
  { label: 'Ləğv edilib', value: 'cancelled' },
];

function formatRange(startIso: string, endIso: string): string {
  return `${formatDayLabel(startIso)}, ${formatTimeRange(startIso, endIso)}`;
}

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const { connected } = useRealtime();

  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [proposeFor, setProposeFor] = useState<Booking | null>(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings', 'list', filter],
    queryFn: () =>
      bookingApi.list(filter === 'all' ? {} : { status: filter }),
  });

  const runAction = useMutation({
    mutationFn: ({
      action,
      booking,
    }: {
      action: 'confirm' | 'cancel' | 'complete' | 'no-show';
      booking: Booking;
    }) => {
      switch (action) {
        case 'confirm':
          return bookingApi.confirm(booking.id);
        case 'cancel':
          return bookingApi.cancel(booking.id);
        case 'complete':
          return bookingApi.complete(booking.id);
        case 'no-show':
          return bookingApi.markNoShow(booking.id);
      }
    },
    onSuccess: () => {
      toast.success('Yeniləndi');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
    onError: (error: { message?: string }) =>
      toast.error(error?.message ?? 'Əməliyyat alınmadı'),
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Bronlar
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                connected ? 'bg-emerald-500' : 'bg-neutral-300'
              }`}
            />
            {connected ? 'Canlı yenilənir' : 'Bağlantı bərpa olunur…'}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                filter === option.value
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      {isLoading && <p className="text-sm text-neutral-400">Yüklənir…</p>}

      {!isLoading && bookings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-12 text-center dark:border-neutral-800">
          <CalendarClock size={28} className="mx-auto text-neutral-300" />
          <p className="mt-3 text-sm text-neutral-500">
            Bu filtrdə bron yoxdur.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {bookings.map((booking) => {
          const meta = BOOKING_STATUS_META[booking.status];
          const isBusy = runAction.isPending;

          return (
            <article
              key={booking.id}
              className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {formatRange(booking.start_time, booking.end_time)}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {booking.duration_mins} dəq
                    {booking.notes ? ` · ${booking.notes}` : ''}
                  </p>

                  {booking.status === 'reschedule_proposed' &&
                    booking.proposed_start_time && (
                      <p className="mt-2 rounded-lg bg-sky-50 px-2.5 py-1.5 text-xs text-sky-800 dark:bg-sky-500/10 dark:text-sky-300">
                        Təklif olunan vaxt:{' '}
                        <strong>
                          {formatRange(
                            booking.proposed_start_time,
                            booking.proposed_end_time ?? booking.proposed_start_time
                          )}
                        </strong>
                        {booking.proposal_note ? ` — ${booking.proposal_note}` : ''}
                        <span className="mt-0.5 block text-[11px] opacity-75">
                          Müştərinin cavabı gözlənilir
                        </span>
                      </p>
                    )}

                  {booking.status === 'cancelled' && booking.cancel_reason && (
                    <p className="mt-2 text-xs text-rose-600">
                      Səbəb: {booking.cancel_reason}
                    </p>
                  )}
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${meta.className}`}
                >
                  {meta.label}
                </span>
              </div>

              {/* Əməliyyatlar — yalnız statusun icazə verdikləri */}
              <div className="mt-3 flex flex-wrap gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                {booking.status === 'pending' && (
                  <ActionButton
                    icon={<Check size={14} />}
                    label="Təsdiqlə"
                    tone="primary"
                    disabled={isBusy}
                    onClick={() =>
                      runAction.mutate({ action: 'confirm', booking })
                    }
                  />
                )}

                {(booking.status === 'pending' ||
                  booking.status === 'confirmed') && (
                  <ActionButton
                    icon={<RefreshCw size={14} />}
                    label="Başqa vaxt təklif et"
                    disabled={isBusy}
                    onClick={() => setProposeFor(booking)}
                  />
                )}

                {booking.status === 'confirmed' && (
                  <ActionButton
                    icon={<Check size={14} />}
                    label="Tamamlandı"
                    disabled={isBusy}
                    onClick={() =>
                      runAction.mutate({ action: 'complete', booking })
                    }
                  />
                )}

                {booking.status === 'confirmed' && (
                  <ActionButton
                    label="Gəlmədi"
                    disabled={isBusy}
                    onClick={() =>
                      runAction.mutate({ action: 'no-show', booking })
                    }
                  />
                )}

                {(booking.status === 'pending' ||
                  booking.status === 'confirmed' ||
                  booking.status === 'reschedule_proposed') && (
                  <ActionButton
                    icon={<X size={14} />}
                    label="Ləğv et"
                    tone="danger"
                    disabled={isBusy}
                    onClick={() =>
                      runAction.mutate({ action: 'cancel', booking })
                    }
                  />
                )}

                {isBusy && (
                  <Loader2 size={14} className="ml-1 animate-spin self-center text-neutral-400" />
                )}
              </div>
            </article>
          );
        })}
      </div>

      {proposeFor && (
        <ProposeTimeDialog
          booking={proposeFor}
          onClose={() => setProposeFor(null)}
        />
      )}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  tone = 'default',
  disabled,
  onClick,
}: {
  icon?: React.ReactNode;
  label: string;
  tone?: 'default' | 'primary' | 'danger';
  disabled?: boolean;
  onClick: () => void;
}) {
  const toneClasses = {
    default:
      'border border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800',
    primary:
      'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900',
    danger:
      'border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-500/30 dark:hover:bg-rose-500/10',
  }[tone];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${toneClasses}`}
    >
      {icon}
      {label}
    </button>
  );
}
