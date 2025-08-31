'use client';
import { useAuthStore } from '@/entities/auth';
import { useQuery } from '@tanstack/react-query';

export default function ProfilePage() {
  const token = useAuthStore((state) => state.token);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await fetch('/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Fetch failed');
      return res.json();
    },
    enabled: !!token,
  });

  return (
    <div>
      <h1>Profile</h1>
      <ul>
        {profile?.designs.map((d: any) => (
          <li key={d.id}>{d.uniqueLink}</li>
        ))}
      </ul>
    </div>
  );
}
