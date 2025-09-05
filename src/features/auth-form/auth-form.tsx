'use client';

import { useAuthStore, useLogin, useRegister } from '@/entities/auth';
import { useRouter } from 'next/navigation';
import { Controller, FormProvider, useForm } from 'react-hook-form';

interface IAuthForm {
  type: TAuthFormType;
}

type TAuthFormType = 'login' | 'register';

interface IAuthFormState {
  email: string;
  password: string;
  name?: string;
}

const defaultRegisterFormState: IAuthFormState = {
  email: '',
  password: '',
  name: '',
};

const AuthForm = ({ type }: IAuthForm) => {
  const isLogin = type === 'login';

  const formMethods = useForm<IAuthFormState>({
    defaultValues: defaultRegisterFormState,
    mode: 'onChange',
  });

  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const { mutate: login } = useLogin({
    onSuccess: (data) => {
      setAuth(data.token);
      router.push('/profile');
    },
  });

  const { mutate: register } = useRegister({
    onSuccess: (data) => {
      setAuth(data.token);
      router.push('/profile');
    },
  });

  const onSubmit = (data: IAuthFormState) => {
    if (isLogin) {
      return login({ email: data.email, password: data.password });
    }

    register(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Controller
          name='email'
          render={({ field }) => {
            return <input type='text' placeholder='Your email' {...field} />;
          }}
        />

        <Controller
          name='password'
          render={({ field }) => {
            return <input type='text' placeholder='Your password' {...field} />;
          }}
        />

        {!isLogin && (
          <Controller
            name='name'
            render={({ field }) => {
              return <input type='text' placeholder='Your name' {...field} />;
            }}
          />
        )}

        <button type='submit' disabled={!formMethods.formState.isValid}>
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
    </FormProvider>
  );
};

export default AuthForm;
