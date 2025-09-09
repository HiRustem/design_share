import { Metadata } from 'next';
import LandingPage from '@/pages/landing/landing-page';

export const metadata: Metadata = {
  title: 'Design Share - Безопасный обмен дизайн-проектами',
  description: 'Платформа для дизайнеров для безопасного обмена проектами с заказчиками. Добавляйте водяные знаки, создавайте временные ссылки для просмотра.',
  keywords: 'дизайн, проекты, водяные знаки, PDF, безопасность, заказчики',
  openGraph: {
    title: 'Design Share - Безопасный обмен дизайн-проектами',
    description: 'Платформа для дизайнеров для безопасного обмена проектами с заказчиками',
    type: 'website',
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design Share - Безопасный обмен дизайн-проектами',
    description: 'Платформа для дизайнеров для безопасного обмена проектами с заказчиками',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return <LandingPage />;
}