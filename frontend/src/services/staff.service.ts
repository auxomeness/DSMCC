import { apiClient } from '@/services/api/client'
import { endpoints } from '@/services/api/endpoints'

export async function listStaff() {
  const response = await apiClient.get(endpoints.staff)
  return response.data
}
