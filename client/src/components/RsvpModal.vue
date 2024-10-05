<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Errors, ErrorBag } from '@client/types'
import FormInput from '@components/form/FormInput.vue'
import FormCheckbox from '@components/form/FormCheckbox.vue'
import { rsvpModal } from '@client/state/modalState'
import { fireConfetti } from '@client/utilities/confetti'
import { CalendarDaysIcon } from '@heroicons/vue/24/solid'

type RsvpForm = {
  name: string,
  email?: string,
  reminders: boolean,
}

const errors = ref<Errors>({})
const formData = ref<RsvpForm>({
  name: localStorage.getItem('rsvp.name') || '',
  email: localStorage.getItem('rsvp.email') || '',
  reminders: false,
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

  if (formData.value.email === '') {
    delete formData.value.email
  }

  const response = await fetch(
    '/api/weeks/' + rsvpModal.week.weekId + '/rsvp', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
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

  localStorage.setItem('rsvp.name', formData.value.name)
  localStorage.setItem('rsvp.email', formData.value.email || '')
}

const disabled = computed(() => !formData.value.name
  || (formData.value.reminders && !formData.value.email))
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
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
            enter-from-class="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
            enter-to-class="translate-y-0 opacity-100 sm:scale-100"
            leave-active-class="duration-200 ease-in"
            leave-from-class="translate-y-0 opacity-100 sm:scale-100"
            leave-to-class="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
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
                <div class="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-brat-100">
                  <CalendarDaysIcon class="w-6 h-6 text-brat-500" />
                </div>

                <div class="mt-3 text-center sm:mt-5">
                  <h3
                    id="modal-title"
                    class="text-base font-semibold leading-6 text-gray-900"
                  >
                    <span class="text-brat-500">RSVP to: </span>

                    <span v-text="rsvpModal.week?.theme" />
                  </h3>

                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Let us know you are coming! Bring&nbsp;a&nbsp;friend&nbsp;if&nbsp;you&nbsp;like.
                    </p>

                    <p class="text-sm text-brat-500">
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
                  :required="true"
                />

                <FormInput
                  v-model="formData.email"
                  :error="errors.email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="ghostface@woodsboroca.gov"
                  :required="formData.reminders"
                />

                <FormCheckbox
                  v-model="formData.reminders"
                  name="reminders"
                  description="Get reminder emails for upcoming events"
                  label="Reminders?"
                />
              </form>

              <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  data-testid="rsvp-button"
                  :disabled="disabled"
                  type="button"
                  class="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-black rounded-md shadow-sm bg-brat-500 hover:bg-brat-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brat-500 sm:col-start-2"
                  :class="{
                    'opacity-50 cursor-not-allowed': disabled,
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
