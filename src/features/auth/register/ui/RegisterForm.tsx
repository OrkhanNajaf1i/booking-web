import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/shared/ui/primitives';
import type { RegisterDto } from '@/entities/session/model/types';

import { useRegister } from '../model/useRegister';

/** Sahə altındakı xəta mətni — hər yerdə eyni görünsün. */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-medium text-danger-700">{message}</p>;
}

export function RegisterForm() {
  const { mutate: registerUser, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>();

  return (
    <form onSubmit={handleSubmit((data) => registerUser(data))} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="full_name">Ad, soyad</Label>
        <Input
          id="full_name"
          autoComplete="name"
          placeholder="Orxan Nəcəfli"
          {...register('full_name', { required: 'Ad və soyadı yazın' })}
        />
        <FieldError message={errors.full_name?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">E-poçt</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="ad@nümunə.az"
          {...register('email', {
            required: 'E-poçt daxil edin',
            pattern: { value: /^\S+@\S+$/i, message: 'Düzgün e-poçt ünvanı yazın' },
          })}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Mobil nömrə</Label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+994 50 123 45 67"
          {...register('phone', { required: 'Nömrəni yazın' })}
        />
        <FieldError message={errors.phone?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Şifrə</Label>
        <PasswordInput
          id="password"
          placeholder="Ən azı 6 simvol"
          autoComplete="new-password"
          {...register('password', {
            required: 'Şifrə təyin edin',
            minLength: { value: 6, message: 'Şifrə ən azı 6 simvol olmalıdır' },
          })}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isPending}
        className="mt-1 w-full"
      >
        {isPending ? 'Hesab yaradılır…' : 'Hesab yarat'}
      </Button>
    </form>
  );
}
