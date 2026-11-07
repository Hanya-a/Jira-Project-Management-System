export const API_ENDPOINTS = {
  AUTH: {
    REFRESH: '/authentication/token/refresh/',
    LOGIN: '/authentication/login/',
  },
  PROJECTS: {
    LIST: '/card_manager/projects/',
    DETAIL: (id: string | number) => `/card_manager/projects/${id}/`,
  },
  CARDS: {
    LIST: '/card_manager/cards/',
    DETAIL: (id: string | number) => `/card_manager/cards/${id}/`,
  },
  HISTORY: {
    LIST: '/card_manager/history/',
  },
  COMMENTS: {
    LIST: '/card_manager/comment/',
    DETAIL: (id: string | number) => `/card_manager/comment/${id}/`,
  },
  LABELS: {
    LIST: '/card_manager/label/',
  },
  MOVE: {
    LIST: '/card_manager/move/',
  },
  WORKLOG: {
    LIST: '/card_manager/worklog/',
  },

} as const;