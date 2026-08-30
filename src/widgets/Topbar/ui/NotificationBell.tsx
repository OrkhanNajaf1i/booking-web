import { Bell, Check } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/entities/notification/api/notificationApi';
import { NOTIFICATION_ICONS } from '@/entities/notification/model/types';
import { useRealtime } from '@/shared/lib/realtime/RealtimeProvider';

/** "2 dəq əvvəl" formatı. */
function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return 'indicə';
  if (minutes < 60) return `${minutes} dəq əvvəl`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat əvvəl`;

  const days = Math.floor(hours / 24);
  return `${days} gün əvvəl`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { connected } = useRealtime();

  // WebSocket hadisə gələndə bu keş invalidasiya olunur (RealtimeProvider),
  // ona görə burada polling-ə ehtiyac yoxdur.
  const { data } = useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: () => notificationApi.list({ limit: 20 }),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllRead = useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const items = data?.items ?? [];
  const unread = data?.unread_count ?? 0;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
        aria-label="Bildirişlər"
      >
        <Bell size={18} />

        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}

        {/* Canlı bağlantı göstəricisi */}
        <span
          className={`absolute bottom-1 right-1.5 h-1.5 w-1.5 rounded-full ${
            connected ? 'bg-emerald-500' : 'bg-neutral-300'
          }`}
          title={connected ? 'Canlı bağlantı aktivdir' : 'Bağlantı yoxdur'}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-11 z-40 w-88 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5 dark:border-neutral-800">
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                Bildirişlər
              </span>

              {unread > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  disabled={markAllRead.isPending}
                  className="flex items-center gap-1 text-xs text-neutral-500 transition-colors hover:text-neutral-900 disabled:opacity-50 dark:hover:text-white"
                >
                  <Check size={12} />
                  Hamısını oxu
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-neutral-400">
                  Hələ bildiriş yoxdur
                </p>
              )}

              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => !item.is_read && markRead.mutate(item.id)}
                  className={`flex w-full gap-3 border-b border-neutral-50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-neutral-50 dark:border-neutral-800/50 dark:hover:bg-neutral-800/50 ${
                    item.is_read ? '' : 'bg-sky-50/50 dark:bg-sky-500/5'
                  }`}
                >
                  <span className="text-base leading-none">
                    {NOTIFICATION_ICONS[item.type] ?? '🔔'}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-neutral-900 dark:text-white">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-500 dark:text-neutral-400">
                      {item.body}
                    </span>
                    <span className="mt-1 block text-[11px] text-neutral-400">
                      {timeAgo(item.created_at)}
                    </span>
                  </span>

                  {!item.is_read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
