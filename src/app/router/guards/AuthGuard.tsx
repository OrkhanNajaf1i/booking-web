import { Navigate, Outlet } from 'react-router-dom';

export const AuthGuard = () => {
  const isAuth = localStorage.getItem('accessToken');

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
