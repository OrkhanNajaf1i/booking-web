// features/update-business/ui/UpdateBusinessForm.tsx

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBusinessQuery } from '@/entities/business/model/businessQuery';
import { useUpdateBusiness } from '../model/useUpdateBusiness';
import { ProfessionPicker } from '@/shared/ui/ProfessionPicker';

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

  // Kateqoriya sabit siyahıdandır — müştəri tərəfdəki qruplaşdırma
  // buna baxır, ona görə boş qala bilməz.
  category_slug: z
    .string()
    .min(1, 'Kateqoriya seçin'),

  // İxtisas sərbəst mətndir və istəyə bağlıdır.
  service_category: z.string().max(100, 'Maksimum 100 simvol'),
});

type FormValues = z.infer<typeof schema>;

// ─── Component ───────────────────────────────────────────
export function UpdateBusinessForm() {
  const { data: business } = useBusinessQuery();
  const { mutate, isPending } = useUpdateBusiness();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      name:             business?.name             ?? '',
      phone:            business?.phone            ?? '',
      category_slug:    business?.category_slug    ?? '',
      service_category: business?.service_category ?? '',
    },
  });

  return (
    <form
      onSubmit={handleSubmit((dto) =>
        // Telefon backend-də mətn kimi saxlanılır; Number-ə çevirmək
        // "+994" prefiksini itirirdi.
        mutate({ ...dto, industry: dto.category_slug }),
      )}
      className="space-y-4"
    >

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

      {/* Peşə — sabit siyahı, amma öz sözü ilə də yazıla bilər */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Peşəniz
        </label>
        <Controller
          control={control}
          name="category_slug"
          render={({ field: categoryField }) => (
            <Controller
              control={control}
              name="service_category"
              render={({ field: customField }) => (
                <ProfessionPicker
                  value={{
                    categorySlug: categoryField.value,
                    customName: customField.value ?? '',
                  }}
                  onChange={(next) => {
                    categoryField.onChange(next.categorySlug);
                    customField.onChange(next.customName);
                  }}
                />
              )}
            />
          )}
        />
        {errors.category_slug && (
          <p className="mt-1 text-sm text-red-500">
            {errors.category_slug.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Siyahıdan seçin, yoxdursa özünüz yazın.
        </p>
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