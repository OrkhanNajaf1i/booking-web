import { Bell } from 'lucide-react';
import { useState } from 'react';

const MOCK_NOTIFICATIONS = [
  { id: '1', text: 'Yeni bron: Anar Həsənov — 14:00',  time: '2 dəq əvvəl',  read: false },
  { id: '2', text: 'Bron təsdiqləndi: Nigar Əliyeva',  time: '15 dəq əvvəl', read: false },
  { id: '3', text: 'Bron ləğv edildi: Tural Məmmədov', time: '1 saat əvvəl', read: true  },
];

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-11 z-40 w-80 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                Bildirişlər
                {unread > 0 && (
                  <span className="ml-2 rounded-full bg-red-100 px-1.5 py-0.5 text-xs text-red-600">
                    {unread}
                  </span>
                )}
              </p>
            </div>

            <ul>
              {MOCK_NOTIFICATIONS.map((n) => (
                <li
                  key={n.id}
                  className="flex items-start gap-3 border-b border-neutral-100 px-4 py-3 last:border-0 dark:border-neutral-800"
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      n.read ? 'bg-transparent' : 'bg-blue-500'
                    }`}
                  />
                  <div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {n.text}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400">{n.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
