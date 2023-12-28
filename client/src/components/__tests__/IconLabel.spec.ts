/** @vitest-environment jsdom */

import { mount } from '@vue/test-utils'
import IconLabel from '../IconLabel.vue'
import { describe, expect, it } from 'vitest'

describe('Default arguments', () => {
  it('renders a label with an icon', async () => {
    const wrapper = mount(IconLabel, {
      props: {
        icon: 'Calendar',
        label: 'Hello world',
        field: 'director',
        movie: {
          title: 'Movie Title',
          director: 'Movie Director',
          year: 2021,
          length: 102,
          time: '8:00 PM',
          url: 'https://example.com/movie1234',
          posterUrl: 'https://example.com/poster.jpg',
          theaterName: 'Theater',
          showingUrl: 'Showing Url',
          isFieldTrip: true,
          displayLength: '1h 42m',
        },
      },
    })

    expect(wrapper.text()).toContain('Movie Director')
    // expect(wrapper.find('svg').exists()).toBe(true)
  })
})
