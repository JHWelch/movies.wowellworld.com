/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Notifications from '../Notifications.vue'
import { notifications } from '../../state/notificationState'
import { nextTick } from 'vue'

it('does not display message by default', () => {
  const wrapper = mount(Notifications)

  const notification = wrapper.find('[data-testid="notifications"]')
  expect(notification.exists()).toBe(false)
})

describe('show message with default type', () => {
  it('should display message with info style', async () => {
    const wrapper = mount(Notifications)

    notifications.open('Hello World')

    await nextTick()

    const notification = wrapper.find('[data-testid="notifications"]')
    expect(notification.exists()).toBe(true)
    expect(notification.text()).toBe('Hello World')
    expect(notification.classes()).toContain('bg-blue-500')
  })
})

describe('show message with success type', () => {
  it('should display message with success style', async () => {
    const wrapper = mount(Notifications)

    notifications.open('Hello World', 'success')

    await nextTick()

    const notification = wrapper.find('[data-testid="notifications"]')
    expect(notification.exists()).toBe(true)
    expect(notification.text()).toBe('Hello World')
    expect(notification.classes()).toContain('bg-green-500')
  })
})

describe('show message with warning type', () => {
  it('should display message with warning style', async () => {
    const wrapper = mount(Notifications)

    notifications.open('Hello World', 'warning')

    await nextTick()

    const notification = wrapper.find('[data-testid="notifications"]')
    expect(notification.exists()).toBe(true)
    expect(notification.text()).toBe('Hello World')
    expect(notification.classes()).toContain('bg-yellow-500')
  })
})

describe('show message with error type', () => {
  it('should display message with error style', async () => {
    const wrapper = mount(Notifications)

    notifications.open('Hello World', 'error')

    await nextTick()

    const notification = wrapper.find('[data-testid="notifications"]')
    expect(notification.exists()).toBe(true)
    expect(notification.text()).toBe('Hello World')
    expect(notification.classes()).toContain('bg-red-500')
  })
})

describe('message open', () => {
  beforeEach(() => {
    notifications.open('Hello World')
  })

  describe('click close', () => {
    it('should close message', async () => {
      const wrapper = mount(Notifications)

      const close = wrapper.find('[data-testid="notifications-close"]')
      close.trigger('click')

      await nextTick()

      expect(wrapper.find('[data-testid="notifications"]').exists()).toBe(false)
    })
  })
})
