import createFetchMock from 'vitest-fetch-mock'
import { expect, vi } from 'vitest'
const fetchMocker = createFetchMock(vi)
import { DOMWrapper, VueWrapper } from '@vue/test-utils'

fetchMocker.enableMocks()

// Vue Wrapper helpers

VueWrapper.prototype.byTestId = function<NodeType extends Node> (
  this: VueWrapper<NodeType>,
  id: string
): DOMWrapper<Element> {
  return this.find(`[data-testid="${id}"]`)
}

// Custom matchers

expect.extend({
  toBeValue: function (wrapper: DOMWrapper<Element>, value: string) {
    const element = wrapper.element
    if (!(element instanceof HTMLInputElement)) {
      return {
        pass: false,
        message: () => 'element is not an input',
      }
    }

    const { isNot } = this

    return {
      pass : element.value === value,
      message: () =>
        `expected ${element.value}${isNot ? ' not' : ''} to be ${value}`,
    }
  },
})
