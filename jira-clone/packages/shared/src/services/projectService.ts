
import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS } from "../lib/endpoints";

export interface ProjectRecord {
  id: number;
  name: string;
  description: string;
  key: string;
  members: string[];
  created_at: string;
  updated_at: string;
  status: string;
  created_by: string | null;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CreateProjectData {
  name: string;
  description?: string;
  status?: string;
  members?: string[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: string;
  members?: string[];
}

export async function getProjects(): Promise<ProjectRecord[]> {
  const response = await apiClient.get<
    ProjectRecord[] | PaginatedResponse<ProjectRecord>
  >(API_ENDPOINTS.PROJECTS.LIST);

  return Array.isArray(response.data)
    ? response.data
    : response.data.results;
}

export async function getProjectByIdOrKey(
  idOrKey: string
): Promise<ProjectRecord | undefined> {
  const all = await getProjects();

  return all.find(
    (p) =>
      String(p.id) === idOrKey ||
      p.key.toLowerCase() === idOrKey.toLowerCase()
  );
}

export async function createProject(
  data: CreateProjectData
): Promise<ProjectRecord> {
  const response = await apiClient.post<ProjectRecord>(
    API_ENDPOINTS.PROJECTS.LIST,
    data
  );

  return response.data;
}

export async function updateProject(
  projectId: string | number,
  data: UpdateProjectData
): Promise<ProjectRecord> {
  const response = await apiClient.patch<ProjectRecord>(
    `${API_ENDPOINTS.PROJECTS.LIST}${projectId}/`,
    data
  );

  return response.data;
}

export async function deleteProject(
  projectId: string | number
): Promise<void> {
  await apiClient.delete(
    `${API_ENDPOINTS.PROJECTS.LIST}${projectId}/`
  );
}
