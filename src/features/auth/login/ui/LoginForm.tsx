// features/auth/login/ui/LoginForm.tsx
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';

import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/shared/ui/primitives';
import { paths } from '@/app/router/lib/paths';
import type { LoginDto } from '@/entities/session/model/types';

import { useLogin } from '../model/useLogin';

// Xəta mətnləri istifadəçiyə görünür — interfeysin qalanı kimi
// Azərbaycan dilində olmalıdır.
const loginSchema = z.object({
  email: z.string().min(1, 'E-poçt daxil edin').email('Düzgün e-poçt ünvanı yazın'),
  password: z.string().min(6, 'Şifrə ən azı 6 simvol olmalıdır'),
});

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => login(values))} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-poçt</FormLabel>
              <FormControl>
                <Input
                  placeholder="ad@nümunə.az"
                  type="email"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Şifrə</FormLabel>
                <Link
                  to={paths.forgotPassword() ?? '#'}
                  className="text-xs text-slate-500 transition-colors hover:text-brand-700"
                >
                  Şifrəni unutmusunuz?
                </Link>
              </div>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isPending}
          className="w-full"
        >
          {isPending ? 'Daxil olunur…' : 'Daxil ol'}
        </Button>
      </form>
    </Form>
  );
}
