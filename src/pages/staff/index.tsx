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
import { PhoneAction } from '@/shared/ui/PhoneAction';
import {
  businessApi,
  BUSINESS_MODE,
  useBusinessQuery,
  type BusinessMode,
} from '@/entities/business';
import { Button, Card, Dialog } from '@/shared/ui/primitives';

export default function StaffPage() {
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const { data: business } = useBusinessQuery();

  // Tək işləyən həkim/bərbər üçün "komanda" anlayışı yoxdur — o, özü
  // xidmət göstərəndir. Ona görə bu rejimdə dəvət düyməsi yoxdur:
  // ekranın özü "tək işləyirsiniz" yazırsa, yanında işçi dəvəti
  // təklif etmək ekranı öz sözünə zidd edir.
  //
  // Amma yol bağlanmır — bərbər ikinci bərbər götürə bilər. Keçid
  // ayrıca, açıq addımdır; server də dəvəti yalnız komanda rejimində
  // qəbul edir.
  const isSolo = business?.business_type === BUSINESS_MODE.solo;

  const switchMode = useMutation({
    mutationFn: (mode: BusinessMode) => businessApi.switchMode(mode),
    onSuccess: (updated) => {
      queryClient.setQueryData(['business'], updated);
      queryClient.invalidateQueries({ queryKey: ['business'] });
      toast.success(
        updated.business_type === BUSINESS_MODE.team
          ? 'Komanda rejimi açıldı — indi işçi dəvət edə bilərsiniz'
          : 'Tək iş rejiminə keçdiniz',
      );
    },
    onError: (error) =>
      toast.error(extractErrorMessage(error, 'Rejim dəyişdirilmədi')),
  });

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
    <div className="space-y-5 sm:space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isSolo ? 'Mütəxəssis' : 'İşçilər'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isSolo
              ? 'Siz tək işləyirsiniz — randevular birbaşa sizin adınıza gəlir.'
              : 'Randevu qəbul edən mütəxəssislər. Hər birinin öz iş qrafiki olur.'}
          </p>
        </div>

        {!isSolo && (
          <button
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-2 h-10 rounded-lg bg-brand-700 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-800 sm:h-9.5"
          >
            <UserPlus size={15} />
            İşçi dəvət et
          </button>
        )}
      </header>

      {isLoading && <p className="text-sm text-slate-500">Yüklənir…</p>}

      {!isLoading && active.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
          <Users size={28} className="mx-auto text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            Hələ aktiv mütəxəssis yoxdur.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Biznes yaradılanda siz avtomatik mütəxəssis kimi əlavə olunmalı
            idiniz — görünmürsə, çıxıb yenidən daxil olun.
          </p>
        </div>
      )}

      <div className="space-y-2.5 sm:space-y-3">
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
          <h2 className="text-sm font-semibold text-slate-500">
            Deaktiv ({inactive.length})
          </h2>
          {inactive.map((member) => (
            <StaffCard key={member.id} member={member} inactive />
          ))}
        </section>
      )}

      <ModeCard
        solo={isSolo}
        activeCount={active.length}
        busy={switchMode.isPending}
        onSwitch={switchMode.mutate}
      />

      {inviteOpen && <InviteDialog onClose={() => setInviteOpen(false)} />}
    </div>
  );
}

// ─── Rejim keçidi ────────────────────────────────────────────

/**
 * Tək iş ↔ komanda.
 *
 * Sakit, ikinci dərəcəli bölmədir: gündəlik iş deyil, ildə bir dəfə
 * olan qərardır. Komandadan geri qayıtmaq yalnız sahib tək qalanda
 * mümkündür — server də eyni qaydanı tətbiq edir.
 */
