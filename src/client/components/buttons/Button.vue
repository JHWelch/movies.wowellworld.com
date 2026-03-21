<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  href?: string
  class?: string
  disabled?: boolean
  variant?: 'primary'|'secondary'
  size?: 'small'|'large'
}>(), {
  href: undefined,
  class: undefined,
  disabled: false,
  variant: 'primary',
  size: 'large',
})

const tag = computed(() => props.href ? 'a' : 'button')
const color = {
  primary: 'bg-primary-dark',
  secondary: 'bg-light',
}[props.variant]
const size = {
  large: 'px-4 py-2 md:py-3 text-xl',
  small: 'px-2 py-1 text-lg',
}[props.size]
</script>

<template>
  <component
    :is="tag"
    :href="props.href"
    :disabled="props.disabled"
    :class="[
      props.class,
      color,
      size,
      'flex items-center justify-center w-full space-x-2 font-semibold rounded-lg shrink text-dark cursor-pointer',
      'hover:bg-primary-light hover:ring-2 hover:ring-primary-dark hover:ring-offset-2 hover:ring-offset-dark',
      'focus:bg-primary-light focus:ring-2 focus:ring-primary-dark focus:ring-offset-2 focus:ring-offset-dark focus:outline-none',
      'sm:w-auto',
      ...disabled ? ['opacity-50 cursor-not-allowed'] : [],
    ]"
  >
    <slot />
  </component>
</template>
