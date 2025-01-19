/** @vitest-environment jsdom */

import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import SuggestionsCreatePage from '@pages/SuggestionsCreatePage.vue'
import fetchMock from '@fetch-mock/vitest'
import { ComponentPublicInstance } from 'vue'

let wrapper: VueWrapper<ComponentPublicInstance<typeof SuggestionsCreatePage>>

afterEach(() => {
  localStorage.clear()
})

describe('no value saved', () => {
  it('returns empty string with no default', () => {
    wrapper = mount(SuggestionsCreatePage)

    expect(wrapper.vm.formData.submitted_by).toBe('')
  })
})

describe('value saved', () => {
  beforeEach(() => {
    localStorage.setItem('submitted_by', 'John Smith')
  })

  it('should return saved value', () => {
    wrapper = mount(SuggestionsCreatePage)

    expect(wrapper.vm.formData.submitted_by).toBe('John Smith')
  })
})

describe('submit', () => {
  beforeEach(() => {
    fetchMock.mockGlobal().route('/suggestions', {})
    window.location = {
      ...window.location,
      href: '',
    }
  })

  it('should save value to local storage', async () => {
    wrapper = mount(SuggestionsCreatePage)

    await wrapper.find('#submitted_by').setValue('Jane Doe')
    await wrapper.find('#theme').setValue('Test Theme')
    await wrapper.find('#movie1').setValue('Test Movie 1')
    await wrapper.find('#movie2').setValue('Test Movie 2')
    await wrapper.find('form').trigger('submit')

    await flushPromises()

    expect(localStorage.getItem('submitted_by')).toBe('Jane Doe')
  })
})
