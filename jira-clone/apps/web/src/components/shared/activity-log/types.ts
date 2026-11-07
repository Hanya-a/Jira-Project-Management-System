import type { CSSProperties } from 'react';
import type {ActivityLog as ActivityLogType,User,} from '@jira-clone/shared';

export type ActivityLogFilter = 'history' | 'worklog';

export interface ActivityLogFilterOption {
  label: string;
  value: ActivityLogFilter;
}

export const ACTIVITY_LOG_FILTERS: ActivityLogFilterOption[] = [
  { label: 'History', value: 'history' },
  { label: 'Work Log', value: 'worklog' },
];

export interface ActivityLogProps {
  /** Array of activity log events */
  logs: ActivityLogType[];

  /** Available workspace members to resolve actor profile */
  users?: User[];

  /** Optional filter for a specific card */
  cardId?: string;

  /** Optional header title */
  title?: string;

  /** Maximum number of items to display */
  maxItems?: number;

  /** Custom container style */
  style?: CSSProperties;

  /** Custom CSS class */
  className?: string;

  /** Controlled active filter */
  filter?: ActivityLogFilter;

  /** Default filter if uncontrolled */
  defaultFilter?: ActivityLogFilter;

  /** Callback fired when filter changes */
  onFilterChange?: (filter: ActivityLogFilter) => void;

  /** Whether to show the filter pills */
  showFilters?: boolean;

  /** Whether to render with card background and border */
  bordered?: boolean;

  /** Test identifier */
  testID?: string;

  /** Callback to open the Create Work Log modal */
  onCreateWorkLog?: () => void;

  /** Whether the current user is allowed to create a work log */
  canCreateWorkLog?: boolean;
}