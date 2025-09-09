import { Metadata } from 'next';
import ProfilePage from '@/pages/profile/profile-page';

export const metadata: Metadata = {
  title: 'Личный кабинет - Design Share',
  description: 'Управляйте своими проектами и настройками в личном кабинете Design Share.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Profile() {
  return <ProfilePage />;
}