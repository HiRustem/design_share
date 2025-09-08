'use client';
import { DesignEditor } from '@/entities/design';

export default function ViewPage({ params }: { params: Promise<{ slug: string }> }) {
  // const { id } = useParams();

  // const { data: design } = useQuery({
  //   queryKey: ['design', id],
  //   queryFn: async () => {
  //     const res = await fetch(`/api/design/${id}`);
  //     if (!res.ok) throw new Error('Not found');
  //     return res.json();
  //   },
  // });

  return <DesignEditor />;
}
