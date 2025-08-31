'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
// import { Document, Page } from 'react-pdf';

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

  return (
    <div>
      {/* {design && (
        <Document file={design.url}>
          <Page pageNumber={1} />
        </Document>
      )} */}
      Design
    </div>
  );
}
