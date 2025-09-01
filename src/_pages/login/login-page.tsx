'use client';

import { useAuthStore } from '@/entities/auth';
import { useLogin } from '@/entities/auth/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, FormProvider, useForm } from 'react-hook-form';

interface LoginForm {
  email: string;
  password: string;
}

const defaultLoginFormState: LoginForm = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const formMethods = useForm<LoginForm>({
    defaultValues: defaultLoginFormState,
    mode: 'onChange',
  });

  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const { mutate } = useLogin({
    onSuccess: (data) => {
      setAuth(data.token);
      router.push('/profile');
    },
  });

  const onSubmit = (data: LoginForm) => mutate(data);

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Controller
          name="email"
          render={({ field }) => {
            return <input type="text" placeholder="Your name" {...field} />;
          }}
        />

        <Controller
          name="password"
          render={({ field }) => {
            return <input type="text" placeholder="Your name" {...field} />;
          }}
        />
        <button type="submit" disabled={!formMethods.formState.isValid}>
          Войти
        </button>
      </form>
    </FormProvider>
  );
}
