import { useEffect, useState } from 'react';
import {
  getProjects,
  fetchCards,
  buildUserLookup,
  type Card,
  type User,
} from '@jira-clone/shared';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../routes/paths';
import { Button } from '../../components/base';
import { ProfilePhoto } from './components/profile-photo';
import styles from './ProfilePage.module.css';

function isAssignedToUser(card: Card, userId: string): boolean {
  return (
    card.assigneeId === userId ||
    Boolean(card.assigneeIds?.includes(userId))
  );
}

export function ProfilePage() {
  const navigate = useNavigate();

  const username =
    sessionStorage.getItem('jira-current-username') ?? '';

  const [user, setUser] = useState<User>({
    id: username,
    name: username,
    email: '',
    initials: username.slice(0, 2).toUpperCase(),
  });

  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const projects = await getProjects();
        const allCards: Card[] = [];

        for (const project of projects) {
          const lookup = await buildUserLookup(project, username);

          const projectCards = await fetchCards(
            { project: project.id },
            lookup
          );

          allCards.push(...projectCards);

          const loggedInUser = lookup.byUsername[username];

          if (loggedInUser) {
            setUser(loggedInUser);
          }
        }

        setCards(allCards);
      } catch (error) {
        console.error('FAILED TO LOAD PROFILE:', error);
      }
    };

    void loadProfileData();
  }, [username]);

  const assignedCount = cards.filter((card) =>
    isAssignedToUser(card, user.id)
  ).length;

  const createdCount = cards.filter(
    (card) => card.publisherId === user.id
  ).length;

  const activeCount = cards.filter(
    (card) =>
      card.columnId === 'in_progress' ||
      card.columnId === 'in_review'
  ).length;

  return (
    <div className={styles.container}>
      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Profile</h1>
          <p className={styles.subtitle}>
            Manage your account information, role settings, and preferences.
          </p>
        </div>

        <div className={styles.profileCard}>
          {/* Identity header */}
          <div className={styles.profileHeader}>
            <div className={styles.profileIdentity}>
              <ProfilePhoto user={user} />

              <div className={styles.identityText}>
                <h2 className={styles.profileName}>{user.name}</h2>
                <p className={styles.profileEmail}>
                  {user.email || 'No email available'}
                </p>
              </div>
            </div>

            <Button
              label="Log out"
              variant="danger"
              size="sm"
              onPress={() => {
                sessionStorage.removeItem('jira-auth-tokens');
                sessionStorage.removeItem('jira-current-username');
                navigate(ROUTES.AUTH.SIGN_IN);
              }}
            />
          </div>

          {/* Quick stats — derived from backend cards */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <p className={styles.statValue}>{assignedCount}</p>
              <p className={styles.statLabel}>Assigned to me</p>
              <p className={styles.statHint}>Cards in your queue</p>
            </div>

            <div className={styles.statCard}>
              <p className={styles.statValue}>{createdCount}</p>
              <p className={styles.statLabel}>Created by me</p>
              <p className={styles.statHint}>Issues you reported</p>
            </div>

            <div className={styles.statCard}>
              <p className={styles.statValue}>{activeCount}</p>
              <p className={styles.statLabel}>In progress</p>
              <p className={styles.statHint}>Moving through the board</p>
            </div>
          </div>

          {/* Account details */}
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Username</span>
              <span className={styles.detailValue}>{username}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Projects</span>
              <span className={styles.detailValue}>
                {new Set(cards.map((card) => card.projectId)).size}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Total Cards</span>
              <span className={styles.detailValue}>{cards.length}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>User ID</span>
              <span className={styles.monoValue}>{user.id}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
