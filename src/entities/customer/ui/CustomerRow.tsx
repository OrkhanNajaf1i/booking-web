import type { CustomerDto } from '../model/types';

interface CustomerRowProps {
  customer: CustomerDto;
}

export function CustomerRow({ customer }: CustomerRowProps) {
  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900">{customer.full_name}</div>
      </td>

      <td className="px-4 py-3">
        <div className="text-sm text-gray-600">{customer.email}</div>
      </td>

      <td className="px-4 py-3">
        <div className="text-sm text-gray-900">{customer.phone}</div>
      </td>

      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            customer.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {customer.status}
        </span>
      </td>

      <td className="px-4 py-3 text-center">
        <span className="text-sm font-medium text-gray-900">
          {customer.total_bookings}
        </span>
      </td>

      <td className="px-4 py-3">
        {customer.notes && (
          <div className="text-xs text-gray-500 truncate max-w-xs">
            {customer.notes}
          </div>
        )}
      </td>
    </tr>
  );
}
