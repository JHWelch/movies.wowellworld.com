/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import Notifications from '@components/Notifications.vue'
import { notifications } from '@client/state/notificationState'
import { nextTick } from 'vue'
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid'

let wrapper: VueWrapper
let notification: VueWrapper

describe('default', () => {
  beforeEach(() => {
    wrapper = mount(Notifications)
    notification = wrapper.byTestId('notifications')
  })

  it('does not display message by default', () => {
    expect(notification.exists()).toBe(false)
  })
})

describe('show message with default type', () => {
  beforeEach(async () => {
    wrapper = mount(Notifications)
    notifications.open('Hello World')
    await nextTick()
    notification = wrapper.byTestId('notifications')
  })

  it('should show notifications', () => {
    expect(notification.exists()).toBe(true)
  })

  it('should display message', () => {
    expect(notification.text()).toBe('Hello World')
  })

  it('should display message with info style', () => {
    expect(notification.classes()).toContain('bg-blue-500')
  })

  it('should display message with info icon', () => {
    expect(wrapper.findComponent(InformationCircleIcon).exists()).toBe(true)
  })
})

describe('show message with success type', () => {
  beforeEach(async () => {
    wrapper = mount(Notifications)
    notifications.open('Hello World', 'success')
    await nextTick()
    notification = wrapper.byTestId('notifications')
  })

  it('should display message with correct style', () => {
    expect(notification.classes()).toContain('bg-green-500')
  })

  it('should display message with correct icon', () => {
    expect(wrapper.findComponent(CheckCircleIcon).exists()).toBe(true)
  })
})

describe('show message with warning type', () => {
  beforeEach(async () => {
    wrapper = mount(Notifications)
    notifications.open('Hello World', 'warning')
    await nextTick()
    notification = wrapper.byTestId('notifications')
  })

  it('should display message with correct style', () => {
    expect(notification.classes()).toContain('bg-yellow-500')
  })

  it('should display message with correct icon', () => {
    expect(wrapper.findComponent(ExclamationTriangleIcon).exists()).toBe(true)
  })
})

describe('show message with error type', () => {
  beforeEach(async () => {
    wrapper = mount(Notifications)
    notifications.open('Hello World', 'error')
    await nextTick()
    notification = wrapper.byTestId('notifications')
  })

  it('should display message with correct style', () => {
    expect(notification.classes()).toContain('bg-red-500')
  })

  it('should display message with correct icon', () => {
    expect(wrapper.findComponent(XCircleIcon).exists()).toBe(true)
  })
})

describe('message open', () => {
  beforeEach(() => {
    notifications.open('Hello World')
  })

  describe('click close', () => {
    it('should close message', async () => {
      const wrapper = mount(Notifications)

      const close = wrapper.byTestId('notifications-close')
      close.trigger('click')

      await nextTick()

      expect(wrapper.byTestId('notifications').exists()).toBe(false)
    })
  })
})

describe('Message called via query param', () => {
  beforeEach(async () => {
    window.location = {
      search: '?message=Hello%20World',
    }
    wrapper = mount(Notifications)
    await nextTick()

    notification = wrapper.byTestId('notifications')
  })

  it('should display info message', async () => {
    expect(notification.exists()).toBe(true)
    expect(notification.text()).toBe('Hello World')
    expect(notification.classes()).toContain('bg-blue-500')
  })
})

describe('Message called via query param with type', () => {
  beforeEach(async () => {
    window.location = {
      search: '?message=Hello%20World&type=success',
    }
    wrapper = mount(Notifications)
    await nextTick()

    notification = wrapper.byTestId('notifications')
  })

  it('should display success message', async () => {
    expect(notification.exists()).toBe(true)
    expect(notification.text()).toBe('Hello World')
    expect(notification.classes()).toContain('bg-green-500')
  })
})
