<script lang="ts" setup>
import FormInput from '@components/form/FormInput.vue'
import { MovieSearchDto } from '@shared/dtos'
import { ref } from 'vue'
import LoadingIcon from '@components/icons/LoadingIcon.vue'
import debounce from 'lodash.debounce'
import { PhotoIcon } from '@heroicons/vue/24/solid'
import { MovieSearchInputData } from '@components/form/MovieSearchInput/types'

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
const data = defineModel<MovieSearchInputData>({ required: true })
const setMovie = (movie: MovieSearchDto) => {
  data.value.title = movie.title
  data.value.id = movie.tmdbId
  movies.value = []
}
const searching = ref<boolean>(false)
const movies = ref<MovieSearchDto[]>([])
const searchError = ref<string | undefined>(undefined)
const search = debounce(async () => {
  if (!data.value.title || data.value.title.length < 3) {
    movies.value = []

    return
  }

  searching.value = true

  try {
    const response = await fetch(`/api/movies?search=${data.value.title}`)
    const json = await response.json()
    if (response.ok) {
      movies.value = json.movies
    } else {
      searchError.value = json.error
    }
  } catch (error) {
    console.error(error)
  }

  searching.value = false
}, 200)
const selected = ref<number>(0)
const select = (index: number) => {
  selected.value = index
  document.getElementById('movie-'+movies.value[index].tmdbId.toString())
    ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}
const down = (event: KeyboardEvent) => {
  event.stopPropagation()

  select(selected.value < movies.value.length - 1 ? selected.value + 1 : 0)
}
const up = (event: KeyboardEvent) => {
  event.stopPropagation()

  select(selected.value = selected.value > 0
    ? selected.value - 1
    : movies.value.length - 1)
}
const enter = (event: KeyboardEvent) => {
  event.stopPropagation()
  if (!data.value) return

  if (movies.value.length) {
    setMovie(movies.value[selected.value])
  } else {
    search()
  }
}
const closeSearch = (event?: KeyboardEvent, timeout: number = 0) => {
  event?.stopPropagation()

  setTimeout(() => {
    movies.value = []
  }, timeout) // Timeout to allow click event to fire
}
</script>
<template>
  <div class="relative">
    <FormInput
      v-model="data.title"
      :name="name"
      :hide-label="hideLabel"
      :label="label"
      type="text"
      :error="error ?? searchError"
      :placeholder="placeholder"
      :required="required"
      @clear-error="$emit('clear-error')"
      @input="search"
      @keyup.down="down"
      @keyup.up="up"
      @keyup.enter="enter"
      @keyup.esc="closeSearch"
      @blur="(event: KeyboardEvent) => closeSearch(event, 200)"
    />

    <div
      v-if="searching"
      class="absolute top-0 right-0 mt-0 mr-0"
    >
      <LoadingIcon />
    </div>

    <ul
      v-if="movies.length"
      class="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 divide-y rounded-md shadow-lg divide-solid max-h-96"
    >
      <li
        v-for="movie, i in movies"
        :id="'movie-' + movie.tmdbId.toString()"
        :key="movie.tmdbId"
        :class="{
          'flex items-center space-x-2 p-2 cursor-pointer': true,
          'bg-brat-300': selected === i,
        }"
        @mouseover="() => select(i)"
        @click="(event) => {
          event.stopPropagation()
          setMovie(movie)
        }"
      >
        <img
          v-if="movie.posterPath"
          :src="movie.posterPath"
          alt="Movie Poster"
        >

        <div
          v-else
          class="flex items-center justify-center w-[45px] bg-gray-200 h-[67.9972px] rounded-sm flex-shrink-0"
        >
          <PhotoIcon class="w-6 h-6 m-2 text-gray-600" />
        </div>

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
