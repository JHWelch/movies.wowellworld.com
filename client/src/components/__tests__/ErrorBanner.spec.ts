/** @vitest-environment jsdom */

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorBanner from '../ErrorBanner.vue'

describe('Press "refresh the page"', () => {
  it('should emit "reload" event', () => {
    const wrapper = mount(ErrorBanner)

    wrapper.find('button').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('reload')
  })
})
