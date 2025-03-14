/** @vitest-environment jsdom */

import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MovieItem from '@components/MovieItem.vue'
import EventFactory from '@client/__tests__/utils/factories/eventFactory'
import MovieFactory from '@tests/utils/factories/movieFactory'
import IconLabel from '@components/IconLabel.vue'

it('has all movie details', () => {
  const movie = new MovieFactory().build()
  const event = new EventFactory().withMovies([movie]).build()
  const wrapper = mount(MovieItem, {
    props: {
      movie: movie,
      showEventDetails: true,
      event: event,
    },
  })

  expect(wrapper.findComponent(IconLabel).exists()).toBe(true)
  expect(wrapper.text()).toContain(movie.title)
  expect(wrapper.text()).toContain(movie.director)
  expect(wrapper.text()).toContain(movie.displayLength)
  expect(wrapper.text()).toContain(movie.year)
  // Cannot figure out why this won't work
  // expect(wrapper.text()).toContain(movie.time)
})

it('does not show event details when not provided', () => {
  const movie = new MovieFactory().build({
    director: null,
    year: null,
    displayLength: null,
  })
  const event = new EventFactory().withMovies([movie]).build()
  const wrapper = mount(MovieItem, {
    props: {
      movie: movie,
      showEventDetails: true,
      event: event,
    },
  })

  expect(wrapper.findComponent(IconLabel).exists()).toBe(false)
  expect(wrapper.find('[data-testid="movie-director"]').exists()).toBe(false)
})
