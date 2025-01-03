<script lang="ts" setup>
import FormInput from '@components/form/FormInput.vue'
import { MovieSearchDto } from '@shared/dtos'
import { ref } from 'vue'
import LoadingIcon from '@components/icons/LoadingIcon.vue'
import debounce from 'lodash.debounce'

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
const movies = ref<MovieSearchDto[]>([])
const searchError = ref<string | undefined>(undefined)
const search = debounce(async () => {
  if (!searchTerm.value) {
    movies.value = []

    return
  }

  searching.value = true

  const response = await fetch(`/api/movies?search=${searchTerm.value}`)
  const data = await response.json()

  if (response.ok) {
    movies.value = data.movies
  } else {
    searchError.value = data.error
  }

  searching.value = false
}, 500)
</script>

<template>
  <FormInput
    v-model="searchTerm"
    :name="name"
    :hide-label="hideLabel"
    :label="label"
    type="text"
    :error="error ?? searchError"
    :placeholder="placeholder"
    :required="required"
    @enter="$emit('enter')"
    @clear-error="$emit('clear-error')"
    @input="search"
  />

  <div v-if="searching">
    <LoadingIcon />
  </div>

  <ul v-if="movies.length">
    <li
      v-for="movie in movies"
      :key="movie.tmdbId"
    >
      {{ movie.title }} - {{ movie.year }}
    </li>
  </ul>
</template>
