/**
 * Alternativ vaxt təklifi dialoqu.
 *
 * İşçi "bu vaxt olmur" deyəndə açılır. Boş vaxtlar backend-dən
 * gəlir — yəni təklif olunan vaxt da qrafikə uyğun və boş olur.
 * Təsdiqdən sonra müştəriyə anında bildiriş gedir.
 */
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';

import { availabilityApi } from '@/entities/availability/api/availabilityApi';
import { bookingApi } from '@/entities/booking/api/bookingApi';
import type { Booking } from '@/entities/booking/model/types';

interface Props {
  booking: Booking;
  onClose: () => void;
}

/** Bugünü YYYY-MM-DD formatında verir (yerli vaxt). */
function toDateInput(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10);
}

export function ProposeTimeDialog({ booking, onClose }: Props) {
  const queryClient = useQueryClient();

  const [date, setDate] = useState(() => toDateInput(new Date(booking.start_time)));
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const { data: availability, isLoading } = useQuery({
    queryKey: ['availability', booking.staff_id, booking.service_id, date],
    queryFn: () =>
      availabilityApi.getAvailability({
        staff_id: booking.staff_id,
        service_id: booking.service_id,
        from: date,
        to: date,
      }),
  });

  const propose = useMutation({
    mutationFn: () => {
      if (!selectedStart) throw new Error('Vaxt seçilməyib');
      return bookingApi.proposeReschedule(booking.id, {
        new_start_time: selectedStart,
        note,
      });
    },
    onSuccess: () => {
      toast.success('Təklif göndərildi', {
        description: 'Müştəriyə bildiriş getdi.',
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      onClose();
    },
    onError: (error: { message?: string }) =>
      toast.error(error?.message ?? 'Təklif göndərilmədi'),
  });

  const day = availability?.days?.[0];
  const slots = day?.slots ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5 dark:border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Alternativ vaxt təklif et
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Tarix
            </span>
            <input
              type="date"
              value={date}
              min={toDateInput(new Date())}
              onChange={(event) => {
                setDate(event.target.value);
                setSelectedStart(null);
              }}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </label>

          <div>
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Boş vaxtlar
            </span>

            {isLoading && (
              <p className="mt-2 text-sm text-neutral-400">Hesablanır…</p>
            )}

            {!isLoading && !day?.is_workday && (
              <p className="mt-2 text-sm text-neutral-400">
                Bu gün iş günü deyil.
              </p>
            )}

            {!isLoading && day?.is_workday && (
              <>
                {day.break && (
                  <p className="mt-1 text-[11px] text-neutral-400">
                    Nahar fasiləsi: {day.break.start}–{day.break.end}
                  </p>
                )}

                <div className="mt-2 grid max-h-56 grid-cols-4 gap-2 overflow-y-auto">
                  {slots.map((slot) => {
                    const label = new Date(slot.start).toLocaleTimeString('az-AZ', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const isSelected = selectedStart === slot.start;

                    return (
                      <button
                        key={slot.start}
                        disabled={!slot.available}
                        onClick={() => setSelectedStart(slot.start)}
                        title={!slot.available ? slotHint(slot.state) : undefined}
                        className={`rounded-lg border px-2 py-1.5 text-sm transition-colors ${
                          isSelected
                            ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                            : slot.available
                              ? 'border-neutral-200 text-neutral-700 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300'
                              : 'cursor-not-allowed border-neutral-100 text-neutral-300 line-through dark:border-neutral-800 dark:text-neutral-600'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {slots.length === 0 && (
                  <p className="mt-2 text-sm text-neutral-400">
                    Bu gün üçün boş vaxt yoxdur.
                  </p>
                )}
              </>
            )}
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Qeyd (müştəri görəcək)
            </span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={2}
              placeholder="Məsələn: həmin saat təcili əməliyyat düşüb."
              className="resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-neutral-100 px-5 py-3 dark:border-neutral-800">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Ləğv et
          </button>
          <button
            onClick={() => propose.mutate()}
            disabled={!selectedStart || propose.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
          >
            {propose.isPending && <Loader2 size={14} className="animate-spin" />}
            Təklifi göndər
          </button>
        </div>
      </div>
    </div>
  );
}

function slotHint(state: string): string {
  switch (state) {
    case 'booked':
      return 'Bu vaxt bron olunub';
    case 'blocked':
      return 'Bu vaxt bağlıdır';
    case 'past':
      return 'Bu vaxt keçib';
    case 'too_soon':
      return 'Çox yaxın vaxtdır';
    case 'too_far':
      return 'Çox irəli tarixdir';
    default:
      return 'Əlçatan deyil';
  }
}
