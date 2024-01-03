<script lang="ts" setup>
defineProps<{
  text: string
  route: string
}>()
</script>

<template>
  <router-link
    :to="route"
    class="flex h-full grow flex-col items-center justify-center px-4 py-2 font-medium sm:grow-0"
    :class="{
      'bg-violet-600 text-white': route === $route.path,
      'text-gray-800 hover:bg-violet-300': route !== $route.path,
    }"
  >
    {{ text }}
  </router-link>
</template>
