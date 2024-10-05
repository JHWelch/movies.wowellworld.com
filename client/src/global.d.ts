import { FetchMock } from 'vitest-fetch-mock'

declare global {
  interface Window {
    fetch: FetchMock
  }
}
