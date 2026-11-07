import { useEffect, useState } from 'react';

import { Outlet, useLocation, useNavigate } from 'react-router';

import { Sidenav, type SidenavPage } from '../components/shared/sidenav';

import { useTheme } from '../hooks';

import { ROUTES } from '../routes/paths';

import {
  getProjects,
} from '@jira-clone/shared';

import type {
  Project,
  ProjectRecord,
} from '@jira-clone/shared';

import styles from './ProtectedLayout.module.css';

export function ProtectedLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const { isDark, toggleTheme } = useTheme();

  const location = useLocation();

  const navigate = useNavigate();

  const currentUsername =
    sessionStorage.getItem('jira-current-username') ?? '';

  const currentUser = {
    id: currentUsername,
    name: currentUsername,
    email: '',
    initials: currentUsername.slice(0, 2).toUpperCase(),
  };

  // Load projects from the backend
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const backendProjects = await getProjects();
        const convertedProjects: Project[] = backendProjects.map(
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
        if (convertedProjects.length > 0 && !selectedProjectId) {
          setSelectedProjectId(convertedProjects[0].id);
        }
      } catch (error) {
        console.error('FAILED TO LOAD PROJECTS IN PROTECTED LAYOUT:', error);
      }
    };

    void loadProjects();
  }, [selectedProjectId]);

  // Derive active project from the current space route
  const spaceMatch = location.pathname.match(
    /^\/spaces\/([^/]+)/
  );

  const matchedProject = spaceMatch?.[1]
    ? projects.find(
        (project) =>
          String(project.id) === spaceMatch[1] ||
          project.key.toLowerCase() === spaceMatch[1].toLowerCase()
      )
    : undefined;

  const currentProject =
    matchedProject ??
    projects.find(
      (project) => String(project.id) === selectedProjectId
    ) ??
    projects[0];

  // Map route to SidenavPage
  const getActivePage = (): SidenavPage => {
    const path = location.pathname;

    if (path.startsWith(ROUTES.PROTECTED.SPACES)) return 'projects';

    if (path.startsWith(ROUTES.PROTECTED.NOTIFICATIONS)) {
      return 'notifications';
    }

    if (path.startsWith(ROUTES.PROTECTED.PROFILE)) return 'settings';

    return 'home';
  };

  const handleNavigate = (page: SidenavPage) => {
    switch (page) {
      case 'home':
        navigate(ROUTES.PROTECTED.HOME);
        break;

      case 'projects':
      case 'board':
      case 'backlog':
      case 'activity':
        navigate(ROUTES.PROTECTED.SPACES);
        break;

      case 'notifications':
        navigate(ROUTES.PROTECTED.NOTIFICATIONS);
        break;

      case 'settings':
        navigate(ROUTES.PROTECTED.PROFILE);
        break;

      default:
        navigate(ROUTES.PROTECTED.HOME);
        break;
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidenav rendered on PROTECTED route pages ONLY */}
      <div className={styles.sidenavWrapper}>
        <Sidenav
          activePage={getActivePage()}
          onNavigate={handleNavigate}
          projects={projects}
          currentProject={currentProject}
          onSelectProject={(id) => {
            setSelectedProjectId(id);
            navigate(`/spaces/${id}`);
          }}
          currentUser={currentUser}
          unreadNotificationsCount={2}
          collapsed={collapsed}
          onToggleCollapse={(col) => setCollapsed(col)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onLogout={() => navigate(ROUTES.AUTH.SIGN_IN)}
          style={{ height: '100%' }}
        />
      </div>

      <main className={styles.contentWrapper}>
        <Outlet />
      </main>
    </div>
  );
}

export default ProtectedLayout;
