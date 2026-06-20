export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  appointments: '/appointments',
  concerns: '/concerns',
  offices: '/offices',
  staff: '/staff',
} as const
