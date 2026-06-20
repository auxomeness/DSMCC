const disabledApiMessage =
  'API integrations are disabled while the frontend is being built without a backend.'

const disabledRequest = <T = unknown>(..._args: unknown[]): Promise<{ data: T }> =>
  Promise.reject(new Error(disabledApiMessage))

export const apiClient = {
  delete: disabledRequest,
  get: disabledRequest,
  patch: disabledRequest,
  post: disabledRequest,
}
