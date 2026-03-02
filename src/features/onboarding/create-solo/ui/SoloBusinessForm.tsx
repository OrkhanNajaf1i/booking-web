import { useCreateSoloBusiness } from '../model/useCreateBusiness';
import type { SoloBusinessDto } from '@/entities/business/model/types';

export function SoloBusinessForm() {
  const { mutate, isPending } = useCreateSoloBusiness();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const dto: SoloBusinessDto = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      service_category: (form.elements.namedItem('service_category') as HTMLInputElement).value,
    };
    mutate(dto);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ad / Biznes adı
        </label>
        <input
          name="name"
          required
          placeholder="məs., Elçin Bərbərxanası"
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
          Xidmət kateqoriyası
        </label>
        <input
          name="service_category"
          required
          placeholder="məs., Bərbərxana, Gözəllik salonu, Diş klinikası"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Yaradılır...' : 'Başla'}
      </button>
    </form>
  );
}
