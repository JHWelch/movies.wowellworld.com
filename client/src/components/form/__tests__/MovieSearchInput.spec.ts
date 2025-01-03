/** @vitest-environment jsdom */

import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import MovieSearchInput from '@components/form/MovieSearchInput.vue'

const props = {
  name: 'search',
}

beforeEach(() => {
  vi.mock('lodash.debounce')
})

describe('input passthrough', () => {
  it('should pass through props to input', () => {
    const wrapper = mount(MovieSearchInput, {
      props: {
        name: 'search',
        placeholder: 'Search for movies',
        label: 'Search',
        error: 'Error message',
      },
    })

    const input = wrapper.find('#search')
    const label = wrapper.find('label')
    const error = wrapper.find('#search-error')

    expect(input.attributes('placeholder')).toBe('Search for movies')
    expect(input.attributes('name')).toBe('search')
    expect(label.text()).toBe('Search')
    expect(error.text()).toBe('Error message')
  })
})

describe('user types in search', () => {
  beforeEach(() => {
    window.fetch.doMock()
  })
  afterEach(() => {
    window.fetch.mockClear()
  })

  it('searches for matching movies', async () => {
    window.fetch.mockResponseOnce(JSON.stringify({ movies: [] }))

    const wrapper = mount(MovieSearchInput, { props })

    const input = wrapper.find('#search')
    await input.setValue('The Matrix')
    const request = window.fetch.requests()[0]

    expect(request.url).toBe('/api/movies?search=The%20Matrix')
  })

  it('does not search if input is empty', async () => {
    const wrapper = mount(MovieSearchInput, { props })

    const input = wrapper.find('#search')
    await input.setValue('')

    expect(window.fetch.requests()[0]).toBeUndefined()
  })

  it('does not search if input is less than 3 characters', async () => {
    const wrapper = mount(MovieSearchInput, { props })

    const input = wrapper.find('#search')
    await input.setValue('Th')

    expect(window.fetch.requests()[0]).toBeUndefined()
  })
})
