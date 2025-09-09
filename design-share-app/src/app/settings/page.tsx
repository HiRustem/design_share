import { Metadata } from 'next';
import SettingsPage from '@/pages/settings/settings-page';

export const metadata: Metadata = {
  title: 'Настройки - Design Share',
  description: 'Управление настройками аккаунта Design Share.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Settings() {
  return <SettingsPage />;
}