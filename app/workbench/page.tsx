import { ReviewOptimizer } from '@/components/ReviewOptimizer';
import { SocChallengeBar } from '@/components/SocChallengeBar';
import { Workbench } from '@/components/Workbench';

export default function WorkbenchPage() {
  return (
    <>
      <a className="skip-link" href="#blacklight-workbench">Skip to assessment workspace</a>
      <SocChallengeBar />
      <div id="blacklight-workbench" tabIndex={-1}>
        <Workbench />
      </div>
      <section id="review-optimizer" aria-label="Targeted review optimization">
        <ReviewOptimizer />
      </section>
    </>
  );
}
