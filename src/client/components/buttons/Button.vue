<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  href?: string
  class?: string
  disabled?: boolean
  variant?: 'primary'|'secondary'
}>()

const tag = computed(() => props.href ? 'a' : 'button')
const color = {
  primary: 'bg-primary-dark',
  secondary: 'bg-light',
}[props.variant ?? 'primary']
</script>

<template>
  <component
    :is="tag"
    :href="props.href"
    :disabled="props.disabled"
    :class="[
      props.class,
      color,
      'flex items-center justify-center w-full px-4 py-2 space-x-2 text-xl font-semibold rounded-lg shrink  text-dark cursor-pointer',
      'hover:bg-primary-light hover:ring-2 hover:ring-primary-dark hover:ring-offset-2 hover:ring-offset-dark',
      'focus:bg-primary-light focus:ring-2 focus:ring-primary-dark focus:ring-offset-2 focus:ring-offset-dark focus:outline-none',
      'md:py-3',
      'sm:w-auto',
      ...disabled ? ['opacity-50 cursor-not-allowed'] : [],
    ]"
  >
    <slot />
  </component>
</template>
