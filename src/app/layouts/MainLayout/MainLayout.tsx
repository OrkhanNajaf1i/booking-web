import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hələlik sadə layout - sonra Sidebar və Topbar əlavə edəcəyik */}
      <div className="flex">
        {/* Sol tərəf: Sidebar placeholder */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <p className="text-sm text-gray-500">Sidebar buraya gələcək</p>
          </div>
        </aside>

        {/* Sağ tərəf: Content */}
        <div className="flex-1">
          {/* Topbar placeholder */}
          <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
            <p className="text-sm text-gray-500">Topbar buraya gələcək</p>
          </header>

          {/* Main content */}
          <main className="p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
