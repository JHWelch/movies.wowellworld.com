<script setup lang="ts">
import FormInput from '@client/components/form/FormInput.vue'
import { jsonHeaders } from '@client/data/headers'
import { ArrowPathIcon, LockClosedIcon } from '@heroicons/vue/24/solid'
import { CacheWeeksOutput } from '@shared/dtos'
import { computed, ref } from 'vue'

const cacheWeeksLoading = ref<boolean>(false)
const cacheWeeksOutput = ref<CacheWeeksOutput | null>(null)

const password = ref<string>('')
const passwordError = ref<string | undefined>(undefined)

const cacheWeeks = (fetchOnly: boolean = false) => {
  cacheWeeksLoading.value = true

  fetch('/api/cache/weeks', {
    method: fetchOnly ? 'GET' : 'POST',
    headers: {
      ...jsonHeaders,
      authorization: password.value,
    },
  })
    .then(response => {
      if([401, 403].includes(response.status)) {
        console.error('Unauthorized to fetch week data: ', response.status, response.statusText)

        return response.json()
      }

      if (!response.ok) {
        console.error('Error fetching week data: ', response.status, response.statusText)

        return Promise.resolve(null)
      }

      return response.json()
    })
    .then(data => {
      if (data?.error) {
        passwordError.value = data.error

        return
      }

      cacheWeeksOutput.value = data
    })
    .finally(() => {
      cacheWeeksLoading.value = false
    })
}

const formattedDate = (date: string | null | undefined) => date
  ? new Date(date).toLocaleString()
  : 'Never'

const displayPreviousLastUpdated = computed(
  () => formattedDate(cacheWeeksOutput.value?.previousLastUpdated)
)
const displayNewLastUpdated = computed(
  () => formattedDate(cacheWeeksOutput.value?.newLastUpdated)
)
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div class="max-w-4xl py-10">
      <div class="flex flex-col items-center px-4 py-5 md:px-8">
        <h1 class="text-2xl font-semibold">
          Admin
        </h1>

        <div class="flex flex-col px-4 py-4 rounded-md shadow-sm bg-brat-500 min-w-96">
          <div
            v-if="cacheWeeksOutput"
            class="flex flex-col space-y-4"
          >
            <button
              class="flex items-center justify-center w-full px-4 py-2 mt-2 space-x-2 text-lg font-semibold text-white rounded-md h-14 md:w-auto bg-purp-dark hover:bg-purp-light focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purp-dark"
              :disabled="cacheWeeksLoading"
              @click="() => cacheWeeks()"
            >
              <span>
                {{ cacheWeeksLoading ? 'Syncing Weeks' : 'Sync Weeks' }}
              </span>

              <ArrowPathIcon
                v-if="cacheWeeksLoading"
                class="w-6 h-6 animate-spin"
              />
            </button>

            <div
              class="flex w-full"
            >
              <div class="grid w-full grid-cols-2 gap-4">
                <div class="flex flex-col items-center w-full p-3 rounded-md bg-brat-300">
                  <div class="font-semibold">
                    Weeks Cached
                  </div>
                  <div class="text-6xl">
                    {{ cacheWeeksOutput.updatedWeeks }}
                  </div>
                </div>
                <div class="flex flex-col items-center w-full p-3 rounded-md bg-brat-300">
                  <div class="font-semibold">
                    Movies Populated
                  </div>
                  <div class="text-6xl">
                    {{ cacheWeeksOutput.tmdbMoviesSynced.length }}
                  </div>
                </div>
                <div class="flex flex-col items-center w-full col-span-2 p-3 rounded-md bg-brat-300">
                  <div class="font-semibold">
                    Previous Last Updated
                  </div>
                  <div class="text-right">
                    {{ displayPreviousLastUpdated }}
                  </div>
                </div>
                <div class="flex flex-col items-center w-full col-span-2 p-3 rounded-md bg-brat-300">
                  <div class="font-semibold">
                    Current Last Updated
                  </div>
                  <div class="text-right">
                    {{ displayNewLastUpdated }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <FormInput
              v-model="password"
              name="password"
              type="password"
              label="Password"
              :error="passwordError"
              @clear-error="passwordError = undefined"
            />

            <button
              class="flex items-center justify-center w-full px-4 py-2 mt-2 space-x-2 text-lg font-semibold text-white rounded-md h-14 bg-purp-dark hover:bg-purp-light focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purp-dark"
              :disabled="cacheWeeksLoading"
              @click="() => cacheWeeks(true)"
            >
              <span>Unlock</span>

              <ArrowPathIcon
                v-if="cacheWeeksLoading"
                class="w-6 h-6 animate-spin"
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
