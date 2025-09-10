import { Metadata } from 'next';
import AuthPage from '@/pages/auth/auth-page';

export const metadata: Metadata = {
  title: 'Регистрация - Design Share',
  description: 'Создайте аккаунт Design Share для начала работы с проектами и водяными знаками.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return <AuthPage mode="register" />;
}