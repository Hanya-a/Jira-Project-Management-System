
import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';

import { DEFAULT_CARD_TYPES } from '@jira-clone/shared';

import Input from '../../base/input/Input';
import Badge from '../../base/badge/Badge';
import Avatar from '../avatar/Avatar';

import type {
  BoardFilterBarProps,
  BoardFilterOption,
} from './types';

const SearchIcon: FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const CloseIcon: FC<{ size?: number }> = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const PersonIcon: FC<{ size?: number }> = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

const ShareIcon: FC<{ size?: number }> = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.6 13.5 6.8 4" />
    <path d="m15.4 6.5-6.8 4" />
  </svg>
);

const ChevronDownIcon: FC<{ size?: number }> = ({ size = 12 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const PlusIcon: FC<{ size?: number }> = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const CheckIcon: FC<{ size?: number; color?: string }> = ({
  size = 14,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const UnassignedAvatarIcon: FC<{ size?: number }> = ({ size = 28 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-paper)',
      border: '1px dashed var(--color-line)',
      color: 'var(--color-muted)',
      flexShrink: 0,
    }}
  >
    <PersonIcon size={size * 0.45} />
  </div>
);

const renderTypeIcon = (type: string, size = 15) => {
  switch (type.toLowerCase()) {
    case 'task':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      );

    case 'bug':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="8" y="7" width="8" height="11" rx="4" />
          <path d="M12 3v4" />
          <path d="M5 10h3" />
          <path d="M16 10h3" />
          <path d="M5 14h3" />
          <path d="M16 14h3" />
          <path d="M7 6 5 4" />
          <path d="m17 6 2-2" />
        </svg>
      );

    case 'story':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 4h14v16H5z" />
          <path d="M8 8h8" />
          <path d="M8 12h6" />
        </svg>
      );

    case 'epic':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 3 3 6 6 .9-4.5 4.4 1.1 6.2L12 17.5 6.4 20.5l1.1-6.2L3 9.9 9 9z" />
        </svg>
      );

    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
};

const getTypeDescription = (type: string) => {
  switch (type.toLowerCase()) {
    case 'task':
      return 'A general piece of work';
    case 'bug':
      return 'A problem or defect';
    case 'story':
      return 'A user-focused requirement';
    case 'epic':
      return 'A large body of work';
    default:
      return 'All card types';
  }
};

