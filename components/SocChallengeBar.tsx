'use client';

import { Check, CircleAlert, ShieldCheck, Target } from 'lucide-react';
import { useState } from 'react';
import styles from './SocChallengeBar.module.css';

type Scenario = {
  id:'north'|'west';
  name:string;
  reported:string;
  signal:string;
  alternative:string;
  action:string;
  verdict:'challenge'|'retain';
  metrics:{label:string;value:string;tone:'bad'|'good'|'warn'}[];
  telemetry:string;
  privileged:string;
  debt:string;
};

const scenarios:Scenario[]=[
  {
    id:'north',name:'SOC North',reported:'99.8% SLA compliance',
    signal:'Fast-close clustering + shallower investigation + reopen-rate rise',
    alternative:'Legitimate automation remains plausible, but execution trail is missing',
    action:'Review 7 diverse alerts + request 1 automation trail',verdict:'challenge',
    metrics:[
      {label:'<60s closures',value:'18.4%',tone:'bad'},
      {label:'Median investigation steps',value:'6 → 3',tone:'bad'},
      {label:'30-day reopen rate',value:'2.1% → 6.8%',tone:'bad'},
      {label:'Automation trace coverage',value:'41 / 142',tone:'warn'},
    ],
    telemetry:'Network activity is present, but 17% of critical endpoint telemetry is absent. Comparability gate: DEGRADED.',
    privileged:'Privileged-access monitoring claim is only partially supported: session evidence exists for 87% of declared admin paths.',
    debt:'Evidence debt is concentrated in automation execution trails and endpoint coverage, not in the headline SLA calculation itself.',
  },
  {
    id:'west',name:'SOC West',reported:'98.9% SLA compliance',
    signal:'Stable investigation depth + flat reopen rate + automation trace present',
    alternative:'Observed speed-up is consistent with documented automation',
    action:'Retain claim; sample only healthy-control reviews',verdict:'retain',
    metrics:[
      {label:'<60s closures',value:'7.2%',tone:'good'},
      {label:'Median investigation steps',value:'6 → 6',tone:'good'},
      {label:'30-day reopen rate',value:'2.4% → 2.5%',tone:'good'},
      {label:'Automation trace coverage',value:'136 / 139',tone:'good'},
    ],
    telemetry:'Endpoint and network coverage are aligned for the comparison window. Comparability gate: PASS.',
    privileged:'Privileged-access monitoring claim is supported by complete session and approval evidence in the seeded window.',
    debt:'Residual evidence debt is low and does not materially alter the supervisory interpretation.',
  },
];

export function SocChallengeBar(){
  const[activeId,setActiveId]=useState<Scenario['id']>('north');
  const active=scenarios.find(i=>i.id===activeId)??scenarios[0];
  return <section className={styles.wrap} aria-label="Seeded two-SOC judge scenario">
    <div className={styles.header}><div className={styles.headerText}><span>SEEDED JUDGE SCENARIO</span><strong>Challenge the reported KPI without assuming misconduct</strong></div><div className={styles.tabs} role="group" aria-label="Choose SOC scenario">{scenarios.map(item=><button key={item.id} type="button" aria-pressed={activeId===item.id} className={activeId===item.id?styles.active:''} onClick={()=>setActiveId(item.id)}>{item.name}</button>)}</div></div>
    <div className={styles.flow} aria-live="polite"><article><span>01 · REPORTED</span><strong>{active.reported}</strong></article><article><span>02 · EVIDENCE TEST</span><strong>{active.signal}</strong></article><article><span>03 · COMPETING EXPLANATION</span><strong>{active.alternative}</strong></article><article className={active.verdict==='challenge'?styles.challenge:styles.retain}><span>04 · SUPERVISOR ACTION</span><strong>{active.action}</strong></article></div>
    <div className={styles.evidenceGrid} aria-label={`${active.name} deterministic evidence snapshot`}>
      <div className={styles.metricStrip}>{active.metrics.map(metric=><article key={metric.label} className={styles[metric.tone]}><span>{metric.label}</span><strong>{metric.value}</strong></article>)}</div>
      <div className={styles.evidenceNotes}>
        <article><span>DATA TRUST / COMPARABILITY</span><strong>{active.telemetry}</strong></article>
        <article><span>EVIDENCE DEBT</span><strong>{active.debt}</strong></article>
        <article><span>FINAL CLAIM CHECK</span><strong>{active.privileged}</strong></article>
      </div>
    </div>
    <footer className={styles.footer}><span className={active.verdict==='challenge'?styles.badgeChallenge:styles.badgeRetain}>{active.verdict==='challenge'?<CircleAlert size={14}/>:<Check size={14}/>} {active.verdict==='challenge'?'CLAIM NEEDS EVIDENCE':'CLAIM CURRENTLY SUPPORTED'}</span><span><Target size={13}/> deterministic falsification, not alert scoring</span><span><ShieldCheck size={13}/> human supervisory judgement remains final</span><a className={styles.jump} href="#blacklight-workbench">Open evidence reconstruction ↓</a></footer>
  </section>;
}
