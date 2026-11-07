import { useMemo, useState } from "react";
import type { FC } from "react";
import { Text, Button } from "../../base";
import { ActivityLogItem } from "./ActivityLogItem";
import {
  ACTIVITY_LOG_FILTERS,
  type ActivityLogFilter,
  type ActivityLogProps,
} from "./types";

const HISTORY_ACTIONS = [
  "CARD_CREATED",
  "STATUS_CHANGED",
  "ASSIGNEE_CHANGED",
  "TITLE_UPDATED",
  "DESCRIPTION_UPDATED",
  "COMMENT_ADDED",
];

export const ActivityLog: FC<ActivityLogProps> = ({
  logs,
  users = [],
  cardId,
  title = "ACTIVITY",
  maxItems,
  style,
  className,
  filter,
  defaultFilter = "history",
  onFilterChange,
  showFilters = true,
  bordered = true,
  testID,
  onCreateWorkLog,
  canCreateWorkLog = false,
}) => {
  const [internalFilter, setInternalFilter] =
    useState<ActivityLogFilter>(defaultFilter);

  const activeFilter = filter ?? internalFilter;

  const handleFilterChange = (nextFilter: ActivityLogFilter) => {
    if (!filter) {
      setInternalFilter(nextFilter);
    }

    onFilterChange?.(nextFilter);
  };

  // Filter activity to the current card
  const cardLogs = useMemo(() => {
    return cardId
      ? logs.filter((log) => log.cardId === cardId)
      : logs;
  }, [logs, cardId]);

  // Filter according to the selected Activity tab
  const filteredLogs = useMemo(() => {
    if (activeFilter === "worklog") {
      return cardLogs.filter(
        (log) => log.action === "WORK_LOGGED"
      );
    }

    return cardLogs.filter((log) =>
      HISTORY_ACTIONS.includes(log.action)
    );
  }, [cardLogs, activeFilter]);

  // Newest activity first
  const sortedLogs = useMemo(() => {
    return [...filteredLogs].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  }, [filteredLogs]);

  const displayedLogs = maxItems
    ? sortedLogs.slice(0, maxItems)
    : sortedLogs;

  const getUser = (userId: string) =>
    users.find((u) => u.id === userId) || null;

  const emptyMessage =
    activeFilter === "worklog"
      ? "No work logs recorded yet."
      : "No history changes recorded yet.";

  return (
    <div
      data-testid={testID}
      className={className}
      style={{
        ...(bordered
          ? {
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-line)",
              borderRadius: "var(--radius-card)",
              padding: 16,
            }
          : {}),
        ...style,
      }}
    >
      {/* Header */}
      {title ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <Text
            variant="sectionLabel"
            muted
            style={{
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {title} ({displayedLogs.length})
          </Text>
        </div>
      ) : null}

      {/* Filter buttons */}
      {showFilters && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
            }}
          >
            {ACTIVITY_LOG_FILTERS.map((option) => (
              <Button
                key={option.value}
                label={option.label}
                variant={
                  activeFilter === option.value
                    ? "primary"
                    : "secondary"
                }
                size="sm"
                onPress={() =>
                  handleFilterChange(option.value)
                }
              />
            ))}
          </div>

          {/* Create Work Log button */}
          {activeFilter === "worklog" &&
            canCreateWorkLog &&
            onCreateWorkLog && (
              <Button
                label="Create work log"
                variant="primary"
                size="sm"
                onPress={onCreateWorkLog}
              />
            )}
        </div>
      )}

      {/* Empty state */}
      {displayedLogs.length === 0 ? (
        <div
          style={{
            padding: "24px 0",
            textAlign: "center",
          }}
        >
          <Text
            variant="bodySmall"
            muted
            style={{ fontStyle: "italic" }}
          >
            {emptyMessage}
          </Text>
        </div>
      ) : (
        <div style={{ marginTop: 8 }}>
          {displayedLogs.map((log, index) => {
            const isLast =
              index === displayedLogs.length - 1;

            const actor = getUser(log.actorId);

            return (
              <ActivityLogItem
                key={log.id}
                log={log}
                actor={actor}
                isLast={isLast}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;