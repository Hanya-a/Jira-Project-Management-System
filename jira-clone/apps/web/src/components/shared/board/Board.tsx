import { useRef, useState } from 'react';
import type { CSSProperties, FC, ReactNode } from 'react';

import type {BoardColumn as BoardColumnType,Card as 
  CardType,CardTypeOption,User,} from '@jira-clone/shared';
import {DEFAULT_CARD_TYPES,filterCards,} from '@jira-clone/shared';
import { Text, Badge } from '../../base';
import BoardColumn, {DEFAULT_COLUMN_WIDTH,} from '../board-column/BoardColumn';
import BoardFilterBar from '../board-filter-bar';

export interface BoardProps {
  columns: BoardColumnType[];
  cards: CardType[];

  cardTypes?: CardTypeOption[];

  users?: User[];
  currentUserId?: string;

  boardTitle?: string;
  projectKey?: string;

  showFilterBar?: boolean;
  showColumnTabs?: boolean;

  onCardPress?: (card: CardType) => void;

  onCardMove?: (
    card: CardType,
    toColumnId?: string
  ) => void;
  
  onAddLabel?: (card: CardType) => void;

  onCardAssigneeChange?: (
    userId: string | null,
    card: CardType
  ) => void;

  onCardAssigneesChange?: (
    userIds: string[],
    card: CardType
  ) => void;

  onAddCardPress?: (columnId: string) => void;

  onCreateCard?: (
    title: string,
    columnId: string
  ) => void | Promise<void>;

  canCreateCard?: boolean;

  refreshing?: boolean;
  onRefresh?: () => void;

  columnWidth?: number | string;
  columnGap?: number;

  renderHeader?: () => ReactNode;
  renderFooter?: () => ReactNode;

  style?: CSSProperties;
  contentContainerStyle?: CSSProperties;

  testID?: string;
}

