import { Navigate } from 'react-router-dom';
import { paths } from '@/app/router/lib/paths';

export const RootRedirect = () => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return <Navigate to={paths.login()} replace />;
  }

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user || !user.business_id) {
    return <Navigate to={paths.onboarding()} replace />;
  }

  return <Navigate to={paths.dashboard(user.business_id)} replace />;
};
