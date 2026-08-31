import { Badge } from '@/shared/ui/primitives';
import { PhoneAction } from '@/shared/ui/PhoneAction';

import type { CustomerDto } from '../model/types';

interface CustomerRowProps {
  customer: CustomerDto;
}

export function CustomerRow({ customer }: CustomerRowProps) {
  // Telefonla qeydiyyatdan keçən müştərinin e-poçtu sintetikdir
  // (`…@phone.invalid`) — onu göstərmək yanıldıcıdır.
  const email = customer.email?.endsWith('@phone.invalid') ? '' : customer.email;

  return (
    <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40">
      <td className="px-4 py-3">
        <div className="font-medium text-slate-900 dark:text-white">
          {customer.full_name}
        </div>
      </td>

      <td className="px-4 py-3">
        {email ? (
          <a
            href={`mailto:${email}`}
            className="inline-flex min-h-7 items-center text-sm text-slate-600 transition-colors hover:text-brand-700 dark:text-slate-300"
          >
            {email}
          </a>
        ) : (
          <span className="text-sm text-slate-400">—</span>
        )}
      </td>

      <td className="px-4 py-3">
        <PhoneAction phone={customer.phone} />
      </td>

      <td className="px-4 py-3">
        <Badge tone={customer.status === 'active' ? 'success' : 'neutral'}>
          {customer.status === 'active' ? 'Aktiv' : 'Deaktiv'}
        </Badge>
      </td>

      <td className="px-4 py-3 text-center">
        <span className="tabular text-sm font-medium text-slate-900 dark:text-white">
          {customer.total_bookings}
        </span>
      </td>

      <td className="px-4 py-3">
        {customer.notes && (
          <div className="max-w-xs truncate text-xs text-slate-500">
            {customer.notes}
          </div>
        )}
      </td>
    </tr>
  );
}
