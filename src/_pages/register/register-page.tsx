'use client';

import { useAuthStore } from '@/entities/auth';
import { useRegister } from '@/entities/auth/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, FormProvider, useForm } from 'react-hook-form';

interface RegisterForm {
  email: string;
  password: string;
  name?: string;
}

const defaultRegisterFormState: RegisterForm = {
  email: '',
  password: '',
};

export default function RegisterPage() {
  const formMethods = useForm<RegisterForm>({
    defaultValues: defaultRegisterFormState,
    mode: 'onChange',
  });

  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const { mutate } = useRegister({
    onSuccess: (data) => {
      setAuth(data.token);
      router.push('/profile');
    },
  });

  const onSubmit = (data: RegisterForm) => mutate(data);

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

        <Controller
          name="name"
          render={({ field }) => {
            return <input type="text" placeholder="Your name" {...field} />;
          }}
        />

        <button type="submit" disabled={!formMethods.formState.isValid}>
          Зарегистрироваться
        </button>
      </form>
    </FormProvider>
  );
}
