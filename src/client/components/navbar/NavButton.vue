<script lang="ts" setup>
defineProps<{
  text: string
  route: string
}>()
</script>

<template>
  <router-link
    :to="route"
    class="flex flex-col items-center justify-center h-full p-2 text-sm leading-5 text-center md:text-xl grow sm:grow-0 hover:bg-primary-dark hover:text-dark focus:bg-primary-dark focus:text-dark focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-dark focus:ring-primary-dark"
    :class="{
      'font-bold': route === $route.path,
      'font-medium ': route !== $route.path,
    }"
  >
    {{ text }}
  </router-link>
</template>
