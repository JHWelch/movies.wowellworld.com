<script lang="ts" setup>
import { CalendarDaysIcon } from '@heroicons/vue/24/solid'
import { WeekDto } from '@shared/dtos'
import { rsvpModal } from '@client/state/modalState'
import MovieList from '@components/MovieList.vue'
import SkippedBanner from '@components/SkippedBanner.vue'
import Theme from '@components/week/Theme.vue'

defineProps<{
  week: WeekDto
  showEventDetails: boolean
}>()
</script>

<template>
  <div class="flex flex-col items-center mt-12 mb-12">
    <div class="w-full max-w-4xl px-4 sm:px-8">
      <div class="flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
        <h3
          :id="week.slug ?? undefined"
          class="flex flex-col"
        >
          <span
            class="text-lg font-light text-purp-dark"
            v-text="week.date"
          />

          <Theme :week="week" />

          <span
            v-if="week.submittedBy"
            class="text-lg text-purp-dark"
          >
            Programming By
            <span class="font-semibold">{{ week.submittedBy }}</span>
          </span>
        </h3>

        <button
          v-if="showEventDetails"
          v-show="!week.isSkipped"
          class="flex items-center justify-center w-full px-4 py-2 mt-2 space-x-2 text-lg font-semibold text-black rounded-md h-14 md:w-auto bg-brat-500 hover:bg-brat-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brat-500"
          @click="rsvpModal.open(week)"
        >
          <span>RSVP</span>

          <CalendarDaysIcon class="w-6 h-6 text-black" />
        </button>
      </div>
    </div>

    <SkippedBanner
      v-if="week.isSkipped"
      :theme="week.theme"
    />

    <MovieList
      v-if="!week.isSkipped"
      :week="week"
      :show-event-details="showEventDetails"
    />
  </div>
</template>
