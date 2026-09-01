/**
 * Ayarlar — biznesin müştəriyə görünən məlumatları.
 *
 * Səhifə əvvəl öz `min-h-screen` mərkəzləmə qutusunda idi: panelin
 * içində ikinci dəfə tam ekran açırdı, ona görə nə başlığı vardı, nə də
 * digər səhifələrlə eyni kənar boşluğu.
 */
import { UpdateBusinessForm } from '@/features/onboarding/update-business/ui/UpdateBusinessForm';
import { Card, PageHeader } from '@/shared/ui/primitives';

export default function Settings() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        title="Ayarlar"
        description="Biznesin adı, əlaqə nömrəsi və peşəsi. Müştəri sizi tətbiqdə bu məlumatlarla görür."
      />

      <Card className="max-w-xl">
        <UpdateBusinessForm />
      </Card>
    </div>
  );
}
