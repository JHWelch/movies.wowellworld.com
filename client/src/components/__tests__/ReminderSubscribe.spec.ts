/** @vitest-environment jsdom */

import { VueWrapper, mount } from '@vue/test-utils'
import ReminderSubscribe from '@client/components/ReminderSubscribe.vue'
import { Mock, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

let wrapper: VueWrapper

globalThis.fetch = vi.fn()

beforeAll(() => {
  vi.mock('js-confetti', () => ({
    default: vi.fn().mockReturnValue({
      addConfetti: vi.fn(),
    }),
  }))
})

beforeEach(() => {
  wrapper = mount(ReminderSubscribe)
})

it('renders "Get Reminders" button with unopened style', () => {
  const button = wrapper.byTestId('get-reminders-button')

  expect(button.text()).toBe('Get Reminders!')
  expect(button.classes()).toContain('text-white')
  expect(button.classes()).toContain('hover:bg-purp-dark')
})

describe('press the "Get Reminders" button', () => {
  beforeEach(async () => {
    await wrapper.find('button').trigger('click')
  })

  it('renders "Get Reminders" button with opened style', () => {
    const button = wrapper.byTestId('get-reminders-button')

    expect(button.text()).toBe('Get Reminders!')
    expect(button.classes()).toContain('text-mint')
    expect(button.classes()).toContain('bg-purp-dark')
  })

  it('shows a form to enter an email address', () => {
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('shows a "Subscribe" button', () => {
    expect(wrapper.byTestId('subscribe-button').exists()).toBe(true)
  })

  describe('enter email and subscribe with success', () => {
    beforeEach(async () => {
      (fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          message: 'Thank you for signing up! See you soon.',
        }),
      })

      await wrapper.find('input').setValue('test@example.com')
      await wrapper.byTestId('subscribe-button').trigger('click')
      await nextTick()
    })

    it('makes a POST request to the API', async () => {
      expect(fetch).toHaveBeenCalledWith('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      })
    })

    it('closes the input', async () => {
      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.byTestId('subscribe-button').exists()).toBe(false)
    })
  })

  describe('when the request fails', () => {
    beforeEach(async () => {
      (fetch as Mock).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({
          errors: { email: 'Already subscribed' },
          message: "You're already subscribed! Check your spam folder if you don't get the emails.",
        }),
      })

      await wrapper.find('input').setValue('test@example.com')
      await wrapper.byTestId('subscribe-button').trigger('click')
    })

    it('does not close the input', async () => {
      expect(wrapper.find('input').exists()).toBe(true)
      expect(wrapper.byTestId('subscribe-button').exists()).toBe(true)
    })
  })
})
