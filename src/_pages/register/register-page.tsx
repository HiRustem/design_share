'use client';

import { useAuthStore } from '@/entities/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

interface RegisterForm {
  email: string;
  password: string;
  name?: string;
}

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Registration failed');
      return res.json();
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push('/profile');
    },
  });

  const onSubmit = (data: RegisterForm) => registerMutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} type="text" placeholder="Your name" />
      <input {...register('email')} type="email" placeholder="Email" required />
      <input {...register('password')} type="password" placeholder="Password" required />
      <button type="submit" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? 'Loading...' : 'Register'}
      </button>
      {registerMutation.isError && (
        <p style={{ color: 'red' }}>Error: {(registerMutation.error as Error).message}</p>
      )}
    </form>
  );
}
