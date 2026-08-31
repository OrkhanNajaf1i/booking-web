import { useState } from 'react';
import { MultiBusinessForm } from '@/features/onboarding/create-multi/ui/MultiBusinessForm';
import { SoloBusinessForm } from '@/features/onboarding/create-solo/ui/SoloBusinessForm';

type BusinessType = 'solo' | 'multi' | null;

export default function OnboardingPage() {
  const [type, setType] = useState<BusinessType>(null);

  // Step 1: Biznes tipini seç
  if (!type) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-lg w-full p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Biznesinizi qurun
          </h1>
          <p className="text-slate-500 mb-8">
            Başlamaq üçün necə işlədiyinizi seçin.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setType('solo')}
              className="p-6 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-left transition-all"
            >
              <div className="text-2xl mb-3">🧑‍💼</div>
              <h3 className="font-semibold text-slate-900 mb-1">Tək işləyirəm</h3>
              <p className="text-sm text-slate-500">
                Öz cədvəlimi özüm idarə edirəm
              </p>
            </button>

            <button
              onClick={() => setType('multi')}
              className="p-6 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-left transition-all"
            >
              <div className="text-2xl mb-3">👥</div>
              <h3 className="font-semibold text-slate-900 mb-1">Komandamız var</h3>
              <p className="text-sm text-slate-500">
                Bir neçə işçi ilə çalışıram
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Seçilmiş tipə görə formu göstər
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-lg w-full p-8">
        <button
          onClick={() => setType(null)}
          className="mb-6 text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
        >
          ← Geri
        </button>

        <h2 className="text-xl font-bold text-slate-900 mb-6">
          {type === 'solo' ? 'Peşəkar məlumatlarınız' : 'Biznes məlumatları'}
        </h2>

        {/* Feature form-ları — page bunları sadəcə render edir, məntiq feature-dədir */}
        {type === 'solo' && <SoloBusinessForm />}
        {type === 'multi' && <MultiBusinessForm />}
      </div>
    </div>
  );
}
