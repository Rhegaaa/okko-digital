import { Prisma } from '@prisma/client';
import { createHash } from 'node:crypto';
import { prisma } from '@/lib/db';
import { decryptCredential } from './credential';
import { GROWTH_RELEASE } from './content';
import schemas from './model-schema.json';

export const GEMINI_MODEL='gemini-3.6-flash';
export const GEMINI_REVIEW_MODEL='gemini-3.5-flash-lite';
const endpoint='https://generativelanguage.googleapis.com/v1beta';
export type InferencePhase='writer'|'review'|'repair'|'reviewRepair';
export function inferenceHash(phase:InferencePhase,system:string,user:string){
  let normalized=user;try{const data=JSON.parse(user);if(data.observedSearchResults)delete data.observedSearchResults.measuredAt;normalized=JSON.stringify(data);}catch{}
  const version=phase==='review'||phase==='reviewRepair'?phase+':'+GEMINI_REVIEW_MODEL:phase;
  return createHash('sha256').update(GROWTH_RELEASE+'\0'+version+'\0'+system+'\0'+normalized).digest('hex');
}
export async function geminiStatus(){
  const row=await prisma.growthCredential.findUnique({where:{id:'gemini'},select:{enabled:true,freeTierConfirmedAt:true}});
  return {connected:!!row?.enabled,freeTierConfirmedAt:row?.freeTierConfirmedAt?.toISOString()||null,model:GEMINI_MODEL,reviewerModel:GEMINI_REVIEW_MODEL,release:GROWTH_RELEASE};
}
export async function validateGeminiKey(apiKey:string){
  let response:Response;
  try{response=await fetch(`${endpoint}/models/${GEMINI_MODEL}`,{headers:{'x-goog-api-key':apiKey},cache:'no-store',redirect:'error',signal:AbortSignal.timeout(15000)});}catch{throw Error('Google ne répond pas. La clé n’a pas été enregistrée.');}
  if(!response.ok)throw Error(response.status===429?'Quota Google indisponible. Réessayer plus tard, sans activer la facturation.':`Clé ou modèle non accessible chez Google (HTTP ${response.status}).`);
  const model=await response.json();if(model.name!==`models/${GEMINI_MODEL}`)throw Error('Le modèle attendu n’est pas disponible.');
}
export function parseGeminiResponse(raw:unknown){
  const data=raw as {status?:string;model?:string;steps?:{type:string;content?:{type:string;text?:string}[]}[];usage?:{total_input_tokens?:number;total_output_tokens?:number;total_thought_tokens?:number}};
  if(data.status!=='completed'||data.model!==GEMINI_MODEL)throw Error('Réponse Gemini incomplète ou modèle inattendu.');
  const text=(data.steps||[]).filter(s=>s.type==='model_output').flatMap(s=>s.content||[]).filter(p=>p.type==='text').map(p=>p.text||'').join('');
  if(!text||text.length>100000)throw Error('Texte Gemini absent ou trop volumineux.');
  let parsed:unknown;try{parsed=JSON.parse(text);}catch{throw Error('Gemini n’a pas produit un document JSON valide.');}
  return {content:parsed,usage:{prompt_tokens:data.usage?.total_input_tokens||0,completion_tokens:(data.usage?.total_output_tokens||0)+(data.usage?.total_thought_tokens||0)}};
}
export function parseGeminiReviewResponse(raw:unknown){
  const data=raw as {modelVersion?:string;candidates?:{finishReason?:string;content?:{parts?:{text?:string;thought?:boolean}[]}}[];usageMetadata?:{promptTokenCount?:number;candidatesTokenCount?:number;thoughtsTokenCount?:number}};
  if(data.modelVersion&&!data.modelVersion.startsWith(GEMINI_REVIEW_MODEL))throw Error('Réponse Gemini de relecture : modèle inattendu.');
  const candidate=data.candidates?.[0];if(candidate?.finishReason!=='STOP')throw Error('Réponse Gemini de relecture incomplète.');
  const text=(candidate.content?.parts||[]).filter(p=>p.text&&!p.thought).map(p=>p.text).join('');if(!text||text.length>20000)throw Error('Texte Gemini de relecture absent ou trop long.');
  let content:unknown;try{content=JSON.parse(text);}catch{throw Error('Gemini n’a pas produit une relecture JSON valide.');}
  return {content,usage:{prompt_tokens:data.usageMetadata?.promptTokenCount||0,completion_tokens:(data.usageMetadata?.candidatesTokenCount||0)+(data.usageMetadata?.thoughtsTokenCount||0)}};
}
export async function inferGemini(runId:string,phase:InferencePhase,system:string,user:string){
  const run=await prisma.growthRun.findUnique({where:{id:runId}});if(run?.status!=='RUNNING'||!runId.endsWith(':'+GROWTH_RELEASE))throw Error('Cycle Gemini non actif.');
  const credential=await prisma.growthCredential.findUnique({where:{id:'gemini'}});if(!credential?.enabled||!credential.freeTierConfirmedAt)throw Error('Connecter un projet Gemini Free Tier sans facturation.');
  // Each phase is reserved once per attempt. A lost HTTP response can return
  // its saved result, but never silently trigger a second provider request.
  const callId=`gemini:${runId}:${run.attempts}:${phase}`;
  const isReview=phase==='review'||phase==='reviewRepair',model=isReview?GEMINI_REVIEW_MODEL:GEMINI_MODEL;
  const promptHash=inferenceHash(phase,system,user);
  const previous=await prisma.growthSnapshot.findUnique({where:{id:callId}});
  if(previous){const payload=previous.payload as {status?:string;promptHash?:string;result?:unknown};if(payload.promptHash&&payload.promptHash!==promptHash)throw Error('Cette génération a déjà été tentée avec un autre brief.');if(payload.status==='COMPLETE'&&payload.result)return payload.result;throw Error('Cette génération a déjà été tentée. Reprise au prochain cycle, sans requête en double.');}
  const reusable=await prisma.growthSnapshot.findFirst({where:{id:{startsWith:`gemini:${runId}:`},source:'GEMINI_FREE_INFERENCE',AND:[{payload:{path:['promptHash'],equals:promptHash}},{payload:{path:['status'],equals:'COMPLETE'}}]},orderBy:{updatedAt:'desc'}});
  if(reusable){const stored=reusable.payload as {result:{content:Prisma.InputJsonValue}};const result={content:stored.result.content,usage:{prompt_tokens:0,completion_tokens:0}};await prisma.growthSnapshot.create({data:{id:callId,source:'GEMINI_FREE_INFERENCE',payload:{status:'COMPLETE',model,promptHash,reusedFrom:reusable.id,result}}});return result;}
  await prisma.growthSnapshot.create({data:{id:callId,source:'GEMINI_FREE_INFERENCE',payload:{status:'RUNNING',model,promptHash}}});
  try{
    const apiKey=decryptCredential(credential.encryptedKey);
    const body=isReview?{
      systemInstruction:{parts:[{text:system}]},contents:[{parts:[{text:user}]}],
      generationConfig:{temperature:1,maxOutputTokens:2400,thinkingConfig:{thinkingLevel:'low'},responseMimeType:'application/json',responseJsonSchema:schemas.critic},
    }:{
      model:GEMINI_MODEL,system_instruction:system,input:user,store:false,
      generation_config:{temperature:1,thinking_level:'low',max_output_tokens:phase==='writer'||phase==='repair'?8192:2400},
      response_format:{type:'text',mime_type:'application/json',schema:phase==='writer'||phase==='repair'?schemas.article:schemas.critic},
    };
    const url=isReview?endpoint+'/models/'+model+':generateContent':endpoint+'/interactions';
    const options={method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':apiKey},redirect:'error' as const,cache:'no-store' as const,body:JSON.stringify(body)};
    let response:Response|undefined;
    for(let attempt=0;attempt<2;attempt++){
      response=await fetch(url,{...options,signal:AbortSignal.timeout(50000)});
      if(attempt===0&&[502,503,504].includes(response.status)){
        await response.body?.cancel();await new Promise(resolve=>setTimeout(resolve,3000));
        const state=await prisma.growthState.findUnique({where:{id:'okko'}});if(!state?.enabled||!state.leaseUntil||state.leaseUntil<new Date())throw Error('Automatisation arrêtée avant la reprise.');continue;
      }
      break;
    }
    if(!response)throw Error('Gemini indisponible.');
    if(!response.ok)throw Error(response.status===429?'Quota gratuit Gemini épuisé : génération arrêtée, aucun repli payant.':`Gemini indisponible (HTTP ${response.status}) : aucun repli payant.`);
    const raw=await response.json();const result=isReview?parseGeminiReviewResponse(raw):parseGeminiResponse(raw);
    await prisma.growthSnapshot.update({where:{id:callId},data:{payload:{status:'COMPLETE',model,promptHash,result:result as Prisma.InputJsonObject}}});return result;
  }catch(error){
    const message=error instanceof Error&&/^(Quota gratuit|Gemini indisponible|Réponse Gemini|Texte Gemini|Gemini n’a)/.test(error.message)?error.message:'Génération interrompue ou délai dépassé : aucun contenu publié.';
    await prisma.growthSnapshot.update({where:{id:callId},data:{payload:{status:'FAILED',model,promptHash,error:message}}});throw Error(message);
  }
}
