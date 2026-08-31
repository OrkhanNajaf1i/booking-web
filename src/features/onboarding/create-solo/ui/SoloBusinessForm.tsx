import { useState } from 'react';

import { useCreateSoloBusiness } from '../model/useCreateBusiness';
import type { SoloBusinessDto } from '@/entities/business/model/types';
import {
  ProfessionPicker,
  type ProfessionValue,
} from '@/shared/ui/ProfessionPicker';

export function SoloBusinessForm() {
  const { mutate, isPending } = useCreateSoloBusiness();

  // Peşə sabit siyahıdandır, amma istifadəçi öz sözü ilə də yaza
  // bilir. Qruplaşdırma yalnız seçilən sahəyə baxır.
  const [profession, setProfession] = useState<ProfessionValue>({
    categorySlug: '',
    customName: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const dto: SoloBusinessDto = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      category_slug: profession.categorySlug,
      service_category: profession.customName,
    };
    mutate(dto);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Ad / Biznes adı
        </label>
        <input
          name="name"
          required
          placeholder="məs., Elçin Bərbərxanası"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Telefon
        </label>
        <input
          name="phone"
          required
          placeholder="+994 50 000 00 00"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Peşəniz
        </label>
        <ProfessionPicker value={profession} onChange={setProfession} />
        <p className="mt-1 text-xs text-slate-500">
          Siyahıdan seçin, yoxdursa özünüz yazın. Müştəri sizi tətbiqdə
          bu ad altında tapacaq.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending || !profession.categorySlug}
        className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Yaradılır...' : 'Başla'}
      </button>
    </form>
  );
}
