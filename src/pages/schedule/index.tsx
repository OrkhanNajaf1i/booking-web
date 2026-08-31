/**
 * Qrafik idarəetməsi — adminin (xəstəxana, həkim, bərbər) iş qaydalarını
 * təyin etdiyi ekran.
 *
 * Burada yazılan üç şey müştərinin gördüyü boş vaxtları tam müəyyən edir:
 *   1. Həftəlik iş saatları + nahar fasiləsi (söndürülə bilər)
 *   2. Seçim addımı (16 / 30 / 60 dəq) və randevu uzunluğu
 *   3. Bufer, minimum xəbərdarlıq, avtomatik təsdiq
 */
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Clock, Coffee, Loader2, Save } from 'lucide-react';

import { availabilityApi } from '@/entities/availability/api/availabilityApi';
import {
  DAY_NAMES,
  type ScheduleSettings,
  type SetWorkingHoursDto,
} from '@/entities/availability/model/types';
import { staffApi } from '@/entities/staff/api/staffApi';

/** Yeni işçi üçün başlanğıc həftə: B.e–Cümə 09:00–18:00, nahar 13:00–14:00. */
function defaultWeek(staffId: string): SetWorkingHoursDto[] {
  return Array.from({ length: 7 }, (_, day) => ({
    staff_id: staffId,
    day_of_week: day,
    start_time: '09:00',
    end_time: '18:00',
    break_enabled: false,
    break_start: '13:00',
    break_end: '14:00',
    is_active: day >= 1 && day <= 5,
  }));
}

