import { MainLayoutSkeleton } from '@/app/layouts/MainLayout/MainLayoutSkeleton';
import { useBusinessQuery } from '@/entities/business';
import { Navigate, Outlet, useParams } from 'react-router-dom';

export const BusinessGuard = () => {
  const { businessId } = useParams();
  const { data: business, isLoading, error:isError } = useBusinessQuery();

  if (isLoading) return <MainLayoutSkeleton />;

  if (isError) return <Navigate to="/login" replace />;
  if (!businessId) return <Navigate to="/not-found" replace />;
  if (!business?.id) return <Navigate to="/onboarding" replace />;
  if (business?.id !== businessId) {
    return <Navigate to={`/business/${business?.id}/dashboard`} replace />;
  }

  return <Outlet />;
};

