import createFetchMock from 'vitest-fetch-mock'
import { vi } from 'vitest'
const fetchMocker = createFetchMock(vi)

fetchMocker.enableMocks()

HTMLCanvasElement.prototype.getContext = () => {
  // return whatever getContext has to return
}
