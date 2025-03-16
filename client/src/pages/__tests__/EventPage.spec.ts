/** @vitest-environment jsdom */

import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { expect, it } from 'vitest'
import fetchMock from '@fetch-mock/vitest'
import MovieFactory from '@client/__tests__/utils/factories/movieFactory'
import EventPage from '@pages/EventPage.vue'
import EventFactory from '@client/__tests__/utils/factories/eventFactory'

let wrapper: VueWrapper

it('will fetch and show the specified event', async () => {
  fetchMock.mockGlobal().route('/api/events/2024-01-01', new EventFactory().withMovies([
    new MovieFactory().build({
      title: 'The Matrix',
      director: 'The Wachowskis',
    }),
  ]).build())

  wrapper = mount(EventPage, {
    props: {
      id: '2024-01-01',
    },
  })

  await flushPromises()

  expect(wrapper.text()).toContain('The Matrix')
  expect(wrapper.text()).toContain('The Wachowskis')
})
