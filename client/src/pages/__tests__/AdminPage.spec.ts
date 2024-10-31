/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AdminPage from '@pages/AdminPage.vue'
import { nextTick } from 'vue'

describe('unauthed page', () => {
  it('shows password form', () => {
    const wrapper = mount(AdminPage)

    expect(wrapper.byTestId('unlock-button').exists()).toBe(true)
    expect(wrapper.byTestId('input-password').exists()).toBe(true)
  })

  it('does not show admin content', () => {
    const wrapper = mount(AdminPage)

    expect(wrapper.text()).not.toContain('Sync Weeks')
  })

  describe('correct password', () => {
    beforeEach(() => {
      window.fetch.mockResponseOnce(JSON.stringify({
        updatedWeeks: 0,
        previousLastUpdated: '2021-01-01T00:00:00.000Z',
        newLastUpdated: '2021-01-01T00:00:00.000Z',
        tmdbMoviesSynced: [],
      }))
    })

    it('shows admin content', async () => {
      const wrapper = mount(AdminPage)
      await wrapper.byTestId('input-password').setValue('password')
      await wrapper.byTestId('unlock-button').trigger('click')
      await nextTick()
      await nextTick()
      await nextTick()

      expect(wrapper.text()).toContain('Sync Weeks')
    })
  })
})
