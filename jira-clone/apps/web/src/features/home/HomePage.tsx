import { useState, useMemo, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router';
import {
  type BoardColumn,
  type User,
  type Card,
  type Project,
  updateCardInList,
  deleteCardFromList,
  getProjects,
  fetchCards,
  buildUserLookup,
  type ProjectRecord,
} from '@jira-clone/shared';
import { Button } from '../../components/base';
import { CardDetail } from '../../components/shared/card-detail';
import { ForYouSection } from './components/for-you';
import { RecommendedSpaces } from './components/recommended-spaces';
import type { SpaceItem } from '@jira-clone/shared';
import { ROUTES } from '../../routes/paths';
import styles from './HomePage.module.css';

// ============================================================================
// ICONS
// ============================================================================

const CompassIcon: FC<{ size?: number }> = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const UserCheckIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
);

const ClockIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PenToolIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);

const GridIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

function getGreeting(userName: string): string {
  const hour = new Date().getHours();
  const firstName = userName.split(' ')[0] || userName;

  if (hour < 12) return `Good morning, ${firstName} 👋`;
  if (hour < 17) return `Good afternoon, ${firstName} 👋`;

  return `Good evening, ${firstName} 👋`;
}

export function HomePage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // These are UI columns matching the backend card statuses.
  const [columns] = useState<BoardColumn[]>([
  {
    id: 'todo',
    title: 'To Do',
    order: 0,
    projectId: '',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    order: 1,
    projectId: '',
  },
  {
    id: 'in_review',
    title: 'In Review',
    order: 2,
    projectId: '',
  },
  {
    id: 'done',
    title: 'Done',
    order: 3,
    projectId: '',
  },
]);

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const currentUsername =
    sessionStorage.getItem('jira-current-username') ?? '';

  const currentUser = {
    id: currentUsername,
    name: currentUsername,
  };

  const currentUserId = currentUser.id;

  // ==========================================================================
  // LOAD PROJECTS, CARDS AND USERS FROM BACKEND
  // ==========================================================================

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const currentUsername =
          sessionStorage.getItem('jira-current-username') ?? '';

        const apiProjects = await getProjects();

        const convertedProjects: Project[] = apiProjects.map(
          (project: ProjectRecord) => ({
            id: String(project.id),
            name: project.name,
            description: project.description,
            key: project.key,
            ownerId: project.created_by ?? '',
            createdAt: project.created_at,
            updatedAt: project.updated_at,
          })
        );

        setProjects(convertedProjects);

        const allCards: Card[] = [];
        const allUsers: User[] = [];

        for (const project of apiProjects) {
          const lookup = await buildUserLookup(
            project,
            currentUsername
          );

          allUsers.push(...lookup.allUsers);

          const projectCards = await fetchCards(
            { project: project.id },
            lookup
          );

          allCards.push(...projectCards);
        }

        // Remove duplicate users across projects.
        const uniqueUsers = Array.from(
          new Map(
            allUsers.map((user) => [user.id, user])
          ).values()
        );

        setUsers(uniqueUsers);
        setCards(allCards);
      } catch (error) {
        console.error(
          'FAILED TO LOAD DASHBOARD DATA:',
          error
        );
      }
    };

    void loadDashboardData();
  }, []);

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  // ==========================================================================
  // LIVE KPI COUNTS
  // ==========================================================================

  const assignedCount = useMemo(() => {
    return cards.filter(
      (card) =>
        card.assigneeId === currentUserId ||
        (card.assigneeIds &&
          card.assigneeIds.includes(currentUserId))
    ).length;
  }, [cards, currentUserId]);

  const inProgressCount = useMemo(() => {
    return cards.filter((card) =>
      card.columnId.includes('progress')
    ).length;
  }, [cards]);

  const createdCount = useMemo(() => {
    return cards.filter(
      (card) => card.publisherId === currentUserId
    ).length;
  }, [cards, currentUserId]);

  // ==========================================================================
  // RECOMMENDED SPACES
  // ==========================================================================

  const recommendedSpaces: SpaceItem[] = useMemo(() => {
    const countsByProject: Record<
      string,
      {
        todo: number;
        inProgress: number;
        done: number;
      }
    > = {};

    cards.forEach((card) => {
      if (!countsByProject[card.projectId]) {
        countsByProject[card.projectId] = {
          todo: 0,
          inProgress: 0,
          done: 0,
        };
      }

      if (card.columnId.includes('done')) {
        countsByProject[card.projectId].done += 1;
      } else if (card.columnId.includes('progress')) {
        countsByProject[card.projectId].inProgress += 1;
      } else {
        countsByProject[card.projectId].todo += 1;
      }
    });

    return projects.slice(0, 4).map((project) => ({
      project,

      // Use real users loaded from the backend instead of mockUsers.
      members: users.slice(0, 3).map((user) => ({
        id: user.id,
        name: user.name,
      })),

      // Use real card counts. No fake fallback numbers.
      issueCounts: countsByProject[project.id] ?? {
        todo: 0,
        inProgress: 0,
        done: 0,
      },

      // This is currently only a UI category because the backend
      // ProjectRecord does not provide a category field.
      category: 'software',
    }));
  }, [cards, projects, users]);

  const activeSpacesCount = projects.length;

  // ==========================================================================
  // CARD HANDLERS
  // ==========================================================================

  const handleSaveCard = (updatedCard: Card) => {
    setCards((prev) =>
      updateCardInList(prev, updatedCard)
    );

    setSelectedCard(updatedCard);
  };

  const handleDeleteCard = (cardId: string) => {
    setCards((prev) =>
      deleteCardFromList(prev, cardId)
    );

    setSelectedCard(null);
  };

  // ==========================================================================
  // WORK LOG
  // ==========================================================================

  const handleCreateWorkLog = async (data: {
    timeSpent: string;
    timeRemaining?: string | null;
    dateStarted: string;
    workDescription?: string;
  }) => {
    console.log('Work log created:', data);
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className={styles.container}>
      <main className={styles.content}>
        {/* Top Header Row */}
        <header className={styles.headerRow}>
          <div className={styles.headerText}>
            <div className={styles.greetingRow}>
              <h1 className={styles.title}>
                {getGreeting(currentUser.name)}
              </h1>
            </div>

            <p className={styles.subtitle}>
              {todayFormatted} · Here is your cross-project sprint summary
              and active work items.
            </p>
          </div>

          <div className={styles.headerActions}>
            <Button
              label="Explore projects"
              variant="primary"
              size="md"
              leftIcon={<CompassIcon size={15} />}
              onPress={() =>
                navigate(ROUTES.PROTECTED.SPACES)
              }
            />
          </div>
        </header>

        {/* Live KPI Metric Cards */}
        <section
          className={styles.kpiGrid}
          aria-label="Quick metrics"
        >
          <div
            className={styles.kpiCard}
            onClick={() => {
              const el =
                document.querySelector('[role="tablist"]');

              el?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
            role="button"
            tabIndex={0}
          >
            <div className={styles.kpiTop}>
              <span className={styles.kpiLabel}>
                Assigned to You
              </span>

              <span className={styles.kpiIcon}>
                <UserCheckIcon size={16} />
              </span>
            </div>

            <span className={styles.kpiValue}>
              {assignedCount}
            </span>

            <span className={styles.kpiDesc}>
              Open tasks requiring your review
            </span>
          </div>

          <div
            className={styles.kpiCard}
            onClick={() => {
              const el =
                document.querySelector('[role="tablist"]');

              el?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
            role="button"
            tabIndex={0}
          >
            <div className={styles.kpiTop}>
              <span className={styles.kpiLabel}>
                In Progress
              </span>

              <span className={styles.kpiIcon}>
                <ClockIcon size={16} />
              </span>
            </div>

            <span className={styles.kpiValue}>
              {inProgressCount}
            </span>

            <span className={styles.kpiDesc}>
              Active issues across ongoing sprints
            </span>
          </div>

          <div
            className={styles.kpiCard}
            onClick={() => {
              const el =
                document.querySelector('[role="tablist"]');

              el?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
            role="button"
            tabIndex={0}
          >
            <div className={styles.kpiTop}>
              <span className={styles.kpiLabel}>
                Created by You
              </span>

              <span className={styles.kpiIcon}>
                <PenToolIcon size={16} />
              </span>
            </div>

            <span className={styles.kpiValue}>
              {createdCount}
            </span>

            <span className={styles.kpiDesc}>
              Issues and tasks authored by you
            </span>
          </div>

          <div
            className={styles.kpiCard}
            onClick={() =>
              navigate(ROUTES.PROTECTED.SPACES)
            }
            role="button"
            tabIndex={0}
          >
            <div className={styles.kpiTop}>
              <span className={styles.kpiLabel}>
                Active Projects
              </span>

              <span className={styles.kpiIcon}>
                <GridIcon size={16} />
              </span>
            </div>

            <span className={styles.kpiValue}>
              {activeSpacesCount}
            </span>

            <span className={styles.kpiDesc}>
              Collaborative team workspaces
            </span>
          </div>
        </section>

        {/* 2-Column Main Dashboard Layout */}
        <div className={styles.mainGrid}>
          {/* Left Column: Your Work + Team Activity */}
          <div className={styles.leftColumn}>
            <ForYouSection
              cards={cards}
              projects={projects}
              columns={columns}
              users={users}
              currentUserId={currentUserId}
              onSelectCard={(card) =>
                setSelectedCard(card)
              }
            />
          </div>

          {/* Right Column: Recommended Spaces */}
          <div className={styles.rightColumn}>
            <RecommendedSpaces
              spaces={recommendedSpaces}
              maxItems={4}
            />
          </div>
        </div>
      </main>

      {/* Card Detail Dialog Modal */}
      {selectedCard && (
        <CardDetail
          visible={Boolean(selectedCard)}
          card={selectedCard}
          columns={columns}
          users={users}
          comments={[]}
          activityLogs={[]}
          currentUserId={currentUserId}
          onClose={() => setSelectedCard(null)}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
          onCreateWorkLog={handleCreateWorkLog}
        />
      )}
    </div>
  );
}

export default HomePage;