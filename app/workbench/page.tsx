import Link from 'next/link';
import { ArrowRight, FileSearch, ShieldCheck, Target } from 'lucide-react';

export default function WorkbenchPage(){
  return <main style={{minHeight:'100vh',background:'#071014',color:'#e8f1ef',fontFamily:'system-ui,sans-serif'}}>
    <div style={{maxWidth:1040,margin:'0 auto',padding:'34px 24px 52px'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:18,marginBottom:28}}>
        <div><span style={{fontSize:11,letterSpacing:'.12em',color:'#78dfc5',fontWeight:800}}>BLACKLIGHT · GUIDED DEMO</span><h1 style={{fontSize:38,lineHeight:1.08,margin:'8px 0 8px'}}>Can this SOC prove what it reports?</h1><p style={{margin:0,color:'#93a9a4',maxWidth:700,lineHeight:1.6}}>One supervisory question, one evidence trail, one bounded action. Everything else stays behind the advanced inspector.</p></div>
        <Link href="/" style={{color:'#9bb1ac',textDecoration:'none',fontSize:13}}>← Home</Link>
      </header>

      <section style={{border:'1px solid #2a4640',borderRadius:18,background:'#0b191d',padding:'24px 26px',marginBottom:20}}>
        <span style={{fontSize:10,letterSpacing:'.1em',color:'#708984'}}>01 · CLAIM</span>
        <div style={{display:'flex',justifyContent:'space-between',gap:18,alignItems:'end',flexWrap:'wrap',marginTop:7}}>
          <div><strong style={{display:'block',fontSize:40}}>99.8% SLA compliance</strong><p style={{margin:'7px 0 0',color:'#91a6a1',fontSize:14}}>A strong headline. BLACKLIGHT asks: <b style={{color:'#cce0da'}}>what evidence should exist if it is genuinely true?</b></p></div>
          <span style={{border:'1px solid #70563a',background:'#2a2118',color:'#e7c37c',padding:'8px 11px',borderRadius:999,fontSize:11,fontWeight:800}}>CHALLENGED · NOT CONDEMNED</span>
        </div>
      </section>

      <section aria-label="BLACKLIGHT proof flow" style={{border:'1px solid #203934',borderRadius:16,background:'#091619',padding:'20px 22px',marginBottom:20}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr auto 1fr',alignItems:'center',gap:14}}>
          <div><span style={{fontSize:10,color:'#6f8983'}}>02 · TEST</span><strong style={{display:'block',fontSize:17,marginTop:5}}>Reconstruct evidence</strong><p style={{margin:'5px 0 0',color:'#8ea39e',fontSize:12.5,lineHeight:1.5}}>Investigation transitions, automation trails and telemetry coverage.</p></div>
          <span style={{fontSize:22,color:'#49675f'}}>→</span>
          <div><span style={{fontSize:10,color:'#6f8983'}}>03 · COMPARE</span><strong style={{display:'block',fontSize:17,marginTop:5}}>Run North vs West</strong><p style={{margin:'5px 0 0',color:'#8ea39e',fontSize:12.5,lineHeight:1.5}}>Same deterministic engine. Different evidence. Different conclusion.</p></div>
          <span style={{fontSize:22,color:'#49675f'}}>→</span>
          <div><span style={{fontSize:10,color:'#6f8983'}}>04 · ACT</span><strong style={{display:'block',fontSize:17,marginTop:5}}>Ask for the smallest proof</strong><p style={{margin:'5px 0 0',color:'#8ea39e',fontSize:12.5,lineHeight:1.5}}>7 diverse reviews + 1 missing automation execution trail.</p></div>
        </div>
      </section>

      <section style={{display:'grid',gridTemplateColumns:'1.25fr .75fr',gap:14,marginBottom:18}}>
        <article style={{border:'1px solid #2f554a',borderRadius:17,background:'linear-gradient(135deg,#10251f,#0b191d)',padding:'23px'}}>
          <div style={{display:'flex',gap:9,alignItems:'center'}}><FileSearch size={18} color="#78dfc5"/><span style={{fontSize:10,letterSpacing:'.08em',color:'#78dfc5'}}>START HERE</span></div>
          <h2 style={{fontSize:24,margin:'10px 0 8px'}}>Open SOC North and follow the evidence.</h2>
          <p style={{color:'#9bb0aa',fontSize:13.5,lineHeight:1.6,margin:'0 0 17px'}}>You will see fast closures, reduced investigation depth, reopen rise and missing automation evidence. Then flip to SOC West: documented automation clears the same tests.</p>
          <Link href="/evidence?soc=north" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'13px 16px',borderRadius:9,background:'#78dfc5',color:'#071014',textDecoration:'none',fontWeight:800}}>Start the proof walkthrough <ArrowRight size={16}/></Link>
        </article>
        <article style={{border:'1px solid #413c2b',borderRadius:17,background:'#171711',padding:'23px'}}>
          <div style={{display:'flex',gap:9,alignItems:'center'}}><Target size={18} color="#e3be6a"/><span style={{fontSize:10,letterSpacing:'.08em',color:'#e3be6a'}}>END STATE</span></div>
          <strong style={{display:'block',fontSize:25,margin:'10px 0 8px'}}>7 + 1</strong>
          <p style={{color:'#a59d82',fontSize:13,lineHeight:1.55,margin:0}}>Seven diverse reviews plus one targeted evidence request instead of a broad manual audit.</p>
        </article>
      </section>

      <footer style={{display:'flex',justifyContent:'space-between',gap:14,alignItems:'center',flexWrap:'wrap',borderTop:'1px solid #1e332e',paddingTop:16}}>
        <span style={{display:'inline-flex',alignItems:'center',gap:7,color:'#819792',fontSize:12}}><ShieldCheck size={14}/> deterministic · offline-friendly · supervisor remains final</span>
        <Link href="/advanced" style={{color:'#91a6a1',fontSize:12,textDecoration:'none'}}>Advanced evidence inspector →</Link>
      </footer>
    </div>
  </main>;
}
