import { FetchMock } from 'vitest-fetch-mock'

declare global {
  let fetch: FetchMock
}
