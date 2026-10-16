import { createRemoteJWKSet, jwtVerify } from 'jose';
const keys=createRemoteJWKSet(new URL('https://token.actions.githubusercontent.com/.well-known/jwks'));
export async function workerIdentity(request:Request){
  const token=request.headers.get('authorization')?.replace(/^Bearer /,'');if(!token)throw Error('Non autorisé.');
  const {payload:p}=await jwtVerify(token,keys,{issuer:'https://token.actions.githubusercontent.com',audience:'https://okko-digital.fr/growthpilot',algorithms:['RS256']});
  if(p.repository!=='Rhegaaa/okko-digital'||String(p.repository_id)!=='1397176851'||p.ref!=='refs/heads/main'||p.workflow_ref!=='Rhegaaa/okko-digital/.github/workflows/growthpilot.yml@refs/heads/main'||!['schedule','workflow_dispatch','push'].includes(String(p.event_name)))throw Error('Identité du worker refusée.');
  if(!p.run_id||!p.run_attempt)throw Error('Identité incomplète.');return `${p.run_id}:${p.run_attempt}`;
}
