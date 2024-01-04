/** @vitest-environment jsdom */

import { VueWrapper, mount } from '@vue/test-utils'
import ReminderSubscribe from '../ReminderSubscribe.vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let wrapper: VueWrapper

const subscribeSelector = '[data-testid="subscribe-button"]'
const getRemindersSelector = '[data-testid="get-reminders-button"]'

globalThis.fetch = vi.fn()

beforeEach(() => {
  wrapper = mount(ReminderSubscribe)
})

it('renders "Get Reminders" button with unopened style', () => {
  const button = wrapper.find(getRemindersSelector)

  expect(button.text()).toBe('Get Reminders!')
  expect(button.classes()).toContain('text-gray-800')
  expect(button.classes()).toContain('hover:bg-violet-300')
})

describe('press the "Get Reminders" button', () => {
  beforeEach(async () => {
    await wrapper.find('button').trigger('click')
  })

  it('renders "Get Reminders" button with opened style', () => {
    const button = wrapper.find(getRemindersSelector)

    expect(button.text()).toBe('Get Reminders!')
    expect(button.classes()).toContain('text-white')
    expect(button.classes()).toContain('bg-violet-600')
  })

  it('shows a form to enter an email address', () => {
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('shows a "Subscribe" button', () => {
    expect(wrapper.find(subscribeSelector).exists()).toBe(true)
  })

  describe('enter email & press the "Subscribe" button', () => {
    beforeEach(async () => {
      await wrapper.find('input').setValue('test@example.com')
      await wrapper.find(subscribeSelector).trigger('click')
    })

    it('makes a POST request to the API', async () => {
      expect(fetch).toHaveBeenCalledWith('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      })
    })
  })
})