const GridIcon: FC<{ size?: number }> = ({
  size = 40,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

export const Board: FC<BoardProps> = ({
  columns = [],
  cards = [],

  cardTypes = DEFAULT_CARD_TYPES,

  users = [],
  currentUserId,

  boardTitle,
  projectKey,

  showFilterBar = true,
  showColumnTabs = true,

  onCardPress,
  onCardMove,
  onAddLabel,
  onCardAssigneeChange,
  onCardAssigneesChange,

  

  onAddCardPress,
  onCreateCard,
  canCreateCard = true,

  refreshing = false,
  onRefresh,

  columnWidth = DEFAULT_COLUMN_WIDTH,
  columnGap = 12,

  renderHeader,
  renderFooter,

  style,
  contentContainerStyle,

  testID,
}) => {
  const boardScrollRef = useRef<HTMLDivElement>(null);

  const [activeColumnIndex, setActiveColumnIndex] =
    useState(0);

  // ---------------------------------------------------------
  // FILTER STATE
  // ---------------------------------------------------------

  const [searchQuery, setSearchQuery] = useState('');

  const [assignedToMe, setAssignedToMe] =
    useState(false);

  const [sharedWithMe, setSharedWithMe] =
    useState(false);

  const [createdByMe, setCreatedByMe] =
    useState(false);

  const [hasCommentsFilter, setHasCommentsFilter] =
    useState(false);

  const [selectedFilterUserIds, setSelectedFilterUserIds] =
    useState<string[]>([]);

  const [selectedType, setSelectedType] =
    useState('all');

  const [selectedStatus, setSelectedStatus] =
    useState('all');

  const [selectedPriority, setSelectedPriority] =
    useState('all');

  const [selectedProject, setSelectedProject] =
    useState('all');

  const [selectedLabel, setSelectedLabel] =
    useState('all');

  const [selectedOrdering, setSelectedOrdering] =
    useState('');

  // ---------------------------------------------------------
  // FILTER OPTIONS
  // ---------------------------------------------------------

  const statusOptions = [
    { id: 'all', label: 'All statuses' },
    { id: 'todo', label: 'TODO' },
    { id: 'in_progress', label: 'IN PROGRESS' },
    { id: 'in_review', label: 'IN REVIEW' },
    { id: 'done', label: 'DONE' },
  ];

  const priorityOptions = [
    { id: 'all', label: 'All priorities' },
    { id: 'lowest', label: 'Lowest' },
    { id: 'low', label: 'Low' },
    { id: 'medium', label: 'Medium' },
    { id: 'high', label: 'High' },
    { id: 'highest', label: 'Highest' },
  ];

  const typeOptions = cardTypes;

  const projectOptions = [
    { id: 'all', label: 'All projects' },
    ...(projectKey
      ? [
          {
            id: String(projectKey),
            label: String(projectKey),
          },
        ]
      : []),
  ];

  const labelIds = Array.from(
    new Set(
      cards.flatMap((card) => {
        const labels = (
          card as CardType & {
            labels?:
              | string[]
              | {
                  id?: string;
                  name?: string;
                }[];
          }
        ).labels;

        if (!labels) {
          return [];
        }

        return labels
          .map((label) =>
            typeof label === 'string'
              ? label
              : String(
                  label.id ??
                    label.name ??
                    ''
                )
          )
          .filter(Boolean);
      })
    )
  );

  const labelOptions = [
    { id: 'all', label: 'All labels' },
    ...labelIds.map((id) => ({
      id,
      label: id,
    })),
  ];

  const orderingOptions = [
    {
      id: 'name',
      label: 'Name (A–Z)',
    },
    {
      id: '-name',
      label: 'Name (Z–A)',
    },
    {
      id: 'priority',
      label: 'Priority (Low → High)',
    },
    {
      id: '-priority',
      label: 'Priority (High → Low)',
    },
    {
      id: 'status',
      label: 'Status (A–Z)',
    },
    {
      id: '-status',
      label: 'Status (Z–A)',
    },
    {
      id: 'due_date',
      label: 'Due date (Oldest)',
    },
    {
      id: '-due_date',
      label: 'Due date (Newest)',
    },
    {
      id: 'created_at',
      label: 'Created (Oldest)',
    },
    {
      id: '-created_at',
      label: 'Created (Newest)',
    },
    {
      id: 'updated_at',
      label: 'Updated (Oldest)',
    },
    {
      id: '-updated_at',
      label: 'Updated (Newest)',
    },
  ];

  // ---------------------------------------------------------
  // MEMBER FILTER
  // ---------------------------------------------------------

  const handleToggleFilterUserId = (
    userId: string
  ) => {
    setSelectedFilterUserIds((previous) =>
      previous.includes(userId)
        ? previous.filter((id) => id !== userId)
        : [...previous, userId]
    );
  };

  // ---------------------------------------------------------
  // CLEAR FILTERS
  // ---------------------------------------------------------

  const handleClearFilters = () => {
    setSearchQuery('');
    setAssignedToMe(false);
    setSharedWithMe(false);
    setCreatedByMe(false);
    setHasCommentsFilter(false);

    setSelectedFilterUserIds([]);

    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSelectedProject('all');
    setSelectedLabel('all');
    setSelectedOrdering('');
  };

  // ---------------------------------------------------------
  // FILTER CARDS
  // ---------------------------------------------------------

  const filteredCards = filterCards(cards, {
    searchQuery,
    assignedToMe,
    sharedWithMe,
    createdByMe,
    hasComments: hasCommentsFilter,
    selectedUserIds: selectedFilterUserIds,
    currentUserId,
    type: selectedType,
    status: selectedStatus,
    priority: selectedPriority,
    project: selectedProject,
    label: selectedLabel,
  });

  // ---------------------------------------------------------
  // SORT CARDS
  // ---------------------------------------------------------

  const orderedCards = [...filteredCards].sort(
    (a, b) => {
      switch (selectedOrdering) {
        case 'name':
          return a.title.localeCompare(b.title);

        case '-name':
          return b.title.localeCompare(a.title);

        case 'priority':
          return String(a.priority).localeCompare(
            String(b.priority)
          );

        case '-priority':
          return String(b.priority).localeCompare(
            String(a.priority)
          );

        case 'status':
          return String(a.columnId).localeCompare(
            String(b.columnId)
          );

        case '-status':
          return String(b.columnId).localeCompare(
            String(a.columnId)
          );

        case 'due_date':
          return (
            new Date(a.dueDate ?? 0).getTime() -
            new Date(b.dueDate ?? 0).getTime()
          );

        case '-due_date':
          return (
            new Date(b.dueDate ?? 0).getTime() -
            new Date(a.dueDate ?? 0).getTime()
          );

        case 'created_at':
          return (
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
          );

        case '-created_at':
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );

        case 'updated_at':
          return (
            new Date(a.updatedAt).getTime() -
            new Date(b.updatedAt).getTime()
          );

        case '-updated_at':
          return (
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
          );

        default:
          return 0;
      }
    }
  );

  // ---------------------------------------------------------
  // COLUMN SCROLLING
  // ---------------------------------------------------------

  const scrollToColumn = (index: number) => {
    if (
      index < 0 ||
      index >= columns.length
    ) {
      return;
    }

    setActiveColumnIndex(index);

    const columnElement =
      boardScrollRef.current?.children[
        index
      ] as HTMLElement | undefined;

    if (columnElement) {
      columnElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

  const handleBoardScroll = () => {
    const container =
      boardScrollRef.current;

    if (!container) {
      return;
    }

    const children = Array.from(
      container.children
    ) as HTMLElement[];

    if (children.length === 0) {
      return;
    }

    const containerLeft =
      container.getBoundingClientRect().left;

    let closestIndex = 0;
    let closestDistance = Infinity;

    children.forEach((child, index) => {
      const distance = Math.abs(
        child.getBoundingClientRect().left -
          containerLeft
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveColumnIndex(closestIndex);
  };

  // ---------------------------------------------------------
  // COLUMN COLOR
  // ---------------------------------------------------------

  const getColumnColor = (
    column: BoardColumnType
  ) => {
    if (column.color) {
      return column.color;
    }

    if (column.id.includes('done')) {
      return '#10B981';
    }

    if (column.id.includes('review')) {
      return 'var(--color-accent)';
    }

    if (column.id.includes('progress')) {
      return '#3B82F6';
    }

    return 'var(--color-ink-muted)';
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <div
      data-testid={testID}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 0,
        backgroundColor:
          'var(--color-paper)',
        ...style,
      }}
    >
      {/* HEADER */}

      {(boardTitle || projectKey) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '12px 16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minWidth: 0,
              flex: 1,
            }}
          >
            {projectKey && (
              <Badge
                label={projectKey}
                variant="accent"
                size="sm"
                rounded
              />
            )}

            {boardTitle && (
              <Text
                variant="heading"
                bold
                numberOfLines={1}
              >
                {boardTitle}
              </Text>
            )}
          </div>

          <Badge
            label={`${orderedCards.length} ${
              orderedCards.length === 1
                ? 'issue'
                : 'issues'
            }`}
            variant="neutral"
            size="sm"
          />
        </div>
      )}

      {/* CUSTOM HEADER */}

      {renderHeader?.()}

      {/* FILTER BAR */}

      {showFilterBar && (
        <BoardFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}

          assignedToMe={assignedToMe}
          onToggleAssignedToMe={() =>
            setAssignedToMe(
              (previous) => !previous
            )
          }

          sharedWithMe={sharedWithMe}
          onToggleSharedWithMe={() =>
            setSharedWithMe(
              (previous) => !previous
            )
          }

          selectedType={selectedType}
          onSelectType={setSelectedType}
          cardTypes={typeOptions}

          createdByMe={createdByMe}
          onToggleCreatedByMe={() =>
            setCreatedByMe(
              (previous) => !previous
            )
          }

          hasComments={hasCommentsFilter}
          onToggleHasComments={() =>
            setHasCommentsFilter(
              (previous) => !previous
            )
          }

          selectedUserIds={
            selectedFilterUserIds
          }
          onToggleUserId={
            handleToggleFilterUserId
          }

          users={users}

          currentUser={users.find(
            (user) =>
              user.id === currentUserId
          )}

          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          statuses={statusOptions}

          selectedPriority={
            selectedPriority
          }
          onSelectPriority={
            setSelectedPriority
          }
          priorities={priorityOptions}

          selectedLabel={selectedLabel}
          onSelectLabel={setSelectedLabel}
          labels={labelOptions}

          selectedOrdering={
            selectedOrdering
          }
          onSelectOrdering={
            setSelectedOrdering
          }
          orderingOptions={orderingOptions}

          matchCount={
            orderedCards.length
          }
          totalCount={cards.length}

          onClearFilters={
            handleClearFilters
          }
        />
      )}

      {/* COLUMN TABS */}

      {showColumnTabs &&
        columns.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              padding: '0 16px 12px',
              scrollbarWidth: 'thin',
            }}
          >
            {columns.map(
              (column, index) => {
                const isActive =
                  index ===
                  activeColumnIndex;

                const count =
                  orderedCards.filter(
                    (card) =>
                      card.columnId ===
                      column.id
                  ).length;

                return (
                  <button
                    key={column.id}
                    type="button"
                    onClick={() =>
                      scrollToColumn(
                        index
                      )
                    }
                    aria-selected={
                      isActive
                    }
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      flexShrink: 0,
                      padding: '6px 12px',
                      borderRadius:
                        'var(--radius-pill)',
                      border: `1px solid ${
                        isActive
                          ? 'var(--color-ink)'
                          : 'var(--color-line)'
                      }`,
                      backgroundColor:
                        'var(--color-surface)',
                      color: isActive
                        ? 'var(--color-ink)'
                        : 'var(--color-ink-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor:
                          getColumnColor(
                            column
                          ),
                        flexShrink: 0,
                      }}
                    />

                    <span
                      style={{
                        fontSize: 12,
                        fontWeight:
                          isActive
                            ? 700
                            : 500,
                        whiteSpace:
                          'nowrap',
                      }}
                    >
                      {column.title}
                    </span>

                    <Badge
                      label={String(
                        count
                      )}
                      variant="neutral"
                      size="sm"
                      rounded
                    />
                  </button>
                );
              }
            )}
          </div>
        )}

      {/* BOARD */}

      {columns.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 48,
            margin: 16,
            backgroundColor:
              'var(--color-surface)',
            border:
              '1px dashed var(--color-line)',
            borderRadius:
              'var(--radius-card)',
            color:
              'var(--color-ink-muted)',
          }}
        >
          <GridIcon size={40} />

          <Text
            variant="body"
            bold
            style={{
              marginTop: 12,
            }}
          >
            No columns configured
          </Text>

          <Text
            variant="caption"
            muted
            style={{
              textAlign: 'center',
              marginTop: 4,
              maxWidth: 260,
            }}
          >
            This board does not have
            any workflow columns set up
            yet.
          </Text>
        </div>
      ) : (
        <div
          ref={boardScrollRef}
          onScroll={handleBoardScroll}
          style={{
            display: 'flex',
            gap: columnGap,
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '0 16px 24px',
            flex: 1,
            minHeight: 0,
            alignItems: 'flex-start',
            boxSizing: 'border-box',
            ...contentContainerStyle,
          }}
        >
          {columns.map((column) => {
            const columnCards =
              orderedCards.filter(
                (card) =>
                  card.columnId ===
                  column.id
              );

            return (
              <BoardColumn
                key={column.id}
                column={column}
                cards={columnCards}
                users={users}
                currentUserId={currentUserId}
                onCardPress={onCardPress}
                onCardMove={onCardMove}
                onAddLabel={onAddLabel}
                onCardAssigneeChange={onCardAssigneeChange}
                onCardAssigneesChange={onCardAssigneesChange}
                onAddCardPress={onAddCardPress}
                onCreateCard={onCreateCard}
                canCreateCard={canCreateCard}
                columnWidth={columnWidth}
              />
            );
          })}
        </div>
      )}

      {/* REFRESH */}

      {onRefresh && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '4px 16px 8px',
          }}
        >
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            style={{
              border: 'none',
              background: 'transparent',
              color:
                'var(--color-accent)',
              cursor: refreshing
                ? 'default'
                : 'pointer',
              fontSize: 12,
              opacity: refreshing
                ? 0.6
                : 1,
            }}
          >
            {refreshing
              ? 'Refreshing...'
              : 'Refresh'}
          </button>
        </div>
      )}

      {/* FOOTER */}

      {renderFooter?.()}
    </div>
  );
};

export default Board;
