<script lang="ts" setup>
import DynamicHeroIcon from './DynamicHeroIcon.vue'
import * as heroIcons from '@heroicons/vue/24/solid'

withDefaults(defineProps<{
  label: string
  icon: keyof typeof heroIcons
  iconClass?: string
}>(), {
  iconClass: 'h-4 w-4 text-slate-500',
})

</script>

<template>
  <span class="flex items-center space-x-0.5">
    <DynamicHeroIcon
      :name="icon"
      :class="iconClass"
    />

    <span
      class="text-sm text-slate-700"
      v-text="label"
    />
  </span>
</template>
