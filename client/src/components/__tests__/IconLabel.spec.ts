/** @vitest-environment jsdom */

import { mount } from '@vue/test-utils'
import IconLabel from '@components/IconLabel.vue'
import { describe, expect, it } from 'vitest'
import DynamicHeroIcon from '@components/DynamicHeroIcon.vue'

describe('Default arguments', () => {
  it('renders a label with an icon', async () => {
    const wrapper = mount(IconLabel, {
      props: {
        icon: 'CalendarIcon',
        label: 'Movie Director',
      },
    })

    const icon = wrapper.findComponent(DynamicHeroIcon)
    expect(wrapper.text()).toContain('Movie Director')
    expect(icon.exists()).toBe(true)
    expect(icon.props('name')).toBe('CalendarIcon')
  })
})
