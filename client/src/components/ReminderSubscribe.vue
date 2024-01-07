<script lang="ts" setup>
import { ref } from 'vue'
import FormInput from './form/FormInput.vue'
import { ErrorBag, Errors } from '../types'
import { notifications } from '../state/notificationState'
import { fireConfetti } from '../utilities/confetti'

const open = ref<boolean>(false)
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

const subscribe = async () => {
  const response = await fetch('/api/subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email.value }),
  })

  const data = await response.json()

  if (!response.ok) {
    handleErrors(data)

    return
  }

  open.value = false
  email.value = ''
  fireConfetti()
}
</script>

<template>
  <button
    class="h-full py-2 px-4 font-medium flex flex-col justify-center items-center grow sm:grow-0 text-center leading-5"
    :class="{
      'text-white bg-violet-600': open,
      'text-gray-800 hover:bg-violet-300': !open,
    }"
    data-testid="get-reminders-button"
    @click="open = !open"
  >
    Get Reminders!
  </button>

  <div
    v-if="open"
    class="absolute w-full right-0 top-12 bg-violet-200 p-3 space-y-4"
  >
    <p class="text-sm">
      Get a email reminder the day before upcoming movie nights
    </p>

    <div class="w-full flex space-x-4">
      <FormInput
        v-model="email"
        name="email"
        :hide-label="true"
        :error="errors.email"
        @clear-error="errors = {}"
        @enter="subscribe"
      />

      <button
        class="flex items-center justify-center px-4 py-1 font-semibold text-white rounded-md bg-violet-600 hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 h-9 text-sm"
        data-testid="subscribe-button"
        @click="subscribe"
      >
        Subscribe
      </button>
    </div>
  </div>
</template>
