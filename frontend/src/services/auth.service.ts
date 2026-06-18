import { apiClient } from '@/services/api/client'
import { endpoints } from '@/services/api/endpoints'
import { type AuthUser } from '@/types/auth'

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterTenantPayload = {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  password: string
  floor: string
  unitNumber: string
}

export type AuthResponse = {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export async function login(payload: LoginPayload) {
  const response = await apiClient.post(endpoints.auth.login, payload)
  return response.data
}

export async function registerTenant(payload: RegisterTenantPayload) {
  const response = await apiClient.post(endpoints.auth.register, payload)
  return response.data
}

export async function getCurrentUser() {
  const response = await apiClient.get<{ data: { user: AuthUser } }>(endpoints.auth.me)
  return response.data.data.user
}
