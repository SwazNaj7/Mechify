import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { HomeContent } from '@/components/home/home-content';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect authenticated users to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return <HomeContent />;
}
