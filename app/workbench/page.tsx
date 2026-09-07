import Link from 'next/link';
import {FileSearch,Layers,Link2} from 'lucide-react';
import {assessDataset} from '@/lib/engine';
import {DEMO_ASSET_PROFILE,makeDemoRecords,makeWestDemoRecords,WEST_ASSET_PROFILE} from '@/lib/demo';
import './workbench.css';

function pack(name:string,records:any[],profile:any){const a=assessDataset(records,{name,source:'demo',declaredCriticalAssets:profile.declaredCriticalAssets,claimedProtectedAssets:profile.claimedProtectedAssets,loadedAt:'2026-07-31T23:59:59.000Z'});return {a,unsupported:a.findings.filter(f=>f.verdict==='unsupported').length,review:a.findings.filter(f=>f.verdict==='review').length,supported:a.findings.filter(f=>f.verdict==='supported').length}}

const reviewSet=[
  ['CRIT-00001','Fast close · no investigation · no automation'],
  ['CRIT-00023','Fast unexplained closure from a different asset stratum'],
  ['CRIT-00042','Repeated template sequence · missing investigation'],
  ['CRIT-00071','Exception-coded maintenance-window case'],
  ['CRIT-00137','Fast closure with a traceable automation control'],
  ['CRIT-00301','Escalation-policy edge case'],
  ['ASSET-312','Negative-space coverage check: declared, never observed'],
] as const;

export default function WorkbenchPage(){
  const north=pack('SOC North — challenged KPI',makeDemoRecords(),DEMO_ASSET_PROFILE);const west=pack('SOC West — healthy control',makeWestDemoRecords(),WEST_ASSET_PROFILE);const actionableDebt=136+276+41;
  return <main className="blInstrument">
    <header className="blHeader"><div className="blBrand"><Link href="/" className="blLogo"><span className="blMark">◉</span><b>BLACKLIGHT</b></Link><span className="blDivider"/><div className="blHeaderMeta"><strong>SOC supervisory assessment</strong><small>Periodic evidence review · deterministic · offline-friendly</small></div></div><div className="blHeaderActions"><Link href="/advanced" className="blGhost"><Layers size={15}/> Advanced</Link><Link href="/evidence?soc=north" className="blGhost"><Link2 size={15}/> Open evidence</Link><Link href="/evidence?soc=north" className="blPrimary"><FileSearch size={15}/> Start review</Link></div></header>

    <div className="blBody">
      <section className="blCanvas"><div className="blGrid"/><div className="blCanvasInner">
        <div className="blCanvasTitle"><div><span>SUPERVISORY EVIDENCE CANVAS</span><h1>Can the SOC prove the story behind 99.8%?</h1></div><small>Same engine · two evidence packs · no misconduct inference</small></div>
        <div className="blClaim"><span>REPORTED KPI</span><div className="blClaimLine"><strong>99.8% SLA compliance</strong><em>CHALLENGED · NOT CONDEMNED</em></div></div>
        <div className="blFlow"><article><span>01 · CLAIM</span><b>Define what must be true</b><p>A strong SLA should leave investigation, automation and coverage evidence.</p></article><article><span>02 · RECONSTRUCT</span><b>Replay operational evidence</b><p>Check event ordering and negative space instead of trusting the aggregate.</p></article><article><span>03 · FALSIFY</span><b>Keep competing explanations</b><p>Automation can still explain fast closure — if its execution trail exists.</p></article><article><span>04 · ACT</span><b>Ask for the smallest proof</b><p>Reduce a broad audit to seven diverse reviews and one targeted request.</p></article></div>
        <div className="blSocCompare"><SocCard kind="north" title="SOC North" state="Claim challenged" p={north} observed="311 / 587 protected assets observed" automation="41 fast closures lack automation trail" href="/evidence?soc=north"/><SocCard kind="west" title="SOC West" state="Healthy control" p={west} observed="Coverage aligns with declared estate" automation="Automation trail remains coherent" href="/evidence?soc=west"/></div>
      </div></section>

      <aside className="blPanel">
        <section className="blCard"><div className="blSearch"><FileSearch size={15}/><span>Select an evidence pack to examine...</span></div><div className="blPreset"><Link className="active" href="/evidence?soc=north">SOC North</Link><Link href="/evidence?soc=west">SOC West</Link></div><div className="blActionBox"><span>GUIDED REVIEW</span><h2>Start with the challenged claim.</h2><p>Open North, inspect the decisive contradiction, then flip to West and watch the same rules clear a documented control.</p><Link className="blRun" href="/evidence?soc=north">Run falsification walkthrough</Link></div></section>

        <section className="blCard" id="review-optimizer"><div className="blCardHead"><span>EVIDENCE DEBT SNAPSHOT</span><span>counted · not scored</span></div><div className="blIndex"><strong>{actionableDebt}</strong><span> gaps</span></div><b className="blGrade">Actionable proof missing</b><div className="blTags"><span>{north.unsupported} UNSUPPORTED TESTS</span><span>{north.review} COMPARABILITY REVIEW</span><span>{north.a.dataset.recordCount.toLocaleString()} RECORDS</span></div><div className="blDrivers"><DebtRow label="Investigation transitions" value="136"/><DebtRow label="Protected-asset coverage" value="276"/><DebtRow label="Automation execution trails" value="41"/><DebtRow label="Escalation-policy state" value="review"/></div><div className="blTrust"><span>REVIEW OPTIMIZER</span><b>7 diverse reviews + 1 targeted evidence request</b></div><div className="blSocRows">{reviewSet.map(([id,why])=><div key={id}><span>{id}</span><b>{why}</b></div>)}</div><div className="blSocAction"><span>SMALLEST NEXT EVIDENCE</span><b>Request the SOAR execution history for the 41 fast unresolved closures. A coherent trail could clear the automation explanation without reviewing all 1,842 alerts.</b></div></section>

        <div className="blNote"><span>BOUNDARY CONDITION</span><b>BLACKLIGHT challenges claims, not people.</b><p>Fast closure alone is not misconduct. A legitimate automation explanation stays alive until the expected execution evidence is produced.</p></div>
      </aside>
    </div>
  </main>
}

function SocCard({kind,title,state,p,observed,automation,href}:{kind:'north'|'west';title:string;state:string;p:any;observed:string;automation:string;href:string}){return <article className={`blSoc ${kind}`}><div className="blSocHead"><span>{title.toUpperCase()}</span><b>{state}</b></div><div className="blSocStats"><div><span>Unsupported</span><b>{p.unsupported}</b></div><div><span>Review</span><b>{p.review}</b></div><div><span>Supported</span><b>{p.supported}</b></div></div><div className="blSocRows"><div><span>Investigation evidence</span><b>{kind==='north'?'136 gaps':'complete'}</b></div><div><span>Protected assets</span><b>{observed}</b></div><div><span>Automation explanation</span><b>{automation}</b></div></div><div className="blSocAction"><span>Same rules · different evidence</span><Link href={href}>Inspect pack →</Link></div></article>}
function DebtRow({label,value}:{label:string;value:string}){return <div><span>{label}<b>{value}</b></span><i><em style={{width:value==='review'?'64%':`${Math.min(100,Math.max(12,Number(value)/3))}%`}}/></i></div>}