const FilterDropdown: FC<{
  label: string;
  value?: string;
  options: BoardFilterOption[];
  onChange?: (value: string) => void;
}> = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.id === value);
  const isActive = Boolean(value && value !== 'all');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'relative',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 12px',
          borderRadius: 'var(--radius-pill)',
          border: `1px solid ${
            isActive ? 'var(--color-accent)' : 'var(--color-line)'
          }`,
          backgroundColor: isActive
            ? 'var(--color-accent-soft)'
            : 'var(--color-paper)',
          color: isActive
            ? 'var(--color-accent)'
            : 'var(--color-ink)',
          fontSize: 12,
          fontWeight: isActive ? 600 : 500,
          cursor: 'pointer',
          transition: 'all 150ms ease',
          whiteSpace: 'nowrap',
        }}
      >
        <span>
          {isActive && selectedOption
            ? `${label}: ${selectedOption.label}`
            : label}
        </span>

        <ChevronDownIcon size={12} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            minWidth: 180,
            maxHeight: 280,
            overflowY: 'auto',
            backgroundColor: 'var(--color-paper)',
            border: '1px solid var(--color-line)',
            borderRadius: 'var(--radius-card, 8px)',
            boxShadow:
              '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            zIndex: 100,
            padding: '4px 0',
          }}
        >
          {options.length === 0 ? (
            <div
              style={{
                padding: '10px 12px',
                fontSize: 12,
                color: 'var(--color-muted)',
              }}
            >
              No options available
            </div>
          ) : (
            options.map((option) => {
              const isSelected = option.id === value;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChange?.(option.id);
                    setOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    padding: '7px 12px',
                    backgroundColor: isSelected
                      ? 'var(--color-accent-soft)'
                      : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: 12,
                    color: isSelected
                      ? 'var(--color-accent)'
                      : 'var(--color-ink)',
                  }}
                >
                  <span>{option.label}</span>

                  {isSelected && (
                    <CheckIcon
                      size={14}
                      color="var(--color-accent)"
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

const BoardFilterBar: FC<BoardFilterBarProps> = ({
  searchQuery = '',
  onSearchChange,

  assignedToMe = false,
  onToggleAssignedToMe,

  sharedWithMe = false,
  onToggleSharedWithMe,

  selectedType = 'all',
  onSelectType,
  cardTypes = DEFAULT_CARD_TYPES,

  createdByMe = false,
  onToggleCreatedByMe,

  hasComments = false,

  selectedUserIds = [],
  onToggleUserId,
  users = [],
  currentUser,

  selectedStatus = 'all',
  onSelectStatus,
  statuses = [],

  selectedPriority = 'all',
  onSelectPriority,
  priorities = [],

  selectedProject = 'all',
  onSelectProject,
  projects = [],

  selectedLabel = 'all',
  onSelectLabel,
  labels = [],

  selectedOrdering = '',
  onSelectOrdering,
  orderingOptions = [],

  matchCount,
  totalCount,

  onClearFilters,

  style,
  className,
  testID,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const [memberSearch, setMemberSearch] = useState('');
  const [typeSearch, setTypeSearch] = useState('');

  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsDropdownOpen(false);
      }

      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(target)
      ) {
        setIsTypeDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsTypeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const primaryUsers = users.slice(0, 2);

  const extraSelectedUsers = users
    .slice(2)
    .filter((user) => selectedUserIds.includes(user.id));

  const displayedUsers = [...primaryUsers, ...extraSelectedUsers];

  const isUnassignedSelected = selectedUserIds.includes('unassigned');

  const isSharedActive = sharedWithMe || createdByMe;

  const isTypeActive = selectedType !== 'all';

  const currentType =
    cardTypes.find((cardType) => cardType.id === selectedType) ??
    cardTypes.find((cardType) => cardType.id === 'all');

  const filteredUsers = users.filter((user) => {
    const query = memberSearch.toLowerCase();

    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const filteredCardTypes = cardTypes.filter((cardType) => {
    const query = typeSearch.toLowerCase();

    return (
      cardType.label.toLowerCase().includes(query) ||
      cardType.id.toLowerCase().includes(query) ||
      getTypeDescription(cardType.id)
        .toLowerCase()
        .includes(query)
    );
  });

  const activeFilterCount =
    Number(Boolean(searchQuery)) +
    Number(assignedToMe) +
    Number(isSharedActive) +
    Number(isTypeActive) +
    Number(hasComments) +
    selectedUserIds.length +
    Number(selectedStatus !== 'all') +
    Number(selectedPriority !== 'all') +
    Number(selectedProject !== 'all') +
    Number(selectedLabel !== 'all') +
    Number(Boolean(selectedOrdering));

  return (
    <div
      data-testid={testID}
      className={className}
      style={{
        width: '100%',
        border: '1px solid var(--color-line)',
        borderRadius: 'var(--radius-card, 10px)',
        backgroundColor: 'var(--color-paper)',
        padding: 12,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Search row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
        }}
      >
        <div
          style={{
            position: 'relative',
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-muted)',
              pointerEvents: 'none',
            }}
          >
            <SearchIcon size={16} />
          </div>

          <Input
            value={searchQuery}
            onChangeText={(text) => onSearchChange?.(text)}
            placeholder="Filter cards by title, key, or description..."
            style={{
              width: '100%',
              paddingLeft: 34,
            }}
          />
        </div>

        {typeof matchCount === 'number' &&
          typeof totalCount === 'number' && (
            <span
              style={{
                fontSize: 12,
                color: 'var(--color-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {matchCount}/{totalCount}
            </span>
          )}
      </div>

      {/* Filters row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
          marginTop: 12,
        }}
      >
        {/* Assigned to me */}
        <button
          type="button"
          onClick={onToggleAssignedToMe}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            borderRadius: 'var(--radius-pill)',
            border: `1px solid ${
              assignedToMe
                ? 'var(--color-accent)'
                : 'var(--color-line)'
            }`,
            backgroundColor: assignedToMe
              ? 'var(--color-accent-soft)'
              : 'var(--color-paper)',
            color: assignedToMe
              ? 'var(--color-accent)'
              : 'var(--color-ink)',
            fontSize: 12,
            fontWeight: assignedToMe ? 600 : 500,
            cursor: 'pointer',
          }}
        >
          <PersonIcon size={14} />
          Assigned to me
        </button>

        {/* Shared with me */}
        <button
          type="button"
          onClick={
            onToggleSharedWithMe ?? onToggleCreatedByMe
          }
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            borderRadius: 'var(--radius-pill)',
            border: `1px solid ${
              isSharedActive
                ? 'var(--color-accent)'
                : 'var(--color-line)'
            }`,
            backgroundColor: isSharedActive
              ? 'var(--color-accent-soft)'
              : 'var(--color-paper)',
            color: isSharedActive
              ? 'var(--color-accent)'
              : 'var(--color-ink)',
            fontSize: 12,
            fontWeight: isSharedActive ? 600 : 500,
            cursor: 'pointer',
          }}
        >
          <ShareIcon size={14} />
          Shared with me
        </button>

        {/* Type */}
        <div
          ref={typeDropdownRef}
          style={{
            position: 'relative',
          }}
        >
          <button
            type="button"
            onClick={() =>
              setIsTypeDropdownOpen((current) => !current)
            }
            aria-expanded={isTypeDropdownOpen}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 'var(--radius-pill)',
              border: `1px solid ${
                isTypeActive
                  ? 'var(--color-accent)'
                  : 'var(--color-line)'
              }`,
              backgroundColor: isTypeActive
                ? 'var(--color-accent-soft)'
                : 'var(--color-paper)',
              color: isTypeActive
                ? 'var(--color-accent)'
                : 'var(--color-ink)',
              fontSize: 12,
              fontWeight: isTypeActive ? 600 : 500,
              cursor: 'pointer',
            }}
          >
            {currentType &&
              renderTypeIcon(currentType.id, 14)}

            <span>
              {isTypeActive && currentType
                ? `Type: ${currentType.label}`
                : 'Type'}
            </span>

            <ChevronDownIcon size={12} />
          </button>

          {isTypeDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                width: 260,
                maxHeight: 360,
                overflowY: 'auto',
                backgroundColor: 'var(--color-paper)',
                border: '1px solid var(--color-line)',
                borderRadius: 'var(--radius-card, 8px)',
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                zIndex: 100,
                padding: 8,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 9,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-muted)',
                    pointerEvents: 'none',
                  }}
                >
                  <SearchIcon size={14} />
                </div>

                <Input
                  value={typeSearch}
                  onChangeText={setTypeSearch}
                  placeholder="Search types..."
                  style={{
                    width: '100%',
                    paddingLeft: 30,
                    fontSize: 12,
                  }}
                />
              </div>

              {filteredCardTypes.map((cardType) => {
                const isSelected =
                  cardType.id === selectedType;

                return (
                  <button
                    key={cardType.id}
                    type="button"
                    onClick={() => {
                      onSelectType?.(cardType.id);
                      setIsTypeDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 10px',
                      border: 'none',
                      borderRadius: 6,
                      backgroundColor: isSelected
                        ? 'var(--color-accent-soft)'
                        : 'transparent',
                      color: isSelected
                        ? 'var(--color-accent)'
                        : 'var(--color-ink)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 6,
                        backgroundColor:
                          'var(--color-surface)',
                        flexShrink: 0,
                      }}
                    >
                      {renderTypeIcon(cardType.id, 15)}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {cardType.label}
                      </div>

                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--color-muted)',
                          marginTop: 2,
                        }}
                      >
                        {getTypeDescription(cardType.id)}
                      </div>
                    </div>

                    {isSelected && (
                      <CheckIcon
                        size={14}
                        color="var(--color-accent)"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Status */}
        <FilterDropdown
          label="Status"
          value={selectedStatus}
          options={statuses}
          onChange={onSelectStatus}
        />

        {/* Priority */}
        <FilterDropdown
          label="Priority"
          value={selectedPriority}
          options={priorities}
          onChange={onSelectPriority}
        />

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 24,
            backgroundColor: 'var(--color-line)',
            margin: '0 2px',
          }}
        />

        {/* Member avatars */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {displayedUsers.map((user) => {
            const isSelected =
              selectedUserIds.includes(user.id);

            return (
              <button
                key={user.id}
                type="button"
                onClick={() =>
                  onToggleUserId?.(user.id)
                }
                onMouseEnter={() =>
                  setHoveredUserId(user.id)
                }
                onMouseLeave={() =>
                  setHoveredUserId(null)
                }
                title={user.name}
                style={{
                  position: 'relative',
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  outline: isSelected
                    ? '2px solid var(--color-accent)'
                    : 'none',
                  outlineOffset: 1,
                }}
              >
                <Avatar
                  imageUrl={user.avatarUrl}
                  name={user.name}
                  size={28}
                />

                {hoveredUserId === user.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap',
                      padding: '4px 7px',
                      borderRadius: 5,
                      backgroundColor:
                        'var(--color-ink)',
                      color: 'var(--color-paper)',
                      fontSize: 10,
                      zIndex: 110,
                      pointerEvents: 'none',
                    }}
                  >
                    {user.name}
                  </div>
                )}
              </button>
            );
          })}

          {isUnassignedSelected && (
            <button
              type="button"
              onClick={() =>
                onToggleUserId?.('unassigned')
              }
              title="Unassigned"
              style={{
                padding: 0,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              <UnassignedAvatarIcon size={28} />
            </button>
          )}

          {/* Add member */}
          <div
            ref={dropdownRef}
            style={{
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() =>
                setIsDropdownOpen((current) => !current)
              }
              aria-expanded={isDropdownOpen}
              style={{
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: '1px dashed var(--color-line)',
                backgroundColor: 'var(--color-paper)',
                color: 'var(--color-muted)',
                cursor: 'pointer',
              }}
              title="Filter by member"
            >
              <PlusIcon size={14} />
            </button>

            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: 260,
                  maxHeight: 340,
                  overflowY: 'auto',
                  backgroundColor: 'var(--color-paper)',
                  border: '1px solid var(--color-line)',
                  borderRadius: 'var(--radius-card, 8px)',
                  boxShadow:
                    '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  zIndex: 100,
                  padding: 8,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 9,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-muted)',
                      pointerEvents: 'none',
                    }}
                  >
                    <SearchIcon size={14} />
                  </div>

                  <Input
                    value={memberSearch}
                    onChangeText={setMemberSearch}
                    placeholder="Search members..."
                    style={{
                      width: '100%',
                      paddingLeft: 30,
                      fontSize: 12,
                    }}
                  />
                </div>

                {/* Current user */}
                {currentUser && (
                  <button
                    type="button"
                    onClick={() =>
                      onToggleUserId?.(currentUser.id)
                    }
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '7px 8px',
                      border: 'none',
                      borderRadius: 6,
                      backgroundColor:
                        selectedUserIds.includes(
                          currentUser.id
                        )
                          ? 'var(--color-accent-soft)'
                          : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Avatar
                      imageUrl={currentUser.avatarUrl}
                      name={currentUser.name}
                      size={28}
                    />

                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--color-ink)',
                        }}
                      >
                        {currentUser.name}
                      </div>

                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--color-muted)',
                        }}
                      >
                        Me
                      </div>
                    </div>

                    {selectedUserIds.includes(
                      currentUser.id
                    ) && (
                      <CheckIcon
                        size={14}
                        color="var(--color-accent)"
                      />
                    )}
                  </button>
                )}

                {/* Unassigned */}
                <button
                  type="button"
                  onClick={() =>
                    onToggleUserId?.('unassigned')
                  }
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '7px 8px',
                    border: 'none',
                    borderRadius: 6,
                    backgroundColor:
                      isUnassignedSelected
                        ? 'var(--color-accent-soft)'
                        : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <UnassignedAvatarIcon size={28} />

                  <div
                    style={{
                      flex: 1,
                      fontSize: 12,
                      color: 'var(--color-ink)',
                    }}
                  >
                    Unassigned
                  </div>

                  {isUnassignedSelected && (
                    <CheckIcon
                      size={14}
                      color="var(--color-accent)"
                    />
                  )}
                </button>

                {filteredUsers.map((user) => {
                  const isSelected =
                    selectedUserIds.includes(user.id);

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() =>
                        onToggleUserId?.(user.id)
                      }
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '7px 8px',
                        border: 'none',
                        borderRadius: 6,
                        backgroundColor: isSelected
                          ? 'var(--color-accent-soft)'
                          : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <Avatar
                        imageUrl={user.avatarUrl}
                        name={user.name}
                        size={28}
                      />

                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--color-ink)',
                          }}
                        >
                          {user.name}
                        </div>

                        <div
                          style={{
                            fontSize: 11,
                            color: 'var(--color-muted)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {user.email}
                        </div>
                      </div>

                      {isSelected && (
                        <CheckIcon
                          size={14}
                          color="var(--color-accent)"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Label */}
        <FilterDropdown
          label="Label"
          value={selectedLabel}
          options={labels}
          onChange={onSelectLabel}
        />

        {/* Sort */}
        <FilterDropdown
          label="Sort"
          value={selectedOrdering}
          options={orderingOptions}
          onChange={onSelectOrdering}
        />

        {/* Reset */}
        {activeFilterCount > 0 && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 10px',
              marginLeft: 'auto',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-muted)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            <CloseIcon size={13} />
            Reset

            <Badge
              label={String(activeFilterCount)}
              style={{
                fontSize: 10,
                minWidth: 18,
                height: 18,
                padding: '0 5px',
              }}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default BoardFilterBar;

