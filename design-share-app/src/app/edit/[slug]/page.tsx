import { Metadata } from 'next';
import EditPage from '@/pages/edit/edit-page';

interface EditPageProps {
  params: {
    slug: string;
  };
}

export const metadata: Metadata = {
  title: 'Редактор PDF - Design Share',
  description: 'Редактируйте PDF файлы и добавляйте водяные знаки.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Edit({ params }: EditPageProps) {
  return <EditPage slug={params.slug} />;
}