import { DesignEditor } from '@/entities/design';

export default async function Edit({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return <DesignEditor />;
}
