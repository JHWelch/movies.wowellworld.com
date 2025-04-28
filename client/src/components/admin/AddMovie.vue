<script lang="ts" setup>
import { ref } from 'vue'
import type { MovieSearchInputData } from '@client/components/form/MovieSearchInput/types'
import MovieSearchInput from '@client/components/form/MovieSearchInput.vue'
import { jsonHeaders } from '@client/data/headers'
import { ErrorBag } from '@client/types'
type AddMovieFormData = MovieSearchInputData
type AddMovieErrors = {
  id?: string
}
const errors = ref<AddMovieErrors>({})
const formData = ref<AddMovieFormData>({
  title: '',
  id: undefined,
})
const submitting = ref<boolean>(false)
const handleErrors = (data: ErrorBag) => {
  if (data.errors) {
    errors.value = data.errors
  }
  if (data.message) {
    alert(data.message)
  }
}
const submit = async () => {
  submitting.value = true
  const response = await fetch('/api/movies' , {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      id: formData.value.id,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    submitting.value = false
    handleErrors(data)

    return
  }
}
</script>
<template>
  <form @submit.prevent="submit">
    <h2>Add Movie</h2>

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
