/** @vitest-environment jsdom */

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import EventItem from '@components/EventItem.vue'
import EventFactory from '@tests/utils/factories/eventFactory'
import SkippedBanner from '@components/SkippedBanner.vue'

it('has id of the event\'s slug', () => {
  const event = new EventFactory().build({ slug: 'event-slug' })
  const wrapper = mount(EventItem, {
    props: {
      event: event,
      showEventDetails: true,
    },
  })

  expect(wrapper.find('#event-slug').exists()).toBe(true)
})

it('has all event details', () => {
  const event = new EventFactory().build()
  const wrapper = mount(EventItem, {
    props: {
      event: event,
      showEventDetails: true,
    },
  })

  expect(wrapper.text()).toContain(event.theme)
  expect(wrapper.text()).toContain(event.date)
})

describe('is not skipped', () => {
  it('does not show skipped banner', () => {
    const event = new EventFactory().build()
    const wrapper = mount(EventItem, {
      props: {
        event: event,
        showEventDetails: true,
      },
    })

    expect(wrapper.findComponent(SkippedBanner).exists()).toBe(false)
  })
})

describe('is skipped', () => {
  it('shows skipped banner', () => {
    const event = new EventFactory().build({ isSkipped: true })
    const wrapper = mount(EventItem, {
      props: {
        event: event,
        showEventDetails: true,
      },
    })

    expect(wrapper.findComponent(SkippedBanner).exists()).toBe(true)
  })
})

describe('does not has submitted by', () => {
  it('does not show Programming By', () => {
    const event = new EventFactory().build({ submittedBy: null })
    const wrapper = mount(EventItem, {
      props: {
        event: event,
        showEventDetails: true,
      },
    })

    expect(wrapper.text()).not.toContain('Programming By')
  })
})

describe('has submitted by', () => {
  it('shows Programming By', () => {
    const event = new EventFactory().build({ submittedBy: 'John Doe' })
    const wrapper = mount(EventItem, {
      props: {
        event: event,
        showEventDetails: true,
      },
    })

    expect(wrapper.text()).toContain('Programming By')
    expect(wrapper.text()).toContain('John Doe')
  })
})
