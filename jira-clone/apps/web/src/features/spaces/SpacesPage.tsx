import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router';
import { Button, Input, Dropdown } from '../../components/base';
import { ProjectCard } from '../../components/shared/project-card';
import { Pagination } from '../../components/shared/pagination';
import styles from './SpacesPage.module.css';

import {
  getProjects,
  useDebounce,
} from '@jira-clone/shared';
import type {
  SpaceItem,
  ProjectRecord,
} from '@jira-clone/shared';

import { CreateSpaceModal } from './components/create-space-modal';
import type { CreateSpaceInput } from './components/create-space-modal';

// ============================================================================
// ICONS
// ============================================================================

const SearchIcon: FC<{ size?: number }> = ({ size = 15 }) => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const PlusIcon: FC<{ size?: number }> = ({ size = 16 }) => (
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
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export function SpacesPage() {
  const navigate = useNavigate();

  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const [selectedSort, setSelectedSort] = useState('updated');

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 36;

  // ==========================================================================
  // LOAD PROJECTS FROM BACKEND
  // ==========================================================================

  useEffect(() => {
    const loadProjects = async () => {
      console.log('🔥 REAL SPACES PAGE IS RUNNING');
      try {
        const projects = await getProjects();

        const convertedSpaces: SpaceItem[] = projects.map(
          (project: ProjectRecord) => ({
            project: {
              id: String(project.id),
              name: project.name,
              description: project.description,
              key: project.key,
              ownerId: project.created_by ?? '',
              createdAt: project.created_at,
              updatedAt: project.updated_at,
            },

            members: project.members.map((username) => ({
              id: username,
              name: username,
            })),

            issueCounts: {
              todo: 0,
              inProgress: 0,
              done: 0,
            },

            // Backend ProjectRecord currently has no category field.
            category: 'software',
          })
        );

        setSpaces(convertedSpaces);
      } catch (error) {
        console.error('FAILED TO LOAD PROJECTS:', error);
      }
    };

    void loadProjects();
  }, []);

  // ==========================================================================
  // PAGINATION
  // ==========================================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedSort]);

  // ==========================================================================
  // SEARCH
  // ==========================================================================

  const filteredSpaces = spaces.filter((space) => {
    const query = debouncedSearchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      space.project.name.toLowerCase().includes(query) ||
      space.project.key.toLowerCase().includes(query) ||
      (space.project.description ?? '').toLowerCase().includes(query)
    );
  });

  // ==========================================================================
  // SORT
  // ==========================================================================

  const sortedSpaces = [...filteredSpaces].sort((a, b) => {
    if (selectedSort === 'name') {
      return a.project.name.localeCompare(b.project.name);
    }

    if (selectedSort === 'created') {
      return (
        new Date(b.project.createdAt).getTime() -
        new Date(a.project.createdAt).getTime()
      );
    }

    // Default: updated
    return (
      new Date(b.project.updatedAt).getTime() -
      new Date(a.project.updatedAt).getTime()
    );
  });

  const totalItems = sortedSpaces.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );

  const startIndex = (currentPage - 1) * pageSize;

  const visibleSpaces = sortedSpaces.slice(
    startIndex,
    startIndex + pageSize
  );

  // ==========================================================================
  // CREATE PROJECT
  // ==========================================================================

  const handleCreateSpace = (input: CreateSpaceInput) => {
    console.log(
      'Create project is not connected to the backend yet:',
      input
    );

    setIsCreateModalOpen(false);
  };

  // ==========================================================================

  return (
    <div className={styles.container}>
      {/* Header Row */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>All Projects</h1>

          <p className={styles.subtitle}>
            Browse, filter, and access all team projects, boards, and backlogs.
          </p>
        </div>

        <Button
          label="Create project"
          variant="primary"
          size="md"
          leftIcon={<PlusIcon size={16} />}
          onPress={() => setIsCreateModalOpen(true)}
        />
      </header>

      {/* Top Filter Bar */}
      <section
        className={styles.filterBar}
        aria-label="Project filters"
      >
        <div className={styles.filtersLeft}>
          {/* Search Input */}
          <div className={styles.searchContainer}>
            <Input
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search projects by name or key..."
              leftIcon={<SearchIcon size={15} />}
              containerStyle={{ marginBottom: 0 }}
              inputWrapperStyle={{ minHeight: 38 }}
            />
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className={styles.filtersRight}>
          <div className={styles.sortDropdown}>
            <Dropdown
              value={selectedSort}
              options={[
                {
                  value: 'updated',
                  label: 'Recently updated',
                },
                {
                  value: 'created',
                  label: 'Recently created',
                },
                {
                  value: 'name',
                  label: 'Name',
                },
              ]}
              onSelect={setSelectedSort}
              placeholder="Sort by"
            />
          </div>
        </div>
      </section>

      {/* Spaces Grid */}
      <main
        className={styles.spacesGrid}
        aria-label="Spaces list"
      >
        {visibleSpaces.map((item) => (
          <ProjectCard
            key={item.project.id}
            project={item.project}
            members={item.members}
            issueCounts={item.issueCounts}
            category={item.category}
            onPress={() =>
              navigate(`/spaces/${item.project.id}`)
            }
          />
        ))}
      </main>

      {/* Pagination Footer */}
      <footer className={styles.paginationSection}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </footer>

      {/* Create Space Modal */}
      <CreateSpaceModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateSpace}
      />
    </div>
  );
}

export default SpacesPage;