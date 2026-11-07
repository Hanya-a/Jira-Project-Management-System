import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS } from "../lib/endpoints";

export interface CreateWorkLogData {
  timeSpent: string;
  timeRemaining?: string | null;
  dateStarted: string;
  workDescription?: string;
}

export interface WorkLog {
  id: string;
  cardId: string;
  userId: string;
  timeSpent: string;
  timeRemaining?: string | null;
  dateStarted: string;
  workDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkLogRecord {
  id: number;
  card: string;
  user: string;
  time_spent: string;
  time_remaining: string | null;
  date_started: string;
  work_description: string;
  created_at: string;
  updated_at: string;
}
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

function recordToWorkLog(raw: WorkLogRecord): WorkLog {
  return {
    id: String(raw.id),
    cardId: raw.card,
    userId: raw.user,
    timeSpent: raw.time_spent,
    timeRemaining: raw.time_remaining,
    dateStarted: raw.date_started,
    workDescription: raw.work_description,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export async function getWorkLogs(): Promise<WorkLog[]> {
  const response = await apiClient.get<
    WorkLogRecord[] | PaginatedResponse<WorkLogRecord>
  >(API_ENDPOINTS.WORKLOG.LIST);

  const records = Array.isArray(response.data)
    ? response.data
    : response.data.results;

  return records.map(recordToWorkLog);
}

export async function createWorkLog(
  cardKey: string,
  data: CreateWorkLogData
): Promise<WorkLog> {
  const response = await apiClient.post<WorkLogRecord>(
    API_ENDPOINTS.WORKLOG.LIST,
    {
      card: cardKey,
      time_spent: data.timeSpent,
      time_remaining: data.timeRemaining || null,
      date_started: data.dateStarted,
      work_description: data.workDescription ?? "",
    }
  );

  return recordToWorkLog(response.data);
}