<script lang="ts" setup>
import type { MovieDto, WeekDto } from '../../../shared/dtos'
import IconLabel from './IconLabel.vue'
import FieldTripBanner from './movie/FieldTripBanner.vue'

defineProps<{
  movie: MovieDto
  showEventDetails: boolean
  week: WeekDto
}>()

const movieSizeClass = (week: WeekDto, max: number) => {
  if (week.movies.length == 1) {
    return 'w-full'
  }

  return 'w-1/' + Math.min(week.movies.length, max)
}

/*
Tailwind CSS Safelist for movieSizeClass
sm:w-1/2
lg:w-1/3
lg:w-1/2
xl:w-1/3
2xl:w-1/4
xl:w-full
2xl:w-full
*/

const movieSizeClasses = (week: WeekDto) => {
  const sm = movieSizeClass(week, 2)
  const lg = movieSizeClass(week, 3)
  const xxl = movieSizeClass(week, 4)

  return `w-full sm:${sm} lg:${lg} 2xl:${xxl}`
}
</script>

<template>
  <div :class="['max-w-lg px-3 lg:px-5', movieSizeClasses(week)]">
    <div class="flex flex-col rounded-md bg-violet-200 px-4 py-2 shadow-sm">
      <h4 class="flex h-12 items-center justify-between md:px-2">
        <span
          :class="[
            'overflow-hidden overflow-ellipsis text-center font-medium',
            movie.title.length > 20 ? 'text-xl' : 'text-2xl',
          ]"
          v-text="movie.title"
        />

        <span
          v-if="showEventDetails"
          v-show="movie.time"
          class="text-md overflow-hidden rounded-2xl bg-violet-700 px-2 py-0.5 text-center font-medium text-white"
          v-text="movie.time?.replace(/ /g, '\u00a0')"
        />

        <span v-else><!-- Empty span to Retain formatting --></span>
      </h4>

      <div class="flex flex-1 flex-col justify-between">
        <div class="relative mt-2">
          <FieldTripBanner
            v-if="showEventDetails"
            :movie="movie"
            :week="week"
          />

          <a :href="movie.url ?? undefined" class="w-full">
            <img
              :src="movie.posterUrl"
              :alt="movie.title + ' Poster'"
              class="w-full"
            />
          </a>
        </div>

        <span class="mt-2 flex justify-between">
          <span
            class="text-md font-medium text-slate-700"
            v-text="movie.director"
          />

          <div class="flex space-x-2">
            <IconLabel
              v-if="movie.year"
              icon="Calendar"
              :label="movie.year.toString()"
            />

            <IconLabel
              v-if="movie.displayLength"
              icon="Clock"
              :label="movie.displayLength"
            />
          </div>
        </span>
      </div>
    </div>
  </div>
</template>