export default function SchedulePage() {
  const queryClient = useQueryClient();
  const [staffId, setStaffId] = useState<string>('');
  const [week, setWeek] = useState<SetWorkingHoursDto[]>([]);
  const [settings, setSettings] = useState<ScheduleSettings | null>(null);

  const { data: staff = [], isLoading: staffLoading } = useQuery({
    queryKey: ['staff', 'list'],
    queryFn: staffApi.list,
  });

  // İlk işçi avtomatik seçilir ki, ekran boş qalmasın.
  useEffect(() => {
    if (!staffId && staff.length > 0) setStaffId(staff[0].id);
  }, [staff, staffId]);

  const { data: workingHours, isLoading: hoursLoading } = useQuery({
    queryKey: ['availability', 'working-hours', staffId],
    queryFn: () => availabilityApi.listWorkingHours(staffId),
    enabled: Boolean(staffId),
  });

  const { data: loadedSettings } = useQuery({
    queryKey: ['availability', 'settings', staffId],
    queryFn: () => availabilityApi.getSettings(staffId),
    enabled: Boolean(staffId),
  });

  // Serverdən gələn qismən həftəni 7 günlük tam formaya açırıq.
  useEffect(() => {
    if (!staffId) return;

    const base = defaultWeek(staffId);
    (workingHours ?? []).forEach((row) => {
      base[row.day_of_week] = {
        staff_id: staffId,
        day_of_week: row.day_of_week,
        start_time: row.start_time,
        end_time: row.end_time,
        break_enabled: row.break_enabled,
        break_start: row.break_start ?? '13:00',
        break_end: row.break_end ?? '14:00',
        is_active: row.is_active,
      };
    });
    setWeek(base);
  }, [workingHours, staffId]);

  useEffect(() => {
    if (loadedSettings) setSettings(loadedSettings);
  }, [loadedSettings]);

  const saveWeek = useMutation({
    mutationFn: () =>
      availabilityApi.bulkSetWorkingHours({ staff_id: staffId, days: week }),
    onSuccess: () => {
      toast.success('Həftəlik qrafik yadda saxlanıldı');
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
    onError: (error: { message?: string }) =>
      toast.error(error?.message ?? 'Qrafik yadda saxlanılmadı'),
  });

  const saveSettings = useMutation({
    mutationFn: () => {
      if (!settings) throw new Error('Ayarlar yüklənməyib');
      return availabilityApi.updateSettings({
        staff_id: staffId,
        slot_step_mins: settings.slot_step_mins,
        default_duration_mins: settings.default_duration_mins,
        buffer_before_mins: settings.buffer_before_mins,
        buffer_after_mins: settings.buffer_after_mins,
        min_notice_mins: settings.min_notice_mins,
        max_advance_days: settings.max_advance_days,
        auto_confirm: settings.auto_confirm,
        allow_reschedule_proposal: settings.allow_reschedule_proposal,
        pending_expires_mins: settings.pending_expires_mins,
        cancellation_window_mins: settings.cancellation_window_mins,
        allow_customer_reschedule: settings.allow_customer_reschedule,
        reschedule_window_mins: settings.reschedule_window_mins,
      });
    },
    onSuccess: () => {
      toast.success('Ayarlar yeniləndi');
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
    onError: (error: { message?: string }) =>
      toast.error(error?.message ?? 'Ayarlar yenilənmədi'),
  });

  const updateDay = (day: number, patch: Partial<SetWorkingHoursDto>) => {
    setWeek((prev) =>
      prev.map((row) => (row.day_of_week === day ? { ...row, ...patch } : row))
    );
  };

  const updateSetting = <K extends keyof ScheduleSettings>(
    key: K,
    value: ScheduleSettings[K]
  ) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  /** Nümunə: cari ayarlarla ilk saatların necə görünəcəyi. */
  const previewTimes = useMemo(() => {
    if (!settings) return [];

    const monday = week.find((day) => day.day_of_week === 1 && day.is_active) ?? week[1];
    if (!monday) return [];

    const [hour, minute] = monday.start_time.split(':').map(Number);
    let cursor = hour * 60 + minute;

    return Array.from({ length: 6 }, () => {
      const label = `${String(Math.floor(cursor / 60)).padStart(2, '0')}:${String(
        cursor % 60
      ).padStart(2, '0')}`;
      cursor += settings.slot_step_mins;
      return label;
    });
  }, [settings, week]);

  if (staffLoading) {
    return <div className="p-8 text-sm text-slate-500">Yüklənir…</div>;
  }

  if (staff.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center">
        <p className="text-sm text-slate-500">
          Qrafik təyin etmək üçün əvvəlcə işçi əlavə edin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            İş qrafiki
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            İş saatları, nahar fasiləsi və seçim addımı buradan idarə olunur.
          </p>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">İşçi</span>
          <select
            value={staffId}
            onChange={(event) => setStaffId(event.target.value)}
            className="min-w-56 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            {staff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.full_name || member.title || member.id.slice(0, 8)}
              </option>
            ))}
          </select>
        </label>
      </header>

      {/* ─── Həftəlik qrafik ───────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <Clock size={16} className="text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Həftəlik iş saatları
          </h2>
        </div>

        {hoursLoading ? (
          <p className="px-5 py-8 text-sm text-slate-500">Yüklənir…</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {week.map((day) => (
              <div
                key={day.day_of_week}
                className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4"
              >
                <label className="flex w-44 shrink-0 items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={day.is_active}
                    onChange={(event) =>
                      updateDay(day.day_of_week, { is_active: event.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 accent-brand-700"
                  />
                  <span
                    className={`text-sm font-medium ${
                      day.is_active
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-500'
                    }`}
                  >
                    {DAY_NAMES[day.day_of_week]}
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={day.start_time}
                    disabled={!day.is_active}
                    onChange={(event) =>
                      updateDay(day.day_of_week, { start_time: event.target.value })
                    }
                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <span className="text-slate-500">–</span>
                  <input
                    type="time"
                    value={day.end_time}
                    disabled={!day.is_active}
                    onChange={(event) =>
                      updateDay(day.day_of_week, { end_time: event.target.value })
                    }
                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900"
                  />
                </div>

                {/* Nahar fasiləsi — söndürülə bilər */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={day.break_enabled}
                    disabled={!day.is_active}
                    onChange={(event) =>
                      updateDay(day.day_of_week, { break_enabled: event.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 accent-brand-700 disabled:opacity-40"
                  />
                  <Coffee size={14} className="text-slate-500" />
                  <span className="text-xs text-slate-500">Nahar</span>
                </label>

                {day.break_enabled && day.is_active && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={day.break_start ?? '13:00'}
                      onChange={(event) =>
                        updateDay(day.day_of_week, { break_start: event.target.value })
                      }
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                    />
                    <span className="text-slate-500">–</span>
                    <input
                      type="time"
                      value={day.break_end ?? '14:00'}
                      onChange={(event) =>
                        updateDay(day.day_of_week, { break_end: event.target.value })
                      }
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end border-t border-slate-100 px-5 py-3 dark:border-slate-800">
          <button
            onClick={() => saveWeek.mutate()}
            disabled={saveWeek.isPending || !staffId}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-800 disabled:opacity-50"
          >
            {saveWeek.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            Qrafiki yadda saxla
          </button>
        </div>
      </section>

      {/* ─── Seçim qaydaları ───────────────────────────────── */}
      {settings && (
        <section className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Seçim qaydaları
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Müştərinin gördüyü vaxtların necə kəsiləcəyini təyin edir.
            </p>
          </div>

          <div className="grid gap-5 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3">
            <NumberField
              label="Seçim addımı (dəq)"
              hint="16 qoysanız: 09:00, 09:16, 09:32 …"
              value={settings.slot_step_mins}
              min={5}
              max={480}
              onChange={(value) => updateSetting('slot_step_mins', value)}
            />

            <NumberField
              label="Randevu uzunluğu (dəq)"
              hint="Xidmət seçilməyəndə istifadə olunur"
              value={settings.default_duration_mins}
              min={5}
              max={1440}
              onChange={(value) => updateSetting('default_duration_mins', value)}
            />

            <NumberField
              label="Sonrakı bufer (dəq)"
              hint="Randevudan sonra saxlanılan boşluq"
              value={settings.buffer_after_mins}
              min={0}
              max={240}
              onChange={(value) => updateSetting('buffer_after_mins', value)}
            />

            <NumberField
              label="Əvvəlki bufer (dəq)"
              hint="Hazırlıq üçün ayrılan vaxt"
              value={settings.buffer_before_mins}
              min={0}
              max={240}
              onChange={(value) => updateSetting('buffer_before_mins', value)}
            />

            <NumberField
              label="Minimum xəbərdarlıq (dəq)"
              hint="Bu qədər əvvəlcədən bron edilə bilər"
              value={settings.min_notice_mins}
              min={0}
              max={43200}
              onChange={(value) => updateSetting('min_notice_mins', value)}
            />

            <NumberField
              label="Maksimum irəli (gün)"
              hint="Nə qədər irəli tarixə bron açılsın"
              value={settings.max_advance_days}
              min={1}
              max={365}
              onChange={(value) => updateSetting('max_advance_days', value)}
            />
          </div>

          <div className="space-y-3 border-t border-slate-100 px-5 py-4 dark:border-slate-800">
            <ToggleField
              label="Avtomatik təsdiq"
              hint="Aktivdirsə bron təsdiq gözləmədən dərhal təsdiqlənir"
              checked={settings.auto_confirm}
              onChange={(value) => updateSetting('auto_confirm', value)}
            />
            <ToggleField
              label="Alternativ vaxt təklifinə icazə"
              hint="İşçi müştəriyə başqa vaxt təklif edə bilsin"
              checked={settings.allow_reschedule_proposal}
              onChange={(value) => updateSetting('allow_reschedule_proposal', value)}
            />
            <ToggleField
              label="Müştəri özü vaxt dəyişə bilsin"
              hint="Aşağıdakı pəncərə çərçivəsində müştəri yeni vaxt təklif edir"
              checked={settings.allow_customer_reschedule}
              onChange={(value) => updateSetting('allow_customer_reschedule', value)}
            />
          </div>

          {/* ─── Randevu siyasəti ─────────────────────────── */}
          <div className="border-t border-slate-100 px-5 py-5 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Randevu siyasəti
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Ləğv və dəyişiklik qaydaları. 0 qoysanız məhdudiyyət olmur.
            </p>

            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <NumberField
                label="Ləğv pəncərəsi (dəq)"
                hint="Randevuya bu qədər qalanda müştəri ləğv edə bilməz"
                value={settings.cancellation_window_mins}
                min={0}
                max={20160}
                onChange={(value) =>
                  updateSetting('cancellation_window_mins', value)
                }
              />
              <NumberField
                label="Dəyişiklik pəncərəsi (dəq)"
                hint="Müştərinin vaxt dəyişməsi üçün son müddət"
                value={settings.reschedule_window_mins}
                min={0}
                max={20160}
                onChange={(value) =>
                  updateSetting('reschedule_window_mins', value)
                }
              />
              <NumberField
                label="Cavab müddəti (dəq)"
                hint="Cavabsız qalan sorğu bu müddətdən sonra avtomatik ləğv olunur"
                value={settings.pending_expires_mins}
                min={0}
                max={20160}
                onChange={(value) =>
                  updateSetting('pending_expires_mins', value)
                }
              />
            </div>
          </div>

          {/* Canlı nümunə */}
          <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500">
              Nümunə — müştəri belə görəcək:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {previewTimes.map((time) => (
                <span
                  key={time}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300"
                >
                  {time}
                </span>
              ))}
              <span className="self-center text-sm text-slate-500">…</span>
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 px-5 py-3 dark:border-slate-800">
            <button
              onClick={() => saveSettings.mutate()}
              disabled={saveSettings.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-800 disabled:opacity-50"
            >
              {saveSettings.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Ayarları yadda saxla
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Kiçik köməkçi komponentlər ──────────────────────────────

function NumberField({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
      />
      <span className="text-[11px] text-slate-500">{hint}</span>
    </label>
  );
}

function ToggleField({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-brand-700"
      />
      <span>
        <span className="block text-sm font-medium text-slate-900 dark:text-white">
          {label}
        </span>
        <span className="block text-xs text-slate-500">{hint}</span>
      </span>
    </label>
  );
}
