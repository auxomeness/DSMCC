import { apiClient } from '@/services/api/client'
import { endpoints } from '@/services/api/endpoints'

export async function listOffices() {
  const response = await apiClient.get(endpoints.offices)
  return response.data
}
