/**
 * Biznes qurma sihirbazı — iki addım.
 *
 * Ünvan ayrıca addımdır və keçilə bilmir: biznes yaradıldığı an
 * müştəri tətbiqində görünür, ünvansız isə kartda gedilən yer yazılmır,
 * xəritədə nöqtəsi olmur və "yaxınlıqdakılar" filtri onu atlayır.
 * Sonraya saxlanan ünvan praktikada heç vaxt əlavə olunmur.
 *
 * Koordinat xəritədən gəlir — yazılmış ünvan mətni tək başına nöqtə
 * vermir. Ona görə son düymə yalnız nöqtə seçiləndən sonra açılır.
 */
import { useState } from 'react';
import { Check, MapPin } from 'lucide-react';

import {
  ProfessionPicker,
  type ProfessionValue,
} from '@/shared/ui/ProfessionPicker';
import { LocationPicker } from '@/shared/ui/LocationPicker';
import { Button, Field, TextField } from '@/shared/ui/primitives';
import type { LocationDraft } from '@/entities/business';

export interface BusinessWizardValues {
  name: string;
  phone: string;
  profession: ProfessionValue;
  location: LocationDraft;
}

interface Props {
  /** Tək işləyən üçün mətnlər fərqlidir — ona "biznes" sözü yaddır. */
  solo: boolean;
  pending: boolean;
  onSubmit: (values: BusinessWizardValues) => void;
}

export function BusinessWizard({ solo, pending, onSubmit }: Props) {
  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profession, setProfession] = useState<ProfessionValue>({
    categorySlug: '',
    customName: '',
  });

  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);

  const detailsReady =
    name.trim().length >= 2 &&
    phone.trim() !== '' &&
    profession.categorySlug !== '';
  const locationReady = point !== null && address.trim() !== '';

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!detailsReady || !locationReady || !point) return;

    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      profession,
      location: {
        name: locationName.trim() || undefined,
        address: address.trim(),
        city: city.trim() || undefined,
        latitude: point.lat,
        longitude: point.lng,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <StepBar step={step} />

      {step === 1 && (
        <div className="space-y-4">
          <Field label={solo ? 'Ad / Biznes adı' : 'Biznes adı'}>
            <TextField
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={
                solo ? 'məs., Elçin Bərbərxanası' : 'məs., Bella Gözəllik Salonu'
              }
              autoFocus
            />
          </Field>

          <Field label="Telefon" hint="Müştəri sizə bu nömrə ilə zəng edəcək.">
            <TextField
              name="phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+994 50 000 00 00"
            />
          </Field>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {solo ? 'Peşəniz' : 'Fəaliyyət sahəniz'}
            </span>
            <ProfessionPicker value={profession} onChange={setProfession} />
            <span className="text-xs text-slate-500">
              Siyahıdan seçin, yoxdursa özünüz yazın. Müştəri sizi tətbiqdə bu
              ad altında tapacaq.
            </span>
          </div>

          <Button
            type="button"
            variant="primary"
            className="w-full"
            disabled={!detailsReady}
            onClick={() => setStep(2)}
          >
            Davam et
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Müştəri sizi xəritədə burada görəcək. Ünvanı axtarın, xəritəyə
            toxunun və ya cari yerinizi seçin.
          </p>

          <LocationPicker
            value={point}
            onPick={(picked) => {
              setPoint({ lat: picked.lat, lng: picked.lng });
              // Geokodlama nəticəsi gələndə sahələr dolur; gəlməsə
              // istifadəçinin yazdığı qalır.
              if (picked.address) setAddress(picked.address);
              if (picked.city) setCity(picked.city);
            }}
          />

          <Field label="Ünvan">
            <TextField
              name="address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="küçə, bina"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Şəhər">
              <TextField
                name="city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Bakı"
              />
            </Field>

            <Field label="Filialın adı" hint="Boş qalsa Əsas filial yazılır.">
              <TextField
                name="location_name"
                value={locationName}
                onChange={(event) => setLocationName(event.target.value)}
                placeholder="Əsas filial"
              />
            </Field>
          </div>

          {!point && (
            <p className="flex items-center gap-1.5 text-xs text-warning-700">
              <MapPin size={13} />
              Xəritədə yeri seçin — müştəri sizi bu nöqtədə görəcək.
            </p>
          )}

          <div className="flex gap-2">
            <Button type="button" onClick={() => setStep(1)}>
              Geri
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              loading={pending}
              disabled={!locationReady}
              icon={<Check size={15} />}
            >
              {solo ? 'Başla' : 'Biznes yarat'}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}

function StepBar({ step }: { step: 1 | 2 }) {
  const steps = [
    { number: 1 as const, label: 'Məlumat' },
    { number: 2 as const, label: 'Ünvan' },
  ];

  return (
    <ol className="flex items-center gap-2 text-xs">
      {steps.map((item) => {
        const done = step > item.number;
        const active = step === item.number;

        return (
          <li key={item.number} className="flex flex-1 items-center gap-2">
            <span
              className={[
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                done || active
                  ? 'bg-brand-700 text-white'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800',
              ].join(' ')}
            >
              {done ? <Check size={13} /> : item.number}
            </span>
            <span
              className={
                active
                  ? 'font-medium text-slate-900 dark:text-white'
                  : 'text-slate-500'
              }
            >
              {item.label}
            </span>
            {item.number === 1 && (
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
