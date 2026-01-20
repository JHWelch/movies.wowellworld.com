import { reactive } from 'vue'
import { NotificationType } from '@shared/notifications'

export type NotificationState = {
  message?: string
  type?: NotificationType
  show: () => boolean
  open: (message: string, type?: NotificationType) => void
  flash: (
    message: string,
    type?: NotificationType,
    timeout?: number,
  ) => void
  close: () => void
}

export const notifications: NotificationState = reactive<NotificationState>({
  message: undefined,
  type: undefined,
  show: () => notifications.message !== undefined,
  open: (
    message: string,
    type: NotificationType = 'info',
  ) => {
    notifications.message = message
    notifications.type = type
  },
  flash: (
    message: string,
    type?: NotificationType,
    timeout: number = 5000,
  ) => {
    notifications.open(message, type)
    setTimeout(notifications.close, timeout)
  },
  close: () => {
    notifications.message = undefined
    notifications.type = undefined
  },
})
