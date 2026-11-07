import type { CSSProperties } from 'react';
import type { User, CardTypeOption } from '@jira-clone/shared';

export interface BoardFilterOption {
  id: string;
  label: string;
}

export interface BoardFilterBarProps {
  /** Search query text */
  searchQuery?: string;
  /** Search query change handler */
  onSearchChange?: (query: string) => void;

  /** Whether "Assigned to me" filter is active */
  assignedToMe?: boolean;
  /** Toggle "Assigned to me" */
  onToggleAssignedToMe?: () => void;

  /** Whether "Shared with me" filter is active */
  sharedWithMe?: boolean;
  /** Toggle "Shared with me" */
  onToggleSharedWithMe?: () => void;

  /** Currently selected card type */
  selectedType?: string;
  /** Callback fired when card type filter changes */
  onSelectType?: (type: string) => void;
  /** Available card type options */
  cardTypes?: CardTypeOption[];

  /** Whether "Created by Me" filter is active */
  createdByMe?: boolean;
  /** Toggle "Created by Me" */
  onToggleCreatedByMe?: () => void;

  /** Whether "Has Comments" filter is active */
  hasComments?: boolean;
  /** Toggle "Has Comments" */
  onToggleHasComments?: () => void;

  /** Array of selected user IDs for assignee filtering */
  selectedUserIds?: string[];
  /** Toggle selection of a user ID */
  onToggleUserId?: (userId: string) => void;

  /** Available workspace members */
  users?: User[];

  /** Current logged-in user */
  currentUser?: User | null;

  /** Currently selected status */
  selectedStatus?: string;
  /** Callback fired when status changes */
  onSelectStatus?: (status: string) => void;
  /** Available status options */
  statuses?: BoardFilterOption[];

  /** Currently selected priority */
  selectedPriority?: string;
  /** Callback fired when priority changes */
  onSelectPriority?: (priority: string) => void;
  /** Available priority options */
  priorities?: BoardFilterOption[];

  /** Currently selected project */
  selectedProject?: string;
  /** Callback fired when project changes */
  onSelectProject?: (project: string) => void;
  /** Available project options */
  projects?: BoardFilterOption[];

  /** Currently selected label */
  selectedLabel?: string;
  /** Callback fired when label changes */
  onSelectLabel?: (label: string) => void;
  /** Available label options */
  labels?: BoardFilterOption[];

  /** Currently selected ordering */
  selectedOrdering?: string;
  /** Callback fired when ordering changes */
  onSelectOrdering?: (ordering: string) => void;
  /** Available ordering options */
  orderingOptions?: BoardFilterOption[];

  /** Filtered cards count to display */
  matchCount?: number;
  /** Total cards count */
  totalCount?: number;

  /** Callback fired when user clears all filters */
  onClearFilters?: () => void;

  /** Custom container style */
  style?: CSSProperties;
  /** Custom CSS class name */
  className?: string;
  /** Test identifier */
  testID?: string;
}