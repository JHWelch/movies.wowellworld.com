<script lang="ts" setup>
import { ref } from 'vue'

const open = ref<boolean>(false)
</script>

<template>
  <button
    v-if="!open"
    class="h-full py-2 px-4 font-medium flex flex-col justify-center items-center grow sm:grow-0 text-center leading-5"
    :class="{

    }"
    @click="open = !open"
  >
    Get Reminders!
  </button>



  <div v-else>
    <input
      type="email"
      placeholder="Email"
    >

    <button
      class="button"
      data-testid="subscribe-button"
    >
      Subscribe
    </button>
  </div>
</template>
