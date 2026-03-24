import { Navigate } from 'react-router-dom';
import { paths } from '@/app/router/lib/paths';
import { decodeJwt } from '@/shared/lib/jwt'; 
type JwtPayload = {
  business_id?: string;
};

export const RootRedirect = () => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return <Navigate to={paths.login()} replace />;
  }

  const payload = decodeJwt<JwtPayload>(token);
  console.log("token redirect:",payload);
  
  if (!payload || !payload.business_id) {
    return <Navigate to={paths.onboarding()} replace />;
  }

  return <Navigate to={paths.dashboard(payload.business_id)} replace />;
};
