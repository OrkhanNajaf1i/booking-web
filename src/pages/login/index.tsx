import { Link } from 'react-router-dom';

import { LoginForm } from '@/features/auth/login/ui/LoginForm';
import { AuthShell } from '@/shared/ui/AuthShell';
import { paths } from '@/app/router/lib/paths';

export default function LoginPage() {
  return (
    <AuthShell
      title="Yenidən xoş gəldiniz"
      description="Randevularınıza baxmaq üçün hesabınıza daxil olun."
      footer={
        <>
          Hesabınız yoxdur?{' '}
          <Link
            to={paths.register()}
            className="font-medium text-brand-700 hover:text-brand-800 hover:underline"
          >
            Qeydiyyatdan keçin
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
