<script lang="ts" setup>
import FormInput from '@components/form/FormInput.vue'

withDefaults(defineProps<{
  name: string
  hideLabel?: boolean
  label?: string
  error?: string
  placeholder?: string
  required?: boolean
}>(), {
  hideLabel: false,
  placeholder: '',
  error: undefined,
  label: undefined,
  required: false,
})
defineEmits([
  'clear-error',
  'enter',
])
</script>

<template>
  <FormInput
    :name="name"
    :hide-label="hideLabel"
    :label="label"
    type="text"
    :error="error"
    :placeholder="placeholder"
    :required="required"
    @enter="$emit('enter')"
    @clear-error="$emit('clear-error')"
  />
</template>
