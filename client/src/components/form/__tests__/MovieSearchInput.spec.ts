/** @vitest-environment jsdom */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MovieSearchInput from '@components/form/MovieSearchInput.vue'

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
  it('searches for matching movies', async () => {
    window.fetch.mockResponseOnce(JSON.stringify({ movies: [] }))

    const wrapper = mount(MovieSearchInput, {
      props: { name: 'search' },
    })

    const input = wrapper.find('#search')
    await input.setValue('The Matrix')
    const request = window.fetch.requests()[0]

    expect(request.url).toBe('/api/movies?search=The%20Matrix')
  })
})
