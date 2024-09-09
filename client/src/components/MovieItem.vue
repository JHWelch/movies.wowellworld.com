<script lang="ts" setup>
import type { MovieDto, WeekDto } from '@shared/dtos'
import IconLabel from '@components/IconLabel.vue'
import FieldTripBanner from '@components/movie/FieldTripBanner.vue'

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
  <div
    :class="[
      'px-3 max-w-lg lg:px-5',
      movieSizeClasses(week),
    ]"
  >
    <div class="flex flex-col px-4 py-2 rounded-md shadow-sm bg-brat-500">
      <h4 class="flex items-center justify-between h-12 md:px-2">
        <span
          :class="[
            'overflow-hidden font-medium text-center overflow-ellipsis',
            movie.title.length > 20 ? 'text-xl' : 'text-2xl',
          ]"
          v-text="movie.title"
        />

        <span
          v-if="showEventDetails"
          v-show="movie.time"
          class="text-md overflow-hidden font-medium text-center bg-brat-300 text-black px-2 py-0.5 rounded-2xl"
          v-text="movie.time?.replace(/ /g, '\u00a0')"
        />

        <span v-else><!-- Empty span to Retain formatting --></span>
      </h4>

      <div class="flex flex-col justify-between flex-1">
        <div class="relative mt-2">
          <FieldTripBanner
            v-if="showEventDetails"
            :movie="movie"
            :week="week"
          />

          <a
            :href="movie.url ?? undefined"
            class="w-full"
          >
            <img
              :src="movie.posterUrl"
              :alt="movie.title + ' Poster'"
              class="w-full"
              loading="lazy"
            >
          </a>
        </div>

        <span class="flex justify-between mt-2">
          <span
            v-if="movie.director"
            data-testid="movie-director"
            class="font-medium text-black text-md"
            v-text="movie.director"
          />

          <div class="flex space-x-2">
            <IconLabel
              v-if="movie.year"
              icon="CalendarIcon"
              :label="movie.year.toString()"
            />

            <IconLabel
              v-if="movie.displayLength"
              icon="ClockIcon"
              :label="movie.displayLength"
            />
          </div>
        </span>
      </div>
    </div>
  </div>
</template>
