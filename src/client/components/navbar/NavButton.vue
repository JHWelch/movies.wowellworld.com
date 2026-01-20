<script lang="ts" setup>
defineProps<{
  text: string
  route: string
}>()
</script>

<template>
  <router-link
    :to="route"
    class="flex flex-col text-sm items-center justify-center h-full p-2 leading-5 text-center md:text-xl grow sm:grow-0"
    :class="{
      'font-bold': route === $route.path,
      'font-medium ': route !== $route.path,
    }"
  >
    {{ text }}
  </router-link>
</template>
