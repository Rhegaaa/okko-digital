import assert from 'node:assert/strict';
import { encryptCredential,decryptCredential } from '../lib/growthpilot/credential';
import { inferGemini,parseGeminiResponse,parseGeminiReviewResponse,inferenceHash,GEMINI_MODEL,GEMINI_REVIEW_MODEL } from '../lib/growthpilot/gemini';
import { GROWTH_RELEASE } from '../lib/growthpilot/content';
import { prisma } from '../lib/db';

async function main(){
  const secret='fixture-only-not-a-real-provider-key';const envelope=encryptCredential(secret);
  assert(!envelope.includes(secret));assert.equal(decryptCredential(envelope),secret);
  assert.notEqual(envelope,encryptCredential(secret));const tampered=JSON.parse(envelope);tampered.tag=Buffer.alloc(16).toString('base64');assert.throws(()=>decryptCredential(JSON.stringify(tampered)));
  const response={model:GEMINI_MODEL,status:'completed',steps:[{type:'model_output',content:[{type:'text',text:'{"ok":true}'}]}],usage:{total_input_tokens:100,total_output_tokens:30,total_thought_tokens:10}};
  assert.deepEqual(parseGeminiResponse(response),{content:{ok:true},usage:{prompt_tokens:100,completion_tokens:40}});
  assert.throws(()=>parseGeminiResponse({...response,status:'requires_action'}));assert.throws(()=>parseGeminiResponse({...response,model:'unexpected-model'}));
  const reviewFixture={modelVersion:GEMINI_REVIEW_MODEL,candidates:[{finishReason:'STOP',content:{parts:[{text:'{"approved":true,"unsupportedClaims":[],"reason":"Supported by supplied facts."}'}]}}],usageMetadata:{promptTokenCount:90,candidatesTokenCount:20}};
  assert.equal((parseGeminiReviewResponse(reviewFixture).content as any).approved,true);assert.throws(()=>parseGeminiReviewResponse({...reviewFixture,candidates:[{finishReason:'MAX_TOKENS'}]}));
  // In-memory replacements only: no database mutation and no actual API call.
  assert.equal(inferenceHash('writer','s',JSON.stringify({observedSearchResults:{measuredAt:'old',results:[]}})),inferenceHash('writer','s',JSON.stringify({observedSearchResults:{measuredAt:'new',results:[]}})));
  const db=prisma as any;const saved={run:db.growthRun.findUnique,state:db.growthState.findUnique,credential:db.growthCredential.findUnique,find:db.growthSnapshot.findUnique,first:db.growthSnapshot.findFirst,create:db.growthSnapshot.create,update:db.growthSnapshot.update,fetch:globalThis.fetch};
  const snapshots=new Map<string,any>();let requests=0;let status=200;let attempts=1;const sequence:number[]=[];
  try{
    db.growthRun.findUnique=async()=>({status:'RUNNING',attempts});
    db.growthState.findUnique=async()=>({enabled:true,leaseUntil:new Date(Date.now()+600000)});
    db.growthCredential.findUnique=async()=>({enabled:true,freeTierConfirmedAt:new Date(),encryptedKey:envelope});
    db.growthSnapshot.findUnique=async({where}:any)=>snapshots.get(where.id)||null;
    db.growthSnapshot.findFirst=async({where}:any)=>[...snapshots.values()].find(s=>s.payload.status==='COMPLETE'&&s.payload.promptHash===where.AND[0].payload.equals)||null;
    db.growthSnapshot.create=async({data}:any)=>{assert(!snapshots.has(data.id));snapshots.set(data.id,data);return data;};
    db.growthSnapshot.update=async({where,data}:any)=>{snapshots.set(where.id,{...snapshots.get(where.id),...data});return snapshots.get(where.id);};
    globalThis.fetch=async(url,options)=>{requests++;const review=String(url).endsWith('/models/'+GEMINI_REVIEW_MODEL+':generateContent');assert.equal(url,review?'https://generativelanguage.googleapis.com/v1beta/models/'+GEMINI_REVIEW_MODEL+':generateContent':'https://generativelanguage.googleapis.com/v1beta/interactions');assert.equal((options?.headers as any)['x-goog-api-key'],secret);const body=JSON.parse(options?.body as string);if(review)assert.equal(body.generationConfig.responseMimeType,'application/json');else{assert.equal(body.model,GEMINI_MODEL);assert.equal(body.store,false);}assert(!('tools' in body));return new Response(JSON.stringify(review?reviewFixture:response),{status:sequence.shift()??status});};
    const runId='TEST:'+GROWTH_RELEASE;
    const first=await inferGemini(runId,'writer','system fixture','public brief fixture');assert.equal(requests,1);
    assert.deepEqual(await inferGemini(runId,'writer','system fixture','public brief fixture'),first);assert.equal(requests,1,'Cached phase must not call Gemini twice.');
    status=429;await assert.rejects(()=>inferGemini(runId,'review','system fixture','public brief fixture'),/Quota gratuit/);assert.equal(requests,2);
    await assert.rejects(()=>inferGemini(runId,'review','system fixture','public brief fixture'),/déjà été tentée/);assert.equal(requests,2,'Quota failure must not trigger a paid fallback or silent retry.');
    db.growthCredential.findUnique=async()=>null;await assert.rejects(()=>inferGemini(runId,'repair','system fixture','public brief fixture'),/Connecter un projet/);assert.equal(requests,2);
    db.growthCredential.findUnique=async()=>({enabled:true,freeTierConfirmedAt:new Date(),encryptedKey:envelope});status=200;sequence.push(503,200);
    await inferGemini(runId,'repair','system fixture','public brief fixture');assert.equal(requests,4,'Only a confirmed transient 503 may trigger one bounded retry.');
    attempts=2;const reused=await inferGemini(runId,'writer','system fixture','public brief fixture');assert.equal(requests,4);assert.deepEqual(reused,{content:{ok:true},usage:{prompt_tokens:0,completion_tokens:0}});
    await assert.rejects(()=>inferGemini(runId,'writer','system fixture','different public brief fixture'),/autre brief/);assert.equal(requests,4);
    const reviewed=await inferGemini(runId,'reviewRepair','system fixture','public brief fixture');assert.equal((reviewed as any).content.approved,true);assert.equal(requests,5);
  }finally{
    db.growthRun.findUnique=saved.run;db.growthState.findUnique=saved.state;db.growthCredential.findUnique=saved.credential;db.growthSnapshot.findUnique=saved.find;db.growthSnapshot.findFirst=saved.first;db.growthSnapshot.create=saved.create;db.growthSnapshot.update=saved.update;globalThis.fetch=saved.fetch;
  }
  console.log('Gemini credential encryption/tamper, response parsing, idempotence, free-quota stop and missing-key checks passed. No live API request.');
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>prisma.$disconnect());
