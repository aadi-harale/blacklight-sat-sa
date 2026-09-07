import Link from 'next/link';
import { ReviewOptimizer } from '@/components/ReviewOptimizer';
import { Workbench } from '@/components/Workbench';
import styles from './workbench-focus.module.css';

export default function WorkbenchPage() {
  return (
    <>
      <a className="skip-link" href="#blacklight-workbench">Skip to assessment workspace</a>
      <section className={styles.demoStrip} aria-label="Seeded supervisor demo summary">
        <div className={styles.demoClaim}>
          <span>REPORTED KPI</span>
          <strong>99.8% SLA</strong>
          <em>challenged, not condemned</em>
        </div>
        <div className={styles.demoFlow} aria-label="Decision flow">
          <span>EVIDENCE</span><b>fast-close clustering + reopen rise</b><i>→</i><span>ACTION</span><b>7 reviews + 1 automation trail</b>
        </div>
        <Link className={styles.demoLink} href="/evidence?soc=north">Compare SOC evidence →</Link>
      </section>
      <div className={styles.focused}>
        <div id="blacklight-workbench" tabIndex={-1}>
          <Workbench />
        </div>
        <section id="review-optimizer" aria-label="Targeted review optimization">
          <ReviewOptimizer />
        </section>
      </div>
    </>
  );
}
