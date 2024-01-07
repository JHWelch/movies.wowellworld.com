<script lang="ts" setup>
import { notifications } from '../state/notificationState';
import { XMarkIcon } from '@heroicons/vue/24/solid'

</script>

<template>
  <div
    v-if="notifications.show()"
    data-testid="notifications"
    class="fixed top-0 right-0 py-4 pl-4 pr-6 m-4 rounded-lg shadow-lg text-white z-50"
    :class="{
      'bg-green-500': notifications.type === 'success',
      'bg-red-500': notifications.type === 'error',
      'bg-yellow-500': notifications.type === 'warning',
      'bg-blue-500': notifications.type === 'info',
    }"
  >
    <p>
      {{ notifications.message }}
    </p>

    <button
      class="absolute top-0 right-0 p-2"
      @click="notifications.close()"
    >
      <XMarkIcon class="w-4 h-4" />
    </button>
  </div>
</template>
