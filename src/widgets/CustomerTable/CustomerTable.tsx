import { Users } from 'lucide-react';

import { type CustomerDto } from '@/entities/customer/model/types';
import { CustomerRow } from '@/entities/customer/ui/CustomerRow';
import { EmptyState } from '@/shared/ui/primitives';

import { CustomerTableSkeleton } from './CustomerTableSkeleton';

interface CustomerTableProps {
  customers: CustomerDto[];
  isLoading: boolean;
  page?: number;
  totalPages?: number;
}

const COLUMNS = [
  { label: 'Ad', align: 'left' },
  { label: 'E-poçt', align: 'left' },
  { label: 'Telefon', align: 'left' },
  { label: 'Vəziyyət', align: 'left' },
  { label: 'Randevu', align: 'center' },
  { label: 'Qeyd', align: 'left' },
] as const;

export function CustomerTable({
  customers,
  isLoading,
  page = 1,
  totalPages = 1,
}: CustomerTableProps) {
  if (isLoading) {
    return <CustomerTableSkeleton rows={8} />;
  }

  if (!customers.length) {
    return (
      <EmptyState
        icon={<Users size={20} />}
        title="Hələ müştəri yoxdur"
        description="Kimsə sizdə randevu alan kimi burada görünəcək."
      />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-card shadow-xs dark:border-slate-800">
      {/*
        `overflow-visible` qəsdəndir: nömrənin "zəng et / kopyala"
        menyusu cədvəlin kənarından çıxır. Dar ekranda üfüqi sürüşdürmə
        lazım olduğu üçün ora ayrıca sarğı qoyulub.
      */}
      <div className="scroll-thin overflow-x-auto overflow-y-visible">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              {COLUMNS.map((column) => (
                <th
                  key={column.label}
                  className={`px-4 py-3 text-xs font-semibold tracking-wide text-slate-500 uppercase ${
                    column.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <CustomerRow key={customer.id} customer={customer} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
        <p className="text-sm text-slate-500">
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {customers.length}
          </span>{' '}
          müştəri
          {totalPages > 1 && (
            <>
              {' · '}
              <span className="tabular">
                {page}/{totalPages}
              </span>{' '}
              səhifə
            </>
          )}
        </p>
      </div>
    </div>
  );
}
