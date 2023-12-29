<script lang="ts" setup>
import { ref } from 'vue'
import { WeekDto } from '../../../shared/dtos'
import { Errors, ErrorBag } from '../types'
import FormInput from './form/FormInput.vue'
import FormCheckbox from './form/FormCheckbox.vue'
import IconRsvp from '../icons/IconRsvp.vue'

type RsvpForm = {
  name: string,
  email: string,
  plusOne: boolean,
}

const open = ref<boolean>(false)
const week = ref<WeekDto | null>(null)
const errors = ref<Errors>({})
const formData = ref<RsvpForm>({
  name: '',
  email: '',
  plusOne: false,
})
const handleErrors = (data: ErrorBag) => {
  if (data.errors) {
    errors.value = data.errors
  }
  if (data.message) {
    alert(data.message)
  }
}
const rsvp = async () => {
  if (!week.value) { return }

  const response = await fetch('/api/weeks/' + week.value.weekId + '/rsvp' , {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })

  const data = await response.json()

  if (!response.ok) {
    handleErrors(data)

    return
  }

  // $dispatch('fire-confetti')
}
</script>

<template>
  <div
    v-show="open"
    id="rsvp-modal"
    x-transition:enter="ease-out duration-300"
    x-transition:enter-start="opacity-0"
    x-transition:enter-end="opacity-100"
    x-transition:leave="ease-in duration-200"
    x-transition:leave-start="opacity-100"
    x-transition:leave-end="opacity-0"
    class="relative z-10"
    aria-labelledby="rsvp-modal-title"
    role="dialog"
    aria-modal="true"
    @open-modal="week = $event.detail.week; open = true"
    @close-modal="open = false"
  >
    <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />

    <div
      class="fixed inset-0 z-10 overflow-y-auto"
      @click="open = false"
      @keyup.escape="open = false"
    >
      <div class="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
        <div
          id="rsvp-modal-title"
          x-show="open"
          x-transition:enter="ease-out duration-300"
          x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
          x-transition:leave="ease-in duration-200"
          x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100"
          x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          class="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          @click.stop
        >
          <div>
            <div class="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-violet-100">
              <IconRsvp class="w-6 h-6 text-violet-600" />
            </div>

            <div class="mt-3 text-center sm:mt-5">
              <h3
                id="modal-title"
                class="text-base font-semibold leading-6 text-gray-900"
              >
                <span class="text-violet-500">RSVP to:</span>

                <span v-text="week?.theme" />
              </h3>

              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Let us know you are coming! Bring&nbsp;a&nbsp;friend&nbsp;if&nbsp;you&nbsp;like.
                </p>

                <p class="text-sm text-violet-500">
                  Hope to see you soon!
                </p>
              </div>
            </div>
          </div>

          <form class="space-y-4">
            <FormInput
              v-model="formData.name"
              :error="errors.name"
              name="name"
              placeholder="Ghostface"
            />

            <FormInput
              v-model="formData.email"
              :error="errors.email"
              name="email"
              type="email"
              placeholder="ghostface@woodsboroca.gov"
            />

            <FormCheckbox
              v-model="formData.plusOne"
              name="plusOne"
              description="The more the merrier"
              label="Plus One?"
            />
          </form>

          <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              :disabled="!formData.name || !formData.email"
              type="button"
              class="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-violet-600 hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2"
              :class="{
                'opacity-50 cursor-not-allowed': !formData.name || !formData.email,
              }"
              @click="rsvp()"
            >
              RSVP!
            </button>

            <button
              type="button"
              class="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              @click="open = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>