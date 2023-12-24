<script lang="ts" setup>
import IconTicket from '../../icons/IconTicket.vue'

defineProps<{
  movie: any
  showEventDetails: boolean
  week: any
}>()
</script>

<template>
  <a
    v-if="movie.isFieldTrip"
    :href="movie.showingUrl"
    class="absolute inset-0 flex items-center justify-between w-full h-12 p-3 font-medium text-center text-white text-md bg-opacity-80 bg-violet-500"
  >
    <span x-text="movie.theaterName" />

    <IconTicket class="w-6 h-6 ml-2 -rotate-45" />
  </a>
</template>
