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
  if (!searchTerm.value || searchTerm.value.length < 3) {
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
  <div class="relative">
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

    <div
      v-if="searching"
      class="absolute top-0 right-0 mt-2 mr-2"
    >
      <LoadingIcon />
    </div>

    <ul
      v-if="movies.length"
      class="absolute z-10 w-full p-2 mt-1 space-y-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-96"
    >
      <li
        v-for="movie in movies"
        :key="movie.tmdbId"
        class="flex items-center space-x-2"
      >
        <img
          :src="movie.posterPath"
          alt="Movie Poster"
        >

        <div class="flex justify-between w-full">
          <span
            class="italic"
            v-text="movie.title"
          />

          <span
            v-text="movie.year"
          />
        </div>
      </li>
    </ul>
  </div>
</template>
