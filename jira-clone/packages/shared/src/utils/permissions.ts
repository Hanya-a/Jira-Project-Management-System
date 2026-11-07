import type { CardRole } from '../types/card';

export function getCardRole(
  currentUserId: string,
  card: { publisherId: string; assigneeId?: string | null; assigneeIds?: string[] }
): CardRole {
  if (card.publisherId === currentUserId) return 'reporter';
  if (
    card.assigneeId === currentUserId ||
    (card.assigneeIds && card.assigneeIds.includes(currentUserId))
  ) {
    return 'assignee';
  }
  return 'viewer';
}

export const cardPermissions = {
  canEditTitle: (role: CardRole): boolean => role === 'reporter',
  canEditDescription: (role: CardRole): boolean => role === 'reporter' || role === 'assignee',
  canChangeAssignee: (role: CardRole): boolean => role === 'reporter',
  canMoveStatus: (role: CardRole): boolean => role === 'reporter' || role === 'assignee',
  canEditDates: (role: CardRole): boolean => role === 'reporter' || role === 'assignee',
  canDeleteCard: (role: CardRole): boolean => role === 'reporter',
  canComment: (_role: CardRole): boolean => true, // all authenticated members can comment
};
