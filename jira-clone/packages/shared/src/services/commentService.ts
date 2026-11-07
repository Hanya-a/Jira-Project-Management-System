import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS } from "../lib/endpoints";
import type { Comment } from "../types/comment";

interface CommentRecord {
  id: number | string;
  card:
    | number
    | string
    | {
        id?: number | string;
      };
  author:
    | number
    | string
    | {
        id?: number | string;
      };
  content: string;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

function getId(
  value:
    | number
    | string
    | {
        id?: number | string;
      }
    | null
    | undefined
): string {
  if (
    typeof value === "object" &&
    value !== null
  ) {
    return String(value.id ?? "");
  }

  return String(value ?? "");
}

function recordToComment(
  raw: CommentRecord
): Comment {
  return {
    id: String(raw.id),
    cardId: getId(raw.card),
    authorId: getId(raw.author),
    content: raw.content,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export async function getComments(
  cardId?: string
): Promise<Comment[]> {
  const response = await apiClient.get<
    CommentRecord[] | PaginatedResponse<CommentRecord>
  >(API_ENDPOINTS.COMMENTS.LIST);

  const records = Array.isArray(response.data)
    ? response.data
    : response.data.results;

  const comments = records.map(recordToComment);

  if (!cardId) {
    return comments;
  }

  return comments.filter(
    (comment: Comment) =>
      String(comment.cardId) === String(cardId)
  );
}

export async function createComment(
  cardId: string,
  content: string
): Promise<Comment> {
  const response =
    await apiClient.post<CommentRecord>(
      API_ENDPOINTS.COMMENTS.LIST,
      {
        card: cardId,
        content,
      }
    );

  const comment = recordToComment(
    response.data
  );

  // Guarantee the frontend has the card ID
  // even if the backend returns an unexpected
  // representation of the card.
  return {
    ...comment,
    cardId: String(cardId),
  };
}

export async function deleteComment(
  commentId: string
): Promise<void> {
  await apiClient.delete(
    `${API_ENDPOINTS.COMMENTS.LIST}${commentId}/`
  );
}