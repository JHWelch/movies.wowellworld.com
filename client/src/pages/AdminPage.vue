<script setup lang="ts">
import { jsonHeaders } from '@client/data/headers'
import { ArrowPathIcon } from '@heroicons/vue/24/solid'
import { CacheWeeksOutput } from '@shared/dtos'
import { computed, ref } from 'vue'

const cacheWeeksLoading = ref<boolean>(false)
const cacheWeeksOutput = ref<CacheWeeksOutput | null>(null)

const cacheWeeks = (fetchOnly: boolean = false) => {
  cacheWeeksLoading.value = true

  fetch('/api/cache/weeks', {
    method: fetchOnly ? 'GET' : 'POST',
    headers: jsonHeaders,
  })
    .then(response => {
      if (!response.ok) {
        console.error('Error fetching week data: ', response.status, response.statusText)
        return Promise.resolve([])
      }

      return response.json()
    })
    .then(data => {
      cacheWeeksOutput.value = data
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

cacheWeeks(true)
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div class="max-w-4xl py-10">
      <div class="flex flex-col items-center px-4 py-5 text-center md:px-8">
        <h1 class="text-2xl font-semibold">
          Admin
        </h1>

        <div class="flex flex-col px-4 py-4 mt-6 space-y-4 rounded-md shadow-sm bg-brat-500 min-w-96">
          <h2 class="text-xl">
            Sync Data
          </h2>

          <button
            class="flex items-center justify-center w-full px-4 py-2 mt-2 space-x-2 text-lg font-semibold text-black rounded-md h-14 md:w-auto bg-brat-300 hover:bg-brat-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brat-400"
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
            v-if="cacheWeeksOutput"
            class="flex w-full px-4 py-2 mt-2 text-left rounded-md bg-brat-300"
          >
            <div>
              <div class="flex justify-between space-x-4">
                <div class="font-semibold">
                  Weeks Cached
                </div>

                <div class="text-center">
                  {{ cacheWeeksOutput.updatedWeeks }}
                </div>
              </div>

              <div class="flex justify-between space-x-4">
                <div class="font-semibold">
                  Previous Last Updated
                </div>

                <div class="text-right">
                  {{ displayPreviousLastUpdated }}
                </div>
              </div>

              <div class="flex justify-between space-x-4">
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
      </div>
    </div>
  </div>
</template>
