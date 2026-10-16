import { prisma } from '@/lib/db';
export async function publishedGrowth(){return prisma.growthArticle.findMany({where:{status:{in:['PUBLISHED','VERIFYING']},publishedAt:{not:null}},select:{slug:true,title:true,description:true,publishedAt:true,updatedAt:true},orderBy:{publishedAt:'desc'},take:200});}
export async function growthBySlug(slug:string){return prisma.growthArticle.findFirst({where:{slug,status:{in:['PUBLISHED','VERIFYING']},publishedAt:{not:null}},include:{opportunity:{select:{commercialPath:true}}}});}
