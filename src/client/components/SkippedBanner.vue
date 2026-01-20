<script lang="ts" setup>
defineProps<{
  theme: string
}>()
</script>

<template>
  <div class="flex justify-center w-full p-4 mt-4">
    <div class="h-12 max-w-4xl px-4 text-4xl">
      <span
        class="font-semibold"
        v-text="theme"
      />
    </div>
  </div>
</template>
