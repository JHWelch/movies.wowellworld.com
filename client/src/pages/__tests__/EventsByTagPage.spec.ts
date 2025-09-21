/** @vitest-environment jsdom */

import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { afterEach, expect, it, vitest } from 'vitest'
import fetchMock from '@fetch-mock/vitest'
import MovieFactory from '@client/__tests__/utils/factories/movieFactory'
import EventsByTagPage from '@pages/EventsByTagPage.vue'
import EventFactory from '@client/__tests__/utils/factories/eventFactory'

let wrapper: VueWrapper

const routerReplaceMock = vitest.fn()

vitest.mock('vue-router', () => ({
  useRouter: () => ({
    replace: routerReplaceMock,
  }),
}))

afterEach(() => {
  fetchMock.mockReset()
})

it('should show the tags events', async () => {
  fetchMock.mockGlobal().route('/api/events?tag=october', [
    new EventFactory().withMovies([
      new MovieFactory().build({
        title: 'The Matrix',
        director: 'The Wachowskis',
      }),
    ]).build(),
    new EventFactory().withMovies([
      new MovieFactory().build({
        title: 'Mars Attacks!',
        director: 'Tim Burton',
      }),
    ]).build(),
  ])

  wrapper = mount(EventsByTagPage, {
    props: {
      tag: 'october',
    },
  })

  await flushPromises()

  expect(wrapper.text()).toContain('The Matrix')
  expect(wrapper.text()).toContain('The Wachowskis')
  expect(wrapper.text()).toContain('Mars Attacks!')
  expect(wrapper.text()).toContain('Tim Burton')
})

it('redirects to /404 when no events are found', async () => {
  fetchMock.mockGlobal().route('/api/events?tag=nonexistent', [])

  wrapper = mount(EventsByTagPage, {
    props: {
      tag: 'nonexistent',
    },
  })

  await flushPromises()

  expect(routerReplaceMock).toHaveBeenCalledWith('/404')
})
