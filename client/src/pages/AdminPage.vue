<script setup lang="ts">
import Info from '@client/components/admin/Info.vue'
import FormInput from '@client/components/form/FormInput.vue'
import { jsonHeaders } from '@client/data/headers'
import { ArrowPathIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/vue/24/solid'
import { CacheEventsOutput } from '@shared/dtos'
import { computed, ref } from 'vue'

const cacheEventsLoading = ref<boolean>(false)
const cacheEventsOutput = ref<CacheEventsOutput | null>(null)

const password = ref<string>('')
const passwordError = ref<string | undefined>(undefined)

const cacheEvents = (fetchOnly: boolean = false) => {
  cacheEventsLoading.value = true

  fetch('/api/cache/events', {
    method: fetchOnly ? 'GET' : 'POST',
    headers: {
      ...jsonHeaders,
      authorization: password.value,
    },
  })
    .then(response => {
      if ([401, 403].includes(response.status)) {
        return response.json()
      }

      if (!response.ok) {
        console.error('Error fetching event data: ', response.status, response.statusText)

        return Promise.resolve(null)
      }

      return response.json()
    })
    .then(data => {
      if (data?.error) {
        passwordError.value = data.error

        return
      }

      cacheEventsOutput.value = data
    })
    .finally(() => {
      cacheEventsLoading.value = false
    })
}

const formattedDate = (date: string | null | undefined) => date
  ? new Date(date).toLocaleString()
  : 'Never'

const displayPreviousLastUpdated = computed(
  () => formattedDate(cacheEventsOutput.value?.previousLastUpdated)
)
const displayNewLastUpdated = computed(
  () => formattedDate(cacheEventsOutput.value?.newLastUpdated)
)
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div class="max-w-4xl py-10">
      <div class="flex flex-col items-center px-4 py-5 md:px-8">
        <h1 class="text-2xl font-semibold">
          Admin
        </h1>

        <div class="flex flex-col px-4 py-4 min-w-96">
          <div
            v-if="cacheEventsOutput"
            class="flex flex-col space-y-4"
          >
            <button
              class="flex items-center justify-center w-full mt-2 space-x-2 text-3xl font-semibold rounded-md h-14 md:w-auto disabled:opacity-75"
              :disabled="cacheEventsLoading"
              @click="() => cacheEvents()"
            >
              <span>
                {{ cacheEventsLoading ? 'Syncing Events' : 'Sync Events' }}
              </span>

              <ArrowPathIcon
                v-if="cacheEventsLoading"
                class="w-6 h-6 animate-spin"
              />
            </button>

            <div class="flex w-full">
              <div class="grid w-full grid-cols-2 gap-4">
                <Info
                  title="Events Cached"
                  :value="cacheEventsOutput.updatedEvents.toString()"
                />

                <Info
                  title="Movies Populated"
                  :value="cacheEventsOutput.tmdbMoviesSynced.length.toString()"
                />

                <Info
                  title="Previous Last Updated"
                  :value="displayPreviousLastUpdated"
                  :style="'large'"
                />

                <Info
                  title="Current Last Updated"
                  :value="displayNewLastUpdated"
                  :style="'large'"
                />
              </div>
            </div>
          </div>

          <div
            v-else
            class="flex flex-col space-y-4"
          >
            <FormInput
              v-model="password"
              name="password"
              type="password"
              label="Password"
              :error="passwordError"
              @clear-error="passwordError = undefined"
            />

            <button
              class="flex items-center justify-center w-full px-4 py-2 space-x-2 text-3xl font-semibold rounded-md disabled:opacity-75"
              :disabled="cacheEventsLoading"
              data-testid="unlock-button"
              @click="() => cacheEvents(true)"
            >
              <span>
                {{ cacheEventsLoading ? 'Unlocking' : 'Unlock' }}
              </span>

              <LockOpenIcon
                v-if="cacheEventsLoading"
                class="w-6 h-6"
              />

              <LockClosedIcon
                v-else
                class="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
