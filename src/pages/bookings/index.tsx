/**
 * Bronlar — işçi/adminin gələn sorğuları gördüyü və cavabladığı ekran.
 *
 * Müştəri bron edən kimi WebSocket hadisəsi gəlir, keş invalidasiya olunur
 * və sorğu səhifəni yeniləmədən siyahıda görünür.
 */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarClock, Check, Loader2, RefreshCw, X } from "lucide-react";

import { bookingApi } from "@/entities/booking/api/bookingApi";
import {
  BOOKING_STATUS_META,
  type Booking,
  type BookingStatus,
} from "@/entities/booking/model/types";
import { ProposeTimeDialog } from "@/features/booking/propose/ui/ProposeTimeDialog";
import { useRealtime } from "@/shared/lib/realtime/RealtimeProvider";
import { formatDayLabel, formatTimeRange } from "@/shared/lib/date";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
} from "@/shared/ui/primitives";
import { PhoneAction } from "@/shared/ui/PhoneAction";

const FILTERS: { label: string; value: BookingStatus | "all" }[] = [
  { label: "Hamısı", value: "all" },
  { label: "Təsdiq gözləyir", value: "pending" },
  { label: "Təsdiqlənib", value: "confirmed" },
  { label: "Təklif göndərilib", value: "reschedule_proposed" },
  { label: "Ləğv edilib", value: "cancelled" },
];

