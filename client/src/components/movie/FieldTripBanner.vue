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
    class="text-md absolute inset-0 flex h-12 w-full items-center justify-between bg-violet-500 bg-opacity-80 p-3 text-center font-medium text-white"
  >
    <span v-text="movie.theaterName" />

    <IconTicket class="ml-2 h-6 w-6 -rotate-45" />
  </a>
</template>
