import type { ReactNode } from 'react';

import { Sidebar } from '@/widgets/Sidebar/ui/Sidebar';
import { useSidebar } from '@/widgets/Sidebar/model/useSidebar';
import { Topbar } from '@/widgets/Topbar/ui/Topbar';
import { useBusinessQuery } from '@/entities/business';

import { MainLayoutSkeleton } from './MainLayoutSkeleton';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isLoading } = useBusinessQuery();

  // Vəziyyət burada saxlanılır: yan panelin çəkmə rejimini topbar-dakı
  // düymə açır, ona görə hər ikisi eyni mənbəni oxumalıdır.
  const sidebar = useSidebar();

  if (isLoading) return <MainLayoutSkeleton />;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar state={sidebar} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onOpenMenu={sidebar.openDrawer} showMenuButton={!sidebar.isDesktop} />

        {/* Geniş monitorda məzmun kənarlara dağılmasın deyə
            `page-shell` maksimum eni saxlayır. Telefonda kənar boşluq
            daralır — 390 pikseldə hər piksel qiymətlidir. */}
        <main className="scroll-thin flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="page-shell">{children}</div>
        </main>
      </div>
    </div>
  );
};
