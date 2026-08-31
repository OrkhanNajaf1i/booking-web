/**
 * Xidmətlər — kataloqun idarə olunduğu ekran.
 *
 * Xidmət iki şeyi təyin edir: randevunun uzunluğunu (availability
 * mühərrikinə gedir) və qiyməti (dashboard-dakı gəlir hesabatı).
 * Xidmət yoxdursa qrafik ayarlarındakı default müddət işlənir və
 * gəlir həmişə sıfır görünür.
 */
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Clock, Loader2, Pencil, Plus, Scissors, X } from 'lucide-react';

import {
  serviceApi,
  formatDuration,
  formatPrice,
  type Service,
  type ServiceDto,
} from '@/entities/service/api/serviceApi';
import { extractErrorMessage } from '@/shared/api/errors';
import { Button } from '@/shared/ui/primitives';

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services', 'list'],
    queryFn: serviceApi.list,
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => serviceApi.deactivate(id),
    onSuccess: () => {
      toast.success('Xidmət deaktiv edildi');
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) =>
      toast.error(extractErrorMessage(error, 'Əməliyyat alınmadı')),
  });

  const active = services.filter((item) => item.is_active);
  const inactive = services.filter((item) => !item.is_active);

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Xidmətlər
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Hər xidmətin müddəti randevunun uzunluğunu, qiyməti isə gəlir
            hesabatını təyin edir.
          </p>
        </div>

        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 h-10 rounded-lg bg-brand-700 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-800 sm:h-9.5"
        >
          <Plus size={15} />
          Xidmət əlavə et
        </button>
      </header>

      {isLoading && <p className="text-sm text-slate-500">Yüklənir…</p>}

      {!isLoading && active.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
          <Scissors size={28} className="mx-auto text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">Hələ xidmət yoxdur.</p>
          <p className="mt-1 text-xs text-slate-500">
            Xidmət əlavə etməsəniz randevular default müddətlə yaranır və
            gəlir hesablanmır.
          </p>
        </div>
      )}

      <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
        {active.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            busy={deactivate.isPending}
            onEdit={() => setEditing(service)}
            onDeactivate={() => deactivate.mutate(service.id)}
          />
        ))}
      </div>

      {inactive.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-500">
            Deaktiv ({inactive.length})
          </h2>
          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
            {inactive.map((service) => (
              <ServiceCard key={service.id} service={service} inactive />
            ))}
          </div>
        </section>
      )}

      {(creating || editing) && (
        <ServiceDialog
          service={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Xidmət kartı ────────────────────────────────────────────

function ServiceCard({
  service,
  inactive = false,
  busy = false,
  onEdit,
  onDeactivate,
}: {
  service: Service;
  inactive?: boolean;
  busy?: boolean;
  onEdit?: () => void;
  onDeactivate?: () => void;
}) {
  return (
    <article
      className={`flex flex-col rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 ${
        inactive ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900 dark:text-white">
          {service.name}
        </h3>
        <span className="shrink-0 text-sm font-semibold text-slate-900 dark:text-white">
          {formatPrice(service.price)}
        </span>
      </div>

      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
        <Clock size={12} />
        {formatDuration(service.duration_minutes)}
      </p>

      {service.description && (
        <p className="mt-2 line-clamp-2 text-xs text-slate-500">
          {service.description}
        </p>
      )}

      {!inactive && (
        <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <Button size="sm" icon={<Pencil size={12} />} onClick={onEdit}>
            Düzəliş
          </Button>
          <Button size="sm" variant="ghost" disabled={busy} onClick={onDeactivate}>
            Deaktiv et
          </Button>
        </div>
      )}
    </article>
  );
}

// ─── Yaratma / düzəliş dialoqu ───────────────────────────────

function ServiceDialog({
  service,
  onClose,
}: {
  service: Service | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const isEdit = service !== null;

  const [form, setForm] = useState<ServiceDto>({
    name: service?.name ?? '',
    description: service?.description ?? '',
    duration_minutes: service?.duration_minutes ?? 30,
    price: service?.price ?? 0,
  });

  const save = useMutation({
    // create Service, update isə void qaytarır — nəticə istifadə
    // olunmadığı üçün ikisini də void-ə gətiririk.
    mutationFn: async (): Promise<void> => {
      if (isEdit) {
        await serviceApi.update(service.id, form);
      } else {
        await serviceApi.create(form);
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Xidmət yeniləndi' : 'Xidmət əlavə edildi');
      queryClient.invalidateQueries({ queryKey: ['services'] });
      // Müddət dəyişsə boş vaxtlar da dəyişir.
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      onClose();
    },
    onError: (error) =>
      toast.error(extractErrorMessage(error, 'Yadda saxlanılmadı')),
  });

  const canSave = form.name.trim().length > 0 && form.duration_minutes >= 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            {isEdit ? 'Xidməti dəyiş' : 'Yeni xidmət'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Ad
            </span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              placeholder="Saç kəsimi"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Müddət (dəq)
              </span>
              <input
                type="number"
                min={5}
                max={1440}
                value={form.duration_minutes}
                onChange={(event) =>
                  setForm({
                    ...form,
                    duration_minutes: Number(event.target.value),
                  })
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              />
              <span className="text-[11px] text-slate-500">
                Randevunun uzunluğu
              </span>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Qiymət (₼)
              </span>
              <input
                type="number"
                min={0}
                step="0.5"
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: Number(event.target.value) })
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              />
              <span className="text-[11px] text-slate-500">
                Gəlir hesabatına gedir
              </span>
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Təsvir (istəyə bağlı)
            </span>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              rows={2}
              placeholder="Müştəri bunu seçim ekranında görəcək"
              className="resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Ləğv et
          </button>
          <button
            onClick={() => save.mutate()}
            disabled={!canSave || save.isPending}
            className="inline-flex items-center gap-2 h-10 rounded-lg bg-brand-700 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-800 sm:h-9.5 disabled:opacity-50"
          >
            {save.isPending && <Loader2 size={14} className="animate-spin" />}
            Yadda saxla
          </button>
        </div>
      </div>
    </div>
  );
}
