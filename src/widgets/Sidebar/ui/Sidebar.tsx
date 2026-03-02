import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useSidebar } from '../model/useSidebar';
import { SidebarNav } from './SidebarNav';
import { NAV_GROUPS } from '../model/navConfig';
import clsx from 'clsx';

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={clsx(
        'flex h-screen flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
        'transition-[width] duration-200 ease-in-out',
        collapsed ? 'w-[60px]' : 'w-[220px]'
      )}
    >
      {/* Logo */}
      <div
        className={clsx(
          'flex h-14 shrink-0 items-center border-b border-neutral-200 dark:border-neutral-800',
          collapsed ? 'justify-center px-0' : 'px-4'
        )}
      >
        {collapsed ? (
          <span className="text-lg font-bold text-primary">B</span>
        ) : (
          <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">
            Bookify
          </span>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        <SidebarNav groups={NAV_GROUPS} collapsed={collapsed} />
      </div>

      {/* Collapse toggle */}
      <div className="shrink-0 border-t border-neutral-200 p-2 dark:border-neutral-800">
        <button
          onClick={toggle}
          title={collapsed ? 'Genişlət' : 'Daralt'}
          className={clsx(
            'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-500',
            'transition-colors duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          )}
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <>
              <PanelLeftClose size={18} />
              <span className="text-sm">Daralt</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
