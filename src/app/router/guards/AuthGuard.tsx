import { Navigate, Outlet } from 'react-router-dom';
import { RealtimeProvider } from '@/shared/lib/realtime/RealtimeProvider';

export const AuthGuard = () => {
  const isAuth = localStorage.getItem('accessToken');

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // WebSocket yalnız login olunmuş sahədə qalxır — login səhifəsində
  // token olmadan boş-boşuna qoşulmağa çalışmasın.
  return (
    <RealtimeProvider>
      <Outlet />
    </RealtimeProvider>
  );
};
