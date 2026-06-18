import { type Role } from '@/types/auth'

export function hasRole(role: Role | undefined, allowedRoles: Role[]) {
  return role ? allowedRoles.includes(role) : false
}
