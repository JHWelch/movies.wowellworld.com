<script lang="ts" setup>
import FormInput from '@components/form/FormInput.vue'
import { ref } from 'vue'

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
const searchTerm = ref<string>('')
const searching = ref<boolean>(false)
const search = () => {
  searching.value = true

  fetch(`/api/movies?search=${searchTerm.value}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      searching.value = false
    })
}

</script>

<template>
  <FormInput
    v-model="searchTerm"
    :name="name"
    :hide-label="hideLabel"
    :label="label"
    type="text"
    :error="error"
    :placeholder="placeholder"
    :required="required"
    @enter="$emit('enter')"
    @clear-error="$emit('clear-error')"
    @input="search"
  />
</template>
