import { Metadata } from 'next';
import AuthPage from '@/pages/auth/auth-page';

export const metadata: Metadata = {
  title: 'Вход в аккаунт - Design Share',
  description: 'Войдите в свой аккаунт Design Share для доступа к проектам и настройкам.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}