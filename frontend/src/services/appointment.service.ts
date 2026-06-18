import { apiClient } from '@/services/api/client'
import { endpoints } from '@/services/api/endpoints'

export async function listAppointments() {
  const response = await apiClient.get(endpoints.appointments)
  return response.data
}
