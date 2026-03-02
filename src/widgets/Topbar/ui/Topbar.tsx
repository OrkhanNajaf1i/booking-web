import { Bell, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';

// Mock user — sonra real auth store-dan gələcək
const MOCK_USER = {
  name: 'Orxan Məmmədov',
  email: 'orxan@gmail.com',
  avatar: null, // şəkil yoxdursa initials göstəririk
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Topbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login', { replace: true });
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6 dark:border-neutral-800 dark:bg-neutral-950">

      {/* Sol: Sistem adı */}
      <span className="text-sm font-semibold text-neutral-900 dark:text-white">
        Bookify
      </span>

      {/* Sağ: Actions */}
      <div className="flex items-center gap-1">

        {/* Notification Bell */}
        <NotificationBell />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
              {getInitials(MOCK_USER.name)}
            </div>

            {/* Ad */}
            <span className="hidden text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:block">
              {MOCK_USER.name}
            </span>

            <ChevronDown size={14} className="text-neutral-400" />
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-30"
                onClick={() => setUserMenuOpen(false)}
              />

              <div className="absolute right-0 top-11 z-40 w-52 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                {/* User info */}
                <div className="border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {MOCK_USER.name}
                  </p>
                  <p className="text-xs text-neutral-400">{MOCK_USER.email}</p>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <LogOut size={15} />
                  Çıxış
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
