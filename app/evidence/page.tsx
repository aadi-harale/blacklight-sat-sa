import Link from 'next/link';
import { ArrowLeft, Check, CircleAlert, Fingerprint, ShieldCheck, Target } from 'lucide-react';
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
  const lead=assessment.findings.find(f=>f.verdict==='unsupported')??assessment.findings.find(f=>f.verdict==='review')??assessment.findings[0];

  return <main style={{minHeight:'100vh',background:'#071014',color:'#e8f1ef',padding:'28px',fontFamily:'system-ui,sans-serif'}}>
    <div style={{maxWidth:1100,margin:'0 auto'}}>
      <header style={{display:'flex',justifyContent:'space-between',gap:20,alignItems:'center',marginBottom:22,flexWrap:'wrap'}}>
        <div><Link href="/workbench" style={{color:'#9fb4af',display:'inline-flex',gap:7,alignItems:'center',textDecoration:'none',fontSize:13}}><ArrowLeft size={15}/> Back to guided demo</Link><h1 style={{fontSize:30,margin:'12px 0 4px'}}>Can the evidence support the claim?</h1><p style={{color:'#8fa29e',margin:0}}>Same rules. Two SOCs. Different evidence.</p></div>
        <div style={{display:'flex',gap:8}}><Link href="/evidence?soc=north" style={switchStyle(soc==='north')}>SOC North</Link><Link href="/evidence?soc=west" style={switchStyle(soc==='west')}>SOC West</Link></div>
      </header>

      <section style={{border:'1px solid #203832',borderRadius:14,background:'#0a171b',padding:20,marginBottom:16}}>
        <div style={{display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap',alignItems:'center'}}>
          <div><span style={{fontSize:11,letterSpacing:'.08em',color:'#7ce0c6'}}>ACTIVE EVIDENCE PACK</span><h2 style={{margin:'6px 0 4px',fontSize:22}}>{name}</h2><p style={{margin:0,color:'#8ca19c'}}>{assessment.dataset.recordCount.toLocaleString()} critical records · {assessment.dataset.observedAssets} observed assets</p></div>
          <div style={{display:'flex',gap:10}}><Stat label="Unsupported" value={String(unsupported)} bad/><Stat label="Review" value={String(review)}/><Stat label="Supported" value={String(supported)} good/></div>
        </div>
      </section>

      <section style={{border:'1px solid #31564d',borderRadius:16,background:'linear-gradient(135deg,#10231f,#0a171b)',padding:22,marginBottom:16}} aria-label="Lead finding">
        <span style={{fontSize:10,letterSpacing:'.1em',color:'#7ce0c6'}}>WHAT CHANGES THE STORY FIRST</span>
        <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 180px',gap:22,marginTop:10,alignItems:'start'}}>
          <div><div style={{display:'flex',gap:9,alignItems:'center',marginBottom:8}}><VerdictIcon verdict={lead.verdict}/><b style={{fontSize:12,color:verdictColor(lead.verdict)}}>{lead.verdict.toUpperCase()}</b><span style={{fontSize:11,color:'#6f8882'}}>{lead.id}</span></div><h2 style={{fontSize:23,margin:'0 0 9px'}}>{lead.finding}</h2><p style={{color:'#9bb0aa',lineHeight:1.6,margin:0,fontSize:13.5}}>{lead.rationale}</p><div style={{marginTop:14,padding:'12px 14px',border:'1px solid #2b4740',borderRadius:10,background:'#081418',fontSize:13,color:'#c5d9d3'}}>Smallest next proof: <b>{lead.nextEvidence.title}</b> · could resolve {lead.nextEvidence.couldResolve} records</div></div>
          <div style={{borderLeft:'1px solid #29443d',paddingLeft:18}}><span style={{fontSize:11,color:'#728a84'}}>{lead.metricLabel}</span><strong style={{display:'block',fontSize:34,marginTop:5}}>{pct(lead.numerator,lead.denominator)}</strong><small style={{color:'#899d98'}}>{lead.missingCount} unresolved gaps</small></div>
        </div>
      </section>

      <section style={{border:'1px solid #2b4a43',borderRadius:14,background:'#0b1b1f',padding:20,marginBottom:16}} aria-label="Supervisor close-out">
        <span style={{fontSize:11,letterSpacing:'.08em',color:'#7ce0c6'}}>SUPERVISOR CLOSE-OUT</span>
        <div style={{display:'flex',gap:18,justifyContent:'space-between',flexWrap:'wrap',marginTop:7}}><div style={{maxWidth:710}}><h2 style={{fontSize:21,margin:'0 0 7px'}}>{soc==='north'?'Challenge the claim — not the people.':'Healthy control clears the same tests.'}</h2><p style={{margin:0,color:'#96aaa5',lineHeight:1.55}}>{soc==='north'?'North stays challenged because evidence gaps survive reconstruction. Legitimate automation remains a live competing explanation until its execution trail is produced.':'West keeps the claim because investigation, automation and coverage evidence stay coherent under the same rules.'}</p></div><div style={{minWidth:245,border:'1px solid #28433d',borderRadius:11,padding:14}}><span style={{fontSize:10,color:'#718984'}}>NEXT ACTION</span><strong style={{display:'block',marginTop:5,fontSize:17}}>{soc==='north'?'7 reviews + 1 evidence request':'Retain claim + control sample'}</strong><small style={{display:'block',marginTop:7,color:'#8fa39e'}}>Supervisor remains final.</small></div></div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:16}}>{soc==='north'?<Link href="/evidence?soc=west" style={primaryLink}>Compare with SOC West →</Link>:<Link href="/evidence?soc=north" style={primaryLink}>Return to SOC North →</Link>}<Link href="/workbench#review-optimizer" style={secondaryLink}><Target size={14}/> Review Optimizer</Link></div>
      </section>

      <details style={{border:'1px solid #203832',borderRadius:14,background:'#091518',overflow:'hidden',marginBottom:16}}>
        <summary style={{padding:'15px 17px',cursor:'pointer',listStyle:'none',display:'flex',justifyContent:'space-between',gap:16,alignItems:'center',fontSize:13,fontWeight:800,color:'#c8d9d4'}}><span>Show complete proof ledger</span><small style={{color:'#708984',fontWeight:600}}>{assessment.findings.length} deterministic tests · examiner detail</small></summary>
        <div style={{borderTop:'1px solid #203832'}}>
          {assessment.findings.map(f=><div key={f.id} style={{display:'grid',gridTemplateColumns:'145px minmax(0,1fr) 115px 210px',gap:14,alignItems:'center',padding:'14px 17px',borderBottom:'1px solid #182c27'}}>
            <div><span style={{fontSize:10,color:'#6f8882'}}>{f.id}</span><b style={{display:'block',fontSize:13,marginTop:3}}>{f.shortLabel}</b></div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}><VerdictIcon verdict={f.verdict}/><span style={{fontSize:13,color:verdictColor(f.verdict),fontWeight:800}}>{f.verdict.toUpperCase()}</span></div>
            <div><b style={{fontSize:18}}>{pct(f.numerator,f.denominator)}</b><small style={{display:'block',color:'#748b85'}}>{f.missingCount} gaps</small></div>
            <div style={{fontSize:12,color:'#a9bdb7'}}>Next: <b style={{color:'#d0dfdb'}}>{f.nextEvidence.title}</b></div>
          </div>)}
        </div>
      </details>

      <footer style={{marginTop:16,display:'flex',gap:20,flexWrap:'wrap',color:'#809690',fontSize:12}}><span style={{display:'flex',gap:6,alignItems:'center'}}><Fingerprint size={14}/> deterministic</span><span style={{display:'flex',gap:6,alignItems:'center'}}><ShieldCheck size={14}/> no LLM verdict</span><span>Same evidence + same rules = same finding.</span></footer>
    </div>
  </main>;
}

