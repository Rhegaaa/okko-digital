import { prisma } from '@/lib/db';
import { toPlain } from '@/lib/serialize';
import type { WorkProfile, WorkAction } from '@/components/admin/gmb-workboard';
export async function getWorkData(selectedId?: string) {
  const filter = selectedId ? { profileId: selectedId } : {};
  const [profiles,pending,history]=await Promise.all([
    prisma.gmbProfile.findMany({include:{client:{select:{id:true,company:true,contactName:true,status:true,email:true,phone:true,city:true}}},orderBy:{client:{company:'asc'}}}),
    prisma.gmbAction.findMany({where:{...filter,status:{not:'TERMINE'}},orderBy:{dueDate:'asc'}}),
    prisma.gmbAction.findMany({where:{...filter,status:'TERMINE'},orderBy:{completedAt:'desc'},take:100}),
  ]);
  return {profiles:toPlain<WorkProfile[]>(profiles),actions:toPlain<WorkAction[]>([...pending,...history])};
}
