import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
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
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        
      <Topbar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
};
