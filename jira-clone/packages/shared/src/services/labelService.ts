import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS } from "../lib/endpoints";

export interface LabelRecord {
  id: number;
  name: string;
  project: number;
}

export interface CreateLabelData {
  name: string;
  project: number;
}

export interface UpdateLabelData {
  name?: string;
  project?: number;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function getLabels(): Promise<LabelRecord[]> {
  const response = await apiClient.get<
    LabelRecord[] | PaginatedResponse<LabelRecord>
  >(API_ENDPOINTS.LABELS.LIST);

  return Array.isArray(response.data)
    ? response.data
    : response.data.results;
}

export async function createLabel(
  data: CreateLabelData
): Promise<LabelRecord> {
  const response = await apiClient.post<LabelRecord>(
    API_ENDPOINTS.LABELS.LIST,
    data
  );

  return response.data;
}

export async function updateLabel(
  labelId: string | number,
  data: UpdateLabelData
): Promise<LabelRecord> {
  const response = await apiClient.patch<LabelRecord>(
    `${API_ENDPOINTS.LABELS.LIST}${labelId}/`,
    data
  );

  return response.data;
}

export async function deleteLabel(
  labelId: string | number
): Promise<void> {
  await apiClient.delete(
    `${API_ENDPOINTS.LABELS.LIST}${labelId}/`
  );
}