const primaryLink={padding:'10px 13px',borderRadius:8,background:'#77e0c5',color:'#071014',textDecoration:'none',fontWeight:800} as const;
const secondaryLink={padding:'10px 13px',borderRadius:8,border:'1px solid #35564e',color:'#c9ddd8',textDecoration:'none',fontWeight:700,display:'inline-flex',gap:6,alignItems:'center'} as const;
function switchStyle(active:boolean){return {padding:'10px 13px',borderRadius:8,border:'1px solid #2a4942',color:active?'#071014':'#c9ddd8',background:active?'#77e0c5':'transparent',textDecoration:'none',fontWeight:700} as const}
function verdictColor(v:string){return v==='supported'?'#79dfbd':v==='unsupported'?'#ef8e84':'#e2bd69'}
function VerdictIcon({verdict}:{verdict:string}){return verdict==='supported'?<Check size={14} color="#79dfbd"/>:<CircleAlert size={14} color={verdictColor(verdict)}/>}
function Stat({label,value,bad=false,good=false}:{label:string;value:string;bad?:boolean;good?:boolean}){return <div style={{minWidth:86,border:'1px solid #263e39',borderRadius:9,padding:'9px 11px'}}><span style={{display:'block',fontSize:10,color:'#738984'}}>{label}</span><b style={{fontSize:22,color:bad?'#ef8e84':good?'#79dfbd':'#e1c06d'}}>{value}</b></div>}
