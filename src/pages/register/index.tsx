import { RegisterForm } from '@/features/auth/register/ui/RegisterForm';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Başlıq və ya Logo */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Booking Platform
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hesabınız var?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80">
              Giriş edin
            </Link>
          </p>
        </div>

        {/* Feature Component */}
        <RegisterForm />
      </div>
    </div>
  );
}
