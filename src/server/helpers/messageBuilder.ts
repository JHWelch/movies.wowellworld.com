import { NotificationType } from '@shared/notifications'

const withMessage = (
  route: string,
  message: string,
  type: NotificationType = 'success',
) => route + '?message=' + encodeURIComponent(message) + '&type=' + type

export {
  withMessage,
}
