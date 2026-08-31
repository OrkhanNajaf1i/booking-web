import { Link } from 'react-router-dom';

import { RegisterForm } from '@/features/auth/register/ui/RegisterForm';
import { AuthShell } from '@/shared/ui/AuthShell';
import { paths } from '@/app/router/lib/paths';

export default function RegisterPage() {
  return (
    <AuthShell
      title="Hesab yaradın"
      description="Xidmət göstərən kimi qeydiyyatdan keçin — randevularınızı buradan idarə edəcəksiniz."
      footer={
        <>
          Hesabınız var?{' '}
          <Link
            to={paths.login()}
            className="font-medium text-brand-700 hover:text-brand-800 hover:underline"
          >
            Daxil olun
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
