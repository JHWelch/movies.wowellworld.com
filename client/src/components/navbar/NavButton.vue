<script lang="ts" setup>
defineProps<{
  text: string
  route: string
}>()
</script>

<template>
  <router-link
    :to="route"
    class="flex flex-col items-center justify-center h-full px-4 py-2 font-medium leading-5 text-center grow sm:grow-0"
    :class="{
      'text-mint bg-purp-dark': route === $route.path,
      'text-white hover:text-mint hover:bg-purp-dark': route !== $route.path,
    }"
  >
    {{ text }}
  </router-link>
</template>
