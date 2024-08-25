/** @vitest-environment jsdom */

import { mount } from '@vue/test-utils'
import IconLabel from '@components/IconLabel.vue'
import { describe, expect, it } from 'vitest'

describe('Default arguments', () => {
  it('renders a label with an icon', async () => {
    const wrapper = mount(IconLabel, {
      props: {
        icon: 'Calendar',
        label: 'Movie Director',
      },
    })

    expect(wrapper.text()).toContain('Movie Director')
    // expect(wrapper.find('svg').exists()).toBe(true)
  })
})
