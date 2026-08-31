import { useCreateSoloBusiness } from '../model/useCreateBusiness';
import type { SoloBusinessDto } from '@/entities/business/model/types';
import { BusinessWizard } from '@/features/onboarding/shared/ui/BusinessWizard';

export function SoloBusinessForm() {
  const { mutate, isPending } = useCreateSoloBusiness();

  return (
    <BusinessWizard
      solo
      pending={isPending}
      onSubmit={(values) => {
        const dto: SoloBusinessDto = {
          name: values.name,
          phone: values.phone,
          // Peşə sabit siyahıdandır, amma istifadəçi öz sözü ilə də
          // yaza bilir. Qruplaşdırma yalnız seçilən sahəyə baxır.
          category_slug: values.profession.categorySlug,
          service_category: values.profession.customName,
          location: values.location,
        };
        mutate(dto);
      }}
    />
  );
}
