<script lang="ts" setup>
defineProps<{
  text: string
  route: string
}>()
</script>

<template>
  <router-link
    :to="route"
    class="h-full py-2 px-4 font-medium flex flex-col justify-center items-center grow sm:grow-0 text-center leading-5"
    :class="{
      'text-white bg-violet-600': route === $route.path,
      'text-gray-800 hover:bg-violet-300': route !== $route.path,
    }"
  >
    {{ text }}
  </router-link>
</template>
