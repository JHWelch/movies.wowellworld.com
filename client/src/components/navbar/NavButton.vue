<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps<{
  text: string
  route: string
}>()
</script>

<!-- <%= route === path
        ? 'text-white bg-violet-600'
        : 'text-gray-800 hover:bg-violet-300'
      %>" -->

<template>
  <router-link
    :to="route"
    class="h-full py-2 px-4 font-medium flex flex-col justify-center items-center grow sm:grow-0"
  >
    {{ text }}
  </router-link>
</template>
