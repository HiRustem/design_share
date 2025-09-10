import { Metadata } from 'next';
import ViewPage from '@/pages/view/view-page';

interface ViewPageProps {
  params: {
    slug: string;
  };
}

export const metadata: Metadata = {
  title: 'Просмотр проекта - Design Share',
  description: 'Просмотр защищенного дизайн-проекта.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function View({ params }: ViewPageProps) {
  return <ViewPage slug={params.slug} />;
}