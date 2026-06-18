import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/hooks/useAuth'
import { getCurrentUser } from '@/services/auth.service'

export function useCurrentUser() {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getCurrentUser,
    enabled: Boolean(accessToken),
  })
}
