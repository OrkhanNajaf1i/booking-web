import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import clsx from 'clsx';

import { BrandGlyph } from '@/shared/ui/BrandMark';
import type { SidebarState } from '../model/useSidebar';

import { SidebarNav } from './SidebarNav';
import { NAV_GROUPS } from '../model/navConfig';

/**
 * Yan panel.
 *
 * Masaüstündə səhifənin yanında durur və daralda bilir. Telefonda isə
 * 232 piksel eni məzmuna yer qoymurdu — orada panel üstdən açılan
 * çəkmə panelə çevrilir və seçimdən sonra özü bağlanır.
 */
export function Sidebar({ state }: { state: SidebarState }) {
  const { collapsed, toggleCollapsed, drawerOpen, closeDrawer, isDesktop } = state;

  const panel = (
    <aside
      className={clsx(
        'flex h-full flex-col border-r border-slate-200 bg-sidebar',
        'dark:border-slate-800',
        isDesktop && 'transition-[width] duration-200 ease-in-out',
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

        {/* Çəkmə paneldə bağlama düyməsi — örtüyə toxunmaq da işləyir,
            amma düymə daha aydındır. */}
        {!isDesktop && (
          <button
            onClick={closeDrawer}
            aria-label="Menyunu bağla"
            className="ml-auto grid size-10 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="scroll-thin flex-1 overflow-x-hidden overflow-y-auto py-4">
        {/* Telefonda keçiddən sonra panel özü bağlanmalıdır — əks
            halda yeni səhifə panelin altında qalır. */}
        <SidebarNav
          groups={NAV_GROUPS}
          collapsed={collapsed}
          onNavigate={isDesktop ? undefined : closeDrawer}
        />
      </div>

      {/* Daraltma yalnız masaüstündə mənalıdır. */}
      {isDesktop && (
        <div className="shrink-0 border-t border-slate-200 p-2 dark:border-slate-800">
          <button
            onClick={toggleCollapsed}
            title={collapsed ? 'Genişlət' : 'Daralt'}
            aria-label={collapsed ? 'Yan paneli genişlət' : 'Yan paneli daralt'}
            className={clsx(
              'flex min-h-10 w-full items-center gap-3 rounded-lg py-2 text-sm text-slate-500',
              'transition-colors hover:bg-slate-100 hover:text-slate-700',
              'dark:hover:bg-slate-800 dark:hover:text-slate-200',
              collapsed ? 'justify-center px-0' : 'px-3',
            )}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            {!collapsed && <span>Daralt</span>}
          </button>
        </div>
      )}
    </aside>
  );

  if (isDesktop) return panel;

  return (
    <>
      {/* Örtük — panel açıq olmayanda tamamilə çıxarılır ki, toxunuşu
          tutmasın. */}
      {drawerOpen && (
        <div
          onClick={closeDrawer}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px]"
        />
      )}

      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-out',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        // Bağlı panel klaviatura ilə gəzişdə keçilməməlidir.
        {...(drawerOpen ? {} : { inert: '' as unknown as boolean })}
      >
        {panel}
      </div>
    </>
  );
}
