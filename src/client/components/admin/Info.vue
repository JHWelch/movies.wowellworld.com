<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  value: string
  style?: 'small' | 'large'
}>(), {
  style: 'small',
})
</script>

<template>
  <div
    :class="{
      'flex flex-col items-center w-full p-3 border-4 border-double border-black': true,
      'col-span-2': style === 'large',
    }"
  >
    <div class="font-semibold">
      {{ title }}
    </div>

    <div :class="{ 'text-6xl': style === 'small' }">
      {{ value }}
    </div>
  </div>
</template>
