import { CalendarCheck, Users } from 'lucide-react';

import { type CustomerDto } from '@/entities/customer/model/types';
import { CustomerRow } from '@/entities/customer/ui/CustomerRow';
import { Badge, EmptyState } from '@/shared/ui/primitives';
import { PhoneAction } from '@/shared/ui/PhoneAction';

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

/** Telefonla qeydiyyat sintetik e-poçt yaradır — onu göstərmək yanıldıcıdır. */
function realEmail(email?: string): string {
  return email && !email.endsWith('@phone.invalid') ? email : '';
}

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

  const footer = (
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
  );

  return (
    <div className="space-y-3">
      {/*
        Telefonda kart, masaüstündə cədvəl.

        Altı sütun 390 piksellik ekrana sığmır: nömrə beş sətrə düşür,
        vəziyyət və qeyd sütunları isə tamamilə kəsilir. Üfüqi sürüşmə
        də çıxış deyil — telefonda cədvəli yana çəkmək əziyyətlidir.
      */}
      <ul className="space-y-2.5 md:hidden">
        {customers.map((customer) => {
          const email = realEmail(customer.email);

          return (
            <li
              key={customer.id}
              className="rounded-xl border border-slate-200 bg-card p-4 shadow-xs dark:border-slate-800"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 flex-1 font-medium wrap-break-word text-slate-900 dark:text-white">
                  {customer.full_name}
                </p>
                <Badge tone={customer.status === 'active' ? 'success' : 'neutral'}>
                  {customer.status === 'active' ? 'Aktiv' : 'Deaktiv'}
                </Badge>
              </div>

              <div className="mt-2.5">
                <PhoneAction phone={customer.phone} />
              </div>

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="mt-1 block min-h-7 truncate text-sm leading-7 text-slate-500 transition-colors hover:text-brand-700"
                >
                  {email}
                </a>
              )}

              <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-2.5 text-xs text-slate-500 dark:border-slate-800">
                <CalendarCheck size={13} className="shrink-0 text-slate-400" />
                <span className="tabular">{customer.total_bookings}</span> randevu
                {customer.notes && (
                  <span className="ml-1 min-w-0 truncate">· {customer.notes}</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden rounded-xl border border-slate-200 bg-card shadow-xs md:block dark:border-slate-800">
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

        <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
          {footer}
        </div>
      </div>

      <div className="px-1 md:hidden">{footer}</div>
    </div>
  );
}
