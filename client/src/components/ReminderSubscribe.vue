<script lang="ts" setup>
import { ref } from 'vue'
import FormInput from '@components/form/FormInput.vue'
import { ErrorBag, Errors } from '@client/types'
import { notifications } from '@client/state/notificationState'
import { fireConfetti } from '@client/utilities/confetti'
import { jsonHeaders } from '@client/data/headers'

const isOpen = ref<boolean>(false)
const email = ref<string>('')

const errors = ref<Errors>({})

const handleErrors = (data: ErrorBag) => {
  if (data.errors) {
    errors.value = data.errors
  }

  if (data.message) {
    notifications.flash(data.message, 'error')
  }
}

const subscribe = async (event: MouseEvent | KeyboardEvent) => {
  event.stopPropagation()
  const response = await fetch('/api/subscriptions', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email: email.value }),
  })

  const data = await response.json()

  if (!response.ok) {
    handleErrors(data)

    return
  }

  isOpen.value = false
  email.value = ''
  fireConfetti()
}
</script>

<template>
  <button
    class="flex flex-col items-center justify-center h-full px-4 py-2 font-medium leading-5 text-center grow sm:grow-0"
    :class="{
      'bg-purp-dark text-mint': isOpen,
      'hover:bg-purp-dark hover:text-mint text-white': !isOpen,
    }"
    data-testid="get-reminders-button"
    @click="isOpen = !isOpen"
  >
    Get Reminders!
  </button>

  <div
    v-if="isOpen"
    class="absolute w-full right-0 top-12 bg-brat-500 p-3 space-y-4 max-w-[500px] min-[500px]:rounded-b-md"
  >
    <p class="text-sm">
      Get an email reminder the day before upcoming movie nights
    </p>

    <div class="flex w-full space-x-4">
      <FormInput
        v-model="email"
        name="email"
        :hide-label="true"
        :error="errors.email"
        @clear-error="errors = {}"
        @keyup.enter="subscribe"
      />

      <button
        class="flex items-center justify-center px-4 py-1 text-sm font-semibold rounded-md text-mint bg-purp-dark hover:bg-purp-light focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brat-500 h-9"
        data-testid="subscribe-button"
        @click="subscribe"
      >
        Subscribe
      </button>
    </div>
  </div>
</template>
