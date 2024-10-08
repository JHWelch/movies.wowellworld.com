/** @vitest-environment jsdom */

import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import WeekItem from '@components/WeekItem.vue'
import WeekFactory from '@tests/utils/factories/weekFactory'

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
