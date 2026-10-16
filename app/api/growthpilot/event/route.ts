import { NextResponse } from 'next/server';
import { cleanPath,limitPublic,recordMetric,sameOrigin } from '@/lib/growthpilot/metrics';
export async function POST(req:Request){
  if(!sameOrigin(req))return new NextResponse(null,{status:403});
  const body=await req.json().catch(()=>null);if(body?.event!=='CTA'||typeof body.path!=='string')return new NextResponse(null,{status:400});
  if(!(await limitPublic(req,'event',15)))return new NextResponse(null,{status:429});await recordMetric('CTA',cleanPath(body.path));return new NextResponse(null,{status:204});
}
