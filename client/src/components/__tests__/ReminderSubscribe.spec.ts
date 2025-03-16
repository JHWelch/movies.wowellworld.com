/** @vitest-environment jsdom */

import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import ReminderSubscribe from '@client/components/ReminderSubscribe.vue'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import fetchMock from '@fetch-mock/vitest'

let wrapper: VueWrapper

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

afterEach(() => {
  fetchMock.mockReset()
})

it('renders "Get Reminders" button', () => {
  const button = wrapper.byTestId('get-reminders-button')

  expect(button.text()).toBe('Get Reminders!')
})

describe('press the "Get Reminders" button', () => {
  beforeEach(async () => {
    await wrapper.find('button').trigger('click')
  })

  it('shows a form to enter an email address', () => {
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('shows a "Subscribe" button', () => {
    expect(wrapper.byTestId('subscribe-button').exists()).toBe(true)
  })

  describe('enter email and subscribe with success', () => {
    beforeEach(async () => {
      fetchMock.mockGlobal().route('/api/subscriptions', {
        message: 'Thank you for signing up! See you soon.',
      })

      await wrapper.find('input').setValue('test@example.com')
      await wrapper.byTestId('subscribe-button').trigger('click')
      await flushPromises()
    })

    it('makes a POST request to the API', async () => {
      expect({ fetchMock } ).toHavePosted('/api/subscriptions', {
        body: { email: 'test@example.com' },
      })
    })

    it('closes the input', async () => {
      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.byTestId('subscribe-button').exists()).toBe(false)
    })
  })

  describe('when the request fails', () => {
    beforeEach(async () => {
      fetchMock.mockGlobal().route('/api/subscriptions', {
        status: 422,
        body: {
          errors: { email: 'Already subscribed' },
          message: "You're already subscribed! Check your spam folder if you don't get the emails.",
        },
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
