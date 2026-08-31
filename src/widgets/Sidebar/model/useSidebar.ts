import { useCallback, useEffect, useState } from 'react';

/** Yan panelin çəkmə panelə çevrildiyi hədd (Tailwind `lg`). */
const DESKTOP_WIDTH = 1024;

export interface SidebarState {
  /** Masaüstündə dar rejim — yalnız ikonlar. */
  collapsed: boolean;
  toggleCollapsed: () => void;

  /** Telefon/planşetdə panel açıqdırmı. */
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;

  /** Ekran masaüstü genişliyindədirmi. */
  isDesktop: boolean;
}

/**
 * Yan panelin vəziyyəti.
 *
 * Masaüstündə panel həmişə görünür və daralda bilir. Telefonda isə
 * 232 piksel eni məzmuna yer qoymur — orada panel üstdən açılan
 * çəkmə panelə çevrilir.
 */
export function useSidebar(): SidebarState {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [isDesktop, setIsDesktop] = useState(
    // SSR-də `window` yoxdur; masaüstü fərz edilir ki, ilk kadr
    // dar ekranda sıçramasın.
    () => typeof window === 'undefined' || window.innerWidth >= DESKTOP_WIDTH,
  );

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${DESKTOP_WIDTH}px)`);

    const apply = () => {
      setIsDesktop(query.matches);
      // Ekran genişlənəndə çəkmə panel açıq qalmamalıdır — masaüstündə
      // panel onsuz da görünür, örtük isə məzmunu bağlayardı.
      if (query.matches) setDrawerOpen(false);
    };

    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  // Çəkmə panel açıqkən arxadakı səhifə sürüşməməlidir.
  useEffect(() => {
    if (!drawerOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  // Escape bağlayır.
  useEffect(() => {
    if (!drawerOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  return {
    collapsed: isDesktop ? collapsed : false,
    toggleCollapsed: useCallback(() => setCollapsed((previous) => !previous), []),
    drawerOpen,
    openDrawer: useCallback(() => setDrawerOpen(true), []),
    closeDrawer: useCallback(() => setDrawerOpen(false), []),
    isDesktop,
  };
}
