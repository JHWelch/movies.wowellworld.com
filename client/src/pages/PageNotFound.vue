<script setup lang="ts">
import MovieItem from '@client/components/MovieItem.vue'
import { computed } from 'vue'

const movieCommon = {
  time:  null,
  theaterName:  null,
  showingUrl:  null,
  isFieldTrip: false,
  displayLength:  null,
}

const movies = [
  {
    title: 'Gone with the Wind',
    director: 'Victor Fleming',
    year: 1939,
    length: 233,
    url: 'https://www.themoviedb.org/movie/770-gone-with-the-wind',
    posterUrl: 'https://www.themoviedb.org/t/p/w500/lNz2Ow0wGCAvzckW7EOjE03KcYv.jpg',
  },
  {
    title: 'Missing Link',
    director: 'Chris Butler',
    year: 2019,
    length: 95,
    url: 'https://www.themoviedb.org/movie/458253-missing-link',
    posterUrl: 'https://www.themoviedb.org/t/p/w500/f8TS62mpfoY9oz5N6oPj3HSjwPm.jpg',
  },
  {
    title: 'Finding Nemo',
    director: 'Andrew Stanton',
    year: 2003,
    length: 100,
    url: 'https://www.themoviedb.org/movie/12-finding-nemo',
    posterUrl: 'https://www.themoviedb.org/t/p/w500/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg',
  },
  {
    title: 'The Searchers',
    director: 'John Ford',
    year: 1956,
    length: 119,
    url: 'https://www.themoviedb.org/movie/3114-the-searchers',
    posterUrl: 'https://www.themoviedb.org/t/p/w500/jLBmgW0epNzJ1N9uzaVCjbyT94v.jpg',
  },
  {
    title: 'The Lost Boys',
    director: 'Joel Schumacher',
    year: 1987,
    length: 97,
    url: 'https://www.themoviedb.org/movie/1547-the-lost-boys',
    posterUrl: 'https://www.themoviedb.org/t/p/w500/jpYDxlZgDryBOFRS6iTHKwYUU6T.jpg',
  },
  {
    title: 'Lost in Translation',
    director: 'Sofia Coppola',
    year: 2003,
    length: 102,
    url: 'https://www.themoviedb.org/movie/153-lost-in-translation',
    posterUrl: 'https://www.themoviedb.org/t/p/w500/4k4Yz08WGfbu8ITIjaG99XTeco8.jpg',
  },
  {
    title: 'Gone Girl',
    director: 'David Fincher',
    year: 2014,
    length: 149,
    url: 'https://www.themoviedb.org/movie/210577-gone-girl',
    posterUrl: 'https://www.themoviedb.org/t/p/w500/ts996lKsxvjkO2yiYG0ht4qAicO.jpg',
  },
  {
    title: 'Missing',
    director: 'Will Merrick',
    year: 2023,
    length: 111,
    url: 'https://www.themoviedb.org/movie/768362-missing',
    posterUrl: 'https://www.themoviedb.org/t/p/w500/wEOUYSU5Uf8J7152PT6jdb5233Y.jpg',
  },
]

const week = {
  id: '303',
  weekId: '404',
  theme: '404',
  date: '1939-12-15',
  isSkipped: false,
  slug: null,
  submittedBy: null,
  styledTheme: [],
  movies: [],
}

const movie = computed(() => movies[Math.floor(Math.random()*movies.length)])
</script>

<template>
  <div class="flex flex-col items-center py-10 space-y-10 lg:flex-row lg:space-x-32 lg:justify-center lg:space-y-0">
    <h1 class="font-bold text-8xl four-oh-four lg:text-9xl xl:text-[150px]">
      404
    </h1>

    <MovieItem
      :movie="{
        ...movie,
        ...movieCommon,
      }"
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
@media (min-width: 1024px){
  .four-oh-four {
    text-shadow: 9px 9px 0 theme('colors.brat.500');
  }
}
</style>
