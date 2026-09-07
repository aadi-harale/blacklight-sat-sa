import Link from 'next/link';
import { ArrowRight, FileSearch, ShieldCheck, Target } from 'lucide-react';

const steps = [
  ['01','Read the claim','SOC North reports 99.8% SLA compliance. BLACKLIGHT does not call that good or bad; it asks what evidence should exist if the claim is true.'],
  ['02','Test the evidence','Reconstruct investigation steps, automation execution trails and monitoring coverage using the same deterministic rules every time.'],
  ['03','Compare two SOCs','Run the challenged SOC and a healthy control through the exact same engine. North keeps unresolved gaps; West clears the same tests.'],
  ['04','Request the smallest proof','Reduce a broad audit to 7 diverse alert reviews plus one automation execution trail. Human supervisory judgement remains final.'],
];

export default function WorkbenchPage(){
  return <main style={{minHeight:'100vh',background:'#071014',color:'#e8f1ef',fontFamily:'system-ui,sans-serif'}}>
    <div style={{maxWidth:1120,margin:'0 auto',padding:'34px 24px 56px'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:18,marginBottom:30}}>
        <div>
          <span style={{fontSize:11,letterSpacing:'.12em',color:'#78dfc5',fontWeight:800}}>BLACKLIGHT · GUIDED DEMO</span>
          <h1 style={{fontSize:36,lineHeight:1.08,margin:'8px 0 8px'}}>Can this SOC prove what it reports?</h1>
          <p style={{margin:0,color:'#93a9a4',maxWidth:690,lineHeight:1.6}}>Follow one claim from headline KPI to evidence reconstruction to the smallest supervisory action. The advanced inspector stays available, but it no longer competes with the story.</p>
        </div>
        <Link href="/" style={{color:'#9bb1ac',textDecoration:'none',fontSize:13}}>← Home</Link>
      </header>

      <section style={{border:'1px solid #2a4640',borderRadius:18,background:'#0b191d',padding:'24px',marginBottom:18}}>
        <span style={{fontSize:10,letterSpacing:'.1em',color:'#708984'}}>REPORTED KPI</span>
        <div style={{display:'flex',justifyContent:'space-between',gap:18,alignItems:'end',flexWrap:'wrap',marginTop:6}}>
          <div><strong style={{display:'block',fontSize:38}}>99.8% SLA compliance</strong><p style={{margin:'7px 0 0',color:'#91a6a1'}}>Question: do the closures contain evidence of meaningful investigation?</p></div>
          <span style={{border:'1px solid #70563a',background:'#2a2118',color:'#e7c37c',padding:'8px 11px',borderRadius:999,fontSize:11,fontWeight:800}}>CHALLENGED · NOT CONDEMNED</span>
        </div>
      </section>

      <section style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:12,marginBottom:18}} aria-label="BLACKLIGHT demo flow">
        {steps.map(([n,title,body],i)=><article key={n} style={{border:'1px solid #203934',borderRadius:14,background:i===0?'#10231f':'#0a161a',padding:17,minHeight:190}}>
          <span style={{fontSize:10,color:'#6f8983'}}>{n}</span><strong style={{display:'block',fontSize:16,margin:'10px 0 8px'}}>{title}</strong><p style={{margin:0,color:'#8ea39e',fontSize:12.5,lineHeight:1.55}}>{body}</p>
        </article>)}
      </section>

      <section style={{display:'grid',gridTemplateColumns:'1.15fr .85fr',gap:14,marginBottom:18}}>
        <article style={{border:'1px solid #2a4640',borderRadius:16,background:'#0b191d',padding:20}}>
          <div style={{display:'flex',gap:9,alignItems:'center'}}><FileSearch size={18} color="#78dfc5"/><span style={{fontSize:10,letterSpacing:'.08em',color:'#78dfc5'}}>PRIMARY DEMO</span></div>
          <h2 style={{fontSize:22,margin:'9px 0 7px'}}>Start with SOC North, then flip to SOC West.</h2>
          <p style={{color:'#91a6a1',fontSize:13,lineHeight:1.55,margin:'0 0 15px'}}>The contrast makes the product obvious: fast closure alone is not suspicious. Missing investigation depth, automation trails and telemetry are what keep North challenged.</p>
          <Link href="/evidence?soc=north" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'12px 15px',borderRadius:9,background:'#78dfc5',color:'#071014',textDecoration:'none',fontWeight:800}}>Start evidence walkthrough <ArrowRight size={16}/></Link>
        </article>
        <article style={{border:'1px solid #203934',borderRadius:16,background:'#0a161a',padding:20}}>
          <div style={{display:'flex',gap:9,alignItems:'center'}}><Target size={18} color="#e3be6a"/><span style={{fontSize:10,letterSpacing:'.08em',color:'#e3be6a'}}>END STATE</span></div>
          <strong style={{display:'block',fontSize:22,margin:'9px 0 7px'}}>7 reviews + 1 evidence request</strong>
          <p style={{color:'#91a6a1',fontSize:13,lineHeight:1.55,margin:0}}>BLACKLIGHT reduces review load without issuing a misconduct verdict or an LLM-generated compliance judgement.</p>
        </article>
      </section>

      <footer style={{display:'flex',justifyContent:'space-between',gap:14,alignItems:'center',flexWrap:'wrap',borderTop:'1px solid #1e332e',paddingTop:16}}>
        <span style={{display:'inline-flex',alignItems:'center',gap:7,color:'#819792',fontSize:12}}><ShieldCheck size={14}/> deterministic · local-first · supervisor remains final</span>
        <Link href="/advanced" style={{color:'#91a6a1',fontSize:12,textDecoration:'none'}}>Open advanced evidence inspector →</Link>
      </footer>
    </div>
  </main>;
}
