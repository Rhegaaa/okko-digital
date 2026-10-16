import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { ensureGrowth } from '@/lib/growthpilot/engine';
import { toPlain } from '@/lib/serialize';
import { GrowthDashboard } from '@/components/admin/growthpilot-dashboard';
export const dynamic='force-dynamic';
export default async function GrowthPage(){const session=await auth();if(!session?.user?.id||session.user.role!=='admin')redirect('/control/connexion');await ensureGrowth();const [state,articles,opportunities,backlinks,runs,metrics,snapshot]=await Promise.all([prisma.growthState.findUniqueOrThrow({where:{id:'okko'}}),prisma.growthArticle.findMany({orderBy:{createdAt:'desc'},take:100}),prisma.growthOpportunity.findMany({orderBy:[{priority:'desc'},{createdAt:'asc'}],take:100}),prisma.growthBacklink.findMany({orderBy:{createdAt:'desc'},take:100}),prisma.growthRun.findMany({orderBy:{startedAt:'desc'},take:30}),prisma.growthMetric.findMany({where:{day:{gte:new Date(Date.now()-30*86400000).toISOString().slice(0,10)}}}),prisma.growthSnapshot.findUnique({where:{id:'gsc'}})]);return <GrowthDashboard {...toPlain({state,articles,opportunities,backlinks,runs,metrics,snapshot})}/>;}
