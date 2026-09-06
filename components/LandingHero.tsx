'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Fingerprint,
  GitBranch,
  HardDrive,
  ScanSearch,
  ShieldCheck,
  WifiOff,
  X,
} from 'lucide-react';
import { BrandMark } from './BrandMark';

const FEATURES = [
  {
    kicker: '01 / CONTRADICTION',
    title: 'Claim–evidence reasoning',
    copy: 'Turn a management statement into a testable operational path, then check whether the submitted evidence can actually satisfy it.',
    icon: GitBranch,
  },
  {
    kicker: '02 / NEGATIVE SPACE',
    title: 'Find what should exist but does not',
    copy: 'Compare declared monitoring, workflow and asset coverage against the operational traces that should be present if those claims are true.',
    icon: ScanSearch,
  },
  {
    kicker: '03 / COUNTERFACTUAL',
    title: 'Show what would clear the finding',
    copy: 'Every adverse finding exposes the exact missing evidence or approved exception that would reverse or downgrade it.',
    icon: ShieldCheck,
  },
];

export function LandingHero() {
  return (
    <main className="landing">
      <header className="landing-nav shell">
        <BrandMark />
        <nav className="landing-nav__links" aria-label="Primary">
          <a href="#method">Method</a>
          <a href="#trust">Trust model</a>
          <Link className="button button--ghost" href="/workbench">
            Open workbench
          </Link>
        </nav>
      </header>

      <section className="hero hero-grid">
        <div className="hero__glow" aria-hidden="true" />
        <div className="shell hero__inner">
          <div className="hero__copy">
            <div className="eyebrow">
              <span className="status-pip status-pip--lime" />
              SIH26157 · PROOF BEFORE PREDICTION
            </div>
            <h1>
              Stop asking whether a SOC <em>looks compliant.</em>
              <br />
              Ask whether it can <span>prove the claim.</span>
            </h1>
            <p className="hero__lede">
              BLACKLIGHT is a deterministic supervisory evidence engine. It reconstructs declared
              security processes, detects contradictions and missing expected evidence, then tells
              the examiner exactly what would change the finding.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary button--large" href="/workbench">
                Verify the demo claim
                <ArrowRight size={17} />
              </Link>
              <a className="button button--secondary button--large" href="#method">
                See the reasoning model
              </a>
            </div>
            <div className="hero__trustline">
              <span><WifiOff size={14} /> air-gapped</span>
              <span><Fingerprint size={14} /> reproducible</span>
              <span><HardDrive size={14} /> local-only</span>
            </div>
          </div>

          <div className="proof-card-wrap">
            <div className="proof-card">
              <div className="proof-card__top">
                <span>ENTITY DECLARATION / 2026-Q2</span>
                <span className="proof-card__seal">SIGNED</span>
              </div>
              <p className="proof-card__label">CLAIM C-014</p>
              <blockquote>
                “Every critical alert receives meaningful investigation before closure.”
              </blockquote>
              <div className="proof-card__reported">
                <div>
                  <span className="proof-card__metric">100%</span>
                  <span>reported SLA compliance</span>
                </div>
                <Check size={18} />
              </div>

              <div className="proof-card__scan">
                <div className="scanline" />
                <div className="proof-card__scanhead">
                  <span>BLACKLIGHT RECONSTRUCTION</span>
                  <span>1,842 CRITICAL ALERTS</span>
                </div>
                <div className="micro-flow">
                  <div className="micro-flow__node ok">Detection</div>
                  <ChevronRight size={13} />
                  <div className="micro-flow__node ok">Triage</div>
                  <ChevronRight size={13} />
                  <div className="micro-flow__node fail">Investigation</div>
                  <ChevronRight size={13} />
                  <div className="micro-flow__node ok">Closure</div>
                </div>
                <div className="proof-card__finding">
                  <div className="proof-card__finding-icon">
                    <X size={17} />
                  </div>
                  <div>
                    <strong>CLAIM NOT SUPPORTED</strong>
                    <p>136 critical alerts closed with no observed investigation transition.</p>
                  </div>
                </div>
              </div>

              <div className="proof-card__counter">
                <span>WHAT WOULD CLEAR THIS?</span>
                <p>Provide a valid automation trace, the missing workflow event stream, or an approved exception mapping.</p>
              </div>
            </div>
            <div className="proof-card__shadow" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="trust-strip" id="trust">
        <div className="shell trust-strip__inner">
          <div>
            <span>NO CLOUD</span>
            <strong>Runs inside the assessment boundary</strong>
          </div>
          <div>
            <span>NO LLM JUDGEMENT</span>
            <strong>Same evidence + same rules = same finding</strong>
          </div>
          <div>
            <span>NO BLACK-BOX SCORE</span>
            <strong>Every conclusion exposes its evidence path</strong>
          </div>
        </div>
      </section>

      <section className="section shell" id="method">
        <div className="section-heading">
          <div>
            <p className="section-kicker">THE REASONING MODEL</p>
            <h2>A supervisory instrument, not another cyber dashboard.</h2>
          </div>
          <p>
            The product is designed around falsifiable findings. It separates observation from
            inference and keeps the human examiner in control.
          </p>
        </div>

        <div className="feature-grid">
          {FEATURES.map(({ kicker, title, copy, icon: Icon }) => (
            <article className="feature-card" key={kicker}>
              <div className="feature-card__icon"><Icon size={18} /></div>
              <p className="feature-card__kicker">{kicker}</p>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell">
        <div className="system-map">
          <div className="system-map__caption">BLACKLIGHT / DETERMINISTIC PIPELINE</div>
          <div className="system-map__nodes">
            {[
              ['01', 'Management claim', 'Natural-language declaration + policy'],
              ['02', 'Claim compiler', 'Required evidence states'],
              ['03', 'Evidence reconstruction', 'Events, cases, assets'],
              ['04', 'Contradiction + negative space', 'Observed vs expected'],
              ['05', 'Competing explanations', 'Support / contradiction matrix'],
              ['06', 'Counterfactual clearing', 'What evidence changes the result'],
              ['07', 'Human examiner', 'Final supervisory judgement'],
            ].map(([index, title, note], i) => (
              <div className="system-node" key={index}>
                <span>{index}</span>
                <div>
                  <strong>{title}</strong>
                  <small>{note}</small>
                </div>
                {i < 6 ? <ChevronRight size={15} /> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="shell landing-cta__inner">
          <div>
            <p className="section-kicker">SYNTHETIC VALIDATION PACK INCLUDED</p>
            <h2>A finding should be reproducible, not persuasive.</h2>
          </div>
          <Link className="button button--primary button--large" href="/workbench">
            Enter BLACKLIGHT
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <footer className="landing-footer shell">
        <BrandMark compact />
        <span>Prototype for SIH26157 · deterministic local analysis</span>
      </footer>
    </main>
  );
}
