export type NotificationType = 'success' | 'info' | 'warning' | 'error'

export const isNotificationType = (type: unknown): type is NotificationType =>
  typeof type === 'string' && ['success', 'info', 'warning', 'error'].includes(type)
