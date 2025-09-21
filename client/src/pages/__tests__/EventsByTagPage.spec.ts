/** @vitest-environment jsdom */

import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'
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

describe('events found', () => {
  beforeEach(() => {
    fetchMock.mockGlobal().route('/api/events?tag=Horror%20October', [
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
  })

  it('should show the display title', async () => {
    wrapper = mount(EventsByTagPage, {
      props: {
        tag: 'october',
      },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Horror October')
  })

  it('should not care about tag casing', async () => {
    wrapper = mount(EventsByTagPage, {
      props: {
        tag: 'OCtoBER',
      },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Horror October')
  })

  it('should show the tags events', async () => {
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
})

describe('no events are found', () => {
  it('redirects to /404', async () => {
    fetchMock.mockGlobal().route('/api/events?tag=nonexistent', [])

    wrapper = mount(EventsByTagPage, {
      props: {
        tag: 'nonexistent',
      },
    })

    await flushPromises()

    expect(routerReplaceMock).toHaveBeenCalledWith('/404')
  })
})
