import type { ReactNode } from 'react';

import { Sidebar } from '@/widgets/Sidebar/ui/Sidebar';
import { Topbar } from '@/widgets/Topbar/ui/Topbar';
import { useBusinessQuery } from '@/entities/business';

import { MainLayoutSkeleton } from './MainLayoutSkeleton';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isLoading } = useBusinessQuery();
  if (isLoading) return <MainLayoutSkeleton />;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />

        {/* Geniş monitorda məzmun kənarlara dağılmasın deyə
            `page-shell` maksimum eni saxlayır. */}
        <main className="scroll-thin flex-1 overflow-y-auto px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="page-shell">{children}</div>
        </main>
      </div>
    </div>
  );
};
