/**
 * Biznesin qurulması.
 *
 * İlk sual — tək, yoxsa komanda — sonradan ekranın davranışını təyin
 * edir: komanda rejimi işçi dəvətini açır, tək iş rejimi isə paneli
 * sadələşdirir. Seçim sonradan dəyişilə bilir (İşçilər ekranı), ona
 * görə burada uzun izahat lazım deyil.
 */
import { useState } from 'react';
import { ArrowLeft, Users, UserRound } from 'lucide-react';

import { MultiBusinessForm } from '@/features/onboarding/create-multi/ui/MultiBusinessForm';
import { SoloBusinessForm } from '@/features/onboarding/create-solo/ui/SoloBusinessForm';
import { BrandMark } from '@/shared/ui/BrandMark';
import { Card } from '@/shared/ui/primitives';

type BusinessType = 'solo' | 'multi' | null;

export default function OnboardingPage() {
  const [type, setType] = useState<BusinessType>(null);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:py-12 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-xl space-y-6">
        <BrandMark />

        {!type ? (
          <section className="space-y-5">
            <header>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                Biznesinizi qurun
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Başlamaq üçün necə işlədiyinizi seçin.
              </p>
            </header>

            <div className="grid gap-3 sm:grid-cols-2">
              <ModeCard
                icon={<UserRound size={20} />}
                title="Tək işləyirəm"
                description="Randevular birbaşa mənim adıma gəlir."
                onClick={() => setType('solo')}
              />
              <ModeCard
                icon={<Users size={20} />}
                title="Komandamız var"
                description="Bir neçə mütəxəssis qəbul edir."
                onClick={() => setType('multi')}
              />
            </div>

            <p className="text-xs text-slate-500">
              Sonradan dəyişmək olur — işçi götürsəniz komanda rejiminə
              keçirsiniz.
            </p>
          </section>
        ) : (
          <section className="space-y-5">
            <button
              onClick={() => setType(null)}
              className="inline-flex min-h-6 items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-700 dark:hover:text-slate-300"
            >
              <ArrowLeft size={14} />
              Geri
            </button>

            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              {type === 'solo' ? 'Peşəkar məlumatlarınız' : 'Biznes məlumatları'}
            </h1>

            <Card>
              {/* Məntiq feature-lardadır — səhifə yalnız yerləşdirir. */}
              {type === 'solo' ? <SoloBusinessForm /> : <MultiBusinessForm />}
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}

function ModeCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-slate-200 bg-card p-4 text-left shadow-xs transition-colors hover:border-brand-600 hover:bg-brand-50/50 focus-visible:border-brand-600 focus-visible:outline-none dark:border-slate-800 dark:hover:bg-brand-700/10"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-800 dark:bg-brand-700/20 dark:text-brand-200">
        {icon}
      </span>
      <span className="mt-3 block text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </span>
      <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
    </button>
  );
}
