import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';

import { customerApi } from '@/entities/customer/api/customerApi';
import { CustomerTable } from '@/widgets/CustomerTable/CustomerTable';
import { extractErrorMessage } from '@/shared/api/errors';
import { PageHeader } from '@/shared/ui/primitives';

function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: () => customerApi.getList({ page: 1, page_size: 20 }),
    staleTime: 5 * 60 * 1000,
  });
}

export default function CustomersPage() {
  const { data, isLoading, error } = useCustomers();

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        title="Müştərilər"
        description="Sizdə randevu almış adamlar. Nömrənin üzərinə basıb zəng edə və ya kopyalaya bilərsiniz."
      />

      {error ? (
        <div className="flex items-start gap-3 rounded-xl border border-danger-200 bg-danger-50 p-4 dark:border-danger-700/40 dark:bg-danger-700/10">
          <AlertCircle size={17} className="mt-0.5 shrink-0 text-danger-700" />
          <div>
            <p className="text-sm font-medium text-danger-700">
              Müştəriləri yükləmək alınmadı
            </p>
            <p className="mt-0.5 text-sm text-danger-700/80">
              {extractErrorMessage(error, 'Səhifəni yeniləyin.')}
            </p>
          </div>
        </div>
      ) : (
        <CustomerTable
          customers={data?.data || []}
          isLoading={isLoading}
          page={data?.page}
          totalPages={data?.total_pages}
        />
      )}
    </div>
  );
}
