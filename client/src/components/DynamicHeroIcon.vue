<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import * as heroIcons from '@heroicons/vue/24/solid'

const props = defineProps<{
  name: keyof typeof heroIcons,
  class?: string,
}>()

const isLoaded = ref(false)

onMounted(() => {
  isLoaded.value = true
})
</script>

<template>
  <component
    :is="heroIcons[name]"
    v-if="isLoaded"
    :class="props.class"
  />
</template>
