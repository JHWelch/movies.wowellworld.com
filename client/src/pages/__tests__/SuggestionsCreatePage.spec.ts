/** @vitest-environment jsdom */

import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import SuggestionsCreatePage from '@pages/SuggestionsCreatePage.vue'

afterEach(() => {
  localStorage.clear()
})

describe('no value saved', () => {
  it('returns empty string with no default', () => {
    const wrapper = mount(SuggestionsCreatePage)

    expect(wrapper.vm.formData.submitted_by).toBe('')
  })
})

describe('value saved', () => {
  beforeEach(() => {
    localStorage.setItem('submitted_by', 'John Smith')
  })

  it('should return saved value', () => {
    const wrapper = mount(SuggestionsCreatePage)

    expect(wrapper.vm.formData.submitted_by).toBe('John Smith')
  })
})
