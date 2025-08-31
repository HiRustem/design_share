export default async function Edit({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  console.log('slug', slug);

  return <div>Edit {slug}</div>;
}
