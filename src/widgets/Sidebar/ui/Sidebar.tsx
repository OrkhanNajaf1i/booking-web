import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import clsx from 'clsx';

import { BrandGlyph } from '@/shared/ui/BrandMark';

import { useSidebar } from '../model/useSidebar';
import { SidebarNav } from './SidebarNav';
import { NAV_GROUPS } from '../model/navConfig';

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={clsx(
        'flex h-screen flex-col border-r border-slate-200 bg-sidebar',
        'dark:border-slate-800',
        'transition-[width] duration-200 ease-in-out',
        collapsed ? 'w-17' : 'w-58',
      )}
    >
      {/* ── Marka ─────────────────────────────────────────────
          Daralanda yalnız nişan qalır — hərf yerinə nişan, çünki
          "B" heç nə demir və faviconla əlaqə qurmur. */}
      <div
        className={clsx(
          'flex h-15 shrink-0 items-center border-b border-slate-200 dark:border-slate-800',
          collapsed ? 'justify-center px-0' : 'px-4',
        )}
      >
        <span className="inline-flex items-center gap-2.5">
          <BrandGlyph />
          {!collapsed && (
            <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-white">
              Bookify
            </span>
          )}
        </span>
      </div>

      <div className="scroll-thin flex-1 overflow-x-hidden overflow-y-auto py-4">
        <SidebarNav groups={NAV_GROUPS} collapsed={collapsed} />
      </div>

      <div className="shrink-0 border-t border-slate-200 p-2 dark:border-slate-800">
        <button
          onClick={toggle}
          title={collapsed ? 'Genişlət' : 'Daralt'}
          aria-label={collapsed ? 'Yan paneli genişlət' : 'Yan paneli daralt'}
          className={clsx(
            'flex w-full items-center gap-3 rounded-lg py-2 text-sm text-slate-500',
            'transition-colors hover:bg-slate-100 hover:text-slate-700',
            'dark:hover:bg-slate-800 dark:hover:text-slate-200',
            collapsed ? 'justify-center px-0' : 'px-3',
          )}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          {!collapsed && <span>Daralt</span>}
        </button>
      </div>
    </aside>
  );
}
