<script lang="ts" setup>
import { TicketIcon } from '@heroicons/vue/24/outline'
import { MovieDto, EventDto } from '@shared/dtos'

defineProps<{
  movie: MovieDto
  event: EventDto
}>()
</script>

<template>
  <a
    v-if="movie.isFieldTrip"
    :href="movie.showingUrl ?? undefined"
    class="absolute inset-0 flex items-center justify-between w-full h-12 p-3 font-medium text-center text-black text-md bg-opacity-80 bg-web-pink"
  >
    <span v-text="movie.theaterName" />

    <TicketIcon class="w-6 h-6 ml-2 -rotate-45" />
  </a>
</template>
