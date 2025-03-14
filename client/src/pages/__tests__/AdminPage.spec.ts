/** @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import AdminPage from '@pages/AdminPage.vue'
import fetchMock from '@fetch-mock/vitest'

let wrapper: VueWrapper

afterEach(() => {
  fetchMock.mockReset()
})

describe('unauthed page', () => {
  it('shows password form', () => {
    wrapper = mount(AdminPage)

    expect(wrapper.byTestId('unlock-button').exists()).toBe(true)
    expect(wrapper.byTestId('input-password').exists()).toBe(true)
  })

  it('does not show admin content', () => {
    wrapper = mount(AdminPage)

    expect(wrapper.text()).not.toContain('Sync Events')
  })
})

describe('authentication problems', () => {
  describe('401', () => {
    beforeEach(async () => {
      fetchMock.mockGlobal().route('/api/cache/events', {
        body: { error: 'Something went wrong authenticating you' },
        status: 401,
      })
      wrapper = mount(AdminPage)
      await wrapper.byTestId('input-password').setValue('password')
      await wrapper.byTestId('unlock-button').trigger('click')
      await flushPromises()
    })

    it('does not shows admin content', async () => {
      expect(wrapper.text()).not.toContain('Sync Events')
      expect(wrapper.text()).toContain('Something went wrong authenticating you')
    })
  })

  describe('403', () => {
    beforeEach(async () => {
      fetchMock.mockGlobal().route('/api/cache/events', {
        body: { error: 'Password incorrect' },
        status: 403,
      })
      wrapper = mount(AdminPage)
      await wrapper.byTestId('input-password').setValue('password')
      await wrapper.byTestId('unlock-button').trigger('click')
      await flushPromises()
    })

    it('does not shows admin content', async () => {
      expect(wrapper.text()).not.toContain('Sync Events')
      expect(wrapper.text()).toContain('Password incorrect')
    })
  })
})

describe('correct password - logged in', () => {
  beforeEach(async () => {
    fetchMock.mockGlobal().route('/api/cache/events', {
      updatedEvents: 15,
      previousLastUpdated: '2021-01-01T00:00:00.000Z',
      newLastUpdated: '2021-01-01T00:00:00.000Z',
      tmdbMoviesSynced: Array.from({ length: 32 }, () => {}),
    })

    wrapper = mount(AdminPage)
    await wrapper.byTestId('input-password').setValue('password')
    await wrapper.byTestId('unlock-button').trigger('click')
    await flushPromises()
  })

  it('shows admin content', async () => {
    expect(wrapper.text()).toContain('Sync Events')
  })

  it('shows updated events metadata', async () => {
    expect(wrapper.text()).toContain('15')
    expect(wrapper.text())
      .toContain(new Date('2021-01-01T00:00:00.000Z').toLocaleString())
    expect(wrapper.text())
      .toContain(new Date('2021-01-01T00:00:00.000Z').toLocaleString())
    expect(wrapper.text()).toContain('32')
  })
})
