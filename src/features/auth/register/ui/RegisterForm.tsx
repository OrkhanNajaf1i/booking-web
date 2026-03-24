import { useForm } from 'react-hook-form'; 
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';


import { useRegister } from '../model/useRegister';
import type { RegisterDto } from '@/entities/session/model/types';


export function RegisterForm() {
  const { mutate: registerUser, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>();

  const onSubmit = (data: RegisterDto) => {
    registerUser(data);
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-4 max-w-md mx-auto p-6 border rounded-lg bg-white shadow-sm"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Hesab yarat</h2>

      {/* ─────────────────── Full Name Input ─────────────────── */}
      <div className="space-y-2">
        <Label htmlFor="full_name">Ad Soyad</Label>
        <Input
          id="full_name"
          placeholder="Məs: Orkhan Najafli"
          {...register('full_name', { required: 'Ad soyad daxil edilməlidir' })}
        />
        {/* Xəta varsa qırmızı mesaj göstər */}
        {errors.full_name && (
          <p className="text-red-500 text-sm font-medium">{errors.full_name.message}</p>
        )}
      </div>

      {/* ─────────────────── Email Input ─────────────────── */}
      <div className="space-y-2">
        <Label htmlFor="email">Email ünvanı</Label>
        <Input
          id="email"
          type="email"
          placeholder="mail@example.com"
          {...register('email', { 
            required: 'Email vacibdir',
            pattern: { 
              value: /^\S+@\S+$/i, 
              message: 'Düzgün email formatı daxil edin' 
            }
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm font-medium">{errors.email.message}</p>
        )}
      </div>

      {/* ─────────────────── Phone Input ─────────────────── */}
      <div className="space-y-2">
        <Label htmlFor="phone">Mobil nömrə</Label>
        <Input
          id="phone"
          placeholder="+994 50 123 45 67"
          {...register('phone', { required: 'Nömrə daxil edilməlidir' })}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm font-medium">{errors.phone.message}</p>
        )}
      </div>

      {/* ─────────────────── Password Input ─────────────────── */}
      <div className="space-y-2">
        <Label htmlFor="password">Şifrə</Label>
        <PasswordInput
          id="password"
          placeholder="••••••"
          autoComplete="new-password"
          {...register('password', { 
            required: 'Şifrə təyin edin', 
            minLength: { 
              value: 6, 
              message: 'Şifrə ən az 6 simvol olmalıdır' 
            } 
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm font-medium">{errors.password.message}</p>
        )}
      </div>

      {/* ─────────────────── Submit Button ─────────────────── */}
      <Button 
        type="submit" 
        className="w-full mt-4" 
        disabled={isPending} 
      >
        {isPending ? 'Qeydiyyatdan keçilir...' : 'Qeydiyyatı Tamamla'}
      </Button>
    </form>
  );
}
