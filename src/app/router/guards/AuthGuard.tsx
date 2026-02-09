import { Navigate, Outlet } from 'react-router-dom';

export const AuthGuard = () => {
  // TODO: Burada gələcəkdə real token yoxlanışı olacaq
  // Məsələn: const isAuth = Boolean(localStorage.getItem('token'));
  
  const isAuth = true; // Hələlik hər kəsi "login olmuş" sayırıq

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
