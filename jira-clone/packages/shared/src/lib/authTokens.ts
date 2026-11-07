export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const STORAGE_KEY = 'jira-auth-tokens';

export function getAuthTokens(): AuthTokens | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AuthTokens;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function setAuthTokens(nextTokens: AuthTokens): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextTokens));
}

export function clearAuthTokens(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}