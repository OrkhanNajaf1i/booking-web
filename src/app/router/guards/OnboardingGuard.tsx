import { useBusinessQuery } from '@/entities/business';
import { Navigate, Outlet } from 'react-router-dom';

export const OnboardingGuard = () => {
  const token = localStorage.getItem('accessToken');
  const { data: business } = useBusinessQuery()
  
  if (!token) return <Navigate to="/login" replace />;
  if (business?.id) {
    return <Navigate to={`/business/${business?.id}/dashboard`} replace />;
  }

  return <Outlet />;
};