function formatRange(startIso: string, endIso: string): string {
  return `${formatDayLabel(startIso)}, ${formatTimeRange(startIso, endIso)}`;
}

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const { connected } = useRealtime();

  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [proposeFor, setProposeFor] = useState<Booking | null>(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings", "list", filter],
    queryFn: () => bookingApi.list(filter === "all" ? {} : { status: filter }),
  });

  const runAction = useMutation({
    mutationFn: ({
      action,
      booking,
    }: {
      action: "confirm" | "cancel" | "complete" | "no-show";
      booking: Booking;
    }) => {
      switch (action) {
        case "confirm":
          return bookingApi.confirm(booking.id);
        case "cancel":
          return bookingApi.cancel(booking.id);
        case "complete":
          return bookingApi.complete(booking.id);
        case "no-show":
          return bookingApi.markNoShow(booking.id);
      }
    },
    onSuccess: () => {
      toast.success("Yeniləndi");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
    onError: (error: { message?: string }) =>
      toast.error(error?.message ?? "Əməliyyat alınmadı"),
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        title="Bronlar"
        meta={
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
            <span
              className={`size-1.5 rounded-full ${
                connected ? "bg-success-700" : "bg-slate-300"
              }`}
            />
            {connected ? "Canlı yenilənir" : "Bağlantı bərpa olunur…"}
          </p>
        }
        actions={
          /* Süzgəclər seqment kimi bir qutuda — ayrı-ayrı düymələr
             başlıqla eyni ağırlıqda görünürdü. */
          /* Telefonda beş süzgəc bir sətrə sığmır: sonuncular kəsilirdi.
             Yana sürüşən zolaq həm sığdırır, həm də seqment görünüşünü
             saxlayır — sətri qatlamaq idarəni dağıdardı. */
          <div className="scroll-thin -mx-4 max-w-full overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="inline-flex gap-0.5 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              {FILTERS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`rounded-[6px] px-3 py-1.5 text-sm font-medium transition-colors ${
                    filter === option.value
                      ? "bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {isLoading && <p className="text-sm text-slate-500">Yüklənir…</p>}

      {!isLoading && bookings.length === 0 && (
        <EmptyState
          icon={<CalendarClock size={20} />}
          title="Bu süzgəcdə bron yoxdur"
          description="Müştəri vaxt seçən kimi sorğu burada görünəcək."
        />
      )}

      <div className="space-y-2.5 sm:space-y-3">
        {bookings.map((booking) => {
          const meta = BOOKING_STATUS_META[booking.status];
          const isBusy = runAction.isPending;

          // Ləğv edilmiş və tamamlanmış bronda görüləsi iş yoxdur —
          // boş düymə sətri ayırıcı xətlə birlikdə qalırdı.
          const hasActions =
            booking.status === "pending" ||
            booking.status === "confirmed" ||
            booking.status === "reschedule_proposed";

          return (
            <Card as="article" key={booking.id} padded={false} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  {/* Müştərinin adı başlıqdır: provayder əvvəlcə
                      "kim gəlir" sualına cavab axtarır, vaxt ikinci
                      dərəcəlidir. */}
                  {booking.customer_name && (
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {booking.customer_name}
                    </p>
                  )}

                  <p
                    className={`tabular text-sm ${
                      booking.customer_name
                        ? "mt-0.5 text-slate-600 dark:text-slate-300"
                        : "font-semibold text-slate-900 dark:text-white"
                    }`}
                  >
                    {formatRange(booking.start_time, booking.end_time)}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {booking.duration_mins} dəq
                    {booking.notes ? ` · ${booking.notes}` : ""}
                  </p>

                  {booking.customer_phone && (
                    <div className="mt-1.5">
                      <PhoneAction phone={booking.customer_phone} />
                    </div>
                  )}

                  {booking.status === "reschedule_proposed" &&
                    booking.proposed_start_time && (
                      <p className="mt-2 rounded-lg bg-info-50 px-2.5 py-2 text-xs text-info-700 dark:bg-info-700/15 dark:text-info-200">
                        Təklif olunan vaxt:{" "}
                        <strong>
                          {formatRange(
                            booking.proposed_start_time,
                            booking.proposed_end_time ??
                              booking.proposed_start_time,
                          )}
                        </strong>
                        {booking.proposal_note
                          ? ` — ${booking.proposal_note}`
                          : ""}
                        <span className="mt-0.5 block text-[11px] opacity-75">
                          Müştərinin cavabı gözlənilir
                        </span>
                      </p>
                    )}

                  {booking.status === "cancelled" && booking.cancel_reason && (
                    <p className="mt-2 text-xs text-danger-700">
                      Səbəb: {booking.cancel_reason}
                    </p>
                  )}
                </div>

                <Badge tone={meta.tone}>{meta.label}</Badge>
              </div>

              {/* Əməliyyatlar — yalnız statusun icazə verdikləri */}
              {hasActions && (
                <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3.5 dark:border-slate-800">
                  {booking.status === "pending" && (
                    <Button
                      size="sm"
                      variant="primary"
                      icon={<Check size={14} />}
                      disabled={isBusy}
                      onClick={() =>
                        runAction.mutate({ action: "confirm", booking })
                      }
                    >
                      Təsdiqlə
                    </Button>
                  )}

                  {(booking.status === "pending" ||
                    booking.status === "confirmed") && (
                    <Button
                      size="sm"
                      icon={<RefreshCw size={14} />}
                      disabled={isBusy}
                      onClick={() => setProposeFor(booking)}
                    >
                      Başqa vaxt təklif et
                    </Button>
                  )}

                  {booking.status === "confirmed" && (
                    <Button
                      size="sm"
                      variant="primary"
                      icon={<Check size={14} />}
                      disabled={isBusy}
                      onClick={() =>
                        runAction.mutate({ action: "complete", booking })
                      }
                    >
                      Tamamlandı
                    </Button>
                  )}

                  {booking.status === "confirmed" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isBusy}
                      onClick={() =>
                        runAction.mutate({ action: "no-show", booking })
                      }
                    >
                      Gəlmədi
                    </Button>
                  )}

                  {(booking.status === "pending" ||
                    booking.status === "confirmed" ||
                    booking.status === "reschedule_proposed") && (
                    <Button
                      size="sm"
                      variant="danger"
                      icon={<X size={14} />}
                      disabled={isBusy}
                      onClick={() =>
                        runAction.mutate({ action: "cancel", booking })
                      }
                    >
                      Ləğv et
                    </Button>
                  )}

                  {isBusy && (
                    <Loader2
                      size={14}
                      className="animate-spin text-slate-400"
                    />
                  )}
                </div>
              )}
            </Card>
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
