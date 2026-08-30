/**
 * İşçilər — komandanın idarə olunduğu ekran.
 *
 * Biznes yaradılanda sahib avtomatik işçi kimi qeyd olunur, ona görə
 * bu siyahı heç vaxt tam boş olmur. Yeni işçi dəvətlə əlavə edilir:
 * birbaşa profil yaratmaq mövcud hesab tələb edir, dəvət isə həm
 * hesabı, həm profili qurur.
 */
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Copy, Loader2, Mail, UserPlus, Users, X } from 'lucide-react';

import {
  staffApi,
  STAFF_ROLE_LABELS,
  type StaffMember,
  type StaffRole,
} from '@/entities/staff/api/staffApi';
import { extractErrorMessage } from '@/shared/api/errors';
import { useBusinessQuery } from '@/entities/business';

export default function StaffPage() {
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const { data: business } = useBusinessQuery();

  // Tək işləyən həkim/bərbər üçün "komanda" anlayışı yoxdur — o, özü
  // xidmət göstərəndir. Ekran buna görə fərqli danışır, amma dəvət
  // imkanı qalır: adam işçi götürsə komandaya çevrilə bilər.
  const isSolo = business?.business_type === 'solo_practitioner';

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staff', 'list'],
    queryFn: staffApi.list,
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => staffApi.deactivate(id),
    onSuccess: () => {
      toast.success('İşçi deaktiv edildi');
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
    onError: (error) =>
      toast.error(extractErrorMessage(error, 'Əməliyyat alınmadı')),
  });

  const active = staff.filter((member) => member.status === 'active');
  const inactive = staff.filter((member) => member.status !== 'active');

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {isSolo ? 'Mütəxəssis' : 'İşçilər'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {isSolo
              ? 'Siz tək işləyirsiniz — randevular birbaşa sizin adınıza gəlir.'
              : 'Randevu qəbul edən mütəxəssislər. Hər birinin öz iş qrafiki olur.'}
          </p>
        </div>

        <button
          onClick={() => setInviteOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
        >
          <UserPlus size={15} />
          {isSolo ? 'Komandaya işçi əlavə et' : 'İşçi dəvət et'}
        </button>
      </header>

      {isLoading && <p className="text-sm text-neutral-400">Yüklənir…</p>}

      {!isLoading && active.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-12 text-center dark:border-neutral-800">
          <Users size={28} className="mx-auto text-neutral-300" />
          <p className="mt-3 text-sm text-neutral-500">
            Hələ aktiv mütəxəssis yoxdur.
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Biznes yaradılanda siz avtomatik mütəxəssis kimi əlavə olunmalı
            idiniz — görünmürsə, çıxıb yenidən daxil olun.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {active.map((member) => (
          <StaffCard
            key={member.id}
            member={member}
            busy={deactivate.isPending}
            onDeactivate={() => deactivate.mutate(member.id)}
          />
        ))}
      </div>

      {inactive.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-500">
            Deaktiv ({inactive.length})
          </h2>
          {inactive.map((member) => (
            <StaffCard key={member.id} member={member} inactive />
          ))}
        </section>
      )}

      {inviteOpen && <InviteDialog onClose={() => setInviteOpen(false)} />}
    </div>
  );
}

// ─── İşçi kartı ──────────────────────────────────────────────

function StaffCard({
  member,
  inactive = false,
  busy = false,
  onDeactivate,
}: {
  member: StaffMember;
  inactive?: boolean;
  busy?: boolean;
  onDeactivate?: () => void;
}) {
  const name = member.full_name || member.title || member.id.slice(0, 8);
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <article
      className={`flex flex-wrap items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 ${
        inactive ? 'opacity-60' : ''
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
          {name}
        </p>
        <p className="truncate text-xs text-neutral-500">
          {[
            STAFF_ROLE_LABELS[member.role] ?? member.role,
            member.title,
            member.email,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>

      {!inactive && onDeactivate && (
        <button
          onClick={onDeactivate}
          disabled={busy}
          className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Deaktiv et
        </button>
      )}
    </article>
  );
}

// ─── Dəvət dialoqu ───────────────────────────────────────────

function InviteDialog({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffRole>('staff');
  const [token, setToken] = useState<string | null>(null);

  const invite = useMutation({
    mutationFn: () =>
      staffApi.invite({ email: email.trim(), phone: phone.trim(), role }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });

      if (created) {
        setToken(created);
        toast.success('Dəvət yaradıldı');
      } else {
        toast.success('Dəvət göndərildi');
        onClose();
      }
    },
    onError: (error) =>
      toast.error(extractErrorMessage(error, 'Dəvət göndərilmədi')),
  });

  const inviteLink = token
    ? `${window.location.origin}/invite?token=${token}`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5 dark:border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
            İşçi dəvət et
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X size={16} />
          </button>
        </div>

        {token ? (
          // Dəvət yaradıldı — linki paylaşmaq üçün göstəririk.
          <div className="space-y-3 px-5 py-5">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Bu linki işçiyə göndərin. O, linkə keçib şifrə təyin edəcək və
              komandaya qoşulacaq.
            </p>

            <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-800">
              <code className="min-w-0 flex-1 truncate text-xs text-neutral-700 dark:text-neutral-300">
                {inviteLink}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
                  toast.success('Kopyalandı');
                }}
                className="shrink-0 rounded-md p-1.5 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                title="Kopyala"
              >
                <Copy size={14} />
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Link müddətlidir — işçi vaxtında istifadə etməlidir.
            </p>

            <button
              onClick={onClose}
              className="w-full rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
            >
              Bağla
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 px-5 py-4">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  E-poçt
                </span>
                <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 dark:border-neutral-700">
                  <Mail size={14} className="text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="hekim@example.com"
                    className="w-full bg-transparent py-2 text-sm outline-none"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Mobil nömrə (istəyə bağlı)
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+994501234567"
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Rol
                </span>
                <select
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value as StaffRole)
                  }
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <option value="staff">İşçi — yalnız öz bronlarını görür</option>
                  <option value="manager">Menecer — komandanı idarə edir</option>
                  <option value="admin">Administrator — tam giriş</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-neutral-100 px-5 py-3 dark:border-neutral-800">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Ləğv et
              </button>
              <button
                onClick={() => invite.mutate()}
                disabled={!email.trim() || invite.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
              >
                {invite.isPending && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                Dəvət göndər
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
