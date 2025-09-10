'use client';

import React from 'react';
import Link from 'next/link';
import { AuthForm } from '@/features/auth-form';
import styles from './auth-page.module.scss';

interface AuthPageProps {
  mode: 'login' | 'register';
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoText}>
            Design Share
          </Link>
        </div>
        
        <Link href="/" className={styles.backLink}>
          ← Вернуться на главную
        </Link>
        
        <AuthForm mode={mode} />
      </div>
    </div>
  );
};

export default AuthPage;