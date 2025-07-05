<script lang="ts" setup>
import { ref } from 'vue'
import type { MovieSearchInputData } from '@client/components/form/MovieSearchInput/types'
import MovieSearchInput from '@client/components/form/MovieSearchInput.vue'
import { jsonHeaders } from '@client/data/headers'
import { ErrorBag } from '@client/types'
import LoadingIcon from '@components/icons/LoadingIcon.vue'
type AddMovieFormData = MovieSearchInputData & {
  watchWhere: Array<string>
}
type AddMovieErrors = {
  id?: string
  watchWhere?: string
}
const errors = ref<AddMovieErrors>({})
const formData = ref<AddMovieFormData>({
  title: '',
  id: undefined,
  watchWhere: [],
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
      watchWhere: formData.value.watchWhere ?? [],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    handleErrors(data)
  }

  submitting.value = false
}
</script>
<template>
  <form
    class="p-3 space-y-2 border-4 border-black border-double"
    @submit.prevent="submit"
  >
    <h2>Add Movie</h2>

    <MovieSearchInput
      v-model="formData"
      name="movie"
      label="Search for a movie"
      placeholder="Movie Title"
      :error="errors.id"
      @clear-error="errors.id = ''"
    />

    <input
      id="bluray"
      v-model="formData.watchWhere"
      type="checkbox"
      value="Blu-ray"
    >
    <label
      for="bluray"
      class="ml-2"
    >
      Blu-ray
    </label>

    <input
      id="uhd"
      v-model="formData.watchWhere"
      type="checkbox"
      value="4K Blu-ray"
    >
    <label
      for="uhd"
      class="ml-2"
    >
      UHD
    </label>

    <button
      type="button"
      class="inline-flex justify-center w-full text-xl font-semibold sm:col-start-2 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="submitting || !formData.id"
      @click="submit()"
    >
      <span v-if="!submitting">
        Add Movie
      </span>

      <span
        v-else
        class="flex space-x-2"
      >
        <LoadingIcon />

        <span class="ml-2">Submitting...</span>
      </span>
    </button>
  </form>
</template>
