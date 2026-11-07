// packages/shared/src/services/cardService.ts
import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS } from "../lib/endpoints";
import type { Card } from "../types/card"; // adjust to your real path
import type { UserLookup } from "./userService.ts";

export interface CardRecord {
  id: number;
  name: string;
  key: string;
  summary: string;
  type: string;
  status: string;
  assignee: string | null;
  reporter: string;
  priority: string;
  due_date: string;
  labels: string[];
  created_at: string;
  updated_at: string;
  project: number;
}

function recordToCard(raw: CardRecord, users: UserLookup): Card {
  const assigneeUser = raw.assignee ? users.byUsername[raw.assignee] : undefined;
  const reporterUser = users.byUsername[raw.reporter];
  return {
    id: String(raw.id),
    key: raw.key,
    title: raw.name,
    description: raw.summary,
    type: raw.type,
    columnId: raw.status,
    assigneeId: assigneeUser?.id ?? null,
    assigneeIds: assigneeUser ? [assigneeUser.id] : [],
    priority: raw.priority as Card["priority"],
    dueDate: raw.due_date,
    labels: raw.labels,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    projectId: String(raw.project),
    publisherId: reporterUser?.id ?? raw.reporter,
    commentCount: 0,
  } as Card;
}

function cardToPayload(card: Partial<Card>, users: UserLookup) {
  const assigneeId = card.assigneeId ?? card.assigneeIds?.[0] ?? null;
  const payload: Record<string, unknown> = {};
  if (card.title !== undefined) payload.name = card.title;
  if (card.description !== undefined) payload.summary = card.description;
  if (card.type !== undefined) payload.type = card.type;
  if (card.columnId !== undefined) payload.status = card.columnId;
  if (card.assigneeId !== undefined || card.assigneeIds !== undefined) {
    payload.assignee = assigneeId ? users.byId[assigneeId]?.username ?? null : null;
  }
  if (card.priority !== undefined) payload.priority = card.priority;
  if (card.dueDate !== undefined) payload.due_date = card.dueDate;
  if (card.labels !== undefined) payload.labels = card.labels;
  if (card.projectId !== undefined) payload.project = Number(card.projectId);
  return payload;
}

export async function fetchCards(
  params: { project?: string | number },
  users: UserLookup
): Promise<Card[]> {
  const response = await apiClient.get(API_ENDPOINTS.CARDS.LIST, { params });
  const raw: CardRecord[] = Array.isArray(response.data) ? response.data : (response.data as any).results;
  return raw.map((c) => recordToCard(c, users));
}

export async function createCard(card: Partial<Card>, users: UserLookup): Promise<Card> {
  const response = await apiClient.post<CardRecord>(API_ENDPOINTS.CARDS.LIST, cardToPayload(card, users));
  return recordToCard(response.data, users);
}

export async function updateCard(
  id: string,
  patch: Partial<Card>,
  users: UserLookup
): Promise<Card> {
  const response = await apiClient.patch<CardRecord>(
    API_ENDPOINTS.CARDS.DETAIL(id),
    cardToPayload(patch, users)
  );

  return recordToCard(response.data, users);
}

export async function updateCardStatus(
  id: string,
  status: string,
  users: UserLookup
): Promise<Card> {
  const response = await apiClient.patch<CardRecord>(
    API_ENDPOINTS.CARDS.DETAIL(id),
    { status }
  );

  return recordToCard(response.data, users);
}

export async function deleteCard(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.CARDS.DETAIL(id));
}