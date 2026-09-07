import { ReviewOptimizer } from '@/components/ReviewOptimizer';
import { Workbench } from '@/components/Workbench';
import styles from '../workbench/workbench-focus.module.css';

export default function AdvancedWorkbenchPage() {
  return (
    <>
      <a className="skip-link" href="#blacklight-workbench">Skip to assessment workspace</a>
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
