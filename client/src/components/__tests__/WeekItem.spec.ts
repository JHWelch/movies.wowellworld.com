/** @vitest-environment jsdom */

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import WeekItem from '@components/WeekItem.vue'
import WeekFactory from '@tests/utils/factories/weekFactory'
import SkippedBanner from '@components/SkippedBanner.vue'

it('has id of the week\'s slug', () => {
  const week = new WeekFactory().build({ slug: 'week-slug' })
  const wrapper = mount(WeekItem, {
    props: {
      week: week,
      showEventDetails: true,
    },
  })

  expect(wrapper.find('#week-slug').exists()).toBe(true)
})

it('has all week details', () => {
  const week = new WeekFactory().build()
  const wrapper = mount(WeekItem, {
    props: {
      week: week,
      showEventDetails: true,
    },
  })

  expect(wrapper.text()).toContain(week.theme)
  expect(wrapper.text()).toContain(week.date)
})

describe('is not skipped', () => {
  it('does not show skipped banner', () => {
    const week = new WeekFactory().build()
    const wrapper = mount(WeekItem, {
      props: {
        week: week,
        showEventDetails: true,
      },
    })

    expect(wrapper.findComponent(SkippedBanner).exists()).toBe(false)
  })
})

describe('is skipped', () => {
  it('shows skipped banner', () => {
    const week = new WeekFactory().build({ isSkipped: true })
    const wrapper = mount(WeekItem, {
      props: {
        week: week,
        showEventDetails: true,
      },
    })

    expect(wrapper.findComponent(SkippedBanner).exists()).toBe(true)
  })
})
