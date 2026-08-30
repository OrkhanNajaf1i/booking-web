// features/update-business/ui/UpdateBusinessForm.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBusinessQuery } from '@/entities/business/model/businessQuery';
import { useUpdateBusiness } from '../model/useUpdateBusiness';

// ─── Schema ──────────────────────────────────────────────
const schema = z.object({
  name: z
    .string()
    .min(1, 'Biznes adı tələb olunur')
    .min(2, 'Biznes adı minimum 2 simvol olmalıdır')
    .max(100, 'Biznes adı maximum 100 simvol ola bilər'),

  phone: z
    .string()
    .min(1, 'Telefon nömrəsi tələb olunur')
    .regex(/^\+?[0-9\s\-]{7,15}$/, 'Düzgün telefon nömrəsi daxil edin'),

  industry: z
    .string()
    .min(1, 'Sənaye sahəsi tələb olunur'),
});

type FormValues = z.infer<typeof schema>;

// ─── Component ───────────────────────────────────────────
export function UpdateBusinessForm() {
  const { data: business } = useBusinessQuery();
  const { mutate, isPending } = useUpdateBusiness();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:     business?.name     ?? '',
      phone:    business?.phone    ?? '',
      industry: business?.industry ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit((dto) => mutate({ ...dto, phone: Number(dto.phone) }))} className="space-y-4">

      {/* Biznes adı */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Biznes adı
        </label>
        <input
          {...register('name')}
          placeholder="məs., Elçin Bərbərxanası"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
            ${errors.name
              ? 'border-red-400 focus:ring-red-300'
              : 'border-gray-300 focus:ring-blue-500'
            }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Telefon */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telefon
        </label>
        <input
          {...register('phone')}
          placeholder="+994 50 000 00 00"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
            ${errors.phone
              ? 'border-red-400 focus:ring-red-300'
              : 'border-gray-300 focus:ring-blue-500'
            }`}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sənaye sahəsi
        </label>
        <input
          {...register('industry')}
          placeholder="məs., Barber, Beauty & Nail, Fitness"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
            ${errors.industry
              ? 'border-red-400 focus:ring-red-300'
              : 'border-gray-300 focus:ring-blue-500'
            }`}
        />
        {errors.industry && (
          <p className="mt-1 text-sm text-red-500">{errors.industry.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Yenilənir...' : 'Yadda saxla'}
      </button>

    </form>
  );
}