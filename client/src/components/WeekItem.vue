<script lang="ts" setup>
import { WeekDto } from '../../../shared/dtos'
import IconRsvp from '../icons/IconRsvp.vue'
import { rsvpModal } from '../state/modalState'
import MovieList from './MovieList.vue'
import SkippedBanner from './SkippedBanner.vue'

defineProps<{
  week: WeekDto
  showEventDetails: boolean
}>()

const weekTitle = (week: WeekDto) => {
  return week.isSkipped ? 'No movies this week!' : week.theme
}
</script>

<template>
  <div class="mb-12 mt-12 flex flex-col items-center">
    <div class="w-full max-w-4xl px-4 sm:px-8">
      <div
        class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
      >
        <h3 class="flex flex-col">
          <span class="text-lg font-light text-violet-700" v-text="week.date" />

          <span class="text-3xl font-semibold" v-text="weekTitle(week)" />
        </h3>

        <button
          v-if="showEventDetails"
          v-show="!week.isSkipped"
          class="mt-2 flex h-14 w-full items-center justify-center space-x-2 rounded-md bg-violet-600 px-4 py-2 text-lg font-semibold text-white hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 md:w-auto"
          @click="rsvpModal.open(week)"
        >
          <span>RSVP</span>

          <IconRsvp class="h-6 w-6 text-white" />
        </button>
      </div>
    </div>

    <SkippedBanner v-if="week.isSkipped" :theme="week.theme" />

    <MovieList
      v-if="!week.isSkipped"
      :week="week"
      :show-event-details="showEventDetails"
    />
  </div>
</template>
