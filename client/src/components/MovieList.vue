<script lang="ts" setup>
import { WeekDto } from '../../../shared/dtos'
import MovieItem from './MovieItem.vue'

defineProps<{
  showEventDetails: boolean
  week: WeekDto
}>()
</script>

<template>
  <div
    class="max-w-9xl mt-2 flex flex-wrap justify-center space-y-4 md:space-y-8"
  >
    <MovieItem
      v-for="(movie, index) in week.movies"
      :key="movie.title"
      :movie="movie"
      :show-event-details="showEventDetails"
      :week="week"
      :class="{ 'mt-4 md:mt-8': index === 0 }"
    />
  </div>
</template>
