'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLogin, useRegister } from '@/entities/auth';
import { useAuthStore } from '@/entities/auth';
import { IAuthDto, IRegisterDto } from '@/entities/auth/model/types';
import styles from './auth-form.module.scss';

interface AuthFormProps {
  mode: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IRegisterDto>({
    mode: 'onBlur',
  });

  const loginMutation = useLogin({
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push('/profile');
    },
    onError: (error) => {
      setError(error.message || 'Ошибка входа');
    },
  });

  const registerMutation = useRegister({
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push('/profile');
    },
    onError: (error) => {
      setError(error.message || 'Ошибка регистрации');
    },
  });

  const onSubmit = async (data: IRegisterDto) => {
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await loginMutation.mutateAsync({ email: data.email, password: data.password });
      } else {
        await registerMutation.mutateAsync(data);
      }
    } catch (err) {
      // Ошибка уже обработана в onError
    } finally {
      setIsLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>
          {isLogin ? 'Вход в аккаунт' : 'Создать аккаунт'}
        </h1>
        <p className={styles.subtitle}>
          {isLogin 
            ? 'Войдите в свой аккаунт для доступа к проектам'
            : 'Создайте аккаунт для начала работы с проектами'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {!isLogin && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Имя</label>
            <input
              type="text"
              className={`${styles.input} ${errors.name ? styles.error : ''}`}
              placeholder="Введите ваше имя"
              {...register('name', {
                required: 'Имя обязательно',
                minLength: {
                  value: 2,
                  message: 'Имя должно содержать минимум 2 символа',
                },
              })}
            />
            {errors.name && (
              <span className={styles.errorMessage}>{errors.name.message}</span>
            )}
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={`${styles.input} ${errors.email ? styles.error : ''}`}
            placeholder="Введите ваш email"
            {...register('email', {
              required: 'Email обязателен',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Неверный формат email',
              },
            })}
          />
          {errors.email && (
            <span className={styles.errorMessage}>{errors.email.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Пароль</label>
          <input
            type="password"
            className={`${styles.input} ${errors.password ? styles.error : ''}`}
            placeholder="Введите пароль"
            {...register('password', {
              required: 'Пароль обязателен',
              minLength: {
                value: 6,
                message: 'Пароль должен содержать минимум 6 символов',
              },
            })}
          />
          {errors.password && (
            <span className={styles.errorMessage}>{errors.password.message}</span>
          )}
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className={styles.loading}>
              <span className={styles.spinner} />
              {isLogin ? 'Вход...' : 'Регистрация...'}
            </span>
          ) : (
            isLogin ? 'Войти' : 'Создать аккаунт'
          )}
        </button>
      </form>

      <div className={styles.divider}>
        <span className={styles.dividerText}>или</span>
      </div>

      <div className={styles.textCenter}>
        {isLogin ? (
          <p>
            Нет аккаунта?{' '}
            <Link href="/auth/register" className={styles.link}>
              Зарегистрироваться
            </Link>
          </p>
        ) : (
          <p>
            Уже есть аккаунт?{' '}
            <Link href="/auth/login" className={styles.link}>
              Войти
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;