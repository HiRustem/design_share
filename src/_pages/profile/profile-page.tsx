'use client';

import { useAuthStore } from '@/entities/auth';
import { useGetProfile } from '@/entities/user';

export default function ProfilePage() {
  const token = useAuthStore((state) => state.token);

  const { data, isLoading } = useGetProfile({
    token,
    options: {
      enabled: !!token,
    },
  });

  if (isLoading) return <>Loading</>;

  if (!data && !isLoading) return <>No data</>;

  return <>Profile</>;
}
