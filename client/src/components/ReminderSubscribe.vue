<script lang="ts" setup>
import { ref } from 'vue'
import FormInput from './form/FormInput.vue';

const open = ref<boolean>(false)
const email = ref<string>('')
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
    class="absolute w-full right-0 top-12 bg-violet-200 p-2 flex space-x-2"
  >
    <FormInput
      v-model="email"
      name="email"
      :hide-label="true"
    />

    <button
      class="button"
      data-testid="subscribe-button"
    >
      Subscribe
    </button>
  </div>
</template>
