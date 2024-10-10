<script setup lang="ts">
import MovieItem from '@client/components/MovieItem.vue'

const movie = {
  title: 'Gone with the Wind',
  director: 'Victor Fleming',
  year: 1939,
  length: 233,
  url: 'https://www.themoviedb.org/movie/770-gone-with-the-wind',
  posterUrl: 'https://www.themoviedb.org/t/p/w500/lNz2Ow0wGCAvzckW7EOjE03KcYv.jpg',
  time:  null,
  theaterName:  null,
  showingUrl:  null,
  isFieldTrip: false,
  displayLength:  null,
}

const week = {
  id: '303',
  weekId: '404',
  theme: '404',
  date: '1939-12-15',
  isSkipped: false,
  slug: null,
  styledTheme: [],
  movies: [movie],
}
</script>

<template>
  <div class="flex flex-col items-center min-h-screen pt-10 space-y-10">
    <h1 class="font-bold text-8xl four-oh-four">
      404
    </h1>

    <MovieItem
      :movie="movie"
      :show-event-details="false"
      :week="week"
    />
  </div>
</template>

<style scoped>
.four-oh-four {
  position: relative;
  color: theme('colors.brat.950');
  text-shadow: 6px 6px 0 theme('colors.brat.500');
}
</style>
