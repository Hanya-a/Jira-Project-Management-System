import { HeroSection } from './components/hero';
import { FeaturesOverview } from './components/features-overview';
import { LandingFooter } from './components/footer';
import styles from './LandingPage.module.css';

export function LandingPage() {
  const currentUsername =
    sessionStorage.getItem('jira-current-username');

  const isAuthenticated = Boolean(currentUsername);

  return (
    <div className={styles.container}>
      <HeroSection
        isAuthenticated={isAuthenticated}
        userName={currentUsername ?? undefined}
      />

      <FeaturesOverview isAuthenticated={isAuthenticated} />

      <LandingFooter isAuthenticated={isAuthenticated} />
    </div>
  );
}

export default LandingPage;
