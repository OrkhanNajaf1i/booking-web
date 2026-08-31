import { useCreateMultiBusiness } from '../model/useCreateBusiness';
import type { MultiBusinessDto } from '@/entities/business/model/types';
import { BusinessWizard } from '@/features/onboarding/shared/ui/BusinessWizard';

export function MultiBusinessForm() {
  const { mutate, isPending } = useCreateMultiBusiness();

  return (
    <BusinessWizard
      solo={false}
      pending={isPending}
      onSubmit={(values) => {
        const dto: MultiBusinessDto = {
          name: values.name,
          phone: values.phone,
          category_slug: values.profession.categorySlug,
          service_category: values.profession.customName,
          // Sənaye sahəsi artıq kateqoriyadan çıxır — ayrıca sual verilmir.
          industry: values.profession.categorySlug,
          location: values.location,
        };
        mutate(dto);
      }}
    />
  );
}
