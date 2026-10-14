import { redirect, notFound } from 'next/navigation';
import { auth } from '@/auth';
import { GmbWorkboard } from '@/components/admin/gmb-workboard';
import { getWorkData } from '@/lib/gmb-work-data';
export const dynamic='force-dynamic';
export default async function ProfilePage({params}:{params:Promise<{id:string}>}) {
  const session=await auth(); if(!session?.user?.id||session.user.role!=='admin')redirect('/control/connexion');
  const {id}=await params;const data=await getWorkData(id);if(!data.profiles.some(p=>p.id===id))notFound();
  return <GmbWorkboard {...data} selectedId={id} />;
}
