import { Navigate, Outlet, useParams } from 'react-router-dom';

export const BusinessGuard = () => {
  const { businessId } = useParams();

  // Yoxlanış: Əgər URL-də businessId yoxdursa, 404-ə at
  if (!businessId) {
    return <Navigate to="/not-found" replace />;
  }

  // TODO: Gələcəkdə burada API sorğusu olacaq:
  // "Bu istifadəçinin bu biznesə girməyə icazəsi varmı?"
  
  return <Outlet />;
};
