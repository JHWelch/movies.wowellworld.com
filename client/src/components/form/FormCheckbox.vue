<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  name: string
  description: string
  label?: string
}>()

defineEmits(['clear-error', 'update:modelValue'])

const displayLabel = computed(
  () => props.label ?? props.name.charAt(0).toUpperCase() + props.name.slice(1),
)
</script>

<template>
  <div class="relative flex items-start">
    <div class="flex h-6 items-center">
      <input
        :id="name"
        :value="modelValue"
        :name="name"
        type="checkbox"
        class="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600"
      />
    </div>

    <div class="ml-3 cursor-default text-sm leading-6">
      <label
        :for="name"
        class="font-medium text-gray-900"
        :aria-describedby="name + '-description'"
        v-text="displayLabel"
      />

      <span
        :id="name + '-description'"
        class="text-gray-500"
        @click="$emit('update:modelValue', !modelValue)"
      >
        <span class="sr-only" v-text="displayLabel" />

        {{ description }}
      </span>
    </div>
  </div>
</template>
