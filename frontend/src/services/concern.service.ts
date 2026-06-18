import { apiClient } from '@/services/api/client'
import { endpoints } from '@/services/api/endpoints'

export async function listConcerns() {
  const response = await apiClient.get(endpoints.concerns)
  return response.data
}
