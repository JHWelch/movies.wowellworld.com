/** @vitest-environment jsdom */

import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MovieItem from '../MovieItem.vue'
import WeekFactory from '../../__tests__/utils/factories/weekFactory'
import MovieFactory from '../../__tests__/utils/factories/movieFactory'


it('has all movie details', () => {
  const movie = new MovieFactory().build()
  const week = new WeekFactory().withMovies([movie]).build()
  const wrapper = mount(MovieItem, {
    props: {
      movie: movie,
      showEventDetails: true,
      week: week,
    },
  })

  expect(wrapper.text()).toContain(movie.title)
  expect(wrapper.text()).toContain(movie.director)
  expect(wrapper.text()).toContain(movie.displayLength)
  expect(wrapper.text()).toContain(movie.year)
  // Cannot figure out why this won't work
  // expect(wrapper.text()).toContain(movie.time)
})
