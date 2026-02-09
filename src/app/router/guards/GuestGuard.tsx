import { Navigate, Outlet } from 'react-router-dom';

export const GuestGuard = () => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (user?.business_id) {
      return <Navigate to={`/business/${user.business_id}/dashboard`} replace />;
    }
    
    return <Navigate to="/onboarding" replace />;
  }
  return <Outlet />;
};
