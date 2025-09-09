'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/entities/auth';
import { useUpdateProfile } from '@/entities/user';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import styles from './settings-page.module.scss';

interface UpdateProfileForm {
  name: string;
  email: string;
}

const SettingsPage: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const updateProfileMutation = useUpdateProfile({
    onSuccess: (updatedUser) => {
      setSuccessMessage('Профиль успешно обновлен');
      setErrorMessage(null);
      reset({ name: updatedUser.name, email: updatedUser.email });
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Ошибка обновления профиля');
      setSuccessMessage(null);
    },
  });

  const onSubmit = async (data: UpdateProfileForm) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    
    await updateProfileMutation.mutateAsync(data);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Здесь должен быть вызов API для удаления аккаунта
      // await userService.deleteAccount();
      
      // Пока что просто выходим из аккаунта
      logout();
      router.push('/');
    } catch (error) {
      setErrorMessage('Ошибка удаления аккаунта');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Пользователь не авторизован
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/profile" className={styles.logo}>
            Design Share
          </Link>
          <Link href="/profile" className={styles.backButton}>
            ← Вернуться к профилю
          </Link>
        </div>
      </header>

      <main className={styles.content}>
        <h1 className={styles.title}>Настройки</h1>

        {successMessage && (
          <div className={styles.success}>
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className={styles.error}>
            {errorMessage}
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Профиль</h2>
            <p className={styles.sectionDescription}>
              Обновите информацию о вашем профиле
            </p>
          </div>
          
          <div className={styles.sectionContent}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Имя</label>
                <input
                  type="text"
                  className={`${styles.input} ${errors.name ? styles.error : ''}`}
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

              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  className={`${styles.input} ${errors.email ? styles.error : ''}`}
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

              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={() => reset()}
                  className={styles.cancelButton}
                  disabled={!isDirty}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={!isDirty || updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <span className={styles.loading}>
                      <span className={styles.spinner} />
                      Сохранение...
                    </span>
                  ) : (
                    'Сохранить'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className={`${styles.section} ${styles.dangerZone}`}>
          <div className={`${styles.sectionHeader} ${styles.dangerZoneHeader}`}>
            <h2 className={`${styles.sectionTitle} ${styles.dangerZoneTitle}`}>
              Опасная зона
            </h2>
            <p className={`${styles.sectionDescription} ${styles.dangerZoneDescription}`}>
              Необратимые действия с вашим аккаунтом
            </p>
          </div>
          
          <div className={styles.sectionContent}>
            <div className={styles.formGroup}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#991b1b' }}>
                Удалить аккаунт
              </h3>
              <p style={{ margin: '0 0 1rem 0', color: '#b91c1c' }}>
                Это действие необратимо. Все ваши проекты и данные будут удалены навсегда.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className={styles.deleteButton}
              >
                Удалить аккаунт
              </button>
            </div>
          </div>
        </div>
      </main>

      <Modal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Удаление аккаунта"
        size="md"
      >
        <div>
          <p style={{ marginBottom: '1rem' }}>
            Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.
          </p>
          <p style={{ marginBottom: '2rem', color: '#64748b' }}>
            Все ваши проекты, настройки и данные будут удалены навсегда.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowDeleteModal(false)}
              className={styles.cancelButton}
              disabled={isDeleting}
            >
              Отмена
            </button>
            <button
              onClick={handleDeleteAccount}
              className={styles.deleteButton}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className={styles.loading}>
                  <span className={styles.spinner} />
                  Удаление...
                </span>
              ) : (
                'Удалить аккаунт'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;