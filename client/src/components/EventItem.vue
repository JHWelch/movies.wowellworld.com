<script lang="ts" setup>
import { CalendarDaysIcon } from '@heroicons/vue/24/solid'
import { EventDto } from '@shared/dtos'
import { rsvpModal } from '@client/state/modalState'
import MovieList from '@components/MovieList.vue'
import SkippedBanner from '@components/SkippedBanner.vue'
import Theme from '@components/event/Theme.vue'

defineProps<{
  event: EventDto
  showEventDetails: boolean
}>()
</script>

<template>
  <div class="flex flex-col items-center mt-12 mb-12">
    <div class="w-full max-w-4xl px-4 sm:px-8">
      <div class="">
        <h3
          :id="event.slug ?? undefined"
          class="flex flex-col"
        >
          <span
            class="text-lg font-light text-purp-dark"
            v-text="event.date"
          />

          <Theme :event="event" />

          <span
            v-if="event.submittedBy"
            class="mt-2 text-lg text-purp-dark font-playwrite font-extralight"
          >
            Programming By
            <span class="font-normal">{{ event.submittedBy }}</span>
          </span>
        </h3>

        <button
          v-if="showEventDetails"
          v-show="!event.isSkipped"
          class="flex items-center justify-center w-auto mt-2 space-x-2 text-xl font-semibold shrink"
          @click="rsvpModal.open(event)"
        >
          <span>RSVP</span>

          <CalendarDaysIcon class="w-6 h-6" />
        </button>
      </div>
    </div>

    <SkippedBanner
      v-if="event.isSkipped"
      :theme="event.theme"
    />

    <MovieList
      v-if="!event.isSkipped"
      :event="event"
      :show-event-details="showEventDetails"
    />
  </div>
</template>
