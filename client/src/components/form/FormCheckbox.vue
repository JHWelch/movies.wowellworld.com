<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  name: string
  description: string
  label?: string
}>()

defineEmits([
  'clear-error',
])

const model = defineModel<boolean>()

const displayLabel = computed(
  () => props.label ?? props.name.charAt(0).toUpperCase() + props.name.slice(1),
)
</script>

<template>
  <div class="relative flex items-start">
    <div class="flex items-center h-6">
      <input
        :id="name"
        v-model="model"
        :name="name"
        :data-testid="'input-' + name"
        type="checkbox"
        class="w-4 h-4 border-gray-300 rounded-sm text-brat-500 focus:ring-brat-500"
      >
    </div>

    <div class="ml-3 text-sm leading-6 cursor-default">
      <label
        :for="name"
        class="font-medium text-gray-900"
        :aria-describedby="name +'-description'"
        v-text="displayLabel"
      />

      <span
        :id="name +'-description'"
        class="text-gray-500"
        @click="model = !model"
      >
        <span
          class="sr-only"
          v-text="displayLabel"
        />

        {{ description }}
      </span>
    </div>
  </div>
</template>
