import { LandingHero } from '@/components/LandingHero';

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#blacklight-home">Skip to main content</a>
      <div id="blacklight-home" tabIndex={-1}>
        <LandingHero />
      </div>
    </>
  );
}
