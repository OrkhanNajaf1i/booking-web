/**
 * Filiallar — xidmətin göstərildiyi yerlər.
 *
 * Ünvanı həm əl ilə yazmaq, həm də xəritədən seçmək olur. Xəritədən
 * seçiləndə ünvan və şəhər avtomatik dolur, amma sahələr redaktə
 * olunan qalır: geokodlama təxminidir, son sözü istifadəçi deyir.
 */
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, MapPin, Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-react';

import {
  locationApi,
  type Location,
  type LocationDto,
} from '@/entities/location/api/locationApi';
import { LocationPicker } from '@/shared/ui/LocationPicker';
import { extractErrorMessage } from '@/shared/api/errors';

export default function LocationsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Location | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locations', 'list'],
    queryFn: locationApi.list,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['locations'] });

  const fail = (error: unknown) =>
    toast.error(extractErrorMessage(error, 'Əməliyyat alınmadı'));

  const deactivate = useMutation({
    mutationFn: (id: string) => locationApi.deactivate(id),
    onSuccess: () => {
      toast.success('Filial deaktiv edildi');
      invalidate();
    },
    onError: fail,
  });

  const activate = useMutation({
    mutationFn: (id: string) => locationApi.activate(id),
    onSuccess: () => {
      toast.success('Filial yenidən aktivdir');
      invalidate();
    },
    onError: fail,
  });

  // Həmişəlik silmə. Filiala bağlı randevu varsa server 409 verir və
  // mesaj istifadəçiyə deaktiv etməyi təklif edir.
  const remove = useMutation({
    mutationFn: (id: string) => locationApi.remove(id),
    onSuccess: () => {
      toast.success('Filial silindi');
      invalidate();
    },
    onError: fail,
  });

  const busy = deactivate.isPending || activate.isPending || remove.isPending;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Filiallar
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Xidmətin göstərildiyi yerlər. Müştəri hansı filiala gedəcəyini
            burada görür.
          </p>
        </div>

        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
        >
          <Plus size={15} />
          Filial əlavə et
        </button>
      </header>

      {isLoading && <p className="text-sm text-neutral-400">Yüklənir…</p>}

      {!isLoading && locations.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-12 text-center dark:border-neutral-800">
          <MapPin size={28} className="mx-auto text-neutral-300" />
          <p className="mt-3 text-sm text-neutral-500">Hələ filial yoxdur.</p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <article
            key={location.id}
            className={`rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 ${
              location.is_active ? '' : 'opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-neutral-900 dark:text-white">
                {location.name}
              </h3>
              {!location.is_active && (
                <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800">
                  Deaktiv
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-neutral-500">
              {[location.address, location.city].filter(Boolean).join(', ') ||
                'Ünvan göstərilməyib'}
            </p>

            {location.phone && (
              <p className="mt-0.5 text-xs text-neutral-400">{location.phone}</p>
            )}

            {location.latitude != null && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-neutral-400">
                <MapPin size={10} />
                Xəritədə qeyd olunub
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
              {location.is_active ? (
                <>
                  <button
                    onClick={() => setEditing(location)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    <Pencil size={12} />
                    Düzəliş
                  </button>
                  <button
                    onClick={() => deactivate.mutate(location.id)}
                    disabled={busy}
                    className="rounded-lg px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-50 dark:hover:bg-neutral-800"
                  >
                    Deaktiv et
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => activate.mutate(location.id)}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    <RotateCcw size={12} />
                    Aktivləşdir
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `"${location.name}" həmişəlik silinsin? Bu geri qaytarıla bilməz.`,
                        )
                      ) {
                        remove.mutate(location.id);
                      }
                    }}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    <Trash2 size={12} />
                    Sil
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      {(creating || editing) && (
        <LocationDialog
          location={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Yaratma / düzəliş dialoqu ───────────────────────────────

function LocationDialog({
  location,
  onClose,
}: {
  location: Location | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const isEdit = location !== null;

  const [form, setForm] = useState<LocationDto & {
    latitude?: number;
    longitude?: number;
  }>({
    name: location?.name ?? '',
    address: location?.address ?? '',
    city: location?.city ?? '',
    phone: location?.phone ?? '',
    latitude: location?.latitude ?? undefined,
    longitude: location?.longitude ?? undefined,
  });

  const save = useMutation({
    mutationFn: async (): Promise<void> => {
      if (isEdit) {
        await locationApi.update(location.id, form);
      } else {
        await locationApi.create(form);
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Filial yeniləndi' : 'Filial əlavə edildi');
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      onClose();
    },
    onError: (error) =>
      toast.error(extractErrorMessage(error, 'Yadda saxlanılmadı')),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-8 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5 dark:border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
            {isEdit ? 'Filialı dəyiş' : 'Yeni filial'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Filialın adı
            </span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              placeholder="Mərkəz filialı"
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </label>

          {/* Xəritə — seçim ünvanı avtomatik doldurur */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Xəritədən seçin
            </span>
            <LocationPicker
              value={
                form.latitude != null && form.longitude != null
                  ? { lat: form.latitude, lng: form.longitude }
                  : null
              }
              onPick={(picked) =>
                setForm((prev) => ({
                  ...prev,
                  latitude: picked.lat,
                  longitude: picked.lng,
                  // Geokodlama nəticəsi gələndə sahələri doldururuq;
                  // gəlməsə istifadəçinin yazdığı qalır.
                  address: picked.address ?? prev.address,
                  city: picked.city ?? prev.city,
                }))
              }
            />
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Ünvan
            </span>
            <input
              value={form.address ?? ''}
              onChange={(event) =>
                setForm({ ...form, address: event.target.value })
              }
              placeholder="Nizami küç. 12"
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Şəhər
              </span>
              <input
                value={form.city ?? ''}
                onChange={(event) =>
                  setForm({ ...form, city: event.target.value })
                }
                placeholder="Bakı"
                className="rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Telefon
              </span>
              <input
                value={form.phone ?? ''}
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
                placeholder="+994501234567"
                className="rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-neutral-100 px-5 py-3 dark:border-neutral-800">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Ləğv et
          </button>
          <button
            onClick={() => save.mutate()}
            disabled={!form.name.trim() || save.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
          >
            {save.isPending && <Loader2 size={14} className="animate-spin" />}
            Yadda saxla
          </button>
        </div>
      </div>
    </div>
  );
}
