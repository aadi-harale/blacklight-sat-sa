import { ReviewOptimizer } from '@/components/ReviewOptimizer';
import { Workbench } from '@/components/Workbench';

export default function WorkbenchPage() {
  return (
    <>
      <a className="skip-link" href="#blacklight-workbench">Skip to assessment workspace</a>
      <div id="blacklight-workbench" tabIndex={-1}>
        <Workbench />
      </div>
      <section id="review-optimizer" aria-label="Targeted review optimization">
        <ReviewOptimizer />
      </section>
    </>
  );
}
