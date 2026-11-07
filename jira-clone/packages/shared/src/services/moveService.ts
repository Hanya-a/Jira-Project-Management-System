import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS } from "../lib/endpoints";

export interface MoveRecord {
  id: number;
  card: string;         // card key, e.g. "CARD-14"
  from_project: string; // project key
  to_project: string;   // project key
  moved_by: string;     // username
  created_at: string;
}

export interface MoveCardPayload {
  card: string;       // card KEY, not id
  to_project: string; // project KEY, not id
}

export async function moveCardToProject(
  cardKey: string,
  toProjectKey: string
): Promise<MoveRecord> {
  const response = await apiClient.post<MoveRecord>(
    API_ENDPOINTS.MOVE.LIST,
    {
      card: cardKey,
      to_project: toProjectKey,
    } as MoveCardPayload
  );

  return response.data;
}