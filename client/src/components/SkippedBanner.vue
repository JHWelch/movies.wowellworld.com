<script lang="ts" setup>
defineProps<{
  theme: string
}>()
</script>

<template>
  <div class="mt-4 flex w-full justify-center p-4">
    <div
      class="flex h-24 w-full max-w-4xl items-center justify-center rounded-md bg-violet-200 px-4 text-2xl text-gray-900"
    >
      <span class="font-semibold" v-text="theme" />
    </div>
  </div>
</template>
