// features/update-business/ui/UpdateBusinessForm.tsx

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useBusinessQuery } from '@/entities/business/model/businessQuery';
import { useUpdateBusiness } from '../model/useUpdateBusiness';
import { ProfessionPicker } from '@/shared/ui/ProfessionPicker';
import { Button, Field, TextField } from '@/shared/ui/primitives';

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
    .regex(/^\+?[0-9\s-]{7,15}$/, 'Düzgün telefon nömrəsi daxil edin'),

  // Kateqoriya sabit siyahıdandır — müştəri tərəfdəki qruplaşdırma
  // buna baxır, ona görə boş qala bilməz.
  category_slug: z.string().min(1, 'Kateqoriya seçin'),

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
      name: business?.name ?? '',
      phone: business?.phone ?? '',
      category_slug: business?.category_slug ?? '',
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
      <Field label="Biznes adı" error={errors.name?.message}>
        <TextField {...register('name')} placeholder="məs., Elçin Bərbərxanası" />
      </Field>

      <Field
        label="Telefon"
        error={errors.phone?.message}
        hint="Müştəri sizə bu nömrə ilə zəng edir."
      >
        <TextField
          {...register('phone')}
          type="tel"
          inputMode="tel"
          placeholder="+994 50 000 00 00"
        />
      </Field>

      {/* Peşə — sabit siyahı, amma öz sözü ilə də yazıla bilər */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Peşəniz
        </span>
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
        {errors.category_slug ? (
          <span className="text-xs text-danger-700">
            {errors.category_slug.message}
          </span>
        ) : (
          <span className="text-xs text-slate-500">
            Siyahıdan seçin, yoxdursa özünüz yazın. Kəşf ekranındakı bölmə
            buna görə dəyişir.
          </span>
        )}
      </div>

      <Button type="submit" variant="primary" loading={isPending} className="w-full">
        {isPending ? 'Yenilənir…' : 'Yadda saxla'}
      </Button>
    </form>
  );
}