function ModeCard({
  solo,
  activeCount,
  busy,
  onSwitch,
}: {
  solo: boolean;
  activeCount: number;
  busy: boolean;
  onSwitch: (mode: BusinessMode) => void;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!solo && activeCount > 1) return null;

  return (
    <Card className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {solo ? 'İşçi götürmüsünüz?' : 'Komandada yalnız sizsiniz'}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          {solo
            ? 'Komanda rejimində işçi dəvət edir, hər birinə ayrıca qrafik təyin edirsiniz.'
            : 'Tək iş rejimində ekran sadələşir, randevular birbaşa sizin adınıza gəlir.'}
        </p>
      </div>

      <Button
        onClick={() =>
          solo ? setConfirming(true) : onSwitch(BUSINESS_MODE.solo)
        }
        loading={busy}
        icon={solo ? <UserPlus size={15} /> : undefined}
      >
        {solo ? 'Komandaya keç' : 'Tək iş rejiminə qayıt'}
      </Button>

      {confirming && (
        <Dialog
          title="Komanda rejiminə keçilsin?"
          onClose={() => setConfirming(false)}
          footer={
            <>
              <Button onClick={() => setConfirming(false)}>İmtina</Button>
              <Button
                variant="primary"
                loading={busy}
                onClick={() => {
                  onSwitch(BUSINESS_MODE.team);
                  setConfirming(false);
                }}
              >
                Keç
              </Button>
            </>
          }
        >
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>Bundan sonra:</p>
            <ul className="list-disc space-y-1 pl-4 text-xs">
              <li>işçi dəvət edə bilirsiniz;</li>
              <li>hər işçinin öz iş qrafiki olur;</li>
              <li>müştəri randevu yaradarkən mütəxəssis seçir.</li>
            </ul>
            <p className="text-xs text-slate-500">
              Sizin randevularınız və qrafikiniz olduğu kimi qalır. Tək
              qalsanız geri qayıtmaq mümkündür.
            </p>
          </div>
        </Dialog>
      )}
    </Card>
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
      className={`flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 ${
        inactive ? 'opacity-60' : ''
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-800 dark:bg-brand-700/20 dark:text-brand-200">
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
          {name}
        </p>
        <p className="truncate text-xs text-slate-500">
          {[STAFF_ROLE_LABELS[member.role] ?? member.role, member.title]
            .filter(Boolean)
            .join(' · ')}
        </p>

        {/* Əlaqə sətri ayrıca: nömrə kliklənən olmalıdır, ona görə
            digər mətnlərlə bir sətirdə birləşdirilmir. */}
        {(member.phone || member.email) && (
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            {member.phone && <PhoneAction phone={member.phone} />}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="inline-flex min-h-7 items-center truncate text-xs text-slate-500 transition-colors hover:text-brand-700"
              >
                {member.email}
              </a>
            )}
          </div>
        )}
      </div>

      {member.is_owner && (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Sahib
        </span>
      )}

      {!inactive && onDeactivate && !member.is_owner && (
        <button
          onClick={onDeactivate}
          disabled={busy}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
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
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            İşçi dəvət et
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {token ? (
          // Dəvət yaradıldı — linki paylaşmaq üçün göstəririk.
          <div className="space-y-3 px-5 py-5">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Bu linki işçiyə göndərin. O, linkə keçib şifrə təyin edəcək və
              komandaya qoşulacaq.
            </p>

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
              <code className="min-w-0 flex-1 truncate text-xs text-slate-700 dark:text-slate-300">
                {inviteLink}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
                  toast.success('Kopyalandı');
                }}
                className="shrink-0 rounded-md p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                title="Kopyala"
              >
                <Copy size={14} />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Link müddətlidir — işçi vaxtında istifadə etməlidir.
            </p>

            <button
              onClick={onClose}
              className="w-full h-10 rounded-lg bg-brand-700 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-800 sm:h-9.5"
            >
              Bağla
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 px-5 py-4">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  E-poçt
                </span>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 dark:border-slate-700">
                  <Mail size={14} className="text-slate-500" />
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
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Mobil nömrə (istəyə bağlı)
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+994501234567"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Rol
                </span>
                <select
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value as StaffRole)
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="staff">İşçi — yalnız öz bronlarını görür</option>
                  <option value="manager">Menecer — komandanı idarə edir</option>
                  <option value="admin">Administrator — tam giriş</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3 dark:border-slate-800">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Ləğv et
              </button>
              <button
                onClick={() => invite.mutate()}
                disabled={!email.trim() || invite.isPending}
                className="inline-flex items-center gap-2 h-10 rounded-lg bg-brand-700 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-800 sm:h-9.5 disabled:opacity-50"
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
