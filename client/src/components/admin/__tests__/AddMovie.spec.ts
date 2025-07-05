/** @vitest-environment jsdom */

import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ComponentPublicInstance } from 'vue'
import AddMovie from '@components/admin/AddMovie.vue'
import fetchMock from '@fetch-mock/vitest'

let wrapper: VueWrapper<ComponentPublicInstance<typeof AddMovie>>

it('displays the movie form', () => {
  wrapper = mount(AddMovie)

  expect(wrapper.find('form').exists()).toBe(true)
  expect(wrapper.text()).toContain('Add Movie')
  expect(wrapper.text()).toContain('Search for a movie')
})

describe('submit', () => {
  afterEach(() => {
    fetchMock.mockReset()
  })

  beforeEach(async () => {
    fetchMock.mockGlobal().route('/api/movies', {})

    wrapper = mount(AddMovie)
  })

  it('submits a movies id', () => {
    wrapper.vm.formData.id = 12345

    wrapper.find('form').trigger('submit')
    flushPromises()

    expect({ fetchMock }).toHavePosted('/api/movies', {
      body: {
        id: 12345,
        watchWhere: [],
      },
    })
  })

  it('can submit a movie with what where', () => {
    wrapper.vm.formData.id = 12345
    wrapper.vm.formData.watchWhere = [
      'bluray',
      'uhd',
    ]

    wrapper.find('form').trigger('submit')
    flushPromises()

    expect({ fetchMock }).toHavePosted('/api/movies', {
      body: {
        id: 12345,
        watchWhere: ['bluray', 'uhd'],
      },
    })
  })
})
