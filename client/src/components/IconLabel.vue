<script lang="ts" setup>
import DynamicHeroIcon from './DynamicHeroIcon.vue'
import * as heroIcons from '@heroicons/vue/24/solid'

withDefaults(defineProps<{
  label: string
  icon: keyof typeof heroIcons
  iconClass?: string
}>(), {
  iconClass: 'h-4 w-4 text-black',
})

</script>

<template>
  <span class="flex items-center space-x-0.5">
    <DynamicHeroIcon
      :name="icon"
      :class="iconClass"
    />

    <span
      class="text-sm text-black"
      v-text="label"
    />
  </span>
</template>
