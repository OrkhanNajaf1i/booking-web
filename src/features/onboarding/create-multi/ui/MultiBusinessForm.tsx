import { useState } from 'react';

import { useCreateMultiBusiness } from '../model/useCreateBusiness';
import type { MultiBusinessDto } from '@/entities/business/model/types';
import {
  ProfessionPicker,
  type ProfessionValue,
} from '@/shared/ui/ProfessionPicker';

export function MultiBusinessForm() {
  const { mutate, isPending } = useCreateMultiBusiness();

  const [profession, setProfession] = useState<ProfessionValue>({
    categorySlug: '',
    customName: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const dto: MultiBusinessDto = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      category_slug: profession.categorySlug,
      service_category: profession.customName,
      // Sənaye sahəsi artıq kateqoriyadan çıxır — ayrıca sual verilmir.
      industry: profession.categorySlug,
    };
    mutate(dto);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Biznes adı
        </label>
        <input
          name="name"
          required
          placeholder="məs., Bella Gözəllik Salonu"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telefon
        </label>
        <input
          name="phone"
          required
          placeholder="+994 50 000 00 00"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fəaliyyət sahəniz
        </label>
        <ProfessionPicker value={profession} onChange={setProfession} />
        <p className="mt-1 text-xs text-gray-500">
          Siyahıdan seçin, yoxdursa özünüz yazın.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending || !profession.categorySlug}
        className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Yaradılır...' : 'Biznes yarat'}
      </button>
    </form>
  );
}
