<script lang="ts" setup>
import { ref } from 'vue'
import type { MovieSearchInputData } from '@client/components/form/MovieSearchInput/types'
import MovieSearchInput from '@client/components/form/MovieSearchInput.vue'
type AddMovieFormData = MovieSearchInputData
type AddMovieErrors = {
  id?: string
}
const errors = ref<AddMovieErrors>({})
const formData = ref<AddMovieFormData>({
  title: '',
  id: undefined,
})
</script>
<template>
  <form>
    <MovieSearchInput
      v-model="formData"
      name="movie"
      label="Search for a movie"
      placeholder="Movie Title"
      :error="errors.id"
      @clear-error="errors.id = ''"
    />
  </form>
</template>
