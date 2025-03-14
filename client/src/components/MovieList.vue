<script lang="ts" setup>
import { EventDto } from '@shared/dtos'
import MovieItem from '@components/MovieItem.vue'

defineProps<{
  showEventDetails: boolean
  event: EventDto
}>()
</script>

<template>
  <div class="flex flex-wrap justify-center mt-4 space-y-4 max-w-9xl md:space-y-8 md:mt-8">
    <MovieItem
      v-for="movie in event.movies"
      :key="movie.title"
      :movie="movie"
      :show-event-details="showEventDetails"
      :event="event"
    />
  </div>
</template>
