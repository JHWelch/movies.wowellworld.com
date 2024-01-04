/** @vitest-environment jsdom */

import { VueWrapper, mount } from '@vue/test-utils'
import ReminderSubscribe from '../ReminderSubscribe.vue'
import { beforeEach, describe, expect, it } from 'vitest'

let wrapper: VueWrapper

const subscribeSelector = '[data-testid="subscribe-button"]'

beforeEach(() => {
  wrapper = mount(ReminderSubscribe)
})

it('renders a "Get Reminders" button', async () => {
  expect(wrapper.find('button').text()).toBe('Get Reminders!')
})

describe('press the "Get Reminders" button', () => {
  beforeEach(async () => {
    await wrapper.find('button').trigger('click')
  })

  it('shows a form to enter an email address', async () => {
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('shows a "Subscribe" button', async () => {
    expect(wrapper.find(subscribeSelector).exists()).toBe(true)
  })
})
