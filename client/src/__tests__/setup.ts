import createFetchMock from 'vitest-fetch-mock'
import { vi } from 'vitest'
const fetchMocker = createFetchMock(vi)
import { VueWrapper } from '@vue/test-utils'

fetchMocker.enableMocks()

HTMLCanvasElement.prototype.getContext = () => {
  // return whatever getContext has to return
}

// Vue Wrapper helpers

VueWrapper.prototype.byTestId = function (this: VueWrapper, id: string)  {
  return this.find(`[data-testid="${id}"]`)
}
