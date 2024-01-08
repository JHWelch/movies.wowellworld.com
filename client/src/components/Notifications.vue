<script lang="ts" setup>
import { notifications } from '../state/notificationState'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/solid'

const icon = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
}
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-400"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="notifications.show()"
      data-testid="notifications"
      class="fixed top-0 right-0 py-4 pl-4 pr-6 m-4 rounded-lg shadow-lg text-white z-50 flex space-x-4 justify-center items-center"
      :class="{
        'bg-green-500': notifications.type === 'success',
        'bg-red-500': notifications.type === 'error',
        'bg-yellow-500': notifications.type === 'warning',
        'bg-blue-500': notifications.type === 'info',
      }"
    >
      <component
        :is="icon[notifications.type || 'info']"
        class="w-6 h-6"
      />

      <p>
        {{ notifications.message }}
      </p>

      <button
        class="absolute top-0 right-0 p-2"
        data-testid="notifications-close"
        @click="notifications.close()"
      >
        <XMarkIcon class="w-4 h-4" />
      </button>
    </div>
  </Transition>
</template>