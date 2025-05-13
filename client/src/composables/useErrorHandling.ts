import { notifications } from '@client/state/notificationState'
import { ErrorBag, Errors } from '@client/types'
import { ref } from 'vue'

const errors = ref<Errors>({})

const handleErrors = (data: ErrorBag) => {
  if (data.errors) {
    errors.value = data.errors
  }

  if (data.message) {
    notifications.flash(data.message, 'error')
  }
}

export function useErrorHandling () {
  return {
    errors,
    handleErrors,
  }
}
