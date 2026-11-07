import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS } from "../lib/endpoints";
import type { ActivityLog, ActivityActionType } from "../types/activity";

interface HistoryRecord {
  id: number;
  card: string;
  user: string;
  action: ActivityActionType;
  description: string;
  created_at: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

function recordToActivityLog(raw: HistoryRecord): ActivityLog {
  return {
    id: String(raw.id),
    cardId: raw.card,
    actorId: raw.user,
    action: raw.action,
    details: {
      message: raw.description,
    },
    createdAt: raw.created_at,
  };
}

export async function getHistory(
  cardId?: string
): Promise<ActivityLog[]> {
  const response = await apiClient.get<
    HistoryRecord[] | PaginatedResponse<HistoryRecord>
  >(API_ENDPOINTS.HISTORY.LIST);

  const records = Array.isArray(response.data)
    ? response.data
    : response.data.results;

  const logs = records.map(recordToActivityLog);

  if (!cardId) {
    return logs;
  }

  return logs.filter(
    (log: ActivityLog) =>
      String(log.cardId) === String(cardId)
  );
}