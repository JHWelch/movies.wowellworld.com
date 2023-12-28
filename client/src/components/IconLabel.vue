<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { MovieDto } from '../../../shared/dtos'

const props = withDefaults(defineProps<{
  field: keyof MovieDto
  icon: string
  movie: MovieDto
  iconClass?: string
}>(), {
  iconClass: 'h-4 w-4 text-slate-500',
})

const Icon = defineAsyncComponent({
  loader: () => import(`../icons/Icon${props.icon}.vue`),
  delay: 0,
})
</script>

<template>
  <span class="flex items-center space-x-0.5">
    <Icon :class="iconClass" />

    <span
      class="text-sm text-slate-700"
      v-text="movie[field]"
    />
  </span>
</template>
