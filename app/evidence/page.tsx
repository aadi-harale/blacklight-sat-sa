import Link from 'next/link';
import { ArrowLeft, Check, CircleAlert, Fingerprint, ShieldCheck } from 'lucide-react';
import { assessDataset } from '@/lib/engine';
import { DEMO_ASSET_PROFILE, makeDemoRecords, makeWestDemoRecords, WEST_ASSET_PROFILE } from '@/lib/demo';

const pct=(n:number,d:number)=>d?`${((n/d)*100).toFixed(1)}%`:'n/a';
type Params=Promise<Record<string,string|string[]|undefined>>;

export default async function EvidencePage({searchParams}:{searchParams:Params}){
  const q=await searchParams;
  const raw=Array.isArray(q.soc)?q.soc[0]:q.soc;
  const soc=raw==='west'?'west':'north';
  const records=soc==='west'?makeWestDemoRecords():makeDemoRecords();
  const profile=soc==='west'?WEST_ASSET_PROFILE:DEMO_ASSET_PROFILE;
  const name=soc==='west'?'SOC West — healthy control':'SOC North — challenged KPI';
  const assessment=assessDataset(records,{name,source:'demo',declaredCriticalAssets:profile.declaredCriticalAssets,claimedProtectedAssets:profile.claimedProtectedAssets,loadedAt:'2026-07-31T23:59:59.000Z'});
  const unsupported=assessment.findings.filter(f=>f.verdict==='unsupported').length;
  const review=assessment.findings.filter(f=>f.verdict==='review').length;
  const supported=assessment.findings.filter(f=>f.verdict==='supported').length;

  return <main style={{minHeight:'100vh',background:'#071014',color:'#e8f1ef',padding:'28px',fontFamily:'system-ui,sans-serif'}}>
    <div style={{maxWidth:1180,margin:'0 auto'}}>
      <header style={{display:'flex',justifyContent:'space-between',gap:20,alignItems:'center',marginBottom:24}}><div><Link href="/workbench" style={{color:'#9fb4af',display:'inline-flex',gap:7,alignItems:'center',textDecoration:'none',fontSize:13}}><ArrowLeft size={15}/> Back to supervisor workbench</Link><h1 style={{fontSize:30,margin:'12px 0 4px'}}>Deterministic evidence reconstruction</h1><p style={{color:'#8fa29e',margin:0}}>The SOC selector now changes the evidence pack evaluated by the same falsification engine — not just the narrative above it.</p></div><div style={{display:'flex',gap:8}}><Link href="/evidence?soc=north" style={{padding:'10px 13px',borderRadius:8,border:'1px solid #2a4942',color:soc==='north'?'#071014':'#c9ddd8',background:soc==='north'?'#77e0c5':'transparent',textDecoration:'none',fontWeight:700}}>SOC North</Link><Link href="/evidence?soc=west" style={{padding:'10px 13px',borderRadius:8,border:'1px solid #2a4942',color:soc==='west'?'#071014':'#c9ddd8',background:soc==='west'?'#77e0c5':'transparent',textDecoration:'none',fontWeight:700}}>SOC West</Link></div></header>

      <section style={{border:'1px solid #203832',borderRadius:14,background:'#0a171b',padding:20,marginBottom:18}}><div style={{display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}><div><span style={{fontSize:11,letterSpacing:'.08em',color:'#7ce0c6'}}>ACTIVE EVIDENCE PACK</span><h2 style={{margin:'6px 0 4px',fontSize:22}}>{name}</h2><p style={{margin:0,color:'#8ca19c'}}>{assessment.dataset.recordCount.toLocaleString()} critical records · {assessment.dataset.observedAssets} observed assets · same deterministic ruleset</p></div><div style={{display:'flex',gap:10}}><Stat label="Unsupported" value={String(unsupported)} bad/><Stat label="Review" value={String(review)}/><Stat label="Supported" value={String(supported)} good/></div></div></section>

      <div style={{display:'grid',gap:12}}>{assessment.findings.map(f=><article key={f.id} style={{border:'1px solid #203832',borderRadius:12,background:'#0a1519',padding:'17px 18px',display:'grid',gridTemplateColumns:'190px minmax(0,1fr) 190px',gap:18,alignItems:'start'}}><div><span style={{fontSize:11,color:'#718984'}}>{f.id}</span><strong style={{display:'block',marginTop:5,fontSize:15}}>{f.shortLabel}</strong><span style={{display:'inline-flex',alignItems:'center',gap:5,marginTop:10,fontSize:11,fontWeight:800,color:f.verdict==='supported'?'#79dfbd':f.verdict==='unsupported'?'#ef8e84':'#e2bd69'}}>{f.verdict==='supported'?<Check size={13}/>:<CircleAlert size={13}/>} {f.verdict.toUpperCase()}</span></div><div><strong style={{fontSize:16}}>{f.finding}</strong><p style={{color:'#96aaa5',fontSize:13,lineHeight:1.55,margin:'8px 0 0'}}>{f.rationale}</p><div style={{marginTop:10,fontSize:12,color:'#bad0ca'}}>Next evidence: <b>{f.nextEvidence.title}</b> · could resolve {f.nextEvidence.couldResolve} records</div></div><div style={{borderLeft:'1px solid #203832',paddingLeft:18}}><span style={{fontSize:11,color:'#718984'}}>{f.metricLabel}</span><strong style={{display:'block',fontSize:25,marginTop:4}}>{pct(f.numerator,f.denominator)}</strong><small style={{color:'#7f958f'}}>{f.missingCount} unresolved gaps</small></div></article>)}</div>

      <footer style={{marginTop:18,border:'1px solid #203832',borderRadius:12,padding:16,display:'flex',gap:20,flexWrap:'wrap',color:'#8fa39e',fontSize:12}}><span style={{display:'flex',gap:6,alignItems:'center'}}><Fingerprint size={14}/> Same rules + same pack = same result</span><span style={{display:'flex',gap:6,alignItems:'center'}}><ShieldCheck size={14}/> No LLM verdict; supervisor remains final</span><span>{soc==='north'?'North remains challenged because evidence gaps survive reconstruction.':'West acts as the healthy control: documented automation and complete workflow evidence clear the same tests.'}</span></footer>
    </div>
  </main>;
}

function Stat({label,value,bad=false,good=false}:{label:string;value:string;bad?:boolean;good?:boolean}){return <div style={{minWidth:86,border:'1px solid #263e39',borderRadius:9,padding:'9px 11px'}}><span style={{display:'block',fontSize:10,color:'#738984'}}>{label}</span><b style={{fontSize:22,color:bad?'#ef8e84':good?'#79dfbd':'#e1c06d'}}>{value}</b></div>}
