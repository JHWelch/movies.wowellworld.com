<script lang="ts" setup>
defineProps<{
  theme: string
}>()
</script>

<template>
  <div class="flex justify-center w-full p-4 mt-4">
    <div class="flex items-center justify-center w-full h-24 max-w-4xl px-4 text-2xl text-gray-900 rounded-md bg-brat-500">
      <span
        class="font-semibold"
        v-text="theme"
      />
    </div>
  </div>
</template>
