/** @vitest-environment jsdom */

import { mount, VueWrapper } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { ComponentPublicInstance } from 'vue'
import AddMovie from '@components/admin/AddMovie.vue'

let wrapper: VueWrapper<ComponentPublicInstance<typeof AddMovie>>

it('displays the movie form', () => {
  wrapper = mount(AddMovie)

  expect(wrapper.find('form').exists()).toBe(true)
  expect(wrapper.text()).toContain('Search for a movie')
})
