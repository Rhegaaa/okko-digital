import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { GmbWorkboard } from '@/components/admin/gmb-workboard';
import { getWorkData } from '@/lib/gmb-work-data';
export const dynamic = 'force-dynamic';
export default async function ControlHome() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'admin') redirect('/control/connexion');
  return <GmbWorkboard {...await getWorkData()} />;
}
