export default async function Edit({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return <div>Edit {slug}</div>;
}
