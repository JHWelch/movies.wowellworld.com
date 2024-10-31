<script lang="ts" setup>
import { computed, ref } from 'vue'
import FormInput from '@components/form/FormInput.vue'
import LoadingIcon from '@components/icons/LoadingIcon.vue'
import { ErrorBag } from '@client/types'
import { jsonHeaders } from '@client/data/headers'

type SuggestionFormData = {
  theme?: string
  submitted_by?: string
  movie1?: string
  movie2?: string
}

const errors = ref<SuggestionFormData>({})

const formData = ref<SuggestionFormData>({
  theme: '',
  submitted_by: '',
  movie1: '',
  movie2: '',
})

const submitting = ref<boolean>(false)

const handleErrors = (data: ErrorBag) => {
  if (data.errors) {
    errors.value = {
      theme: data.errors.theme,
      submitted_by: data.errors.submitted_by,
      movie1: data.errors.movies,
      movie2: data.errors.movies,
    }
  }
  if (data.message) {
    alert(data.message)
  }
}
const disabled = computed(() => submitting.value
    || !formData.value.theme
    || !formData.value.movie1
    || !formData.value.movie2
    || !formData.value.submitted_by,
)
const submit = async () => {
  submitting.value = true
  const response = await fetch('/suggestions' , {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      theme: formData.value.theme,
      submitted_by: formData.value.submitted_by,
      movies: [
        formData.value.movie1,
        formData.value.movie2,
      ],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    submitting.value = false
    handleErrors(data)

    return
  }

  window.location.href = '/?suggest_success'
}
</script>

<template>
  <div class="flex flex-col items-center w-full min-h-[70vh] px-5 py-10 sm:py-10 sm:pb-16">
    <h1 class="mt-1 text-3xl leading-10 text-center">
      Suggest a Movie Night&nbsp;Theme!
    </h1>

    <form class="w-full max-w-sm p-4 mt-5 space-y-5 rounded-lg bg-brat-500 sm:mt-8">
      <FormInput
        v-model="formData.submitted_by"
        name="submitted_by"
        label="Your Name"
        placeholder="Who are you?"
        :error="errors.submitted_by"
        @clear-error="errors.submitted_by = ''"
      />

      <FormInput
        v-model="formData.theme"
        name="theme"
        placeholder="Something punny..."
        :error="errors.theme"
        @clear-error="errors.theme = ''"
      />

      <FormInput
        v-model="formData.movie1"
        name="movie1"
        label="First Movie"
        placeholder="Triangle"
        :error="errors.movie1"
        @clear-error="errors.movie1 = ''"
      />

      <FormInput
        v-model="formData.movie2"
        name="movie2"
        label="Second Movie"
        placeholder="Triangle of Sadness"
        :error="errors.movie2"
        @clear-error="errors.movie2 = ''"
      />

      <button
        type="button"
        class="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold rounded-md shadow-sm text-mint bg-purp-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brat-500 sm:col-start-2"
        :disabled="disabled"
        :class="{
          'opacity-50 cursor-not-allowed': disabled,
          'hover:bg-purp-light hover:text-white': !disabled,
        }"
        @click="submit()"
      >
        <span v-if="!submitting">
          Submit Suggestion!
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
  </div>
</template>
