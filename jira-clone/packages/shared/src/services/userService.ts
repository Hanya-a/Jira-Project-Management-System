import type { User } from "../types/user";

export interface UserWithUsername extends User {
  username: string;
}

export interface UserLookup {
  allUsers: User[];
  byUsername: Record<string, UserWithUsername>;
  byId: Record<string, UserWithUsername>;
  currentUserId?: string;
}

interface ProjectWithMembers {
  members: string[];
}

export async function buildUserLookup(
  project: ProjectWithMembers,
  currentUsername?: string
): Promise<UserLookup> {
  const users: UserWithUsername[] = project.members.map((username) => ({
    id: username,
    name: username,
    email: "",
    initials: username.slice(0, 2).toUpperCase(),
    username,
  }));

  const byUsername: Record<string, UserWithUsername> = {};
  const byId: Record<string, UserWithUsername> = {};

  for (const user of users) {
    byUsername[user.username] = user;
    byId[user.id] = user;
  }

  return {
    allUsers: users,
    byUsername,
    byId,
    currentUserId: currentUsername
      ? byUsername[currentUsername]?.id
      : undefined,
  };
}