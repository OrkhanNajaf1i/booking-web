import { useCreateMultiBusiness } from '../model/useCreateBusiness';
import type { MultiBusinessDto } from '@/entities/business/model/types';

export function MultiBusinessForm() {
  const { mutate, isPending } = useCreateMultiBusiness();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const dto: MultiBusinessDto = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      industry: (form.elements.namedItem('industry') as HTMLInputElement).value,
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
          Sənaye sahəsi
        </label>
        <input
          name="industry"
          required
          placeholder="məs., Səhiyyə, Gözəllik, Fitnes"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Yaradılır...' : 'Biznes yarat'}
      </button>
    </form>
  );
}
