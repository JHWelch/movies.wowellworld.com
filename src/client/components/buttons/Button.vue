<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  href?: string
}>()

const tag = computed(() => props.href ? 'a' : 'button')
</script>

<template>
  <component
    :is="tag"
    :href="props.href"
    :class="{
      'flex items-center justify-center w-full px-4 py-2 space-x-2 text-xl font-semibold rounded-lg shrink bg-primary-dark text-dark cursor-pointer': true,
      'hover:bg-primary-light hover:ring-2 hover:ring-primary-dark hover:ring-offset-2 hover:ring-offset-dark': true,
      'focus:bg-primary-light focus:ring-2 focus:ring-primary-dark focus:ring-offset-2 focus:ring-offset-dark focus:outline-none': true,
      'md:py-3': true,
      'sm:w-auto': true,
    }"
  >
    <slot />
  </component>
</template>
