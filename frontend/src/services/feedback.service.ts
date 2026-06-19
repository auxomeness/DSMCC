import { apiClient } from '@/services/api/client'
import { endpoints } from '@/services/api/endpoints'
import { type ApiSuccessResponse } from '@/types/api'

export type FeedbackType = 'FEEDBACK' | 'SUGGESTION'

export type SubmitFeedbackPayload = {
  email?: string
  message: string
  name?: string
  type: FeedbackType
}

export async function submitFeedback(payload: SubmitFeedbackPayload) {
  const response = await apiClient.post<ApiSuccessResponse<undefined>>(
    endpoints.feedbacks,
    payload,
  )

  return response.data
}
