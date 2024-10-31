/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import AdminPage from '@pages/AdminPage.vue'

let wrapper: VueWrapper

describe('unauthed page', () => {
  it('shows password form', () => {
    wrapper = mount(AdminPage)

    expect(wrapper.byTestId('unlock-button').exists()).toBe(true)
    expect(wrapper.byTestId('input-password').exists()).toBe(true)
  })

  it('does not show admin content', () => {
    wrapper = mount(AdminPage)

    expect(wrapper.text()).not.toContain('Sync Weeks')
  })

})

describe('authentication problems', () => {
  describe('401', () => {
    beforeEach(async () => {
      window.fetch.mockResponseOnce(JSON.stringify({
        error: 'Something went wrong authenticating you',
      }), {
        status: 401,
      })
      wrapper = mount(AdminPage)
      await wrapper.byTestId('input-password').setValue('password')
      await wrapper.byTestId('unlock-button').trigger('click')
    })

    it('does not shows admin content', async () => {
      expect(wrapper.text()).not.toContain('Sync Weeks')
      expect(wrapper.text()).toContain('Something went wrong authenticating you')
    })
  })

  describe('403', () => {
    beforeEach(async () => {
      window.fetch.mockResponseOnce(JSON.stringify({
        error: 'Password incorrect',
      }), {
        status: 403,
      })
      wrapper = mount(AdminPage)
      await wrapper.byTestId('input-password').setValue('password')
      await wrapper.byTestId('unlock-button').trigger('click')
    })

    it('does not shows admin content', async () => {
      expect(wrapper.text()).not.toContain('Sync Weeks')
      expect(wrapper.text()).toContain('Password incorrect')
    })
  })
})

describe('correct password - logged in', () => {
  beforeEach(async () => {
    window.fetch.mockResponseOnce(JSON.stringify({
      updatedWeeks: 15,
      previousLastUpdated: '2021-01-01T00:00:00.000Z',
      newLastUpdated: '2021-01-01T00:00:00.000Z',
      tmdbMoviesSynced: Array.from({ length: 32 }, () => {}),
    }))

    wrapper = mount(AdminPage)
    await wrapper.byTestId('input-password').setValue('password')
    await wrapper.byTestId('unlock-button').trigger('click')
  })

  it('shows admin content', async () => {
    expect(wrapper.text()).toContain('Sync Weeks')
  })

  it('shows updated weeks metadata', async () => {
    expect(wrapper.text()).toContain('15')
    expect(wrapper.text())
      .toContain(new Date('2021-01-01T00:00:00.000Z').toLocaleString())
    expect(wrapper.text())
      .toContain(new Date('2021-01-01T00:00:00.000Z').toLocaleString())
    expect(wrapper.text()).toContain('32')
  })
})
