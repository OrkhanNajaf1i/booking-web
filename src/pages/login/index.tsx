// import moduleName from '@/features/auth/login/ui/';
import { LoginForm } from '@/features/auth/login/ui/LoginForm';
import { Link } from 'react-router-dom';

export default function LoginPage() {
    return  <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">Xoş gəldiniz</h2>
          <p className="mt-2 text-sm text-gray-600">
            Hesabınız yoxdur?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Qeydiyyatdan keçin
            </Link>
          </p>
        </div>

        {/* Form */}
        <LoginForm/>
        
      </div>
    </div>
}