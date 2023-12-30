<script lang="ts" setup>
import { MovieDto, WeekDto } from '../../../../shared/dtos'
import IconTicket from '../../icons/IconTicket.vue'

defineProps<{
  movie: MovieDto
  week: WeekDto
}>()
</script>

<template>
  <a
    v-if="movie.isFieldTrip"
    :href="movie.showingUrl ?? undefined"
    class="absolute inset-0 flex items-center justify-between w-full h-12 p-3 font-medium text-center text-white text-md bg-opacity-80 bg-violet-500"
  >
    <span v-text="movie.theaterName" />

    <IconTicket class="w-6 h-6 ml-2 -rotate-45" />
  </a>
</template>
