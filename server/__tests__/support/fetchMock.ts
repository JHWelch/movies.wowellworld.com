import { jest } from '@jest/globals'

type FetchFunction = (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => Promise<Response>

export type MockFetch = jest.Mock<FetchFunction>

export function mockFetch (): MockFetch {
  const mockFetch = jest.fn<FetchFunction>()
  global.fetch = mockFetch

  return mockFetch
}
