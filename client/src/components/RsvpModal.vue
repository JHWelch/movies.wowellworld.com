<script lang="ts" setup>
import { ref } from 'vue'
import { Errors, ErrorBag } from '../types'
import FormInput from './form/FormInput.vue'
import FormCheckbox from './form/FormCheckbox.vue'
import { rsvpModal } from '../state/modalState'
import { fireConfetti } from '../utilities/confetti'
import { CalendarDaysIcon } from '@heroicons/vue/24/solid'

type RsvpForm = {
  name: string,
  email: string,
  plusOne: boolean,
}

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
  if (!rsvpModal.week) { return }

  const response = await fetch(
    '/api/weeks/' + rsvpModal.week.weekId + '/rsvp', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    })

  const data = await response.json()

  if (!response.ok) {
    handleErrors(data)

    return
  }

  fireConfetti()
  rsvpModal.close()
}
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-show="rsvpModal.show"
      id="rsvp-modal"
      class="relative z-10"
      aria-labelledby="rsvp-modal-title"
      role="dialog"
      aria-modal="true"
      @close-modal="rsvpModal.close()"
    >
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />

      <div
        class="fixed inset-0 z-10 overflow-y-auto"
        @click="rsvpModal.close()"
        @keyup.escape="rsvpModal.close()"
      >
        <div class="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
          <Transition
            enter-active-class="ease-out duration-400"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-show="rsvpModal.show"
              id="rsvp-modal-title"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              class="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
              @click.stop
            >
              <div>
                <div class="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-violet-100">
                  <CalendarDaysIcon class="w-6 h-6 text-violet-600" />
                </div>

                <div class="mt-3 text-center sm:mt-5">
                  <h3
                    id="modal-title"
                    class="text-base font-semibold leading-6 text-gray-900"
                  >
                    <span class="text-violet-500">RSVP to: </span>

                    <span v-text="rsvpModal.week?.theme" />
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
                  @click="rsvpModal.close()"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </Transition>
</template>
