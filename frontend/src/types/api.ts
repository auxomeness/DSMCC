export type ApiSuccessResponse<TData = unknown> = {
  success: true
  message: string
  data: TData
}

export type ApiErrorResponse = {
  success: false
  message: string
  errors?: unknown
}
